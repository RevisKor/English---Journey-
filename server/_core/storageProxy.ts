import type { Express } from "express";
/** Compatibility no-op: the Vercel-only edition has no Forge-backed storage route. */
export function registerStorageProxy(_app: Express) {}
