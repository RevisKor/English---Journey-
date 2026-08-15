import { and, eq } from "drizzle-orm";
import {
  A1_COURSE,
  A2_COURSE,
  type CefrLevel,
  type CourseDefinition,
  type LessonDefinition,
  type QuizQuestion,
} from "../shared/course";
import {
  assessmentQuestionBank,
  courseLessons,
  courseLevels,
  courseModules,
  courseTopics,
  lessonGrammar,
  lessonReadings,
  lessonVocabulary,
  lessonWritingTasks,
} from "../drizzle/schema";
import { getDb } from "./db";

const LEGACY_COURSES: CourseDefinition[] = [A1_COURSE, A2_COURSE];
const SYNC_VERSION = 1;
let syncPromise: Promise<void> | null = null;

type CatalogQuestion = QuizQuestion & { id: string };

function rotate<T>(items: T[], offset: number) {
  const start = items.length ? offset % items.length : 0;
  return [...items.slice(start), ...items.slice(0, start)];
}

function spellingChoices(word: string) {
  const lower = word.toLowerCase();
  const swapped = lower.length > 4 ? `${lower.slice(0, 1)}${lower.slice(2, 3)}${lower.slice(1, 2)}${lower.slice(3)}` : `${lower}s`;
  const missing = lower.length > 5 ? `${lower.slice(0, 2)}${lower.slice(3)}` : `${lower}e`;
  return Array.from(new Set([lower, swapped, missing, `${lower}e`])).slice(0, 4);
}

function assessmentVariants(course: CourseDefinition, lesson: LessonDefinition): CatalogQuestion[] {
  const vocabulary = lesson.words.flatMap((word, index) => {
    const alternatives = rotate(lesson.words.filter((item) => item.id !== word.id), index + 2).slice(0, 3).map((item) => item.word);
    return [
      {
        id: `${course.level}:meaning:${word.id}`,
        type: "meaning" as const,
        prompt: `Which English word or expression means “${word.arabic}”?`,
        promptArabic: `ما الكلمة أو العبارة الإنجليزية التي تعني «${word.arabic}»؟`,
        choices: rotate([word.word, ...alternatives], index),
        answer: word.word,
        reviewItemKey: word.id,
        reviewItemType: "vocabulary" as const,
      },
      {
        id: `${course.level}:spelling:${word.id}`,
        type: "spelling" as const,
        prompt: `Choose the correct spelling for: ${word.arabic}`,
        promptArabic: `اختر التهجئة الصحيحة لكلمة أو عبارة: ${word.arabic}`,
        choices: rotate(spellingChoices(word.word), index),
        answer: word.word.toLowerCase(),
        reviewItemKey: word.id,
        reviewItemType: "vocabulary" as const,
      },
    ];
  });

  const grammarChoices = course.lessons.map((item) => item.grammar.topic);
  const example = lesson.grammar.examples[0];
  const grammar = example ? [0, 1, 2].map((variant) => ({
    id: `${course.level}:grammar:${lesson.grammar.id}:${variant}`,
    type: "grammar" as const,
    prompt: variant === 0
      ? `Which grammar focus best supports this sentence? “${example.en}”`
      : `Which grammar focus helps you communicate this lesson outcome: ${lesson.learningPlan?.outcome.canDo ?? lesson.title}?`,
    promptArabic: `أي قاعدة تناسب درس «${lesson.grammar.arabicName}» بشكل أفضل؟`,
    choices: rotate([lesson.grammar.topic, ...grammarChoices.filter((topic) => topic !== lesson.grammar.topic).slice(0, 3)], lesson.lessonNumber + variant),
    answer: lesson.grammar.topic,
    reviewItemKey: lesson.grammar.id,
    reviewItemType: "grammar" as const,
  })) : [];

  return [...vocabulary, ...grammar];
}

