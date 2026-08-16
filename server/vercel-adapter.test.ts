import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";

describe("Vercel hosting adapter", () => {
  it("creates an Express app without starting a listener or mounting the frontend", async () => {
    const app = await createApp({ serveFrontend: false });

    expect(typeof app).toBe("function");
    expect(readFileSync("server/app.ts", "utf8")).not.toContain("app.listen(");
  });

  it("keeps the API rewrite pointed at the single serverless entry point", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
      buildCommand: string;
      outputDirectory: string;
      rewrites: Array<{ source: string; destination: string }>;
    };

    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites).toContainEqual({
      source: "/api/:path*",
      destination: "/api/index",
    });
  });

  it("keeps catalog synchronization out of the Vercel entry point", () => {
    const entry = readFileSync("api/index.ts", "utf8");

    expect(entry).toContain('createApp({ serveFrontend: false })');
    expect(entry).not.toContain("ensureCurrentCurriculumCatalog");
    expect(entry).not.toContain("listen(");
  });
});
