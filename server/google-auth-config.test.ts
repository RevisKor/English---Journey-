import { afterEach, describe, expect, it, vi } from "vitest";

const original = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  OWNER_EMAIL: process.env.OWNER_EMAIL,
  OWNER_EMAILS: process.env.OWNER_EMAILS,
};

async function loadEnv() {
  vi.resetModules();
  return import("./_core/env");
}

afterEach(() => {
  process.env.GOOGLE_CLIENT_ID = original.GOOGLE_CLIENT_ID;
  process.env.GOOGLE_CLIENT_SECRET = original.GOOGLE_CLIENT_SECRET;
  process.env.JWT_SECRET = original.JWT_SECRET;
  process.env.OWNER_EMAIL = original.OWNER_EMAIL;
  process.env.OWNER_EMAILS = original.OWNER_EMAILS;
  vi.resetModules();
});

describe("independent Google OAuth configuration", () => {
  it("requires Google credentials and a strong signed-session secret", async () => {
    process.env.GOOGLE_CLIENT_ID = "";
    process.env.GOOGLE_CLIENT_SECRET = "";
    process.env.JWT_SECRET = "short";
    const { requireGoogleOAuthConfig } = await loadEnv();

    expect(requireGoogleOAuthConfig).toThrow("GOOGLE_CLIENT_ID");
  });

  it("parses multiple exact-match owner emails from OWNER_EMAILS", async () => {
    process.env.OWNER_EMAIL = "legacy@example.com";
    process.env.OWNER_EMAILS = " revissskor@gmail.com, Yahya205080@gmail.com ";
    const { ENV } = await loadEnv();

    expect(ENV.ownerEmails).toEqual(["revissskor@gmail.com", "yahya205080@gmail.com"]);
    expect(ENV.ownerEmails).not.toContain("other@example.com");
  });

  it("falls back to the legacy OWNER_EMAIL variable", async () => {
    process.env.OWNER_EMAIL = "Revissskor@gmail.com";
    delete process.env.OWNER_EMAILS;
    const { ENV } = await loadEnv();

    expect(ENV.ownerEmails).toEqual(["revissskor@gmail.com"]);
  });

  it("accepts complete Google credentials without exposing their values", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
    process.env.JWT_SECRET = "a-private-session-secret-with-at-least-thirty-two-characters";
    const { requireGoogleOAuthConfig } = await loadEnv();

    const config = requireGoogleOAuthConfig();
    expect(config.googleClientId).toBeTruthy();
    expect(config.googleClientSecret).toBeTruthy();
    expect(config.cookieSecret.length).toBeGreaterThanOrEqual(32);
  });
});
