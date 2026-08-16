import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";

describe("Vercel hosting adapter", () => {
  it("creates an API-only Express app without starting a listener or mounting the frontend", () => {
    const app = createApp();

    expect(typeof app).toBe("function");
    expect(readFileSync("server/app.ts", "utf8")).not.toContain("app.listen(");
    expect(readFileSync("server/app.ts", "utf8")).not.toContain("./_core/vite");
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

  it("bootstraps the catalog only for quiz routes in the Vercel entry point", () => {
    const entry = readFileSync("server/vercel-entry.ts", "utf8");

    expect(entry).toContain("ensureCurrentCurriculumCatalog");
    expect(entry).toContain("/api/trpc/course.lessonQuiz");
    expect(entry).toContain("/api/trpc/course.moduleTest");
    expect(entry).toContain("/api/trpc");
    expect(entry).toContain("req.clone().text()");
    expect(entry).toContain("course\\.(lessonQuiz|milestoneQuiz|moduleTest)");
    expect(entry).not.toContain("listen(");
  });

  it("builds a client bundle and a self-contained Vercel function without optional analytics variables", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
    const html = readFileSync("client/index.html", "utf8");
    const ignoredFiles = readFileSync(".gitignore", "utf8");
    const generatedHandler = readFileSync("api/index.js", "utf8");

    expect(packageJson.scripts.build).toBe("pnpm build:client && pnpm build:serverless");
    expect(packageJson.scripts["build:client"]).toBe("vite build");
    expect(packageJson.scripts["build:serverless"]).toContain("scripts/build-vercel-function.mjs");
    expect(packageJson.scripts.build).not.toContain("server/_core/index.ts");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(html).not.toContain("%VITE_ANALYTICS_WEBSITE_ID%");
    expect(ignoredFiles).not.toMatch(/^api\/index\.js$/m);
    expect(generatedHandler).not.toContain('from "../server/app"');
    expect(generatedHandler).not.toContain("from '../server/app'");
    expect(generatedHandler).not.toContain("lightningcss");
    expect(generatedHandler).not.toContain("setupVite");
  });

  it("keeps Vercel-checked source files in the local type-check scope", () => {
    const tsconfig = JSON.parse(readFileSync("tsconfig.json", "utf8")) as {
      include: string[];
    };
    const entry = readFileSync("server/vercel-entry.ts", "utf8");
    const viteConfig = readFileSync("vite.config.ts", "utf8");

    expect(tsconfig.include).toContain("api/**/*");
    expect(tsconfig.include).toContain("vite.config.ts");
    expect(entry).toContain("ExpressRequestListener");
    expect(entry).not.toContain("app.handle(");
    expect(viteConfig).not.toContain("vitePluginManusRuntime");
    expect(viteConfig).not.toContain("manus-debug-collector");
  });
});
