import rawDraft from "./c1-draft.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonStep, VocabularyItem } from "./types";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";
import { C1_MODULE_1_ACTIVITIES } from "./c1-module-1-authored-activities";
import { C1_MODULE_1_EXPERIENCES } from "./c1-module-1-experiences";
import { C1_MODULE_2_ACTIVITIES } from "./c1-module-2-authored-activities";
import { C1_MODULE_2_EXPERIENCES } from "./c1-module-2-experiences";
import { c1Module3AuthoredActivities } from "./c1-module-3-authored-activities";
import { C1_MODULE_3_EXPERIENCES } from "./c1-module-3-experiences";
import { c1Module4AuthoredActivities } from "./c1-module-4-authored-activities";
import { C1_MODULE_4_EXPERIENCES } from "./c1-module-4-experiences";
import c1Module5AuthoredActivities from "./c1-module-5-authored-activities";
import { C1_MODULE_5_EXPERIENCES } from "./c1-module-5-experiences";
import c1Module6AuthoredActivities from "./c1-module-6-authored-activities";
import { C1_MODULE_6_EXPERIENCES } from "./c1-module-6-experiences";
import c1Module7AuthoredActivities from "./c1-module-7-authored-activities";
import { C1_MODULE_7_EXPERIENCES } from "./c1-module-7-experiences";
import c1Module8AuthoredActivities from "./c1-module-8-authored-activities";
import { C1_MODULE_8_EXPERIENCES } from "./c1-module-8-experiences";
import c1Module9AuthoredActivities from "./c1-module-9-authored-activities";
import { C1_MODULE_9_EXPERIENCES } from "./c1-module-9-experiences";

type DraftVocabulary = { word: string; arabic: string; partOfSpeech: string; definition: string; exampleEN: string; exampleAR: string };
type DraftLesson = {
  lessonNumber: number;
  title: string;
  titleArabic: string;
  outcome: { canDo: string; canDoArabic: string; scenario: string; scenarioArabic: string };
  retrieval: Array<{ language: string; prompt: string; purpose: string }>;
  network: { theme: string; themeArabic: string; anchor: string; relatedWords: string[]; chunks: string[]; collocations: string[]; register: "neutral" | "informal" | "formal" | "mixed"; priorLevelLinks: string[]; learningNote: string; learningNoteArabic: string; wordFamilies: Array<{ headword: string; forms: string[]; note: string; noteArabic: string }> };
  vocabulary: DraftVocabulary[];
  grammar: { topic: string; arabicName: string; concept: string; arabicComparison: string; structure: string; commonError: string; exampleEN: string; exampleAR: string };
  readingBrief: string;
  writingPrompt: string;
};

const STEPS: LessonStep[] = [
  { id: "start", title: "Orient", titleArabic: "استعد", purpose: "Frame the question, reawaken B2 language, and take a thoughtful position.", estimatedMinutes: 8 },
  { id: "explore", title: "Interrogate the language", titleArabic: "افحص اللغة", purpose: "Study precise collocations, word families, stance, and source-aware register.", estimatedMinutes: 18 },
  { id: "notice", title: "Notice the architecture", titleArabic: "لاحظ البناء", purpose: "See how grammar and discourse choices shape nuance, attribution, and argument.", estimatedMinutes: 18 },
  { id: "build", title: "Build a reasoned response", titleArabic: "ابنِ استجابة متزنة", purpose: "Plan a coherent synthesis, proposal, critique, or explanation for a real audience.", estimatedMinutes: 22 },
  { id: "respond", title: "Respond to sources", titleArabic: "تفاعل مع المصادر", purpose: "Read a demanding original text and distinguish evidence, inference, and judgement.", estimatedMinutes: 30 },
  { id: "prove", title: "Prove your judgement", titleArabic: "أثبت حكمك", purpose: "Transfer the language into a precise, responsible, and independently reasoned piece of writing.", estimatedMinutes: 24 },
];

function asVocabularyItem(item: DraftVocabulary, lessonNumber: number, index: number): VocabularyItem {
  return { id: `c1-${lessonNumber}-${index + 1}`, word: item.word, arabic: item.arabic, ipa: "", phoneticRespelling: item.word, partOfSpeech: item.partOfSpeech, definition: item.definition, exampleEN: item.exampleEN, exampleAR: item.exampleAR };
}

