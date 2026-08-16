import rawDraft from "./a2-draft.json";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";
import { getProgressiveImmersiveModules } from "./progressive-immersive";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
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
  return uniqueVocabulary([...anchorWords, ...rotatedSeeds]);
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

function lessonFromBlueprint(blueprint: ImmersiveLessonBlueprint, module: ReturnType<typeof getProgressiveImmersiveModules>[number]): LessonDefinition {
  const words = vocabularyForBlueprint(blueprint);
  return enrichLesson({
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
