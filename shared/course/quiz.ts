import { A1_LESSONS, getA1Lesson } from "./a1";

export type QuizQuestion = {
  id: string;
  type: "meaning" | "spelling" | "grammar";
  prompt: string;
  promptArabic: string;
  choices: string[];
  answer: string;
  reviewItemKey: string;
  reviewItemType: "vocabulary" | "grammar";
};

function rotate<T>(items: T[], offset: number) {
  const normalizedOffset = items.length ? offset % items.length : 0;
  return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)];
}

function spellingChoices(word: string) {
  const lowercase = word.toLowerCase();
  const swapped = lowercase.length > 3 ? `${lowercase.slice(0, 1)}${lowercase.slice(2, 3)}${lowercase.slice(1, 2)}${lowercase.slice(3)}` : `${lowercase}e`;
  const doubled = lowercase.length > 3 ? `${lowercase.slice(0, -1)}${lowercase.at(-1)}${lowercase.at(-1)}` : `${lowercase}s`;
  return [lowercase, swapped, doubled, `${lowercase}e`].filter((choice, index, values) => values.indexOf(choice) === index).slice(0, 4);
}

function vocabularyQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getA1Lesson(lessonNumber)!;
  const word = lesson.words[wordIndex % lesson.words.length];
  const alternatives = rotate(lesson.words.filter((item) => item.id !== word.id), wordIndex + 2).slice(0, 3).map((item) => item.word);
  return {
    id: `l${lessonNumber}-meaning-${word.id}`,
    type: "meaning",
    prompt: `Which English word means “${word.arabic}”?`,
    promptArabic: `ما الكلمة الإنجليزية التي تعني «${word.arabic}»؟`,
    choices: rotate([word.word, ...alternatives], wordIndex),
    answer: word.word,
    reviewItemKey: word.id,
    reviewItemType: "vocabulary",
  };
}

function spellingQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getA1Lesson(lessonNumber)!;
  const word = lesson.words[wordIndex % lesson.words.length];
  return {
    id: `l${lessonNumber}-spelling-${word.id}`,
    type: "spelling",
    prompt: `Choose the correct spelling for: ${word.arabic}`,
    promptArabic: `اختر التهجئة الصحيحة لكلمة: ${word.arabic}`,
    choices: rotate(spellingChoices(word.word), wordIndex),
    answer: word.word.toLowerCase(),
    reviewItemKey: word.id,
    reviewItemType: "vocabulary",
  };
}

function grammarQuestion(lessonNumber: number, practiceIndex: number): QuizQuestion {
  const lesson = getA1Lesson(lessonNumber)!;
  const practice = lesson.grammar.practice[practiceIndex % lesson.grammar.practice.length];
  return {
    id: `l${lessonNumber}-grammar-${practiceIndex}`,
    type: "grammar",
    prompt: practice.question,
    promptArabic: `اختر الإجابة الصحيحة عن قاعدة: ${lesson.grammar.arabicName}`,
    choices: rotate(practice.choices, practiceIndex),
    answer: practice.answer,
    reviewItemKey: lesson.grammar.id,
    reviewItemType: "grammar",
  };
}

export function buildLessonQuiz(lessonNumber: number): QuizQuestion[] {
  const lesson = getA1Lesson(lessonNumber);
  if (!lesson) return [];
  return [
    vocabularyQuestion(lessonNumber, 0),
    vocabularyQuestion(lessonNumber, 3),
    vocabularyQuestion(lessonNumber, 7),
    vocabularyQuestion(lessonNumber, 11),
    spellingQuestion(lessonNumber, 5),
    spellingQuestion(lessonNumber, 13),
    grammarQuestion(lessonNumber, 0),
    grammarQuestion(lessonNumber, 1),
  ];
}

export function buildModuleTest(moduleNumber: number): QuizQuestion[] {
  const moduleLessons = A1_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber);
  return moduleLessons.flatMap((lesson) => [
    vocabularyQuestion(lesson.lessonNumber, 1),
    spellingQuestion(lesson.lessonNumber, 8),
    grammarQuestion(lesson.lessonNumber, 0),
  ]);
}

export function withoutAnswers(questions: QuizQuestion[]) {
  return questions.map(({ answer: _answer, reviewItemKey: _reviewItemKey, reviewItemType: _reviewItemType, ...question }) => question);
}
