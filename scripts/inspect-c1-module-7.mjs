import fs from "node:fs";

const lessons = JSON.parse(fs.readFileSync(new URL("../shared/course/c1-draft.json", import.meta.url), "utf8"));
for (const lesson of lessons.filter((item) => item.lessonNumber >= 97 && item.lessonNumber <= 112)) {
  console.log(`${lesson.lessonNumber}\t${lesson.title}\t${lesson.titleArabic}`);
}
