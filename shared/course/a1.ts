import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import { A1_IMMERSIVE_MODULES } from "./a1-immersive-modules";
import { enrichLesson } from "./activity-plan";
import { createLessonExperience } from "./lesson-experience";
import { buildModuleDefinitions } from "./module-definitions";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
  LessonDefinition,
  LessonStep,
  ProgressiveSupport,
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

const EXPERIENCE_STEPS: Record<NonNullable<ReturnType<typeof experienceForBlueprint>>["selectedStages"][number], LessonStep["id"]> = {
  orientation: "start",
  encounter: "explore",
  notice: "notice",
  "supported-practice": "build",
  "meaningful-use": "respond",
  retrieval: "prove",
  evidence: "prove",
  "next-bridge": "respond",
};

function experienceForBlueprint(blueprint: ImmersiveLessonBlueprint, moduleNumber = 1) {
  if (moduleNumber !== 1) return undefined;

  const shared: { progressiveSupports: ProgressiveSupport[] } = {
    progressiveSupports: ["arabic-help", "worked-example", "word-support"],
  };

  switch (blueprint.lessonNumber) {
    case 1:
      return createLessonExperience({
        archetype: "discover",
        density: "normal",
        archetypeRationale: "The learner needs a safe social encounter before a formal language explanation.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "A full grammar explanation would distract from the first communicative success." },
          { stage: "evidence", reason: "A short, supported social response is sufficient first-lesson evidence." },
        ],
        firstView: {
          whatItIs: "Your first English social moment",
          whatToDo: "Listen to a tiny class exchange and choose a greeting.",
          whatMatters: "Use a greeting that fits the moment.",
          whatNext: "Try one short hello-and-goodbye exchange.",
        },
        ...shared,
      });
    case 2:
      return createLessonExperience({
        archetype: "interaction",
        density: "light",
        archetypeRationale: "Turn-taking and meaning are more useful here than a detached possessive-word lecture.",
        selectedStages: ["retrieval", "encounter", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "My and your are noticed within conversation turns." }],
        firstView: {
          whatItIs: "A name exchange",
          whatToDo: "Answer Noor’s question, then ask one back.",
          whatMatters: "Choose my or your for the correct speaker.",
          whatNext: "Use the exchange in a short role-play.",
        },
        ...shared,
      });
    case 3:
      return createLessonExperience({
        archetype: "grammar",
        density: "deep",
        archetypeRationale: "English identity sentences need a careful Arabic-English contrast before learners use them independently.",
        selectedStages: ["orientation", "notice", "supported-practice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The lesson protects depth for a new structural hinge." }],
        firstView: {
          whatItIs: "A small pattern workshop",
          whatToDo: "Compare two identity sentences and build one.",
          whatMatters: "I needs am; you needs are.",
          whatNext: "Use the pattern to describe a person.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "tip"],
      });
    case 4:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "light",
        archetypeRationale: "Image, sound, and a useful caption make people words concrete without overloading the learner.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [{ stage: "orientation", reason: "The picture-and-audio task provides the orientation directly." }],
        firstView: {
          whatItIs: "Picture English: people around you",
          whatToDo: "Hear a word and choose the matching person.",
          whatMatters: "Connect the sound, picture, and English label.",
          whatNext: "Make one simple picture caption.",
        },
        ...shared,
      });
    case 5:
      return createLessonExperience({
        archetype: "integration",
        density: "normal",
        archetypeRationale: "A supported mini-conversation shows the learner that earlier language can work together in one real exchange.",
        selectedStages: ["orientation", "retrieval", "supported-practice", "meaningful-use", "evidence", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "This lesson integrates existing language instead of introducing another grammar rule." }],
        firstView: {
          whatItIs: "Your first complete mini-conversation",
          whatToDo: "Choose a role-play mode and rehearse four lines.",
          whatMatters: "Help the other person understand you, not perfection.",
          whatNext: "Carry this introduction into the numbers lesson.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"],
      });
    default:
      return undefined;
  }
}

