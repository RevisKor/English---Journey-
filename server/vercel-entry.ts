import type { Request, Response } from "express";
import { createApp } from "./app";

const app = createApp();

type ExpressRequestListener = (req: Request, res: Response) => void;

/**
 * Source entry point for the Vercel serverless bundle. The build script emits
 * this as api/index.js so Vercel executes one self-contained function rather
 * than attempting to resolve TypeScript files outside the API directory.
 */
export default function handler(req: Request, res: Response) {
  return (app as unknown as ExpressRequestListener)(req, res);
}
