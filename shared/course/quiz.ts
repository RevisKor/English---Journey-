import { A1_COURSE, A1_LESSONS } from "./a1";
import { buildAssessmentVariants } from "./assessment-questions";

export type QuizQuestion = {
  id: string;
  type: "meaning" | "context" | "spelling" | "grammar";
  prompt: string;
  promptArabic: string;
  choices: string[];
  answer: string;
  reviewItemKey: string;
  reviewItemType: "vocabulary" | "grammar";
  assessmentFocus: "meaning" | "collocation" | "retrieval" | "grammar";
};

function lessonQuestions(lessonNumber: number) {
  const lesson = A1_COURSE.lessons.find((item) => item.lessonNumber === lessonNumber);
  return lesson ? buildAssessmentVariants(A1_COURSE, lesson) : [];
}

export function buildLessonQuiz(lessonNumber: number): QuizQuestion[] {
  const questions = lessonQuestions(lessonNumber);
  const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
  const grammar = questions.filter((question) => question.reviewItemType === "grammar");
  return [0, 3, 7, 11, 15, 18].map((index) => vocabulary[index % vocabulary.length]).concat(grammar.slice(0, 2)).filter(Boolean);
}

export function buildModuleTest(moduleNumber: number): QuizQuestion[] {
  const moduleLessons = A1_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber);
  return moduleLessons.flatMap((lesson) => {
    const questions = lessonQuestions(lesson.lessonNumber);
    const vocabulary = questions.filter((question) => question.reviewItemType === "vocabulary");
    const grammar = questions.filter((question) => question.reviewItemType === "grammar");
    return [vocabulary[1], vocabulary[8], grammar[0]].filter(Boolean);
  });
}

export function withoutAnswers(questions: QuizQuestion[]) {
  return questions.map(({ answer: _answer, reviewItemKey: _reviewItemKey, reviewItemType: _reviewItemType, ...question }) => question);
}
