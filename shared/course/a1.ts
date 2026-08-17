import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import { A1_IMMERSIVE_MODULES } from "./a1-immersive-modules";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
  LessonDefinition,
  LessonStep,
  VocabularyItem,
} from "./types";

export const A1_VOCABULARY = rawVocabulary as VocabularyItem[];
export const A1_GRAMMAR = rawGrammar as GrammarTopic[];

/**
 * The live A1 curriculum is intentionally authored as six fifteen-lesson
 * journeys.  Each journey uses the same word and structure in different
 * modalities rather than treating vocabulary and grammar as isolated lists.
 */
const A1_LESSONS_PER_MODULE = 15;

const moduleGrammarSchedule: number[][] = [
  [0, 5, 0, 2, 3, 0, 11, 13, 19, 5, 6, 0, 3, 19, 0],
  [5, 6, 4, 10, 8, 11, 2, 3, 10, 8, 19, 5, 11, 2, 10],
  [2, 3, 1, 9, 19, 11, 4, 1, 2, 3, 13, 8, 19, 1, 9],
  [1, 14, 9, 11, 19, 1, 7, 14, 9, 19, 15, 16, 17, 1, 19],
  [8, 13, 12, 19, 10, 8, 13, 7, 19, 15, 16, 17, 8, 19, 13],
  [1, 12, 6, 19, 7, 14, 11, 13, 19, 15, 16, 17, 18, 19, 0],
];

const A1_STEPS: LessonStep[] = [
  { id: "start", title: "Start together", titleArabic: "ابدأ معنا", purpose: "Connect today's situation to a familiar word, picture, or phrase.", estimatedMinutes: 4 },
  { id: "explore", title: "Meet the English", titleArabic: "تعرّف إلى الإنجليزية", purpose: "Hear and see a small set of useful words in a clear context.", estimatedMinutes: 8 },
  { id: "notice", title: "Notice the pattern", titleArabic: "لاحظ النمط", purpose: "See how English arranges the words and how the meaning changes.", estimatedMinutes: 7 },
  { id: "build", title: "Build a sentence", titleArabic: "ابنِ جملة", purpose: "Make one short, correct sentence with a model and helpful clues.", estimatedMinutes: 8 },
  { id: "respond", title: "Use it in life", titleArabic: "استخدمها في الحياة", purpose: "Say or write a simple message for a real everyday purpose.", estimatedMinutes: 8 },
  { id: "prove", title: "Check and remember", titleArabic: "تحقق وتذكّر", purpose: "Show what you can do, then bring one useful word back later.", estimatedMinutes: 5 },
];

const vocabularyByWord = new Map(A1_VOCABULARY.map((item) => [item.word.toLocaleLowerCase(), item]));

function uniqueVocabulary(items: VocabularyItem[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function fallbackVocabulary(word: string, moduleTitle: string): VocabularyItem {
  const id = `a1-immersive-${word.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return {
    id,
    word,
    arabic: "كلمة أو عبارة أساسية لهذا الدرس",
    ipa: "",
    phoneticRespelling: word,
    partOfSpeech: "useful word or phrase",
    definition: `A useful English word or phrase in the ${moduleTitle} learning journey.`,
    exampleEN: `Use “${word}” in the guided conversation for this lesson.`,
    exampleAR: `استخدم «${word}» في المحادثة الموجّهة لهذا الدرس.`,
  };
}

function vocabularyForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  moduleVocabulary: VocabularyItem[],
  moduleTitle: string,
  activeLessonNumber: number,
) {
  const localLesson = ((blueprint.lessonNumber - 1) % A1_LESSONS_PER_MODULE) + 1;
  const rotatingModuleSet = moduleVocabulary.slice((localLesson - 1) * 5, localLesson * 5);
  const anchors = blueprint.vocabularyAnchors.map(
    (word) => vocabularyByWord.get(word.toLocaleLowerCase()) ?? fallbackVocabulary(word, moduleTitle),
  );
  // A word can return in later activities for retrieval practice.  The managed
  // catalog uses a globally unique item key, so each lesson occurrence needs
  // its own persistence identity even when the learner-facing word is shared.
  return uniqueVocabulary([...anchors, ...rotatingModuleSet]).map((word) => ({
    ...word,
    id: `a1-lesson-${activeLessonNumber}-${word.id}`,
  }));
}

function grammarForBlueprint(moduleIndex: number, localLesson: number, activeLessonNumber: number) {
  const grammarIndex = moduleGrammarSchedule[moduleIndex][localLesson - 1];
  const guide = A1_GRAMMAR[grammarIndex] ?? A1_GRAMMAR[0];
  return {
    ...guide,
    id: `${guide.id}-m${moduleIndex + 1}-l${localLesson}`,
    lessonNumber: activeLessonNumber,
  };
}

function learningPlanForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  module: (typeof A1_IMMERSIVE_MODULES)[number],
) {
  return {
    outcome: {
      canDo: blueprint.canDo,
      canDoArabic: blueprint.canDoArabic,
      scenario: module.overview,
      scenarioArabic: module.overviewArabic,
    },
    steps: A1_STEPS,
    retrieval: blueprint.exposurePlan.slice(0, 3).map((exposure) => ({
      sourceLevel: "A1" as const,
      language: exposure.task,
      prompt: `Remember one word or phrase, then use it in the ${blueprint.title} situation.`,
      purpose: exposure.taskArabic,
    })),
    englishFirst: false,
    studio: "A1 First Steps Studio",
  };
}

export const A1_LESSONS: LessonDefinition[] = A1_IMMERSIVE_MODULES.flatMap((module, moduleIndex) => {
  const moduleVocabulary = A1_VOCABULARY.slice(moduleIndex * 75, (moduleIndex + 1) * 75);
  return module.lessonBlueprints.map((blueprint) => {
    const localLesson = ((blueprint.lessonNumber - 1) % A1_LESSONS_PER_MODULE) + 1;
    const activeLessonNumber = moduleIndex * A1_LESSONS_PER_MODULE + localLesson;
    return enrichLesson({
      level: "A1",
      lessonNumber: activeLessonNumber,
      moduleNumber: module.moduleNumber,
      title: blueprint.title,
      titleArabic: blueprint.titleArabic,
      words: vocabularyForBlueprint(blueprint, moduleVocabulary, module.title, activeLessonNumber),
      grammar: grammarForBlueprint(moduleIndex, localLesson, activeLessonNumber),
      learningPlan: learningPlanForBlueprint(blueprint, module),
      domainFocus: module.overview,
      domainFocusArabic: module.overviewArabic,
      beginnerScaffold: blueprint.beginnerExplanation,
      beginnerScaffoldArabic: blueprint.beginnerExplanationArabic,
      lessonType: blueprint.type,
    });
  });
});

export const A1_COURSE: CourseDefinition = {
  level: "A1",
  title: "A1: Everyday English from the first hello",
  titleArabic: "A1: الإنجليزية اليومية من أول تحية",
  totalLessons: 90,
  lessonsPerModule: A1_LESSONS_PER_MODULE,
  estimatedMinutes: 90 * 40,
  lessons: A1_LESSONS,
  modules: buildModuleDefinitions("A1", A1_LESSONS),
};

export function getA1Lesson(lessonNumber: number) {
  return A1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
