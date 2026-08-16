import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import { getAuthenticatedUser } from "./googleAuth";

/**
 * Compatibility surface for legacy imports. Authentication is now local and
 * Google-backed; this module performs no Manus network calls.
 */
export type SessionPayload = {
  openId: string;
  name?: string;
};

export const sdk = {
  authenticateRequest: async (req: Request): Promise<User | null> =>
    getAuthenticatedUser(req),
};
