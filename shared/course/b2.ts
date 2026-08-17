import rawDraft from "./b2-draft.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonExperience, LessonStep, VocabularyItem } from "./types";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";
import { createLessonExperience } from "./lesson-experience";
import { B2_MODULE_1_ACTIVITIES } from "./b2-module-1-authored-activities";

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

const B2_MODULE_1_EXPERIENCES: Record<number, LessonExperience> = {
  1: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "Learners need source discipline before forming a view under pressure.", selectedStages: ["orientation", "encounter", "notice", "evidence", "next-bridge"], firstView: { whatItIs: "A source-reading investigation.", whatToDo: "Separate fact, attribution, and uncertainty.", whatMatters: "Careful claims protect trust.", whatNext: "Weigh a service trade-off." }, progressiveSupports: ["word-support", "tip"] }),
  2: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "The convenience debate calls for a measured written judgement.", selectedStages: ["orientation", "notice", "meaningful-use", "evidence"], firstView: { whatItIs: "A balanced service evaluation.", whatToDo: "Write a qualified recommendation.", whatMatters: "A benefit does not erase a cost.", whatNext: "Test workplace promises." }, progressiveSupports: ["worked-example", "word-support"] }),
  3: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Evidence-seeking questions are best rehearsed as a realistic exchange.", selectedStages: ["orientation", "encounter", "supported-practice", "next-bridge"], firstView: { whatItIs: "A workplace-claim interview.", whatToDo: "Ask one specific evidence question.", whatMatters: "Polite questions can reveal substance.", whatNext: "Trace a system failure." }, progressiveSupports: ["worked-example", "tip"] }),
  4: createLessonExperience({ archetype: "notice", density: "normal", archetypeRationale: "Causal precision is the focus, not a full production task.", selectedStages: ["encounter", "notice", "supported-practice", "next-bridge"], firstView: { whatItIs: "A system-failure trace.", whatToDo: "Follow the causal chain.", whatMatters: "Attribute what is known and unknown.", whatNext: "Question a statistic." }, progressiveSupports: ["word-support", "tip"] }),
  5: createLessonExperience({ archetype: "notice", density: "light", archetypeRationale: "This is a focused evidence habit that prepares later argument.", selectedStages: ["orientation", "notice", "retrieval"], firstView: { whatItIs: "A statistic check.", whatToDo: "Ask three limiting questions.", whatMatters: "Numbers need a context.", whatNext: "Present a difficult decision." }, progressiveSupports: ["worked-example", "tip"] }),
  6: createLessonExperience({ archetype: "speaking", density: "normal", archetypeRationale: "A concise spoken recommendation makes trade-offs audible.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A one-minute decision briefing.", whatToDo: "Name groups, a constraint, and a trade-off.", whatMatters: "A defensible choice is not a perfect choice.", whatNext: "Design public space." }, progressiveSupports: ["worked-example"] }),
  7: createLessonExperience({ archetype: "real-world", density: "deep", archetypeRationale: "Public-space priorities require practical negotiation.", selectedStages: ["orientation", "encounter", "meaningful-use", "evidence"], firstView: { whatItIs: "A public-design negotiation.", whatToDo: "Offer a phased, conditional priority.", whatMatters: "Access and safety need concrete choices.", whatNext: "Ask who is absent." }, progressiveSupports: ["worked-example", "word-support"] }),
  8: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "Representation is best examined in a short consultation source.", selectedStages: ["encounter", "notice", "evidence", "next-bridge"], firstView: { whatItIs: "A consultation-source reading.", whatToDo: "Identify represented and missing voices.", whatMatters: "Silence can limit a conclusion.", whatNext: "Build a case for change." }, progressiveSupports: ["word-support"] }),
  9: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "The proposal consolidates evidence, rebuttal, and recommendation.", selectedStages: ["orientation", "retrieval", "meaningful-use", "evidence"], firstView: { whatItIs: "A concise evidence-led proposal.", whatToDo: "Make, test, and qualify a case.", whatMatters: "Acknowledge the strongest objection.", whatNext: "Communicate risk." }, progressiveSupports: ["worked-example", "word-support"] }),
  10: createLessonExperience({ archetype: "notice", density: "light", archetypeRationale: "Risk language needs a compact precision lesson before transfer.", selectedStages: ["orientation", "notice", "supported-practice"], firstView: { whatItIs: "A calm risk-language focus.", whatToDo: "Separate likelihood, harm, and precaution.", whatMatters: "Accuracy avoids panic and complacency.", whatNext: "Test expert advice." }, progressiveSupports: ["worked-example"] }),
  11: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Respectful challenge is practised best through a bounded exchange.", selectedStages: ["encounter", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "An expertise-and-trust exchange.", whatToDo: "Ask about scope and uncertainty.", whatMatters: "Trust includes asking good questions.", whatNext: "Negotiate a compromise." }, progressiveSupports: ["tip", "transcript"] }),
  12: createLessonExperience({ archetype: "interaction", density: "deep", archetypeRationale: "Conditional language serves a concrete negotiation problem.", selectedStages: ["orientation", "encounter", "meaningful-use", "evidence"], firstView: { whatItIs: "A fair-compromise negotiation.", whatToDo: "Offer a conditional solution.", whatMatters: "Legitimate interests can be balanced.", whatNext: "Analyse platform attention." }, progressiveSupports: ["worked-example", "tip"] }),
  13: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "Platform design needs critical cause-effect reading before policy claims.", selectedStages: ["orientation", "encounter", "notice", "evidence"], firstView: { whatItIs: "An attention-economy argument.", whatToDo: "Trace cause and identify an assumption.", whatMatters: "Design shapes choices without determining them.", whatNext: "Evaluate who benefits." }, progressiveSupports: ["word-support", "tip"] }),
  14: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "Access-focused evaluation requires a sustained response.", selectedStages: ["orientation", "retrieval", "meaningful-use", "evidence"], firstView: { whatItIs: "An equitable-access evaluation.", whatToDo: "Compare benefits and barriers.", whatMatters: "Progress may be unevenly shared.", whatNext: "Complete the module checkpoint." }, progressiveSupports: ["worked-example", "word-support"] }),
  15: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "The checkpoint asks learners to transfer the module’s evidence habits.", selectedStages: ["orientation", "retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A B2 informed-judgement checkpoint.", whatToDo: "Write a qualified public recommendation.", whatMatters: "Evidence and uncertainty belong together.", whatNext: "Move into the next B2 module." }, progressiveSupports: ["tip"] }),
};

