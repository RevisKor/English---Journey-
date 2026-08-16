import { A1_COURSE } from "../shared/course/a1.ts";
import { syncCourse } from "../server/course-catalog.ts";

await syncCourse(A1_COURSE);
console.log("A1 curriculum catalog synchronization completed.");
