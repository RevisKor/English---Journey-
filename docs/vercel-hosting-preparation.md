# Vercel Hosting Preparation

## Prepared architecture

English Journey now exposes a reusable Express application factory at `server/app.ts`. The local development entry point still owns the HTTP listener, Vite middleware, and version-aware curriculum synchronization. The Vercel entry point at `api/index.ts` imports only the application factory, serves API traffic through the Node runtime, and does not open a port or start catalog synchronization.

The root `vercel.json` rewrites `/api/*` to the function entry point. The Vite build continues to emit the browser application into `dist/public`, while Vercel serves those static assets directly. The Express function handles `/api/trpc/*`, `/api/oauth/callback`, and `/manus-storage/*` through the existing server registrations.

> No deployment was performed. This change prepares the repository for a user-controlled Vercel import or deployment.

## Required Vercel environment variables

| Variable group | Required values | Purpose |
|---|---|---|
| Database | `DATABASE_URL` | MySQL/TiDB connection used by Drizzle and learner progress persistence. |
| Authentication | `JWT_SECRET`, `OAUTH_SERVER_URL`, `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL` | Session signing and OAuth login/callback behavior. |
| Server application | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Existing storage proxy and platform-provided server helpers. These are not new paid APIs. |
| Browser application | `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_APP_TITLE`, `VITE_APP_LOGO` | Existing client configuration supplied by the project environment. |
| Ownership | `OWNER_OPEN_ID`, `OWNER_NAME` | Existing owner identity used by the application. Analytics is intentionally not loaded, so no analytics variables are required. |

Production and preview values must be entered through the Vercel project’s environment-variable settings. Secrets must not be committed to the repository.

## Important operational limitation

The local server currently performs curriculum synchronization after its listener starts. That behavior remains local-only. On Vercel, catalog changes should be applied through the existing migration/synchronization workflow before deployment; the serverless function must not depend on a persistent background process. This avoids duplicate synchronization work across concurrent function instances.

The current adapter does not add an AI provider, speech provider, analytics provider, or payment service. Browser-native speech and the external learner-owned prompt workflow remain the no-cost product architecture.

## Compatibility reference

Vercel’s Node.js runtime supports Node HTTP serverless execution and documents Node function configuration in its official runtime guidance: [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js).
