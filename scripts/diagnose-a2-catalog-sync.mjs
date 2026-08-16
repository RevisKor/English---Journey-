import { syncCourse } from "../server/course-catalog.ts";
import { A1_COURSE } from "../shared/course/a1.ts";
import { A2_COURSE } from "../shared/course/a2.ts";

const course = process.env.COURSE_LEVEL === "A1" ? A1_COURSE : A2_COURSE;

try {
  await syncCourse(course);
  console.log(`${course.level} catalog synchronization completed.`);
} catch (error) {
  console.error(`${course.level} catalog synchronization failed:`, error);
  process.exitCode = 1;
}
