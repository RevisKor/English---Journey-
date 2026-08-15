import { A2_LESSONS, getA2Lesson } from "./a2";
import type { QuizQuestion } from "./quiz";

export type ReadingCheckDefinition = {
  id: string;
  focus: "main_idea" | "detail" | "inference";
  prompt: string;
  promptArabic: string;
  expectedEvidence: string;
};

function rotate<T>(items: T[], offset: number) {
  if (!items.length) return [];
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function spellingChoices(word: string) {
  const value = word.toLowerCase();
  const missingLetter = value.length > 5 ? `${value.slice(0, 2)}${value.slice(3)}` : `${value}e`;
  const swapped = value.length > 4 ? `${value.slice(0, 1)}${value.slice(2, 3)}${value.slice(1, 2)}${value.slice(3)}` : `${value}s`;
  return [value, missingLetter, swapped, `${value}e`].filter((choice, index, values) => values.indexOf(choice) === index).slice(0, 4);
}

function meaningQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getA2Lesson(lessonNumber)!;
  const target = lesson.words[wordIndex % lesson.words.length];
  const alternatives = rotate(lesson.words.filter((word) => word.id !== target.id), wordIndex + 3).slice(0, 3).map((word) => word.word);
  return {
    id: `a2-l${lessonNumber}-meaning-${target.id}`,
    type: "meaning",
    prompt: `Which useful English expression means “${target.arabic}”?`,
    promptArabic: `أي كلمة أو عبارة إنجليزية مفيدة تعني «${target.arabic}»؟`,
    choices: rotate([target.word, ...alternatives], wordIndex),
    answer: target.word,
    reviewItemKey: target.id,
    reviewItemType: "vocabulary",
  };
}

function spellingQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getA2Lesson(lessonNumber)!;
  const target = lesson.words[wordIndex % lesson.words.length];
  return {
    id: `a2-l${lessonNumber}-spelling-${target.id}`,
    type: "spelling",
    prompt: `Choose the correct spelling for: ${target.arabic}`,
    promptArabic: `اختر التهجئة الصحيحة لكلمة أو عبارة: ${target.arabic}`,
    choices: rotate(spellingChoices(target.word), wordIndex),
    answer: target.word.toLowerCase(),
    reviewItemKey: target.id,
    reviewItemType: "vocabulary",
  };
}

function grammarQuestion(lessonNumber: number): QuizQuestion {
  const lesson = getA2Lesson(lessonNumber)!;
  const example = lesson.grammar.examples[0];
  const alternatives = A2_LESSONS.filter((item) => item.lessonNumber !== lessonNumber).slice(0, 3).map((item) => item.grammar.topic);
  return {
    id: `a2-l${lessonNumber}-grammar`,
    type: "grammar",
    prompt: `Which grammar focus best supports this sentence? “${example.en}”`,
    promptArabic: `أي قاعدة تدعم هذه الجملة بشكل أفضل؟ «${example.ar}»`,
    choices: rotate([lesson.grammar.topic, ...alternatives], lessonNumber),
    answer: lesson.grammar.topic,
    reviewItemKey: lesson.grammar.id,
    reviewItemType: "grammar",
  };
}

export function buildA2LessonQuiz(lessonNumber: number): QuizQuestion[] {
  if (!getA2Lesson(lessonNumber)) return [];
  return [0, 2, 5, 8, 11].map((index) => meaningQuestion(lessonNumber, index)).concat([
    spellingQuestion(lessonNumber, 4),
    spellingQuestion(lessonNumber, 12),
    grammarQuestion(lessonNumber),
  ]);
}

export function buildA2ModuleTest(moduleNumber: number): QuizQuestion[] {
  return A2_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber).flatMap((lesson) => [
    meaningQuestion(lesson.lessonNumber, 1),
    meaningQuestion(lesson.lessonNumber, 7),
    spellingQuestion(lesson.lessonNumber, 10),
    grammarQuestion(lesson.lessonNumber),
  ]);
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
