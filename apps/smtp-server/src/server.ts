import dotenv from "dotenv";
import { Readable } from "stream";
import { simpleParser } from "mailparser";
import { readFileSync, watch, FSWatcher } from "fs";
import { SMTPServer, SMTPServerOptions, SMTPServerSession } from "smtp-server";

dotenv.config();

const AUTH_USERNAME = process.env.SMTP_AUTH_USERNAME ?? "bytesend";
const BASE_URL = process.env.BYTESEND_BASE_URL ?? "https://bytesend.cloud";
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
  if (TLS_MODE !== "manual") return {};
  if (!SSL_KEY_PATH || !SSL_CERT_PATH) {
    throw new Error(
      "SMTP_TLS_MODE is 'manual' but SMTP_TLS_KEY_PATH / SMTP_TLS_CERT_PATH are not set",
    );
  }
  return {
    key: readFileSync(SSL_KEY_PATH),
    cert: readFileSync(SSL_CERT_PATH),
  };
}

const initialCerts = loadCertificates();

const serverOptions: SMTPServerOptions = {
  secure: false,
  key: initialCerts.key,
  cert: initialCerts.cert,
  disabledCommands: TLS_MODE === "none" ? ["STARTTLS"] : [],
  allowInsecureAuth: TLS_MODE === "none",
  onData(
    stream: Readable,
    session: SMTPServerSession,
    callback: (error?: Error) => void,
  ) {
    console.log("Receiving email data...");
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
      console.log("Authenticated successfully");
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
    [465, 2465].forEach((port) => {
      const server = new SMTPServer({ ...serverOptions, secure: true });
      server.listen(port, () => {
        console.log(`SMTP server (implicit TLS) is listening on port ${port}`);
      });
      server.on("error", (err) => {
        console.error(`Error occurred on port ${port}:`, err);
      });
      servers.push(server);
    });
  }

  [25, 587, 2587].forEach((port) => {
    const server = new SMTPServer(serverOptions);
    server.listen(port, () => {
      const label = TLS_MODE === "manual" ? "STARTTLS" : "plain (no TLS)";
      console.log(`SMTP server (${label}) is listening on port ${port}`);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
