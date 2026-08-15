import { ensureCurriculumCatalog, syncStructuredPracticeCatalog } from "../server/course-catalog.ts";

await ensureCurriculumCatalog();
await syncStructuredPracticeCatalog();
console.log("Curriculum catalog synchronization completed.");
