# Vercel-Independent Setup

This guide deploys English Journey without Manus runtime services. The application uses a Vercel-connected Neon Postgres database, Google OAuth, signed secure cookies, browser-native pronunciation, and learner-owned external AI prompts. It does not call a paid AI API.

## 1. Vercel database

The connected Vercel/Neon integration must provide `DATABASE_URL` for Production and Preview. Do not copy or expose its value. The connection value is marked sensitive and is already attached to the project when the database integration is connected.

### Initialize the empty database

1. From Vercel, open the connected Neon integration and choose **Manage** to open the Neon dashboard.
2. Open the database's **SQL Editor** and create a new query.
3. In this repository, open `drizzle/0000_fantastic_raider.sql` from the same Git commit that you deploy.
4. Copy the complete contents of that migration into the Neon SQL Editor and run it once.
5. Confirm that the tables `users`, `courseLevels`, `courseModules`, `courseLessons`, and `lessonProgress` were created.

> Do not run the initialization SQL more than once against the same database. It creates types and tables intended for a new, empty database.

## 2. Vercel environment variables

In **Vercel → English Journey → Settings → Environment Variables**, create the following values for **Production** and **Preview**. Do not add them to GitHub or paste them into chat.

| Variable | Source | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Vercel/Neon integration | Created automatically by the connected database integration. |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth client | The Client ID for the replacement Web application credential. |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth client | Keep private. The credential must not be the one exposed in the earlier screenshot. |
| `JWT_SECRET` | Generate locally | Use `openssl rand -base64 48`; do not rotate after users begin signing in unless sessions should be invalidated. |
| `OWNER_EMAILS` | Comma-separated administrator Google emails | Exact email matches are promoted to the application admin role on first login, for example `revissskor@gmail.com,Yahya205080@gmail.com`. |
| `OWNER_EMAIL` | One administrator Google email (legacy) | Still supported when `OWNER_EMAILS` is absent. |

The independent runtime does **not** need `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, `BUILT_IN_FORGE_*`, `VITE_FRONTEND_FORGE_*`, or `VERCEL_TOKEN`.

## 3. Google OAuth

In the Google Cloud OAuth client, keep the application in **Testing** mode while validating it. Add your own Google account under **Google Auth Platform → Audience → Test users**.

For the production Vercel domain, set this authorized redirect URI:

```text
https://YOUR-VERCEL-DOMAIN/api/auth/callback/google
```

For example:

```text
https://english-journey-bp30hxqba-reviskorians.vercel.app/api/auth/callback/google
```

When you later attach a custom domain, add the equivalent custom-domain callback URL to the same Google OAuth client before using that domain for sign-in.

## 4. Redeploy and verify

After adding or changing environment variables, redeploy the latest Git commit. Then verify:

1. The homepage opens without Manus OAuth or invalid-URL errors.
2. Selecting Sign in opens Google consent and returns to `/api/auth/callback/google`.
3. The signed-in user appears in the application and is an admin when their email exactly matches one of the configured `OWNER_EMAILS` values.
4. Completing a small lesson activity creates saved progress.
5. Refreshing and signing in again preserves the same progress.

If a function fails, inspect Vercel **Functions** logs. Never post `DATABASE_URL`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, or browser session cookies in logs or chat.
