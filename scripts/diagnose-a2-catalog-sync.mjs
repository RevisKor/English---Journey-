import { syncCourse } from "../server/course-catalog.ts";
import { A2_COURSE } from "../shared/course/a2.ts";

try {
  await syncCourse(A2_COURSE);
  console.log("A2 catalog synchronization completed.");
} catch (error) {
  console.error("A2 catalog synchronization failed:", error);
  process.exitCode = 1;
}
