import { createApp } from "./app";
import { ensureCurrentCurriculumCatalog } from "./course-catalog";

const app = createApp();

 type ExpressRequestListener = (req: Request, res: Response) => void;

type NodeResponse = Response & {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

const QUIZ_ROUTES = new Set([
  "/api/trpc/course.lessonQuiz",
  "/api/trpc/course.milestoneQuiz",
  "/api/trpc/course.moduleTest",
]);

let catalogBootstrap: Promise<void> | undefined;

function ensureQuizCatalog() {
  catalogBootstrap ??= ensureCurrentCurriculumCatalog().catch((error) => {
    catalogBootstrap = undefined;
    throw error;
  });
  return catalogBootstrap;
}

/**
 * Source entry point for the Vercel serverless bundle. The build script emits
 * this as api/index.js so Vercel executes one self-contained function rather
 * than attempting to resolve TypeScript files outside the API directory.
 */
export default async function handler(req: Request, res: Response) {
  const path = req.url ? new URL(req.url, "http://localhost").pathname : "";
  if (QUIZ_ROUTES.has(path)) {
    try {
      await ensureQuizCatalog();
    } catch (error) {
      console.error("[Curriculum] Quiz catalog bootstrap failed", error);
      const nodeResponse = res as NodeResponse;
      nodeResponse.statusCode = 503;
      nodeResponse.setHeader("content-type", "application/json; charset=utf-8");
      nodeResponse.end(JSON.stringify({ error: "Course catalog is temporarily unavailable. Please try again." }));
      return;
    }
  }

  return (app as unknown as ExpressRequestListener)(req, res);
}
