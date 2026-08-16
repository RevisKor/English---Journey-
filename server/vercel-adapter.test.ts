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

  it("uses a Vercel-safe client build and does not require optional analytics variables", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: { build: string };
    };
    const html = readFileSync("client/index.html", "utf8");

    expect(packageJson.scripts.build).toBe("vite build");
    expect(packageJson.scripts.build).not.toContain("server/_core/index.ts");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(html).not.toContain("%VITE_ANALYTICS_WEBSITE_ID%");
  });

  it("keeps Vercel-checked source files in the local type-check scope", () => {
    const tsconfig = JSON.parse(readFileSync("tsconfig.json", "utf8")) as {
      include: string[];
    };
    const entry = readFileSync("api/index.ts", "utf8");
    const viteConfig = readFileSync("vite.config.ts", "utf8");

    expect(tsconfig.include).toContain("api/**/*");
    expect(tsconfig.include).toContain("vite.config.ts");
    expect(entry).toContain("ExpressRequestListener");
    expect(entry).not.toContain("app.handle(");
    expect(viteConfig).not.toContain("vitePluginManusRuntime");
  });
});