function asGrammarTopic(lesson: DraftLesson): GrammarTopic {
  const grammar = lesson.grammar;
  return {
    id: `c1-grammar-${lesson.lessonNumber}`, lessonNumber: lesson.lessonNumber, topic: grammar.topic, arabicName: grammar.arabicName,
    concept: grammar.concept, represents: "Use this C1 pattern to control nuance, attribution, emphasis, and the relationship between claims.", arabicComparison: grammar.arabicComparison,
    useWhen: ["you need to qualify, structure, or attribute a complex claim", "the C1 scenario depends on precision, stance, or audience awareness"],
    doNotUseWhen: ["a simpler structure would communicate the same relationship without losing meaning"],
    commonMistakes: [{ wrong: grammar.commonError, correct: grammar.structure, explanation: "Notice how the form changes the strength, source, or relationship of the claim." }],
    structure: { positive: grammar.structure, negative: `Test the limiting or counter-position in: ${grammar.exampleEN}`, question: `Ask yourself how ${grammar.topic} changes the reader's interpretation.` },
    examples: [{ en: grammar.exampleEN, ar: grammar.exampleAR }], practice: [],
  };
}

export const C1_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "C1" as const, lessonNumber: draft.lessonNumber, moduleNumber: Math.ceil(draft.lessonNumber / 16), title: draft.title, titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)), grammar: asGrammarTopic(draft),
  learningPlan: { outcome: draft.outcome, steps: STEPS, retrieval: draft.retrieval.map((item) => ({ sourceLevel: "B2" as const, language: item.language, prompt: item.prompt, purpose: item.purpose })), englishFirst: true, studio: "Ideas & Evidence Studio" },
  lexicalNetworks: [{ id: `c1-network-${draft.lessonNumber}`, theme: draft.network.theme, themeArabic: draft.network.themeArabic, anchor: draft.network.anchor, wordFamilies: draft.network.wordFamilies, relatedWords: draft.network.relatedWords, chunks: draft.network.chunks, collocations: draft.network.collocations, register: draft.network.register, priorLevelLinks: draft.network.priorLevelLinks, learningNote: draft.network.learningNote, learningNoteArabic: draft.network.learningNoteArabic }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
})).map(enrichLesson).map((lesson) => ({
  ...lesson,
  activities: c1Module9AuthoredActivities[lesson.lessonNumber] ?? c1Module8AuthoredActivities[lesson.lessonNumber] ?? c1Module7AuthoredActivities[lesson.lessonNumber] ?? c1Module6AuthoredActivities[lesson.lessonNumber] ?? c1Module5AuthoredActivities[lesson.lessonNumber] ?? (c1Module4AuthoredActivities[lesson.lessonNumber]
    ? [c1Module4AuthoredActivities[lesson.lessonNumber]]
    : c1Module3AuthoredActivities[lesson.lessonNumber] ?? C1_MODULE_2_ACTIVITIES[lesson.lessonNumber] ?? C1_MODULE_1_ACTIVITIES[lesson.lessonNumber] ?? lesson.activities),
  experience: C1_MODULE_9_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_8_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_7_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_6_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_5_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_4_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_3_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_2_EXPERIENCES[lesson.lessonNumber] ?? C1_MODULE_1_EXPERIENCES[lesson.lessonNumber] ?? lesson.experience,
}));

export const C1_VOCABULARY = C1_LESSONS.flatMap((lesson) => lesson.words);
export const C1_GRAMMAR = C1_LESSONS.map((lesson) => lesson.grammar);
export const C1_COURSE: CourseDefinition = { level: "C1", title: "Nuance, evidence, and responsible judgement", titleArabic: "الدقة والأدلة والحكم المسؤول", totalLessons: 160, lessonsPerModule: 16, estimatedMinutes: 420 * 60, lessons: C1_LESSONS, modules: buildModuleDefinitions("C1", C1_LESSONS) };
export function getC1Lesson(lessonNumber: number) { return C1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber); }

export default C1_COURSE;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _c1CourseTypeCheck: CourseDefinition = C1_COURSE;
export { _c1CourseTypeCheck };

export type { DraftLesson as C1DraftLesson };

export const C1_LESSON_COUNT = C1_LESSONS.length;

void _c1CourseTypeCheck;

export const C1_MODULE_COUNT = 10;

export const C1_LEVEL = "C1" as const;

export const C1_LESSON_STEPS = STEPS;

export const C1_AUTHORING_NOTE = "C1 develops source-aware reading, precise stance, and responsible synthesis.";

export const C1_READY = C1_LESSONS.length === 160;

if (!C1_READY) throw new Error(`C1 curriculum requires 160 lessons; found ${C1_LESSONS.length}`);
