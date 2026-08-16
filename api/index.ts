import type { Request, Response } from "express";
import { createApp } from "../server/app";

const appPromise = createApp({ serveFrontend: false });

type ExpressRequestListener = (req: Request, res: Response) => void;

export default async function handler(req: Request, res: Response) {
  const app = await appPromise;
  return (app as unknown as ExpressRequestListener)(req, res);
}
