import { A2_LESSONS } from "../shared/course/a2.ts";

for (const lesson of A2_LESSONS.filter((item) => item.moduleNumber === 5)) {
  const kinds = lesson.activities?.map((activity) => activity.kind) ?? [];
  if (!kinds.includes(lesson.lessonType)) {
    console.log(JSON.stringify({ lessonNumber: lesson.lessonNumber, lessonType: lesson.lessonType, kinds, title: lesson.title }));
  }
}
