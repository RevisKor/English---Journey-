# Vercel Serverless Crash Diagnosis

## Observed production failure

The production deployment reported `FUNCTION_INVOCATION_FAILED` for `GET /api/trpc/auth.me`. Vercel runtime logs identified the underlying error as:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/server/app'
imported from /var/task/api/index.js
```

The older API entry imported `../server/app` directly. Vercel emitted `api/index.js` but did not package a matching compiled `server/app` module, causing the function to exit before tRPC or Google OAuth could run.

## Repair

The production build now performs two explicit outputs:

1. `vite build` writes the static frontend to `dist/public`.
2. `scripts/build-vercel-function.mjs` bundles `server/vercel-entry.ts` into the self-contained `api/index.js` Node serverless entry.

The Express application lazily imports its Vite/static bridge only when a frontend-serving local app is requested. This keeps the Vercel function focused on the API and prevents development-only Vite configuration from being pulled into its runtime bundle.

Unused Manus-specific Vite plugins were removed from the production dependency graph and Vite configuration. The generated function file is ignored by Git and is produced during each Vercel build.

## Local verification

The recovery passed TypeScript validation, a client-plus-serverless production build, a generated-bundle syntax check, and the serial Vitest suite: **40 files / 140 tests**.

## Sources

- Vercel deployment `dpl_2wA9Qig2hHQZfRsM1cUCgu95WoAX` runtime logs, accessed 2026-08-16.
- Vercel deployment `dpl_2wA9Qig2hHQZfRsM1cUCgu95WoAX` build logs, accessed 2026-08-16.