export function structuredReading(course: CourseDefinition, lesson: LessonDefinition) {
  const examples = lesson.grammar.examples.slice(0, 2).map((example) => example.en).join(" ");
  const vocabulary = lesson.words.slice(0, 4).map((word) => word.word).join(", ");
  const outcome = lesson.learningPlan?.outcome.canDo ?? `use ${lesson.grammar.topic} with the lesson vocabulary`;
  return {
    title: `Reading: ${lesson.title}`,
    titleArabic: `قراءة: ${lesson.titleArabic}`,
    passage: `${examples} This short ${course.level} practice text helps you ${outcome}. Notice these useful words: ${vocabulary}.`,
    questions: [
      { question: "What is the main language focus of this text?", questionArabic: "ما الفكرة اللغوية الرئيسة في النص؟", answer: lesson.grammar.topic, explanationArabic: `يركز النص على قاعدة ${lesson.grammar.arabicName}.` },
      { question: "Name one useful word from the text.", questionArabic: "اذكر كلمة مفيدة واحدة من النص.", answer: lesson.words[0]?.word ?? "", explanationArabic: "يمكنك اختيار إحدى كلمات الدرس." },
      { question: "What can you do after this lesson?", questionArabic: "ماذا تستطيع أن تفعل بعد هذا الدرس؟", answer: outcome, explanationArabic: "ارجع إلى نتيجة الدرس واستخدمها في إجابتك." },
    ],
  };
}

export function structuredWriting(course: CourseDefinition, lesson: LessonDefinition) {
  const outcome = lesson.learningPlan?.outcome.canDo ?? `use ${lesson.grammar.topic} in a short message`;
  const usefulWords = lesson.words.slice(0, 6).map((word) => word.word).join(", ");
  return {
    title: `Writing: ${lesson.title}`,
    instructionsEnglish: lesson.practiceBrief?.writingPrompt ?? `Write a short ${course.level} text to show that you can ${outcome}. Use ${lesson.grammar.topic} and at least three of these words when natural: ${usefulWords}.`,
    instructionsArabic: `اكتب نصاً قصيراً لتثبت أنك تستطيع ${lesson.learningPlan?.outcome.canDoArabic ?? `استخدام قاعدة ${lesson.grammar.arabicName}`}. استخدم القاعدة وثلاث كلمات من الدرس على الأقل عندما يكون ذلك طبيعياً.`,
    minimumWords: course.level === "A1" ? 35 : 80,
    successCriteria: ["Use the lesson grammar accurately.", "Use at least three lesson words naturally.", "Make the purpose clear to the reader."],
  };
}

async function syncLessonPractice(lessonId: number, course: CourseDefinition, lesson: LessonDefinition) {
  const db = await getDb();
  if (!db) return;
  const reading = structuredReading(course, lesson);
  const savedReading = await db.select().from(lessonReadings).where(and(eq(lessonReadings.lessonId, lessonId), eq(lessonReadings.title, reading.title))).limit(1);
  if (savedReading[0]) await db.update(lessonReadings).set({ titleArabic: reading.titleArabic, passage: reading.passage, questions: reading.questions, contentVersion: SYNC_VERSION }).where(eq(lessonReadings.id, savedReading[0].id));
  else await db.insert(lessonReadings).values({ lessonId, ...reading, contentVersion: SYNC_VERSION });

  const writing = structuredWriting(course, lesson);
  const savedWriting = await db.select().from(lessonWritingTasks).where(and(eq(lessonWritingTasks.lessonId, lessonId), eq(lessonWritingTasks.title, writing.title))).limit(1);
  if (savedWriting[0]) await db.update(lessonWritingTasks).set({ ...writing, contentVersion: SYNC_VERSION }).where(eq(lessonWritingTasks.id, savedWriting[0].id));
  else await db.insert(lessonWritingTasks).values({ lessonId, ...writing, contentVersion: SYNC_VERSION });
}

async function selectOne<T>(query: Promise<T[]>, message: string): Promise<T> {
  const item = (await query)[0];
  if (!item) throw new Error(message);
  return item;
}

