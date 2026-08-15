import { B1_LESSONS, getB1Lesson } from "./b1";
import type { QuizQuestion } from "./quiz";

function rotate<T>(items: T[], offset: number) { const start = items.length ? offset % items.length : 0; return [...items.slice(start), ...items.slice(0, start)]; }
function spellingChoices(target: string) {
  const word = target.toLowerCase();
  const misspelled = word.length > 7 ? `${word.slice(0, 3)}${word.slice(4)}` : `${word}e`;
  const swapped = word.length > 5 ? `${word.slice(0, 1)}${word.slice(2, 3)}${word.slice(1, 2)}${word.slice(3)}` : `${word}s`;
  return [word, misspelled, swapped, `${word}e`].filter((choice, index, values) => values.indexOf(choice) === index).slice(0, 4);
}
function meaningQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getB1Lesson(lessonNumber)!; const target = lesson.words[wordIndex % lesson.words.length];
  const alternatives = rotate(lesson.words.filter((word) => word.id !== target.id), wordIndex + 2).slice(0, 3).map((word) => word.word);
  return { id: `b1-l${lessonNumber}-meaning-${target.id}`, type: "meaning", prompt: `Which B1 word or expression best means “${target.arabic}”?`, promptArabic: `أي كلمة أو عبارة من مستوى B1 تعني «${target.arabic}»؟`, choices: rotate([target.word, ...alternatives], wordIndex), answer: target.word, reviewItemKey: target.id, reviewItemType: "vocabulary" };
}
function spellingQuestion(lessonNumber: number, wordIndex: number): QuizQuestion {
  const lesson = getB1Lesson(lessonNumber)!; const target = lesson.words[wordIndex % lesson.words.length];
  return { id: `b1-l${lessonNumber}-spelling-${target.id}`, type: "spelling", prompt: `Choose the accurate spelling for this B1 item: ${target.arabic}`, promptArabic: `اختر التهجئة الدقيقة لهذه العبارة من مستوى B1: ${target.arabic}`, choices: rotate(spellingChoices(target.word), wordIndex), answer: target.word.toLowerCase(), reviewItemKey: target.id, reviewItemType: "vocabulary" };
}
function grammarQuestion(lessonNumber: number): QuizQuestion {
  const lesson = getB1Lesson(lessonNumber)!; const alternatives = rotate(B1_LESSONS.filter((item) => item.lessonNumber !== lessonNumber), lessonNumber).slice(0, 3).map((item) => item.grammar.topic);
  return { id: `b1-l${lessonNumber}-grammar`, type: "grammar", prompt: `Which grammar or discourse focus helps you communicate this idea precisely? “${lesson.grammar.examples[0].en}”`, promptArabic: `أي قاعدة أو أداة ربط تساعدك على إيصال هذه الفكرة بدقة؟ «${lesson.grammar.examples[0].ar}»`, choices: rotate([lesson.grammar.topic, ...alternatives], lessonNumber), answer: lesson.grammar.topic, reviewItemKey: lesson.grammar.id, reviewItemType: "grammar" };
}
export function buildB1LessonQuiz(lessonNumber: number): QuizQuestion[] {
  if (!getB1Lesson(lessonNumber)) return [];
  return [0, 3, 6, 9].map((index) => meaningQuestion(lessonNumber, index)).concat([spellingQuestion(lessonNumber, 1), spellingQuestion(lessonNumber, 8), grammarQuestion(lessonNumber)]);
}
export function buildB1ModuleTest(moduleNumber: number): QuizQuestion[] {
  return B1_LESSONS.filter((lesson) => lesson.moduleNumber === moduleNumber).flatMap((lesson) => [meaningQuestion(lesson.lessonNumber, 1), meaningQuestion(lesson.lessonNumber, 7), spellingQuestion(lesson.lessonNumber, 10), grammarQuestion(lesson.lessonNumber)]);
}
