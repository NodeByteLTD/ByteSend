import { createHash, randomBytes } from "crypto";

const CODE_COUNT = 10; // codes generated per setup

/** Generate plain-text recovery codes (shown once to user). */
export function generateRecoveryCodes(): string[] {
  return Array.from({ length: CODE_COUNT }, () =>
    randomBytes(5).toString("hex").toUpperCase(), // 10 hex chars
  );
}

/** One-way hash a recovery code for storage (SHA-256, not bcrypt — codes are long random). */
export function hashRecoveryCode(code: string): string {
  return createHash("sha256").update(code.toUpperCase().trim()).digest("hex");
}

/** Verify a user-submitted recovery code against a stored hash. */
export function verifyRecoveryCode(submitted: string, storedHash: string): boolean {
  const submittedHash = hashRecoveryCode(submitted);
  // Timing-safe comparison
  if (submittedHash.length !== storedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < submittedHash.length; i++) {
    diff |= submittedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return diff === 0;
}