async function syncCourse(course: CourseDefinition) {
  const db = await getDb();
  if (!db) return;

  await db.insert(courseLevels).values({
    code: course.level,
    title: course.title,
    titleArabic: course.titleArabic,
    totalLessons: course.totalLessons,
    lessonsPerModule: course.lessonsPerModule,
    estimatedMinutes: course.estimatedMinutes,
    contentVersion: SYNC_VERSION,
  }).onDuplicateKeyUpdate({ set: {
    title: course.title,
    titleArabic: course.titleArabic,
    totalLessons: course.totalLessons,
    lessonsPerModule: course.lessonsPerModule,
    estimatedMinutes: course.estimatedMinutes,
    contentVersion: SYNC_VERSION,
  } });
  const level = await selectOne(db.select().from(courseLevels).where(eq(courseLevels.code, course.level)).limit(1), `Course level ${course.level} was not saved.`) as typeof courseLevels.$inferSelect;

  for (let moduleNumber = 1; moduleNumber <= Math.ceil(course.totalLessons / course.lessonsPerModule); moduleNumber += 1) {
    const moduleLessons = course.lessons.filter((lesson) => lesson.moduleNumber === moduleNumber);
    const moduleTitle = `Module ${moduleNumber}: ${moduleLessons[0]?.title ?? "Course practice"}`;
    const moduleTitleArabic = `الوحدة ${moduleNumber}: ${moduleLessons[0]?.titleArabic ?? "تطبيقات الدورة"}`;
    await db.insert(courseModules).values({
      levelId: level.id,
      moduleNumber,
      title: moduleTitle,
      titleArabic: moduleTitleArabic,
      overview: `A cumulative ${course.level} module connecting vocabulary, grammar, reading, and writing through practical tasks.`,
      overviewArabic: `وحدة تراكمية في مستوى ${course.level} تربط المفردات والقواعد والقراءة والكتابة بمهام عملية.`,
    }).onDuplicateKeyUpdate({ set: { title: moduleTitle, titleArabic: moduleTitleArabic } });
    const module = await selectOne(db.select().from(courseModules).where(and(eq(courseModules.levelId, level.id), eq(courseModules.moduleNumber, moduleNumber))).limit(1), `Module ${moduleNumber} was not saved.`) as typeof courseModules.$inferSelect;

    for (const lesson of moduleLessons) {
      const topicNumber = lesson.lessonNumber - ((moduleNumber - 1) * course.lessonsPerModule);
      await db.insert(courseTopics).values({
        moduleId: module.id,
        topicNumber,
        title: lesson.title,
        titleArabic: lesson.titleArabic,
        description: lesson.learningPlan?.outcome.canDo ?? `Use the language introduced in ${lesson.title}.`,
        descriptionArabic: lesson.learningPlan?.outcome.canDoArabic ?? `استخدم اللغة المقدمة في درس ${lesson.titleArabic}.`,
      }).onDuplicateKeyUpdate({ set: { title: lesson.title, titleArabic: lesson.titleArabic } });
      const topic = await selectOne(db.select().from(courseTopics).where(and(eq(courseTopics.moduleId, module.id), eq(courseTopics.topicNumber, topicNumber))).limit(1), `Topic ${lesson.lessonNumber} was not saved.`) as typeof courseTopics.$inferSelect;

      await db.insert(courseLessons).values({
        levelId: level.id,
        moduleId: module.id,
        topicId: topic.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        titleArabic: lesson.titleArabic,
        learningPlan: lesson.learningPlan as unknown as Record<string, unknown> | undefined,
        lexicalNetworks: lesson.lexicalNetworks as unknown as Array<Record<string, unknown>> | undefined,
        practiceBrief: lesson.practiceBrief as unknown as Record<string, unknown> | undefined,
        contentVersion: SYNC_VERSION,
      }).onDuplicateKeyUpdate({ set: {
        moduleId: module.id,
        topicId: topic.id,
        title: lesson.title,
        titleArabic: lesson.titleArabic,
        learningPlan: lesson.learningPlan as unknown as Record<string, unknown> | undefined,
        lexicalNetworks: lesson.lexicalNetworks as unknown as Array<Record<string, unknown>> | undefined,
        practiceBrief: lesson.practiceBrief as unknown as Record<string, unknown> | undefined,
        contentVersion: SYNC_VERSION,
      } });
      const savedLesson = await selectOne(db.select().from(courseLessons).where(and(eq(courseLessons.levelId, level.id), eq(courseLessons.lessonNumber, lesson.lessonNumber))).limit(1), `Lesson ${lesson.lessonNumber} was not saved.`) as typeof courseLessons.$inferSelect;

      for (const [position, word] of Array.from(lesson.words.entries())) {
        await db.insert(lessonVocabulary).values({
          lessonId: savedLesson.id,
          itemKey: word.id,
          position,
          word: word.word,
          arabic: word.arabic,
          ipa: word.ipa,
          phoneticRespelling: word.phoneticRespelling,
          partOfSpeech: word.partOfSpeech,
          definition: word.definition,
          exampleEN: word.exampleEN,
          exampleAR: word.exampleAR,
        }).onDuplicateKeyUpdate({ set: {
          lessonId: savedLesson.id,
          position,
          word: word.word,
          arabic: word.arabic,
          ipa: word.ipa,
          phoneticRespelling: word.phoneticRespelling,
          partOfSpeech: word.partOfSpeech,
          definition: word.definition,
          exampleEN: word.exampleEN,
          exampleAR: word.exampleAR,
        } });
      }

      await db.insert(lessonGrammar).values({
        lessonId: savedLesson.id,
        itemKey: lesson.grammar.id,
        topic: lesson.grammar.topic,
        arabicName: lesson.grammar.arabicName,
        grammarData: lesson.grammar as unknown as Record<string, unknown>,
      }).onDuplicateKeyUpdate({ set: {
        lessonId: savedLesson.id,
        topic: lesson.grammar.topic,
        arabicName: lesson.grammar.arabicName,
        grammarData: lesson.grammar as unknown as Record<string, unknown>,
      } });
      await syncLessonPractice(savedLesson.id, course, lesson);

      const variants = assessmentVariants(course, lesson);
      for (const assessmentType of ["lesson_quiz", "module_test"] as const) {
        const scopedVariants = assessmentType === "lesson_quiz" ? variants : variants.filter((_, index) => index % 4 === 0 || index >= variants.length - 3);
        for (const question of scopedVariants) {
          const questionKey = `${course.level}:${assessmentType}:${assessmentType === "lesson_quiz" ? lesson.lessonNumber : moduleNumber}:${question.id}`;
          await db.insert(assessmentQuestionBank).values({
            questionKey,
            levelId: level.id,
            moduleId: module.id,
            lessonId: assessmentType === "lesson_quiz" ? savedLesson.id : null,
            assessmentType,
            objectiveKey: question.reviewItemKey,
            itemType: question.type,
            difficulty: course.level === "A1" ? 1 : 2,
            questionData: question as unknown as Record<string, unknown>,
            reviewItemKey: question.reviewItemKey,
            contentVersion: SYNC_VERSION,
          }).onDuplicateKeyUpdate({ set: {
            questionData: question as unknown as Record<string, unknown>,
            reviewItemKey: question.reviewItemKey,
            active: 1,
            contentVersion: SYNC_VERSION,
          } });
        }
      }
    }
  }
}