function stepsForBlueprint(blueprint: ImmersiveLessonBlueprint, moduleNumber: number) {
  const experience = experienceForBlueprint(blueprint, moduleNumber);
  if (!experience) return A1_STEPS;

  const selectedIds = new Set(experience.selectedStages.map((stage) => EXPERIENCE_STEPS[stage]));
  return A1_STEPS.filter((step) => selectedIds.has(step.id));
}

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
    steps: stepsForBlueprint(blueprint, module.moduleNumber),
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

function mentorGuideForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  module: (typeof A1_IMMERSIVE_MODULES)[number],
) {
  const firstRetrieval = blueprint.exposurePlan.find((exposure) => exposure.mode === "retrieve") ?? blueprint.exposurePlan.at(-1);
  const firstPractice = blueprint.exposurePlan.find((exposure) => exposure.mode === "use" || exposure.mode === "write" || exposure.mode === "hear") ?? blueprint.exposurePlan[0];

  return {
    level: "A1" as const,
    lessonTitle: blueprint.title,
    moments: [
      {
        id: "welcome" as const,
        title: "Your guide for today",
        titleArabic: "دليلك اليوم",
        message: blueprint.lessonNumber === 1 ? module.mentorOpening : `You are continuing ${module.title}. Small steps count: today you will add one useful piece to the English you already know.`,
        messageArabic: blueprint.lessonNumber === 1 ? module.mentorOpeningArabic : `أنت تتابع الآن وحدة ${module.titleArabic}. الخطوات الصغيرة مهمة: اليوم ستضيف جزءاً مفيداً إلى الإنجليزية التي تعرفها بالفعل.`,
      },
      {
        id: "vocabulary" as const,
        title: "First, meet the useful words",
        titleArabic: "أولاً: تعرّف إلى الكلمات المفيدة",
        message: `Do not try to memorise every word at once. Notice the key words, listen to them, and use one in the ${blueprint.title} situation.`,
        messageArabic: `لا تحاول حفظ كل كلمة دفعة واحدة. لاحظ الكلمات الأساسية، واستمع إليها، ثم استخدم كلمة واحدة في موقف ${blueprint.titleArabic}.`,
      },
      {
        id: "grammar" as const,
        title: "Then, notice one small pattern",
        titleArabic: "ثم لاحظ نمطاً صغيراً واحداً",
        message: blueprint.beginnerExplanation,
        messageArabic: blueprint.beginnerExplanationArabic,
      },
      {
        id: "practice" as const,
        title: "Now make it your own",
        titleArabic: "الآن اجعلها لغتك أنت",
        message: firstPractice?.task ?? "Use one of today’s words in a short sentence. A clear attempt is enough.",
        messageArabic: firstPractice?.taskArabic ?? "استخدم كلمة واحدة من كلمات اليوم في جملة قصيرة. محاولة واضحة تكفي.",
      },
      {
        id: "reading" as const,
        title: "See the language in context",
        titleArabic: "شاهد اللغة في سياق",
        message: `When you read or listen today, look for the words and pattern you have just met. Repeated encounters help the language stay with you.`,
        messageArabic: `عندما تقرأ أو تستمع اليوم، ابحث عن الكلمات والنمط اللذين قابلتهما للتو. التعرّض المتكرر يساعد اللغة على البقاء في ذاكرتك.`,
      },
      {
        id: "writing" as const,
        title: "Use a short model, then choose your words",
        titleArabic: "استخدم نموذجاً قصيراً ثم اختر كلماتك",
        message: `Start with one sentence frame. Then change one detail so the sentence says something true about you or your world.`,
        messageArabic: `ابدأ بقالب جملة واحد، ثم غيّر تفصيلاً واحداً لتقول الجملة شيئاً حقيقياً عنك أو عن عالمك.`,
      },
      {
        id: "check" as const,
        title: "Finish by remembering, not guessing",
        titleArabic: "اختم بالتذكر لا بالتخمين",
        message: firstRetrieval?.task ?? "Before you finish, say one useful word or sentence without looking at the page.",
        messageArabic: firstRetrieval?.taskArabic ?? "قبل أن تنهي الدرس، قل كلمة أو جملة مفيدة واحدة من دون النظر إلى الصفحة.",
      },
    ],
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
      mentorGuide: mentorGuideForBlueprint(blueprint, module),
      lessonType: blueprint.type,
      experience: experienceForBlueprint(blueprint, module.moduleNumber),
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
