import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputFile = path.join(projectRoot, "api", "index.js");

await mkdir(path.dirname(outputFile), { recursive: true });
await rm(`${outputFile}.map`, { force: true });

await build({
  absWorkingDir: projectRoot,
  bundle: true,
  entryPoints: ["server/vercel-entry.ts"],
  format: "esm",
  legalComments: "none",
  outfile: outputFile,
  packages: "external",
  platform: "node",
  target: "node22",
});
