import rawDraft from "./b2-draft.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonStep, VocabularyItem } from "./types";

type DraftVocabulary = { word: string; arabic: string; partOfSpeech: string; definition: string; exampleEN: string; exampleAR: string };
type DraftLesson = {
  lessonNumber: number; title: string; titleArabic: string;
  outcome: { canDo: string; canDoArabic: string; scenario: string; scenarioArabic: string };
  retrieval: Array<{ language: string; prompt: string; purpose: string }>;
  network: { theme: string; themeArabic: string; anchor: string; relatedWords: string[]; chunks: string[]; collocations: string[]; register: "neutral" | "informal" | "formal" | "mixed"; priorLevelLinks: string[]; learningNote: string; learningNoteArabic: string; wordFamilies: Array<{ headword: string; forms: string[]; note: string; noteArabic: string }> };
  vocabulary: DraftVocabulary[];
  grammar: { topic: string; arabicName: string; concept: string; arabicComparison: string; structure: string; commonError: string; exampleEN: string; exampleAR: string };
  readingBrief: string; writingPrompt: string;
};

const STEPS: LessonStep[] = [
  { id: "start", title: "Start here", titleArabic: "ابدأ هنا", purpose: "Take a defensible position and reactivate B1 language for the issue.", estimatedMinutes: 7 },
  { id: "explore", title: "Explore", titleArabic: "استكشف", purpose: "Study precise B2 chunks, collocations, word families, register, and stance.", estimatedMinutes: 14 },
  { id: "notice", title: "Notice", titleArabic: "لاحظ", purpose: "Trace how grammar, evidence, and discourse choices shape a nuanced argument.", estimatedMinutes: 14 },
  { id: "build", title: "Build", titleArabic: "ابنِ", purpose: "Construct a coherent evaluation, proposal, rebuttal, or formal response.", estimatedMinutes: 17 },
  { id: "respond", title: "Respond", titleArabic: "استجب", purpose: "Interpret an original source critically and respond for a defined audience and purpose.", estimatedMinutes: 24 },
  { id: "prove", title: "Prove it", titleArabic: "أثبت إتقانك", purpose: "Transfer the language to a new task, justify choices, receive feedback, and schedule review.", estimatedMinutes: 18 },
];

function asVocabularyItem(item: DraftVocabulary, lessonNumber: number, index: number): VocabularyItem {
  return { id: `b2-${lessonNumber}-${index + 1}`, word: item.word, arabic: item.arabic, ipa: "", phoneticRespelling: item.word, partOfSpeech: item.partOfSpeech, definition: item.definition, exampleEN: item.exampleEN, exampleAR: item.exampleAR };
}

function asGrammarTopic(lesson: DraftLesson): GrammarTopic {
  const grammar = lesson.grammar;
  return {
    id: `b2-grammar-${lesson.lessonNumber}`, lessonNumber: lesson.lessonNumber, topic: grammar.topic, arabicName: grammar.arabicName,
    concept: grammar.concept, represents: "Use this B2 pattern to qualify claims, connect evidence, and make your position precise.", arabicComparison: grammar.arabicComparison,
    useWhen: ["you need to weigh evidence or acknowledge a counterpoint", "the B2 task calls for a controlled formal, neutral, or persuasive register"],
    doNotUseWhen: ["a shorter B1 structure already conveys the exact intended meaning without losing nuance"],
    commonMistakes: [{ wrong: grammar.commonError, correct: grammar.structure, explanation: "Check how form, register, and connection between ideas affect the strength of the claim." }],
    structure: { positive: grammar.structure, negative: `Check the limiting, concessive, or negative form in: ${grammar.exampleEN}`, question: `Ask an AI follow-up question about ${grammar.topic}` },
    examples: [{ en: grammar.exampleEN, ar: grammar.exampleAR }], practice: [],
  };
}

export const B2_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "B2", lessonNumber: draft.lessonNumber, moduleNumber: Math.ceil(draft.lessonNumber / 6), title: draft.title, titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)), grammar: asGrammarTopic(draft),
  learningPlan: { outcome: draft.outcome, steps: STEPS, retrieval: draft.retrieval.map((item) => ({ sourceLevel: "B1", language: item.language, prompt: item.prompt, purpose: item.purpose })), englishFirst: true, studio: "Evidence & Influence Studio" },
  lexicalNetworks: [{ id: `b2-network-${draft.lessonNumber}`, theme: draft.network.theme, themeArabic: draft.network.themeArabic, anchor: draft.network.anchor, wordFamilies: draft.network.wordFamilies, relatedWords: draft.network.relatedWords, chunks: draft.network.chunks, collocations: draft.network.collocations, register: draft.network.register, priorLevelLinks: draft.network.priorLevelLinks, learningNote: draft.network.learningNote, learningNoteArabic: draft.network.learningNoteArabic }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
}));

export const B2_VOCABULARY = B2_LESSONS.flatMap((lesson) => lesson.words);
export const B2_GRAMMAR = B2_LESSONS.map((lesson) => lesson.grammar);
export const B2_COURSE: CourseDefinition = { level: "B2", title: "Evidence, influence, and informed judgement", titleArabic: "الأدلة والتأثير والحكم الواعي", totalLessons: 24, lessonsPerModule: 6, estimatedMinutes: 380 * 60, lessons: B2_LESSONS };
export function getB2Lesson(lessonNumber: number) { return B2_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber); }
