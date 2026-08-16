import { afterEach, describe, expect, it, vi } from "vitest";

const original = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};

async function loadEnv() {
  vi.resetModules();
  return import("./_core/env");
}

afterEach(() => {
  process.env.GOOGLE_CLIENT_ID = original.GOOGLE_CLIENT_ID;
  process.env.GOOGLE_CLIENT_SECRET = original.GOOGLE_CLIENT_SECRET;
  process.env.JWT_SECRET = original.JWT_SECRET;
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
