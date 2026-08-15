import { syncAssessmentQuestionBanks } from "../server/course-catalog.ts";

await syncAssessmentQuestionBanks();
console.log("Contextual assessment-bank synchronization completed.");
