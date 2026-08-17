import rawDraft from "./b1-draft.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, LessonExperience, LessonStep, VocabularyItem } from "./types";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";
import { createLessonExperience } from "./lesson-experience";
import { B1_MODULE_1_AUTHORED_ACTIVITIES } from "./b1-module-1-authored-activities";

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

const B1_MODULE_1_EXPERIENCES: Record<number, LessonExperience> = {
  1: createLessonExperience({ archetype: "speaking", density: "deep", archetypeRationale: "A turning point becomes memorable when learners rehearse a connected account before writing it.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A spoken story studio", whatToDo: "Rehearse a personal turning point with time signals.", whatMatters: "Sequence creates meaning, not only accuracy.", whatNext: "Turn your spoken account into a reflective email." }, progressiveSupports: ["worked-example", "word-support"] }),
  2: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Conditional choices are best learned by weighing consequences in a genuine group decision.", selectedStages: ["orientation", "encounter", "meaningful-use", "evidence"], firstView: { whatItIs: "A community decision", whatToDo: "Compare what may happen with what you would choose.", whatMatters: "Separate likely results from imagined alternatives.", whatNext: "Carry this decision language into future advice." }, progressiveSupports: ["worked-example", "extended-rationale"] }),
  3: createLessonExperience({ archetype: "notice", density: "light", archetypeRationale: "The first priority is noticing how calm boundary language differs from blame.", selectedStages: ["orientation", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A language-noticing lesson", whatToDo: "Read a disagreement and identify the boundary and repair.", whatMatters: "A specific need is clearer than a personal attack.", whatNext: "Rehearse a respectful repair conversation." }, progressiveSupports: ["arabic-help", "extended-rationale"] }),
  4: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A habit diary offers enough context to explore change, setback, and support critically.", selectedStages: ["encounter", "notice", "retrieval", "evidence"], firstView: { whatItIs: "A realistic habit diary", whatToDo: "Trace the writer’s change, setback, and support.", whatMatters: "Progress can be uneven and still be real.", whatNext: "Use this language to form your own sustainable plan." }, progressiveSupports: ["word-support"] }),
  5: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A qualified opinion needs deliberate planning, contrast, and a fair conclusion rather than a quick answer.", selectedStages: ["orientation", "notice", "supported-practice", "meaningful-use", "evidence"], firstView: { whatItIs: "A balanced opinion task", whatToDo: "Write a fair view of a local issue with one clear limit.", whatMatters: "B1 opinions earn trust by acknowledging complexity.", whatNext: "Reuse hedging when making practical requests and proposals." }, progressiveSupports: ["worked-example", "external-ai-prompt"] }),
  6: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Email tone has a purpose and audience, so learners compare drafts before producing a request.", selectedStages: ["orientation", "encounter", "supported-practice", "evidence"], firstView: { whatItIs: "An email tone workshop", whatToDo: "Choose the tone, then make a request that someone can act on.", whatMatters: "A clear action and timing matter as much as politeness.", whatNext: "Send a short, structured request." }, progressiveSupports: ["worked-example", "tip"] }),
  7: createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Modal language gains force when tied to visible local priorities and a brief spoken pitch.", selectedStages: ["orientation", "encounter", "meaningful-use", "retrieval"], firstView: { whatItIs: "A neighbourhood-priority map", whatToDo: "Sort what the area must, should, and could do.", whatMatters: "Each modal changes the strength of your claim.", whatNext: "Give a one-minute community pitch." }, progressiveSupports: ["arabic-help", "word-support"] }),
  8: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Reported speech serves a real collaborative purpose when a team must turn views into a fair plan.", selectedStages: ["orientation", "encounter", "supported-practice", "evidence"], firstView: { whatItIs: "A team-meeting reconstruction", whatToDo: "Report what each person said, then propose a fair action.", whatMatters: "Fair solutions begin with accurate listening.", whatNext: "Use this reporting skill for workplace and community tasks." }, progressiveSupports: ["transcript", "worked-example"] }),
  9: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A clear complaint demonstrates how chronological facts and passive forms make a practical problem understandable.", selectedStages: ["orientation", "encounter", "notice", "evidence"], firstView: { whatItIs: "A service-problem case", whatToDo: "Separate the facts, impact, and requested solution.", whatMatters: "A reader should be able to act without guessing what happened.", whatNext: "Apply this clarity in formal messages." }, progressiveSupports: ["word-support", "extended-rationale"] }),
  10: createLessonExperience({ archetype: "real-world", density: "normal", archetypeRationale: "Work choices are personal and practical, so a concise profile is more useful than a generic grammar drill.", selectedStages: ["orientation", "encounter", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A work-fit profile", whatToDo: "Connect your strengths, preferences, and a realistic next role.", whatMatters: "Use grammar to explain reasons, not to label yourself permanently.", whatNext: "Carry this self-knowledge into a proposal and team discussion." }, progressiveSupports: ["worked-example", "word-support"] }),
  11: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A proposal requires audience awareness, measured benefits, and an honest risk rather than a list of wishes.", selectedStages: ["orientation", "notice", "supported-practice", "meaningful-use", "evidence"], firstView: { whatItIs: "A proposal-writing studio", whatToDo: "Recommend one improvement, its benefit, and how to manage a risk.", whatMatters: "Persuasion is stronger when it anticipates a concern.", whatNext: "Use this proposal structure in community action tasks." }, progressiveSupports: ["worked-example", "external-ai-prompt"] }),
  12: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A volunteer case lets learners evaluate impact and sustainability instead of repeating a positive slogan.", selectedStages: ["encounter", "notice", "evidence", "next-bridge"], firstView: { whatItIs: "A community-project case study", whatToDo: "Assess the project’s impact and its practical limit.", whatMatters: "Support is worth judging by evidence and sustainability.", whatNext: "Transfer the reasoning to a source-based report." }, progressiveSupports: ["tip", "word-support"] }),
  13: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "Source evaluation needs careful comparison, so the experience focuses on tracing a claim to reliable evidence.", selectedStages: ["orientation", "encounter", "notice", "retrieval", "evidence"], firstView: { whatItIs: "A source-check investigation", whatToDo: "Compare a claim with direct and reported sources.", whatMatters: "The loudest claim is not automatically the strongest evidence.", whatNext: "Apply this source language to media and design topics." }, progressiveSupports: ["extended-rationale", "tip"] }),
  14: createLessonExperience({ archetype: "discover", density: "normal", archetypeRationale: "A visual attention loop makes an abstract cause-and-effect pattern concrete before learners argue for a change.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use"], firstView: { whatItIs: "A design-and-habit investigation", whatToDo: "Identify one feature, its effect, and a calmer alternative.", whatMatters: "Design choices can shape behaviour without removing all choice.", whatNext: "Defend your change aloud using evidence." }, progressiveSupports: ["arabic-help", "worked-example"] }),
  15: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "The module ends by asking learners to make a persuasive claim while showing they can distinguish support from exaggeration.", selectedStages: ["orientation", "retrieval", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A truthful campaign pitch", whatToDo: "Present and defend an idea with a justified comparison.", whatMatters: "A persuasive message should remain honest about its evidence.", whatNext: "Carry this critical voice into later B1 media work." }, progressiveSupports: ["tip", "external-ai-prompt"] }),
};

export const B1_LESSONS: LessonDefinition[] = (rawDraft as DraftLesson[]).map((draft) => ({
  level: "B1" as const, lessonNumber: draft.lessonNumber, moduleNumber: Math.ceil(draft.lessonNumber / 15), title: draft.title, titleArabic: draft.titleArabic,
  words: draft.vocabulary.map((item, index) => asVocabularyItem(item, draft.lessonNumber, index)), grammar: asGrammarTopic(draft),
  learningPlan: { outcome: draft.outcome, steps: STEPS, retrieval: draft.retrieval.map((item) => ({ sourceLevel: "A2" as const, language: item.language, prompt: item.prompt, purpose: item.purpose })), englishFirst: true, studio: "Story & Society Studio" },
  lexicalNetworks: [{ id: `b1-network-${draft.lessonNumber}`, theme: draft.network.theme, themeArabic: draft.network.themeArabic, anchor: draft.network.anchor, wordFamilies: draft.network.wordFamilies, relatedWords: draft.network.relatedWords, chunks: draft.network.chunks, collocations: draft.network.collocations, register: draft.network.register, priorLevelLinks: draft.network.priorLevelLinks, learningNote: draft.network.learningNote, learningNoteArabic: draft.network.learningNoteArabic }],
  practiceBrief: { readingBrief: draft.readingBrief, writingPrompt: draft.writingPrompt },
  activities: B1_MODULE_1_AUTHORED_ACTIVITIES[draft.lessonNumber] ? [...B1_MODULE_1_AUTHORED_ACTIVITIES[draft.lessonNumber]] : undefined,
  experience: B1_MODULE_1_EXPERIENCES[draft.lessonNumber],
})).map(enrichLesson);

export const B1_VOCABULARY = B1_LESSONS.flatMap((lesson) => lesson.words);
export const B1_GRAMMAR = B1_LESSONS.map((lesson) => lesson.grammar);
export const B1_COURSE: CourseDefinition = { level: "B1", title: "Connected lives and informed choices", titleArabic: "حياة مترابطة وخيارات واعية", totalLessons: 150, lessonsPerModule: 15, estimatedMinutes: 150 * 60, lessons: B1_LESSONS, modules: buildModuleDefinitions("B1", B1_LESSONS) };
export function getB1Lesson(lessonNumber: number) { return B1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber); }
