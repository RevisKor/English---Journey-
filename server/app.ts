import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerGoogleAuthRoutes } from "./_core/googleAuth";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";

/**
 * Builds the API-only Express application without listening on a port.
 *
 * Local Vite/static wiring belongs in the local server entry, not here. This
 * keeps the Vercel handler free of frontend build dependencies and their
 * platform-specific native modules.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerGoogleAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
