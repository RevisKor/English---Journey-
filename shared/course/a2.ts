import rawDraft from "./a2-draft.json";
import rawWordFamilies from "./a2-word-families.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonStep, VocabularyItem } from "./types";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";

type DraftVocabulary = {
  word: string;
  arabic: string;
  partOfSpeech: string;
  definition: string;
  exampleEN: string;
  exampleAR: string;
};

type DraftLesson = {
  lessonNumber: number;
  title: string;
  titleArabic: string;
  outcome: { canDo: string; canDoArabic: string; scenario: string; scenarioArabic: string };
  retrieval: Array<{ language: string; prompt: string; purpose: string }>;
  network: {
    theme: string;
    themeArabic: string;
    anchor: string;
    relatedWords: string[];
    chunks: string[];
    collocations: string[];
    register: "neutral" | "informal" | "formal" | "mixed";
    priorLevelLinks: string[];
    learningNote: string;
    learningNoteArabic: string;
  };
  vocabulary: DraftVocabulary[];
  grammar: {
    topic: string;
    arabicName: string;
    concept: string;
    arabicComparison: string;
    structure: string;
    commonError: string;
    exampleEN: string;
    exampleAR: string;
  };
  readingBrief: string;
  writingPrompt: string;
};

type WordFamilyRecord = {
  lessonNumber: number;
  families: Array<{ headword: string; forms: string[]; note: string; noteArabic: string }>;
};

const WORD_FAMILIES_BY_LESSON = new Map((rawWordFamilies as WordFamilyRecord[]).map((entry) => [entry.lessonNumber, entry.families]));

const STEPS: LessonStep[] = [
  { id: "start", title: "Start here", titleArabic: "ابدأ هنا", purpose: "Retrieve A1 language and see today’s outcome.", estimatedMinutes: 5 },
  { id: "explore", title: "Explore", titleArabic: "استكشف", purpose: "Meet the new language in a useful situation.", estimatedMinutes: 10 },
  { id: "notice", title: "Notice", titleArabic: "لاحظ", purpose: "Understand the language choice, form, and Arabic contrast.", estimatedMinutes: 10 },
  { id: "build", title: "Build", titleArabic: "ابنِ", purpose: "Use chunks and grammar in guided choices.", estimatedMinutes: 10 },
  { id: "respond", title: "Respond", titleArabic: "استجب", purpose: "Create a short answer for a real audience and purpose.", estimatedMinutes: 15 },
  { id: "prove", title: "Prove it", titleArabic: "أثبت إتقانك", purpose: "Show transfer, receive feedback, and schedule review.", estimatedMinutes: 10 },
];

function asVocabularyItem(item: DraftVocabulary, lessonNumber: number, index: number): VocabularyItem {
  return {
    id: `a2-${lessonNumber}-${index + 1}`,
    word: item.word,
    arabic: item.arabic,
    ipa: "",
    phoneticRespelling: item.word,
    partOfSpeech: item.partOfSpeech,
    definition: item.definition,
    exampleEN: item.exampleEN,
    exampleAR: item.exampleAR,
  };
}

function asGrammarTopic(lesson: DraftLesson): GrammarTopic {
  const topic = lesson.grammar;
  return {
    id: `a2-grammar-${lesson.lessonNumber}`,
    lessonNumber: lesson.lessonNumber,
    topic: topic.topic,
    arabicName: topic.arabicName,
    concept: topic.concept,
    represents: "Choose this pattern to communicate clearly in the lesson scenario.",
    arabicComparison: topic.arabicComparison,
    useWhen: ["you need to complete the lesson outcome", "the situation matches the lesson scenario"],
    doNotUseWhen: ["a simpler A1 sentence already expresses the exact meaning you need"],
    commonMistakes: [{ wrong: topic.commonError, correct: topic.structure, explanation: "Read the pattern and compare it with the example before trying again." }],
    structure: { positive: topic.structure, negative: `Check the negative form in: ${topic.exampleEN}`, question: `Ask an AI follow-up question using: ${topic.topic}` },
    examples: [{ en: topic.exampleEN, ar: topic.exampleAR }],
    practice: [],
  };
}

export const A2_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "A2" as const,
  lessonNumber: draft.lessonNumber,
  moduleNumber: Math.ceil(draft.lessonNumber / 5),
  title: draft.title,
  titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)),
  grammar: asGrammarTopic(draft),
  learningPlan: {
    outcome: draft.outcome,
    steps: STEPS,
    retrieval: draft.retrieval.map((item) => ({ sourceLevel: "A1" as const, language: item.language, prompt: item.prompt, purpose: item.purpose })),
    englishFirst: true,
    studio: "Life Lab",
  },
  lexicalNetworks: [{
    id: `a2-network-${draft.lessonNumber}`,
    theme: draft.network.theme,
    themeArabic: draft.network.themeArabic,
    anchor: draft.network.anchor,
    wordFamilies: WORD_FAMILIES_BY_LESSON.get(draft.lessonNumber) ?? [],
    relatedWords: draft.network.relatedWords,
    chunks: draft.network.chunks,
    collocations: draft.network.collocations,
    register: draft.network.register,
    priorLevelLinks: draft.network.priorLevelLinks,
    learningNote: draft.network.learningNote,
    learningNoteArabic: draft.network.learningNoteArabic,
  }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
})).map(enrichLesson);

export const A2_VOCABULARY = A2_LESSONS.flatMap((lesson) => lesson.words);
export const A2_GRAMMAR = A2_LESSONS.map((lesson) => lesson.grammar);

export const A2_COURSE: CourseDefinition = {
  level: "A2",
  title: "Everyday independence",
  titleArabic: "الاستقلالية في الحياة اليومية",
  totalLessons: 20,
  lessonsPerModule: 5,
  estimatedMinutes: 200 * 60,
  lessons: A2_LESSONS,
  modules: buildModuleDefinitions("A2", A2_LESSONS),
};

export function getA2Lesson(lessonNumber: number) {
  return A2_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
