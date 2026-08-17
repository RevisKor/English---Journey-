import rawDraft from "./a2-draft.json";
import { enrichLesson } from "./activity-plan";
import { A2_MODULE_1_AUTHORED_ACTIVITIES } from "./a2-module-1-authored-activities";
import { createLessonExperience } from "./lesson-experience";
import { buildModuleDefinitions } from "./module-definitions";
import { getProgressiveImmersiveModules } from "./progressive-immersive";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
  LessonExperience,
  LessonDefinition,
  LessonStep,
  VocabularyItem,
} from "./types";

type DraftVocabulary = {
  word: string;
  arabic: string;
  partOfSpeech: string;
  definition: string;
  exampleEN: string;
  exampleAR: string;
};

type DraftLesson = { vocabulary: DraftVocabulary[] };

/**
 * The original A2 draft remains a curated bilingual vocabulary seed.  The
 * active lesson sequence now comes from the nine authored immersive modules,
 * allowing every seed word to reappear in a wider set of communicative tasks.
 */
const SEEDED_VOCABULARY: VocabularyItem[] = (rawDraft as DraftLesson[])
  .flatMap((lesson) => lesson.vocabulary)
  .map((item, index) => ({
    id: `a2-seed-${index + 1}`,
    word: item.word,
    arabic: item.arabic,
    ipa: "",
    phoneticRespelling: item.word,
    partOfSpeech: item.partOfSpeech,
    definition: item.definition,
    exampleEN: item.exampleEN,
    exampleAR: item.exampleAR,
  }));

const seedByWord = new Map(SEEDED_VOCABULARY.map((item) => [item.word.toLocaleLowerCase(), item]));

const A2_STEPS: LessonStep[] = [
  { id: "start", title: "Connect", titleArabic: "اربط", purpose: "Retrieve a useful A1 phrase and identify today's situation.", estimatedMinutes: 5 },
  { id: "explore", title: "Meet the language", titleArabic: "تعرّف إلى اللغة", purpose: "Notice new words and a grammar choice in a practical context.", estimatedMinutes: 10 },
  { id: "notice", title: "Notice the choice", titleArabic: "لاحظ الاختيار", purpose: "Compare meaning, form, and an Arabic-speaker risk before using the pattern.", estimatedMinutes: 10 },
  { id: "build", title: "Build a response", titleArabic: "ابنِ استجابة", purpose: "Shape short connected sentences with support and feedback.", estimatedMinutes: 10 },
  { id: "respond", title: "Use it for a purpose", titleArabic: "استخدمها لغرض", purpose: "Speak or write for a real audience, situation, and goal.", estimatedMinutes: 15 },
  { id: "prove", title: "Check and retrieve", titleArabic: "تحقق واسترجع", purpose: "Check contextual understanding and schedule a short review.", estimatedMinutes: 10 },
];

function uniqueVocabulary(items: VocabularyItem[]) {
  return Array.from(new Map(items.map((item) => [item.word.toLocaleLowerCase(), item])).values());
}

function anchorVocabulary(anchor: string, blueprint: ImmersiveLessonBlueprint): VocabularyItem {
  const normalized = anchor.toLocaleLowerCase();
  const existing = seedByWord.get(normalized);
  if (existing) return existing;
  const id = `a2-anchor-${blueprint.lessonNumber}-${normalized.replace(/[^a-z0-9]+/g, "-")}`;
  return {
    id,
    word: anchor,
    arabic: `مفردة أساسية في درس «${blueprint.titleArabic}»`,
    ipa: "",
    phoneticRespelling: anchor,
    partOfSpeech: "useful word or phrase",
    definition: `A key word or phrase for the ${blueprint.title} situation.`,
    exampleEN: `Use “${anchor}” when you ${blueprint.canDo.toLocaleLowerCase().replace(/^i can /, "")}.`,
    exampleAR: `استخدم «${anchor}» عندما تنفذ هدف درس «${blueprint.titleArabic}».`,
  };
}

