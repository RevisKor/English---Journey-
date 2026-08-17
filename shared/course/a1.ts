import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import { A1_IMMERSIVE_MODULES } from "./a1-immersive-modules";
import { authoredActivitiesForA1Module1 } from "./a1-module-1-authored-activities";
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
    case 6:
      return createLessonExperience({
        archetype: "discover",
        density: "light",
        archetypeRationale: "Numbers enter through a useful personal meaning—age—without turning the lesson into an overloaded counting drill.",
        selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "supported-practice", reason: "A small number-card and answer choice already provide enough support for this light discovery lesson." },
          { stage: "evidence", reason: "A private or invented answer is purposeful practice, not a high-stakes performance." },
        ],
        firstView: {
          whatItIs: "Numbers for a real question",
          whatToDo: "Meet a few number words, then practise one age answer.",
          whatMatters: "English uses I am for age.",
          whatNext: "Add one age line to your introduction if you want to.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 7:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Visible classroom objects invite a sound-image-phrase journey, with one concise grammar notice only where it helps the phrase work.",
        selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [
          { stage: "orientation", reason: "The visual gallery immediately explains what the learner will do." },
          { stage: "retrieval", reason: "This focused vocabulary lesson protects space for a new colour-object connection." },
          { stage: "evidence", reason: "One chosen description is enough feedback at this point; assessment comes later in the module." },
        ],
        firstView: {
          whatItIs: "Picture English: colours and classroom things",
          whatToDo: "Listen, choose the matching phrase, then describe one object.",
          whatMatters: "English puts the colour before the object.",
          whatNext: "Use the phrases when you ask for help in class.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 8:
      return createLessonExperience({
        archetype: "interaction",
        density: "deep",
        archetypeRationale: "A learner needs a repair phrase at the moment misunderstanding can happen; the social interaction, not a grammar list, is the lesson’s centre.",
        selectedStages: ["retrieval", "notice", "supported-practice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [
          { stage: "orientation", reason: "The first classroom scenario provides an immediate, concrete orientation." },
          { stage: "next-bridge", reason: "The confidence reflection supplies a natural closure before the reading lesson changes mode." },
        ],
        firstView: {
          whatItIs: "A phrase for when you need help",
          whatToDo: "Hear a classroom direction, then practise asking for a repeat politely.",
          whatMatters: "Not understanding is normal; Can you repeat, please? keeps the conversation moving.",
          whatNext: "Use familiar classroom words inside a short reading.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 9:
      return createLessonExperience({
        archetype: "reading",
        density: "normal",
        archetypeRationale: "A short, highly supported profile lets the learner experience reading for meaning before writing a profile of their own.",
        selectedStages: ["encounter", "notice", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "meaningful-use", reason: "The next lesson deliberately owns the profile-writing task; this lesson protects reading attention." },
          { stage: "evidence", reason: "Guided meaning checks provide sufficient low-stakes evidence for this first reading experience." },
        ],
        firstView: {
          whatItIs: "Your first small English reading card",
          whatToDo: "Read slowly, then find the name, place, and object in the card.",
          whatMatters: "Return to the line that contains the answer; you do not need every word.",
          whatNext: "Keep one useful line ready for your own short profile.",
        },
        progressiveSupports: ["arabic-help", "transcript", "word-support", "worked-example"],
      });
    case 10:
      return createLessonExperience({
        archetype: "writing",
        density: "deep",
        archetypeRationale: "The learner now has enough meaningful language to produce a private or invented profile with focused, beginner-safe writing support.",
        selectedStages: ["retrieval", "notice", "supported-practice", "evidence"],
        intentionallyOmittedStages: [
          { stage: "encounter", reason: "The learner has just met a model profile in the preceding reading lesson." },
          { stage: "meaningful-use", reason: "The supported writing itself is the meaningful use; adding a separate production stage would repeat the task." },
        ],
        firstView: {
          whatItIs: "Your first short English profile",
          whatToDo: "Choose only the details you want, then write three to five supported lines.",
          whatMatters: "A capital I, a full stop, and one clear message are enough for today.",
          whatNext: "Keep one line for a future conversation or improve it after a friendly check.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt", "tip"],
      });
    case 11:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Family language enters through a safe fictional picture story so new words and two useful patterns can be used without demanding personal disclosure.",
        selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "supported-practice", reason: "The fictional family card supplies enough immediate contextual support before the learner chooses a personal or fictional line." },
          { stage: "evidence", reason: "An optional, low-pressure profile addition is more appropriate than a graded family disclosure." },
        ],
        firstView: {
          whatItIs: "Family words through a fictional story",
          whatToDo: "Meet three picture words, then choose one short family sentence to use.",
          whatMatters: "I have ... and This is my ... do different useful jobs.",
          whatNext: "Use a fictional line or add an optional detail to your profile.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 12:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Professions are most useful when learners connect a person, a role, and a short job sentence before a real meeting asks them to choose a relevant detail.",
        selectedStages: ["encounter", "notice", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "meaningful-use", reason: "The next lesson gives job language a more natural communicative role inside a first meeting." },
          { stage: "evidence", reason: "A concise scene choice is sufficient feedback before the interaction lesson." },
        ],
        firstView: {
          whatItIs: "People and their jobs",
          whatToDo: "Match a person to a job, then keep one useful sentence chunk.",
          whatMatters: "A job word works best inside a whole short sentence.",
          whatNext: "Decide whether one job detail belongs in a first meeting.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 13:
      return createLessonExperience({
        archetype: "interaction",
        density: "deep",
        archetypeRationale: "A first meeting asks the learner to choose details and questions responsively, making interaction—not an isolated question-word worksheet—the right dominant experience.",
        selectedStages: ["retrieval", "notice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [
          { stage: "encounter", reason: "The first-meeting decision task provides immediate context and retrieves only language the learner needs." },
          { stage: "supported-practice", reason: "The conversation includes in-the-moment choices and transcript support rather than a separate mechanical drill." },
        ],
        firstView: {
          whatItIs: "A first meeting with real choices",
          whatToDo: "Choose a useful question, listen to the answer, then add one relevant detail.",
          whatMatters: "Good conversation responds to what a person has already said.",
          whatNext: "Hear the same meeting as a smooth, short conversation.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 14:
      return createLessonExperience({
        archetype: "speaking",
        density: "normal",
        archetypeRationale: "After several supported encounters, the learner benefits from choosing an introduction length they can say clearly rather than producing a longer scripted performance.",
        selectedStages: ["encounter", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "The model transcript and pronunciation hints support speaking directly; a separate language analysis would dilute rehearsal time." },
          { stage: "evidence", reason: "A self-chosen clarity target is safer and more useful than an accent-scored speaking test." },
        ],
        firstView: {
          whatItIs: "A version you can say clearly",
          whatToDo: "Listen once, choose a short, medium, or full introduction, then rehearse it calmly.",
          whatMatters: "Being understood is more important than sounding like someone else.",
          whatNext: "Use one clear version in the module check if you are ready.",
        },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 15:
      return createLessonExperience({
        archetype: "assessment",
        density: "deep",
        archetypeRationale: "A supportive module assessment can gather reading, writing, and speaking evidence while letting the learner choose one precise next review target.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "evidence", "next-bridge"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "The assessment checks application of previously noticed language rather than adding a new explanation." },
          { stage: "retrieval", reason: "The final review decision identifies an intentional next target instead of forcing an extra recall task." },
        ],
        firstView: {
          whatItIs: "Module 1: show what you can use",
          whatToDo: "Read a short profile, make your own, say a small introduction, then choose one review target.",
          whatMatters: "The check looks for usable messages and a helpful next step—not perfect recall or accent.",
          whatNext: "Carry the one target you chose into the next module.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "external-ai-prompt", "tip"],
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
      activities: authoredActivitiesForA1Module1(activeLessonNumber),
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
