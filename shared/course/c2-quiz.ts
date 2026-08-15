import { C2_COURSE, C2_LESSONS } from "./c2";
import { buildAssessmentVariants } from "./assessment-questions";
import type { QuizQuestion } from "./quiz";

function lessonQuestions(lessonNumber: number) {
  const lesson = C2_COURSE.lessons.find((item) => item.lessonNumber === lessonNumber);
  return lesson ? buildAssessmentVariants(C2_COURSE, lesson) : [];
}

export function buildC2LessonQuiz(lessonNumber: number): QuizQuestion[] {
  const questions = lessonQuestions(lessonNumber);
  const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
  const grammar = questions.filter((question) => question.reviewItemType === "grammar");
  return [0, 2, 4, 1, 3, 5].map((index) => vocabulary[index % vocabulary.length]).concat(grammar.slice(0, 2)).filter(Boolean);
}

export function buildC2ModuleTest(moduleNumber: number): QuizQuestion[] {
  return C2_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber).flatMap((lesson) => {
    const questions = lessonQuestions(lesson.lessonNumber);
    const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
    const grammar = questions.filter((question) => question.reviewItemType === "grammar");
    return [vocabulary[0], vocabulary[2], vocabulary[4], grammar[0], grammar[1]].filter(Boolean);
  });
}
