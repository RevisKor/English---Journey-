import { A2_COURSE, A2_LESSONS, getA2Lesson } from "./a2";
import { buildAssessmentVariants } from "./assessment-questions";
import type { QuizQuestion } from "./quiz";

export type ReadingCheckDefinition = {
  id: string;
  focus: "main_idea" | "detail" | "inference";
  prompt: string;
  promptArabic: string;
  expectedEvidence: string;
};

function lessonQuestions(lessonNumber: number) {
  const lesson = A2_COURSE.lessons.find((item) => item.lessonNumber === lessonNumber);
  return lesson ? buildAssessmentVariants(A2_COURSE, lesson) : [];
}

export function buildA2LessonQuiz(lessonNumber: number): QuizQuestion[] {
  const questions = lessonQuestions(lessonNumber);
  const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
  const grammar = questions.filter((question) => question.reviewItemType === "grammar");
  return [0, 2, 5, 8, 11, 15, 18].map((index) => vocabulary[index % vocabulary.length]).concat(grammar.slice(0, 1)).filter(Boolean);
}

export function buildA2ModuleTest(moduleNumber: number): QuizQuestion[] {
  return A2_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber).flatMap((lesson) => {
    const questions = lessonQuestions(lesson.lessonNumber);
    const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
    const grammar = questions.filter((question) => question.reviewItemType === "grammar");
    return [vocabulary[1], vocabulary[7], vocabulary[10], grammar[0]].filter(Boolean);
  });
}

export function buildA2ReadingChecks(lessonNumber: number): ReadingCheckDefinition[] {
  const lesson = getA2Lesson(lessonNumber);
  if (!lesson) return [];
  const outcome = lesson.learningPlan?.outcome.canDo ?? "the lesson outcome";
  return [
    { id: `a2-l${lessonNumber}-reading-main`, focus: "main_idea", prompt: "What is the passage mainly about?", promptArabic: "ما الفكرة الرئيسة في النص؟", expectedEvidence: outcome },
    { id: `a2-l${lessonNumber}-reading-detail`, focus: "detail", prompt: "What detail in the text supports your answer?", promptArabic: "ما التفصيل في النص الذي يدعم إجابتك؟", expectedEvidence: "A fact or example stated in the passage" },
    { id: `a2-l${lessonNumber}-reading-inference`, focus: "inference", prompt: "What can you reasonably understand from the writer’s situation?", promptArabic: "ماذا يمكنك أن تستنتج بشكل منطقي من موقف الكاتب؟", expectedEvidence: "A short inference supported by the passage" },
  ];
}
