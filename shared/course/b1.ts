import rawDraft from "./b1-draft.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonStep, VocabularyItem } from "./types";

type DraftVocabulary = { word: string; arabic: string; partOfSpeech: string; definition: string; exampleEN: string; exampleAR: string };
type DraftLesson = {
  lessonNumber: number;
  title: string;
  titleArabic: string;
  outcome: { canDo: string; canDoArabic: string; scenario: string; scenarioArabic: string };
  retrieval: Array<{ language: string; prompt: string; purpose: string }>;
  network: {
    theme: string; themeArabic: string; anchor: string; relatedWords: string[]; chunks: string[]; collocations: string[];
    register: "neutral" | "informal" | "formal" | "mixed"; priorLevelLinks: string[]; learningNote: string; learningNoteArabic: string;
    wordFamilies: Array<{ headword: string; forms: string[]; note: string; noteArabic: string }>;
  };
  vocabulary: DraftVocabulary[];
  grammar: { topic: string; arabicName: string; concept: string; arabicComparison: string; structure: string; commonError: string; exampleEN: string; exampleAR: string };
  readingBrief: string;
  writingPrompt: string;
};

const STEPS: LessonStep[] = [
  { id: "start", title: "Start here", titleArabic: "ابدأ هنا", purpose: "Take a position and reactivate A2 language needed for this scenario.", estimatedMinutes: 6 },
  { id: "explore", title: "Explore", titleArabic: "استكشف", purpose: "Study useful B1 chunks, collocations, word families, and tone.", estimatedMinutes: 12 },
  { id: "notice", title: "Notice", titleArabic: "لاحظ", purpose: "Trace grammar and discourse choices through a connected example.", estimatedMinutes: 12 },
  { id: "build", title: "Build", titleArabic: "ابنِ", purpose: "Shape a coherent paragraph, comparison, story segment, or practical response.", estimatedMinutes: 14 },
  { id: "respond", title: "Respond", titleArabic: "استجب", purpose: "Interpret an original source and respond for a real audience and purpose.", estimatedMinutes: 20 },
  { id: "prove", title: "Prove it", titleArabic: "أثبت إتقانك", purpose: "Transfer the language to a new task, receive feedback, and schedule review.", estimatedMinutes: 16 },
];

function asVocabularyItem(item: DraftVocabulary, lessonNumber: number, index: number): VocabularyItem {
  return { id: `b1-${lessonNumber}-${index + 1}`, word: item.word, arabic: item.arabic, ipa: "", phoneticRespelling: item.word, partOfSpeech: item.partOfSpeech, definition: item.definition, exampleEN: item.exampleEN, exampleAR: item.exampleAR };
}

function asGrammarTopic(lesson: DraftLesson): GrammarTopic {
  const grammar = lesson.grammar;
  return {
    id: `b1-grammar-${lesson.lessonNumber}`, lessonNumber: lesson.lessonNumber, topic: grammar.topic, arabicName: grammar.arabicName,
    concept: grammar.concept, represents: "Use this B1 pattern to make the meaning, relationship, or stance in your response precise.", arabicComparison: grammar.arabicComparison,
    useWhen: ["you need to connect ideas across a paragraph", "the B1 scenario requires a clear stance, sequence, or degree of certainty"],
    doNotUseWhen: ["a shorter A2 sentence already communicates the exact intended meaning"],
    commonMistakes: [{ wrong: grammar.commonError, correct: grammar.structure, explanation: "Check how the form changes the connection between your ideas." }],
    structure: { positive: grammar.structure, negative: `Check the limiting or negative form in: ${grammar.exampleEN}`, question: `Ask an AI follow-up question about ${grammar.topic}` },
    examples: [{ en: grammar.exampleEN, ar: grammar.exampleAR }], practice: [],
  };
}

export const B1_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "B1", lessonNumber: draft.lessonNumber, moduleNumber: Math.ceil(draft.lessonNumber / 6), title: draft.title, titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)), grammar: asGrammarTopic(draft),
  learningPlan: { outcome: draft.outcome, steps: STEPS, retrieval: draft.retrieval.map((item) => ({ sourceLevel: "A2", language: item.language, prompt: item.prompt, purpose: item.purpose })), englishFirst: true, studio: "Story & Society Studio" },
  lexicalNetworks: [{ id: `b1-network-${draft.lessonNumber}`, theme: draft.network.theme, themeArabic: draft.network.themeArabic, anchor: draft.network.anchor, wordFamilies: draft.network.wordFamilies, relatedWords: draft.network.relatedWords, chunks: draft.network.chunks, collocations: draft.network.collocations, register: draft.network.register, priorLevelLinks: draft.network.priorLevelLinks, learningNote: draft.network.learningNote, learningNoteArabic: draft.network.learningNoteArabic }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
}));

export const B1_VOCABULARY = B1_LESSONS.flatMap((lesson) => lesson.words);
export const B1_GRAMMAR = B1_LESSONS.map((lesson) => lesson.grammar);
export const B1_COURSE: CourseDefinition = { level: "B1", title: "Connected lives and informed choices", titleArabic: "حياة مترابطة وخيارات واعية", totalLessons: 24, lessonsPerModule: 6, estimatedMinutes: 300 * 60, lessons: B1_LESSONS };
export function getB1Lesson(lessonNumber: number) { return B1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber); }
