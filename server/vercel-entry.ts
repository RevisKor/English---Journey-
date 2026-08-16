import type { Request, Response } from "express";
import { createApp } from "./app";

const appPromise = createApp({ serveFrontend: false });

type ExpressRequestListener = (req: Request, res: Response) => void;

/**
 * Source entry point for the Vercel serverless bundle. The build script emits
 * this as api/index.js so Vercel executes one self-contained function rather
 * than attempting to resolve TypeScript files outside the API directory.
 */
export default async function handler(req: Request, res: Response) {
  const app = await appPromise;
  return (app as unknown as ExpressRequestListener)(req, res);
}
