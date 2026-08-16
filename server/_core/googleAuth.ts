import { randomUUID } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, SignJWT, type JWTPayload } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV, requireGoogleOAuthConfig } from "./env";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const GOOGLE_STATE_COOKIE = "__Host-google_oauth_state";
const SESSION_ISSUER = "english-journey";
const SESSION_AUDIENCE = "english-journey-session";

type GoogleClaims = JWTPayload & {
  email?: string;
  email_verified?: boolean;
  name?: string;
};

function requestOrigin(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : req.protocol;
  const host = req.get("host");
  if (!host) throw new Error("Request host is required for OAuth redirect");
  return `${protocol}://${host}`;
}

function callbackUrl(req: Request) {
  return `${requestOrigin(req)}/api/auth/callback/google`;
}

function secretKey() {
  return new TextEncoder().encode(requireGoogleOAuthConfig().cookieSecret);
}

async function createSession(openId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(openId)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secretKey());
}

async function getGoogleClaims(idToken: string): Promise<GoogleClaims> {
  const config = requireGoogleOAuthConfig();
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: config.googleClientId,
  });
  return payload as GoogleClaims;
}

export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  if (!ENV.cookieSecret) return null;
  const token = parseCookieHeader(req.headers.cookie ?? "")[COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ENV.cookieSecret), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (typeof payload.sub !== "string" || !payload.sub) return null;
    return (await db.getUserByOpenId(payload.sub)) ?? null;
  } catch {
    return null;
  }
}

export function registerGoogleAuthRoutes(app: Express) {
  app.get("/api/auth/login/google", (req: Request, res: Response) => {
    try {
      const config = requireGoogleOAuthConfig();
      const state = randomUUID();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(GOOGLE_STATE_COOKIE, state, { ...cookieOptions, sameSite: "lax", maxAge: 10 * 60 * 1000 });

      const url = new URL(GOOGLE_AUTH_URL);
      url.searchParams.set("client_id", config.googleClientId);
      url.searchParams.set("redirect_uri", callbackUrl(req));
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      url.searchParams.set("prompt", "select_account");
      res.redirect(302, url.toString());
    } catch (error) {
      console.error("[Google OAuth] Login could not start", error);
      res.status(503).json({ error: "Google sign-in is not configured." });
    }
  });

  app.get("/api/auth/callback/google", async (req: Request, res: Response) => {
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const expectedState = parseCookieHeader(req.headers.cookie ?? "")[GOOGLE_STATE_COOKIE];
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(GOOGLE_STATE_COOKIE, { ...cookieOptions, sameSite: "lax" });

    if (!code || !state || !expectedState || state !== expectedState) {
      res.status(403).json({ error: "Invalid Google OAuth state." });
      return;
    }

    try {
      const config = requireGoogleOAuthConfig();
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: callbackUrl(req),
          grant_type: "authorization_code",
        }),
      });
      if (!tokenResponse.ok) throw new Error(`Google token exchange failed (${tokenResponse.status})`);
      const tokenData = (await tokenResponse.json()) as { id_token?: string };
      if (!tokenData.id_token) throw new Error("Google token response did not include an ID token");

      const claims = await getGoogleClaims(tokenData.id_token);
      if (!claims.sub || !claims.email || claims.email_verified !== true) {
        res.status(400).json({ error: "Google account must provide a verified email address." });
        return;
      }

      const user = await db.upsertUser({
        openId: claims.sub,
        email: claims.email,
        name: claims.name ?? null,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });
      const token = await createSession(user.openId);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      res.status(500).json({ error: "Google sign-in could not be completed." });
    }
  });
}
