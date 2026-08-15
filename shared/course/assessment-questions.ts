import type { CourseDefinition, LessonDefinition, VocabularyItem } from "./types";
import type { QuizQuestion } from "./quiz";

function rotate<T>(items: T[], offset: number) {
  const start = items.length ? offset % items.length : 0;
  return [...items.slice(start), ...items.slice(0, start)];
}

function learnedVocabulary(course: CourseDefinition, lesson: LessonDefinition) {
  return course.lessons
    .filter((item) => item.lessonNumber <= lesson.lessonNumber)
    .flatMap((item) => item.words);
}

function maskTargetInExample(example: string, target: string) {
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`\\b${escaped}\\b`, "i");
  return matcher.test(example) ? example.replace(matcher, "_____") : null;
}

function vocabularyAlternatives(course: CourseDefinition, lesson: LessonDefinition, target: VocabularyItem, offset: number) {
  const targetSpelling = target.word.toLocaleLowerCase();
  const learned = learnedVocabulary(course, lesson).filter((word) => word.id !== target.id && word.word.toLocaleLowerCase() !== targetSpelling);
  const samePartOfSpeech = learned.filter((word) => word.partOfSpeech === target.partOfSpeech);
  const pool = samePartOfSpeech.length >= 3 ? samePartOfSpeech : learned;
  const uniqueBySpelling = (items: VocabularyItem[]) => Array.from(
    new Map(items.map((word) => [word.word.toLocaleLowerCase(), word])).values(),
  );
  const uniquePool = uniqueBySpelling(pool);
  const fallbackPool = uniqueBySpelling(learned);
  return rotate(uniquePool.length >= 3 ? uniquePool : fallbackPool, offset).slice(0, 3).map((word) => word.word);
}

export function buildContextualVocabularyQuestion(course: CourseDefinition, lesson: LessonDefinition, wordIndex: number): QuizQuestion {
  const target = lesson.words[wordIndex % lesson.words.length];
  const maskedExample = maskTargetInExample(target.exampleEN, target.word);
  const assessmentFocus = wordIndex % 3 === 0 ? "collocation" : wordIndex % 3 === 1 ? "meaning" : "retrieval";
  const prompt = assessmentFocus === "meaning"
    ? `Choose the learned word or expression that best matches this meaning: “${target.definition}”`
    : assessmentFocus === "collocation"
      ? `Complete the sentence with the learned word or expression that sounds natural in this phrase: “${maskedExample ?? target.exampleEN}”`
      : maskedExample
        ? `Recall the learned word or expression that completes this sentence: “${maskedExample}”`
        : `Recall the learned word or expression for this lesson context: “${target.definition}”`;
  return {
    id: `${course.level}:context:${target.id}`,
    type: "context",
    prompt,
    promptArabic: assessmentFocus === "meaning"
      ? "اختر الكلمة أو العبارة المتعلَّمة التي تناسب هذا المعنى."
      : assessmentFocus === "collocation"
        ? "اختر الكلمة أو العبارة المتعلَّمة التي تبدو طبيعية في هذه الجملة."
        : "تذكّر الكلمة أو العبارة المتعلَّمة التي تُكمل هذا السياق.",
    choices: rotate([target.word, ...vocabularyAlternatives(course, lesson, target, wordIndex + lesson.lessonNumber)], wordIndex + lesson.lessonNumber),
    answer: target.word,
    reviewItemKey: target.id,
    reviewItemType: "vocabulary",
    assessmentFocus,
  };
}

export function buildGrammarInContextQuestions(course: CourseDefinition, lesson: LessonDefinition): QuizQuestion[] {
  const practiceQuestions = lesson.grammar.practice.map((practice, index) => ({
    id: `${course.level}:grammar:${lesson.grammar.id}:practice:${index}`,
    type: "grammar" as const,
    prompt: practice.question,
    promptArabic: `اختر الإجابة الأنسب في سياق قاعدة: ${lesson.grammar.arabicName}`,
    choices: rotate(practice.choices, lesson.lessonNumber + index),
    answer: practice.answer,
    reviewItemKey: lesson.grammar.id,
    reviewItemType: "grammar" as const,
    assessmentFocus: "grammar" as const,
  }));
  if (practiceQuestions.length) return practiceQuestions;

  const example = lesson.grammar.examples[0];
  const alternatives = rotate(
    course.lessons
      .filter((item) => item.lessonNumber !== lesson.lessonNumber)
      .map((item) => item.grammar.examples[0]?.en)
      .filter((item): item is string => Boolean(item)),
    lesson.lessonNumber,
  ).slice(0, 3);
  if (!example) return [];
  return [{
    id: `${course.level}:grammar:${lesson.grammar.id}:context`,
    type: "grammar",
    prompt: `Which correctly written sentence best demonstrates this lesson's grammar focus: ${lesson.grammar.topic}?`,
    promptArabic: `أي جملة مكتوبة بصورة صحيحة تُظهر قاعدة الدرس: ${lesson.grammar.arabicName}؟`,
    choices: rotate([example.en, ...alternatives], lesson.lessonNumber),
    answer: example.en,
    reviewItemKey: lesson.grammar.id,
    reviewItemType: "grammar",
    assessmentFocus: "grammar",
  }];
}

export function buildAssessmentVariants(course: CourseDefinition, lesson: LessonDefinition): QuizQuestion[] {
  return [
    ...lesson.words.map((_, wordIndex) => buildContextualVocabularyQuestion(course, lesson, wordIndex)),
    ...buildGrammarInContextQuestions(course, lesson),
  ];
}