/** Populate the immutable course catalog when a managed database is available. */
export async function ensureCurriculumCatalog() {
  if (!syncPromise) {
    syncPromise = Promise.all(LEGACY_COURSES.map(syncCourse)).then(() => undefined).catch((error) => {
      syncPromise = null;
      console.error("[Curriculum] Catalog synchronization failed:", error);
      throw error;
    });
  }
  return syncPromise;
}

/** Synchronize only static reading and writing records after a practice-template change. */
export async function syncStructuredPracticeCatalog() {
  const db = await getDb();
  if (!db) return;
  for (const course of LEGACY_COURSES) {
    const level = await db.select().from(courseLevels).where(eq(courseLevels.code, course.level)).limit(1);
    if (!level[0]) throw new Error(`Course level ${course.level} has not been synchronized.`);
    for (const lesson of course.lessons) {
      const savedLesson = await db.select().from(courseLessons).where(and(eq(courseLessons.levelId, level[0].id), eq(courseLessons.lessonNumber, lesson.lessonNumber))).limit(1);
      if (!savedLesson[0]) throw new Error(`Lesson ${course.level}-${lesson.lessonNumber} has not been synchronized.`);
      await syncLessonPractice(savedLesson[0].id, course, lesson);
    }
  }
}

export const supportedCatalogLevels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
