import { B1_COURSE, B1_LESSONS } from "./b1";
import { buildAssessmentVariants } from "./assessment-questions";
import type { QuizQuestion } from "./quiz";

function lessonQuestions(lessonNumber: number) { const lesson = B1_COURSE.lessons.find((item) => item.lessonNumber === lessonNumber); return lesson ? buildAssessmentVariants(B1_COURSE, lesson) : []; }
export function buildB1LessonQuiz(lessonNumber: number): QuizQuestion[] {
  const questions = lessonQuestions(lessonNumber); const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary"); const grammar = questions.filter((question) => question.reviewItemType === "grammar");
  return [0, 3, 6, 9, 12, 15, 18].map((index) => vocabulary[index % vocabulary.length]).concat(grammar.slice(0, 1)).filter(Boolean);
}
export function buildB1ModuleTest(moduleNumber: number): QuizQuestion[] {
  return B1_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber).flatMap((lesson) => { const questions = lessonQuestions(lesson.lessonNumber); const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary"); const grammar = questions.filter((question) => question.reviewItemType === "grammar"); return [vocabulary[1], vocabulary[7], vocabulary[10], grammar[0]].filter(Boolean); });
}
