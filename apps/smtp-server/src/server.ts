import { Readable } from "stream";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";
import { readFileSync, existsSync, watch, FSWatcher } from "fs";
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

// When SMTP_ACME_JSON_PATH + SMTP_ACME_DOMAIN are set the server reads certs
// directly from Traefik's acme.json — no certs-dumper sidecar required.
const ACME_JSON_PATH = process.env.SMTP_ACME_JSON_PATH;
const ACME_DOMAIN = process.env.SMTP_ACME_DOMAIN;

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

type AcmeCert = { key: Buffer; cert: Buffer };

/**
 * Parses Traefik's acme.json and returns the cert+key for the given domain.
 * Searches all resolvers so no resolver name config is needed.
 */
function loadCertFromAcme(acmeJsonPath: string, domain: string): AcmeCert | null {
  try {
    const raw = JSON.parse(readFileSync(acmeJsonPath, "utf8")) as Record<
      string,
      {
        Certificates?: Array<{
          domain: { main: string; sans?: string[] };
          certificate: string;
          key: string;
        }>;
      }
    >;
    for (const resolver of Object.values(raw)) {
      for (const entry of resolver?.Certificates ?? []) {
        const { main, sans = [] } = entry.domain;
        if (main === domain || sans.includes(domain)) {
          return {
            cert: Buffer.from(entry.certificate, "base64"),
            key: Buffer.from(entry.key, "base64"),
          };
        }
      }
    }
  } catch {
    // File not yet readable or parse error — caller will retry
  }
  return null;
}

function loadCertificates(): { key?: Buffer; cert?: Buffer } {
  if (TLS_MODE === "none") return {};
  // Prefer direct acme.json reading when configured.
  if (ACME_JSON_PATH && ACME_DOMAIN) {
    const certs = loadCertFromAcme(ACME_JSON_PATH, ACME_DOMAIN);
    return certs ?? {};
  }
  return {
    key: SSL_KEY_PATH ? readFileSync(SSL_KEY_PATH) : undefined,
    cert: SSL_CERT_PATH ? readFileSync(SSL_CERT_PATH) : undefined,
  };
}

/** Polls until the cert is resolvable, whether from acme.json or from files. */
async function waitForCertificates(
  timeoutMs = 120_000,
  intervalMs = 3_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (ACME_JSON_PATH && ACME_DOMAIN) {
      if (loadCertFromAcme(ACME_JSON_PATH, ACME_DOMAIN)) {
        console.log(`TLS certificate for ${ACME_DOMAIN} found in acme.json.`);
        return;
      }
      console.log(
        `Waiting for TLS certificate for ${ACME_DOMAIN} in ${ACME_JSON_PATH}...`,
      );
    } else {
      if (
        SSL_KEY_PATH && SSL_CERT_PATH &&
        existsSync(SSL_KEY_PATH) && existsSync(SSL_CERT_PATH)
      ) {
        console.log("TLS certificate files found.");
        return;
      }
      console.log(
        `Waiting for TLS certificate files (${SSL_KEY_PATH}, ${SSL_CERT_PATH})...`,
      );
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  const location = ACME_JSON_PATH
    ? `domain ${ACME_DOMAIN} in ${ACME_JSON_PATH}`
    : `files ${SSL_KEY_PATH}, ${SSL_CERT_PATH}`;
  throw new Error(
    `TLS certificates not available after ${timeoutMs / 1_000}s — ${location}`,
  );
}

const serverOptions: SMTPServerOptions = {
  secure: false,
  // key/cert are set in startServers() after waitForCertificates() resolves.
  key: undefined,
  cert: undefined,
  // disabledCommands and allowInsecureAuth are also set in startServers().
  disabledCommands: [],
  allowInsecureAuth: false,
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

  // Load certs now — waitForCertificates() already ensured they exist.
  const initialCerts = loadCertificates();
  serverOptions.key = initialCerts.key;
  serverOptions.cert = initialCerts.cert;

  // Re-evaluate STARTTLS/auth settings now that we know whether certs are loaded.
  const hasCert = !!(initialCerts.key && initialCerts.cert);
  serverOptions.disabledCommands =
    TLS_MODE === "none" || (TLS_MODE === "traefik" && !hasCert)
      ? ["STARTTLS"]
      : [];
  serverOptions.allowInsecureAuth = TLS_MODE === "traefik" && !hasCert;

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
        TLS_MODE === "traefik" && hasCert
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

  // Watch for cert renewal in both manual and traefik modes.
  const filesToWatch: string[] = [];
  if (TLS_MODE === "manual" || TLS_MODE === "traefik") {
    if (ACME_JSON_PATH) {
      filesToWatch.push(ACME_JSON_PATH);
    } else if (SSL_KEY_PATH && SSL_CERT_PATH) {
      filesToWatch.push(SSL_KEY_PATH, SSL_CERT_PATH);
    }
  }

  if (filesToWatch.length > 0) {
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

    filesToWatch.forEach((file) => {
      watchers.push(watch(file, { persistent: false }, reloadCertificates));
    });
  }

  return { servers, watchers };
}

async function main() {
  if (TLS_MODE !== "none") {
    const needsCert =
      (ACME_JSON_PATH && ACME_DOMAIN) || (SSL_KEY_PATH && SSL_CERT_PATH);
    if (needsCert) {
      await waitForCertificates();
    }
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