function vocabularyForBlueprint(blueprint: ImmersiveLessonBlueprint) {
  const anchorWords = blueprint.vocabularyAnchors.map((anchor) => anchorVocabulary(anchor, blueprint));
  const rotationStart = ((blueprint.lessonNumber - 1) * 3) % SEEDED_VOCABULARY.length;
  const rotatedSeeds = Array.from({ length: 4 }, (_, index) => SEEDED_VOCABULARY[(rotationStart + index) % SEEDED_VOCABULARY.length]);
  // A seed intentionally appears again in later lessons for retrieval practice.
  // Persisted vocabulary rows are lesson-owned, however, so every occurrence
  // needs a lesson-scoped key even when its word and definition are shared.
  return uniqueVocabulary([...anchorWords, ...rotatedSeeds]).map((word) => ({
    ...word,
    id: `a2-lesson-${blueprint.lessonNumber}-${word.id}`,
  }));
}

function grammarForBlueprint(blueprint: ImmersiveLessonBlueprint): GrammarTopic {
  const focus = blueprint.grammarFocus;
  return {
    id: `a2-grammar-${blueprint.lessonNumber}`,
    lessonNumber: blueprint.lessonNumber,
    topic: focus,
    arabicName: blueprint.grammarFocusArabic,
    concept: blueprint.beginnerExplanation,
    represents: `Choose ${focus} to make your meaning clear in the ${blueprint.title} situation.`,
    arabicComparison: blueprint.beginnerExplanationArabic,
    useWhen: [
      `the ${blueprint.title} situation matches your purpose`,
      "you need to connect two short ideas clearly instead of translating word by word",
    ],
    doNotUseWhen: ["a shorter A1 pattern already expresses exactly the meaning you need"],
    commonMistakes: [{
      wrong: "Translating the Arabic sentence word by word before checking the English pattern.",
      correct: `Choose the ${focus} pattern, then check the meaning and punctuation.`,
      explanation: "English word order and grammar choices carry meaning. Start from the communicative purpose, not from a literal translation.",
    }],
    structure: {
      positive: `Use ${focus} in a clear affirmative sentence about ${blueprint.title.toLocaleLowerCase()}.`,
      negative: `Make the negative form carefully when ${focus} requires it.`,
      question: `Ask one useful follow-up question using ${focus}.`,
    },
    examples: [{
      en: `In this situation, I can ${blueprint.canDo.replace(/^I can /, "")}.`,
      ar: `في هذا الموقف، ${blueprint.canDoArabic.replace(/^أستطيع /, "أستطيع ")}`,
    }],
    practice: [],
  };
}