export const B2_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "B2" as const, lessonNumber: draft.lessonNumber, moduleNumber: Math.ceil(draft.lessonNumber / 15), title: draft.title, titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)), grammar: asGrammarTopic(draft),
  learningPlan: { outcome: draft.outcome, steps: STEPS, retrieval: draft.retrieval.map((item) => ({ sourceLevel: "B1" as const, language: item.language, prompt: item.prompt, purpose: item.purpose })), englishFirst: true, studio: "Evidence & Influence Studio" },
  lexicalNetworks: [{ id: `b2-network-${draft.lessonNumber}`, theme: draft.network.theme, themeArabic: draft.network.themeArabic, anchor: draft.network.anchor, wordFamilies: draft.network.wordFamilies, relatedWords: draft.network.relatedWords, chunks: draft.network.chunks, collocations: draft.network.collocations, register: draft.network.register, priorLevelLinks: draft.network.priorLevelLinks, learningNote: draft.network.learningNote, learningNoteArabic: draft.network.learningNoteArabic }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
})).map(enrichLesson).map((lesson) => ({
  ...lesson,
  activities: B2_MODULE_1_ACTIVITIES[lesson.lessonNumber] ?? lesson.activities,
  experience: B2_MODULE_1_EXPERIENCES[lesson.lessonNumber] ?? lesson.experience,
}));

export const B2_VOCABULARY = B2_LESSONS.flatMap((lesson) => lesson.words);
export const B2_GRAMMAR = B2_LESSONS.map((lesson) => lesson.grammar);
export const B2_COURSE: CourseDefinition = { level: "B2", title: "Evidence, influence, and informed judgement", titleArabic: "الأدلة والتأثير والحكم الواعي", totalLessons: 150, lessonsPerModule: 15, estimatedMinutes: 380 * 60, lessons: B2_LESSONS, modules: buildModuleDefinitions("B2", B2_LESSONS) };
export function getB2Lesson(lessonNumber: number) { return B2_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber); }
