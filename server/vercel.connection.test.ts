import { describe, expect, it } from "vitest";

describe("Vercel connection", () => {
  it("can authenticate against the read-only Vercel identity endpoint when configured", async () => {
    const token = process.env.VERCEL_TOKEN;
    if (!token) {
      expect(token).toBeDefined();
      return;
    }

    const response = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok).toBe(true);
    const body = (await response.json()) as { user?: { id?: string } };
    expect(body.user?.id).toBeTruthy();
  }, 15_000);
});