const A2_MODULE_1_EXPERIENCES: Record<number, LessonExperience> = {
  1: createLessonExperience({ archetype: "discover", density: "light", archetypeRationale: "Frequency language begins with familiar morning routines.", selectedStages: ["orientation", "encounter", "retrieval", "next-bridge"], firstView: { whatItIs: "A routine-language discovery", whatToDo: "Map one morning and choose one frequency phrase.", whatMatters: "Usually and sometimes change how true a routine is.", whatNext: "Carry one time phrase forward." }, progressiveSupports: ["arabic-help", "worked-example", "word-support"] }),
  2: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A connected note gives reasons and results a clear purpose.", selectedStages: ["encounter", "notice", "supported-practice", "retrieval"], firstView: { whatItIs: "A reason-and-result reading", whatToDo: "Read for the reason, then sort because and so.", whatMatters: "The connector changes the relationship between ideas.", whatNext: "Use one connector with food language." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  3: createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Visual food language gives some and any concrete meaning.", selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A visual food-and-energy lesson", whatToDo: "Explore three cards, then open the kitchen task.", whatMatters: "Some and any depend on the message you make.", whatNext: "Use the words in a weekly routine." }, progressiveSupports: ["arabic-help", "word-support", "worked-example"] }),
  4: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Frequency becomes useful in a supportive interview.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A weekly-routine interview", whatToDo: "Ask one question and give one supported answer.", whatMatters: "How often asks about a pattern, not a single event.", whatNext: "Use frequency to make advice specific." }, progressiveSupports: ["arabic-help", "worked-example", "transcript"] }),
  5: createLessonExperience({ archetype: "speaking", density: "normal", archetypeRationale: "Advice needs a calm spoken model before extended feedback.", selectedStages: ["notice", "supported-practice", "meaningful-use", "evidence"], firstView: { whatItIs: "A gentle-advice rehearsal", whatToDo: "Hear two models, then write for a character.", whatMatters: "Should suggests; it does not command.", whatNext: "Use respectful tone in a pharmacy exchange." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  6: createLessonExperience({ archetype: "real-world", density: "deep", archetypeRationale: "A pharmacy interaction gives polite requests a real listener and purpose.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A practical pharmacy conversation", whatToDo: "Follow the dialogue and choose the softer request.", whatMatters: "Could you helps you sound clear and respectful.", whatNext: "Describe a simple symptom safely." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  7: createLessonExperience({ archetype: "writing", density: "normal", archetypeRationale: "Description language is practised in a privacy-safe fictional message.", selectedStages: ["notice", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A safe description-and-message lesson", whatToDo: "Match descriptions, then write for a fictional person.", whatMatters: "Describe what you notice; do not diagnose.", whatNext: "Place one event on yesterday's timeline." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  8: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "A visual time line makes past forms meaningful.", selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A yesterday time-line lesson", whatToDo: "Order three moments, then retell a calm day.", whatMatters: "Past forms locate an event before now.", whatNext: "Read a fuller week of small changes." }, progressiveSupports: ["arabic-help", "worked-example", "transcript"] }),
  9: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "A connected diary checks sequence, detail, and inference at A2.", selectedStages: ["orientation", "encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A connected weekly diary", whatToDo: "Read once for the main idea, then trace time markers.", whatMatters: "Before, after, and then organise a story.", whatNext: "Use that structure in a paragraph." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  10: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "The learner can now plan, draft, and review a short paragraph.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A guided healthy-choice paragraph", whatToDo: "Plan three linked actions for a character.", whatMatters: "Clear order and one reason guide the reader.", whatNext: "Turn the same ideas into questions." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  11: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "Question helpers are compared through a useful information task.", selectedStages: ["notice", "supported-practice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A practical question workshop", whatToDo: "Sort current and past questions, then choose two.", whatMatters: "The helper shows whether a question is about now or before.", whatNext: "Ask for clarification with confidence." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
  12: createLessonExperience({ archetype: "listening", density: "light", archetypeRationale: "Clarification phrases are short heard-and-repeated tools.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A listening-and-clarifying practice", whatToDo: "Hear an instruction and choose a follow-up.", whatMatters: "Clarifying is active communication, not failure.", whatNext: "Reconnect the module's key choices." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  13: createLessonExperience({ archetype: "review", density: "normal", archetypeRationale: "This lesson retrieves and lets the learner choose a gap to revisit.", selectedStages: ["retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A choice-based health map", whatToDo: "Connect four cards, then select one gap.", whatMatters: "Retrieval makes final writing more independent.", whatNext: "Reopen only the card you chose." }, progressiveSupports: ["arabic-help", "word-support", "tip"] }),
  14: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A practical message joins routines, advice, reasons, and punctuation.", selectedStages: ["orientation", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A practical supportive message", whatToDo: "Write for a fictional reader, then revise for clarity.", whatMatters: "Tone and punctuation help a reader trust you.", whatNext: "Use the connected language in the checkpoint." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  15: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "A checkpoint gathers connected evidence before broader independent-life topics.", selectedStages: ["orientation", "retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A health-and-habits checkpoint", whatToDo: "Complete four short scenario tasks.", whatMatters: "You are connecting ideas, not reciting perfectly.", whatNext: "Carry one strong pattern to the next module." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
};

function lessonFromBlueprint(blueprint: ImmersiveLessonBlueprint, module: ReturnType<typeof getProgressiveImmersiveModules>[number]): LessonDefinition {
  const words = vocabularyForBlueprint(blueprint);
  const generatedLesson = enrichLesson({
    level: "A2",
    lessonNumber: blueprint.lessonNumber,
    moduleNumber: blueprint.moduleNumber,
    title: blueprint.title,
    titleArabic: blueprint.titleArabic,
    words,
    grammar: grammarForBlueprint(blueprint),
    learningPlan: {
      outcome: {
        canDo: blueprint.canDo,
        canDoArabic: blueprint.canDoArabic,
        scenario: module.overview,
        scenarioArabic: module.overviewArabic,
      },
      steps: A2_STEPS,
      retrieval: blueprint.exposurePlan.slice(0, 3).map((exposure) => ({
        sourceLevel: "A1" as const,
        language: exposure.task,
        prompt: `Retrieve one phrase, then use it for the ${blueprint.title} situation.`,
        purpose: exposure.taskArabic,
      })),
      englishFirst: true,
      studio: "A2 Life Lab",
    },
    lexicalNetworks: [{
      id: `a2-network-${blueprint.lessonNumber}`,
      theme: module.title,
      themeArabic: module.titleArabic,
      anchor: blueprint.vocabularyAnchors[0] ?? blueprint.title,
      wordFamilies: [],
      relatedWords: words.slice(0, 6).map((word) => word.word),
      chunks: ["Could you explain that, please?", "I think this is useful because…", "What happened after that?"],
      collocations: blueprint.vocabularyAnchors.slice(0, 3).map((word) => `use ${word} in context`),
      register: "mixed",
      priorLevelLinks: ["A1 greetings", "A1 everyday questions", "A1 basic time and place language"],
      learningNote: blueprint.mentorPurpose,
      learningNoteArabic: blueprint.mentorPurposeArabic,
    }],
    practiceBrief: {
      readingBrief: `Read a connected A2 text about ${module.title.toLocaleLowerCase()}, identify the main purpose, and notice ${blueprint.grammarFocus}.`,
      writingPrompt: `Write 80–100 words for the ${blueprint.title} situation. Show that you can ${blueprint.canDo.replace(/^I can /, "").replace(/\.$/, "")}. Use at least three lesson words naturally, connect your ideas, and revise punctuation before checking your work.`,
    },
    domainFocus: module.overview,
    domainFocusArabic: module.overviewArabic,
    beginnerScaffold: blueprint.beginnerExplanation,
    beginnerScaffoldArabic: blueprint.beginnerExplanationArabic,
    lessonType: blueprint.type,
  });

  const authoredActivities = A2_MODULE_1_AUTHORED_ACTIVITIES[blueprint.lessonNumber];
  const experience = A2_MODULE_1_EXPERIENCES[blueprint.lessonNumber];
  return authoredActivities || experience
    ? { ...generatedLesson, activities: authoredActivities ?? generatedLesson.activities, experience: experience ?? generatedLesson.experience }
    : generatedLesson;
}

const A2_MODULES = getProgressiveImmersiveModules("A2");

export const A2_LESSONS: LessonDefinition[] = A2_MODULES.flatMap((module) =>
  module.lessonBlueprints.map((blueprint, index) => lessonFromBlueprint({
    ...blueprint,
    lessonNumber: ((module.moduleNumber - 1) * 15) + index + 1,
  }, module)),
);

export const A2_VOCABULARY = A2_LESSONS.flatMap((lesson) => lesson.words);
export const A2_GRAMMAR = A2_LESSONS.map((lesson) => lesson.grammar);

export const A2_COURSE: CourseDefinition = {
  level: "A2",
  title: "A2: Connected English for everyday independence",
  titleArabic: "A2: إنجليزية مترابطة للاستقلالية اليومية",
  totalLessons: 135,
  lessonsPerModule: 15,
  estimatedMinutes: 135 * 55,
  lessons: A2_LESSONS,
  modules: buildModuleDefinitions("A2", A2_LESSONS),
};

export function getA2Lesson(lessonNumber: number) {
  return A2_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
