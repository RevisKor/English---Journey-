# Safe Git Push Guide

This repository is prepared for a manual push. The project does not contain deployment credentials, local logs, sandbox metadata, or the generated debug collector. The Vercel adapter is included, but no deployment is performed by this guide.

## 1. Create a private repository

On GitHub, create a new **private** empty repository. Do not add a README, `.gitignore`, or license during creation because this project already contains its own files.

## 2. Review the local tree

From the project directory, run:

```bash
git status --short
git diff -- .gitignore todo.md docs/git-push-safe.md
```

The generated sandbox files should remain ignored. Never add `.env`, `.env.local`, `.vercel/`, `.manus-logs/`, `dist/`, or downloaded archives.

## 3. Commit the prepared source

```bash
git add .
git status --short
git diff --cached --check
git commit -m "Prepare English Journey for Vercel hosting"
```

Before pushing, inspect the staged file list and confirm that no credential, private key, environment file, archive, log, or local configuration file is present.

## 4. Connect and push the repository

Replace the placeholder with the URL of the empty private repository you created:

```bash
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

If `origin` already exists, inspect it with `git remote -v` before changing it. Never paste a token into the remote URL; use GitHub's normal browser login, SSH, or credential manager.

## 5. Import into Vercel

In the Vercel dashboard, select the linked team, choose **Add New → Project**, and import the private repository. Use the committed `vercel.json` configuration. The project uses the existing `pnpm build` command and `dist/public` output directory, with API requests routed through the Vercel function under `/api`.

Add the required values through Vercel's Environment Variables panel for Preview and Production. The names currently used by the server include `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, and `VITE_OAUTH_PORTAL_URL`. Values must be entered in Vercel's encrypted settings and must never be committed.

After the first Preview deployment, update the OAuth provider's callback URL to `https://YOUR_VERCEL_DOMAIN/api/oauth/callback`, then test login, course loading, tRPC requests, daily review, storage, and progress persistence before using Production.

## No-cost boundary

English Journey does not require a paid external AI or speech API for the prepared deployment. The tutor strategy uses learner-owned external prompts, while vocabulary playback uses browser-native speech. Vercel hosting, the database provider, and any future external service may have their own account limits or pricing; review those terms separately before enabling them.
