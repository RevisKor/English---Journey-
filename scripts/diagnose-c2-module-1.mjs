import { C2_LESSONS } from "../shared/course/c2.ts";

for (const lesson of C2_LESSONS.slice(0, 15)) {
  const firstView = lesson.experience?.firstView;
  const retrieval = lesson.activities?.[0]?.retrieval;
  console.log(lesson.lessonNumber, {
    firstView: Boolean(firstView?.whatItIs && firstView?.whatToDo && firstView?.whatMatters && firstView?.whatNext),
    retrieval: Boolean(retrieval?.prompt && retrieval?.promptArabic && retrieval?.expectedEvidence && /[\u0600-\u06FF]/.test(retrieval.promptArabic)),
    retrievalArabic: retrieval?.promptArabic,
  });
}
