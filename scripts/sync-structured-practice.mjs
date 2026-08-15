import { syncStructuredPracticeCatalog } from "../server/course-catalog.ts";

await syncStructuredPracticeCatalog();
console.log("Structured reading and writing practice synchronization completed.");
