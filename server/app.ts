import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerGoogleAuthRoutes } from "./_core/googleAuth";
import { createContext } from "./_core/context";
import { serveStatic, setupVite } from "./_core/vite";
import { appRouter } from "./routers";

export type CreateAppOptions = {
  /** Mount Vite/static frontend handling. Vercel serves the frontend separately. */
  serveFrontend?: boolean;
  /** Provide the HTTP server only for local Vite HMR. */
  httpServer?: import("http").Server;
};

/**
 * Builds the Express application without listening on a port.
 *
 * Keeping construction separate from the local listener is important for
 * serverless runtimes: importing the Vercel entry point must not start a
 * second server or run the long-lived curriculum synchronizer.
 */
export async function createApp({
  serveFrontend = process.env.NODE_ENV !== "production",
  httpServer,
}: CreateAppOptions = {}): Promise<Express> {
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

  if (serveFrontend) {
    if (process.env.NODE_ENV === "development") {
      if (!httpServer) {
        throw new Error("httpServer is required for Vite development middleware");
      }
      await setupVite(app, httpServer);
    } else {
      serveStatic(app);
    }
  }

  return app;
}
