import type { Express } from "express";

/**
 * Legacy compatibility export. Google OAuth is registered by createApp through
 * registerGoogleAuthRoutes; the former Manus callback does not exist here.
 */
export function registerOAuthRoutes(_app: Express) {}
