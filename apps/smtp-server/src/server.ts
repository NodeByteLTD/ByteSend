import { Readable } from "stream";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";
import { readFileSync, watch, FSWatcher } from "fs";
import { SMTPServer, SMTPServerOptions, SMTPServerSession } from "smtp-server";

dotenv.config();

const AUTH_USERNAME = process.env.SMTP_AUTH_USERNAME ?? "bytesend";
const BASE_URL = process.env.BYTESEND_BASE_URL ?? "https://bytesend.cloud";

// TLS_MODE controls how TLS is handled:
//   'traefik' — reverse proxy terminates TLS on port 465 (SMTPS).
//               For port 587 STARTTLS, the server handles TLS directly —
//               provide SMTP_TLS_KEY_PATH / SMTP_TLS_CERT_PATH so that
//               STARTTLS connections can negotiate properly.
//   'manual'  — server handles all TLS (both STARTTLS and implicit) directly.
//   'none'    — no TLS; STARTTLS disabled.
const TLS_MODE = (process.env.SMTP_TLS_MODE ?? "none").toLowerCase();

const SSL_KEY_PATH = process.env.SMTP_TLS_KEY_PATH;
const SSL_CERT_PATH = process.env.SMTP_TLS_CERT_PATH;

async function sendEmailToByteSend(emailData: any, apiKey: string) {
  try {
    const apiEndpoint = "/api/v1/emails";
    const url = new URL(apiEndpoint, BASE_URL);
    console.log("Sending email to ByteSend API at:", url.href);

    const emailDataText = JSON.stringify(emailData);

    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: emailDataText,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "ByteSend API error response: error:",
        JSON.stringify(errorData, null, 4),
        `\nemail data: ${emailDataText}`,
      );
      throw new Error(
        `Failed to send email: ${errorData || "Unknown error from server"}`,
      );
    }

    const responseData = await response.json();
    console.log("ByteSend API response:", responseData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Failed to send email: Unexpected error occurred");
    }
  }
}

function loadCertificates(): { key?: Buffer; cert?: Buffer } {
  // Load certs for both 'manual' and 'traefik' modes when paths are provided.
  // In 'traefik' mode, certs are needed so port 587 STARTTLS can negotiate TLS
  // directly — Traefik does TCP passthrough for STARTTLS (it only terminates TLS
  // for implicit-TLS connections on port 465 where TLS starts at byte 1).
  if (TLS_MODE === "none") return {};
  return {
    key: SSL_KEY_PATH ? readFileSync(SSL_KEY_PATH) : undefined,
    cert: SSL_CERT_PATH ? readFileSync(SSL_CERT_PATH) : undefined,
  };
}

const initialCerts = loadCertificates();

const serverOptions: SMTPServerOptions = {
  secure: false,
  key: initialCerts.key,
  cert: initialCerts.cert,
  // Disable STARTTLS when no cert is available and the mode isn't manual.
  // In 'traefik' mode with certs provided, STARTTLS is enabled so clients using
  // STARTTLS on port 587 can negotiate TLS directly with this server (Traefik does
  // TCP passthrough for port 587 — it cannot upgrade STARTTLS mid-session).
  // In 'none' mode or 'traefik' without certs, advertise plain only.
  disabledCommands:
    TLS_MODE === "none" || (TLS_MODE === "traefik" && !SSL_KEY_PATH)
      ? ["STARTTLS"]
      : [],
  // Allow plain-text auth when in traefik mode without certs (internal-only setup).
  allowInsecureAuth: TLS_MODE === "traefik" && !SSL_KEY_PATH,
  onData(
    stream: Readable,
    session: SMTPServerSession,
    callback: (error?: Error) => void,
  ) {
    console.log("Receiving email data..."); // Debug statement
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error("Failed to parse email data:", err.message);
        return callback(err);
      }

      if (!session.user) {
        console.error("No API key found in session");
        return callback(new Error("No API key found in session"));
      }

      const emailObject = {
        to: Array.isArray(parsed.to)
          ? parsed.to.map((addr) => addr.text).join(", ")
          : parsed.to?.text,
        from: Array.isArray(parsed.from)
          ? parsed.from.map((addr) => addr.text).join(", ")
          : parsed.from?.text,
        subject: parsed.subject,
        text: parsed.text,
        html: parsed.html,
        replyTo: parsed.replyTo?.text,
      };

      sendEmailToByteSend(emailObject, session.user)
        .then(() => callback())
        .then(() => console.log("Email sent successfully to: ", emailObject.to))
        .catch((error) => {
          console.error("Failed to send email:", error.message);
          callback(error);
        });
    });
  },
  onAuth(auth, session: any, callback: (error?: Error, user?: any) => void) {
    if (auth.username === AUTH_USERNAME && auth.password) {
      console.log("Authenticated successfully"); // Debug statement
      callback(undefined, { user: auth.password });
    } else {
      console.error("Invalid username or password");
      callback(new Error("Invalid username or password"));
    }
  },
  size: 10485760,
};

function startServers() {
  const servers: SMTPServer[] = [];
  const watchers: FSWatcher[] = [];

  console.log(`SMTP TLS mode: ${TLS_MODE}`);

  if (TLS_MODE === "manual") {
    if (!SSL_KEY_PATH || !SSL_CERT_PATH) {
      throw new Error(
        "SMTP_TLS_MODE is 'manual' but SMTP_TLS_KEY_PATH / SMTP_TLS_CERT_PATH are not set",
      );
    }

    // Implicit SSL/TLS for ports 465 and 2465
    [465, 2465].forEach((port) => {
      const server = new SMTPServer({ ...serverOptions, secure: true });

      server.listen(port, () => {
        console.log(`Implicit SSL/TLS SMTP server is listening on port ${port}`);
      });

      server.on("error", (err) => {
        console.error(`Error occurred on port ${port}:`, err);
      });

      servers.push(server);
    });
  }

  // STARTTLS / plain SMTP for ports 25, 587, and 2587
  // When TLS_MODE is 'traefik', certs are not loaded so the server runs plain —
  // the reverse proxy has already terminated TLS before forwarding.
  [25, 587, 2587].forEach((port) => {
    const server = new SMTPServer(serverOptions);

    server.listen(port, () => {
      const modeLabel =
        TLS_MODE === "traefik" && SSL_KEY_PATH
          ? "STARTTLS (cert-backed, Traefik passthrough)"
          : TLS_MODE === "traefik"
            ? "plain (no cert — STARTTLS disabled)"
            : TLS_MODE === "manual"
              ? "STARTTLS"
              : "plain";
      console.log(`SMTP server (${modeLabel}) is listening on port ${port}`);
    });

    server.on("error", (err) => {
      console.error(`Error occurred on port ${port}:`, err);
    });

    servers.push(server);
  });

  if (TLS_MODE === "manual" && SSL_KEY_PATH && SSL_CERT_PATH) {
    const reloadCertificates = () => {
      try {
        const { key, cert } = loadCertificates();
        if (key && cert) {
          servers.forEach((srv) => srv.updateSecureContext({ key, cert }));
          console.log("TLS certificates reloaded");
        }
      } catch (err) {
        console.error("Failed to reload TLS certificates", err);
      }
    };

    [SSL_KEY_PATH, SSL_CERT_PATH].forEach((file) => {
      watchers.push(watch(file, { persistent: false }, reloadCertificates));
    });
  }

  return { servers, watchers };
}

const { servers, watchers } = startServers();

function shutdown() {
  console.log("Shutting down SMTP server...");
  watchers.forEach((w) => w.close());
  servers.forEach((s) => s.close());
  process.exit(0);
}

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, shutdown);
});
