const optional = (key: string) => process.env[key]?.trim() ?? "";

/** Runtime configuration supplied by Vercel; no Manus platform values are used. */
export const ENV = {
  databaseUrl: optional("DATABASE_URL"),
  cookieSecret: optional("JWT_SECRET"),
  googleClientId: optional("GOOGLE_CLIENT_ID"),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET"),
  ownerEmail: optional("OWNER_EMAIL").toLowerCase(),
  isProduction: process.env.NODE_ENV === "production",
} as const;

export function requireGoogleOAuthConfig() {
  if (!ENV.googleClientId || !ENV.googleClientSecret) {
    throw new Error("Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
  }
  if (!ENV.cookieSecret || ENV.cookieSecret.length < 32) {
    throw new Error("JWT_SECRET must be set to a private value of at least 32 characters.");
  }
  return ENV;
}
