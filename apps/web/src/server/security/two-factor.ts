import { generateSecret, generateURI, verify } from "otplib";

const TWO_FACTOR_ISSUER = "ByteSend";

export function generateTwoFactorSecret(userEmail: string) {
    const secret = generateSecret();
    const otpauthUrl = generateURI({
        issuer: TWO_FACTOR_ISSUER,
        label: userEmail,
        secret,
    });
    return { secret, otpauthUrl };
}

export async function verifyTwoFactorToken(token: string, secret: string) {
    const result = await verify({ secret, token, epochTolerance: 30 });
    return result.valid;
}
