import { and, eq } from "drizzle-orm";
import {
  A1_COURSE,
  A2_COURSE,
  B1_COURSE,
  B2_COURSE,
  C1_COURSE,
  C2_COURSE,
  type CefrLevel,
  type CourseDefinition,
  type LessonDefinition,
  type QuizQuestion,
  isMilestoneLesson,
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
import { inArray } from "drizzle-orm";
import { getDb } from "./db";
import { buildAssessmentVariants } from "../shared/course/assessment-questions";
import { moduleTheme } from "../shared/course/module-guidance";

const LEGACY_COURSES: CourseDefinition[] = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE];
// Version 5 promotes the approved B2, C1, and C2 roadmap-sized curricula into
// the normalized learner catalog while rebuilding all immutable course snapshots.
const SYNC_VERSION = 5;
let syncPromise: Promise<void> | null = null;

type CatalogQuestion = QuizQuestion & { id: string };

type PersistedCourseLevelSnapshot = {
  contentVersion: number;
};

type PersistedLessonSnapshot = {
  contentVersion: number;
};

type PersistedStructuredPracticeCounts = {
  grammar: number;
  readings: number;
  writing: number;
};

/**
 * A level-version write happens before its module and lesson upserts. If a
 * development restart or deployment interruption occurs mid-refresh, a simple
 * version comparison would incorrectly treat that partial catalog as current.
 * Keep the completion invariant explicit: version, module count, lesson count,
 * and lesson content versions must all agree with the source course.
 */
export function courseNeedsCatalogSynchronization(
  course: CourseDefinition,
  level: PersistedCourseLevelSnapshot | undefined,
  persistedModuleCount: number,
  persistedLessons: PersistedLessonSnapshot[],
  persistedVocabularyCount?: number,
  persistedStructuredPractice?: PersistedStructuredPracticeCounts,
  persistedAssessmentQuestionCount?: number,
) {
  const expectedModuleCount = Math.ceil(course.totalLessons / course.lessonsPerModule);
  const expectedVocabularyCount = course.lessons.reduce((count, lesson) => count + lesson.words.length, 0);
  const expectedAssessmentQuestionCount = course.lessons.reduce((count, lesson) => {
    const variants = assessmentVariants(course, lesson);
    const moduleVariants = variants.filter((_, index) => index % 4 === 0 || index >= variants.length - 3);
    return count + variants.length * (isMilestoneLesson(course, lesson.lessonNumber) ? 2 : 1) + moduleVariants.length;
  }, 0);
  return !level
    || level.contentVersion !== SYNC_VERSION
    || persistedModuleCount !== expectedModuleCount
    || persistedLessons.length !== course.totalLessons
    || persistedLessons.some((lesson) => lesson.contentVersion !== SYNC_VERSION)
    || (persistedVocabularyCount !== undefined && persistedVocabularyCount !== expectedVocabularyCount)
    || (persistedStructuredPractice !== undefined && (
      persistedStructuredPractice.grammar !== course.totalLessons
      || persistedStructuredPractice.readings !== course.totalLessons
      || persistedStructuredPractice.writing !== course.totalLessons
    ))
    || (persistedAssessmentQuestionCount !== undefined && persistedAssessmentQuestionCount !== expectedAssessmentQuestionCount);
}

function rotate<T>(items: T[], offset: number) {
  const start = items.length ? offset % items.length : 0;
  return [...items.slice(start), ...items.slice(0, start)];
}

export function assessmentVariants(course: CourseDefinition, lesson: LessonDefinition): CatalogQuestion[] {
  return buildAssessmentVariants(course, lesson);
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
    minimumWords: course.level === "A1" ? 35 : course.level === "A2" ? 80 : course.level === "B1" ? 140 : 200,
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

export async function syncCourse(course: CourseDefinition) {
  const db = await getDb();
  if (!db) return;
  const savedLessonSources: Array<{
    lesson: LessonDefinition;
    moduleNumber: number;
    moduleId: number;
    lessonId: number;
  }> = [];

  await db.insert(courseLevels).values({
    code: course.level,
    title: course.title,
    titleArabic: course.titleArabic,
    totalLessons: course.totalLessons,
    lessonsPerModule: course.lessonsPerModule,
    estimatedMinutes: course.estimatedMinutes,
    contentVersion: SYNC_VERSION,
  }).onConflictDoUpdate({ target: courseLevels.code, set: {
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
    const theme = moduleTheme(course.level, moduleNumber);
    const moduleTitle = `${theme.title}`;
    const moduleTitleArabic = `${theme.titleArabic}`;
    await db.insert(courseModules).values({
      levelId: level.id,
      moduleNumber,
      title: moduleTitle,
      titleArabic: moduleTitleArabic,
      overview: theme.overview,
      overviewArabic: theme.overviewArabic,
    }).onConflictDoUpdate({ target: [courseModules.levelId, courseModules.moduleNumber], set: { title: moduleTitle, titleArabic: moduleTitleArabic } });
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
      }).onConflictDoUpdate({ target: [courseTopics.moduleId, courseTopics.topicNumber], set: { title: lesson.title, titleArabic: lesson.titleArabic } });
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
      }).onConflictDoUpdate({ target: [courseLessons.levelId, courseLessons.lessonNumber], set: {
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

      savedLessonSources.push({ lesson, moduleNumber, moduleId: module.id, lessonId: savedLesson.id });
    }
  }

  const lessonIds = savedLessonSources.map((source) => source.lessonId);
  if (!lessonIds.length) return;
  const batches = <T,>(items: T[], size = 50) => Array.from(
    { length: Math.ceil(items.length / size) },
    (_, index) => items.slice(index * size, (index + 1) * size),
  );

  // Preserve learner progress rows while rebuilding only the immutable catalog
  // snapshot for this approved course version.
  await Promise.all([
    db.delete(lessonVocabulary).where(inArray(lessonVocabulary.lessonId, lessonIds)),
    db.delete(lessonGrammar).where(inArray(lessonGrammar.lessonId, lessonIds)),
    db.delete(lessonReadings).where(inArray(lessonReadings.lessonId, lessonIds)),
    db.delete(lessonWritingTasks).where(inArray(lessonWritingTasks.lessonId, lessonIds)),
    db.delete(assessmentQuestionBank).where(eq(assessmentQuestionBank.levelId, level.id)),
  ]);

  const vocabularyRows = savedLessonSources.flatMap(({ lesson, lessonId }) => lesson.words.map((word, position) => ({
    lessonId,
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
  })));
  const grammarRows = savedLessonSources.map(({ lesson, lessonId }) => ({
    lessonId,
    itemKey: lesson.grammar.id,
    topic: lesson.grammar.topic,
    arabicName: lesson.grammar.arabicName,
    grammarData: lesson.grammar as unknown as Record<string, unknown>,
  }));
  const readingRows = savedLessonSources.map(({ lesson, lessonId }) => ({
    lessonId,
    ...structuredReading(course, lesson),
    contentVersion: SYNC_VERSION,
  }));
  const writingRows = savedLessonSources.map(({ lesson, lessonId }) => ({
    lessonId,
    ...structuredWriting(course, lesson),
    contentVersion: SYNC_VERSION,
  }));
  const questionRows = savedLessonSources.flatMap(({ lesson, moduleNumber, moduleId, lessonId }) => {
    const variants = assessmentVariants(course, lesson);
    const assessmentTypes = isMilestoneLesson(course, lesson.lessonNumber)
      ? ["lesson_quiz", "milestone_quiz", "module_test"] as const
      : ["lesson_quiz", "module_test"] as const;
    return assessmentTypes.flatMap((assessmentType) => {
      const scopedVariants = assessmentType === "lesson_quiz" || assessmentType === "milestone_quiz"
        ? variants
        : variants.filter((_, index) => index % 4 === 0 || index >= variants.length - 3);
      return scopedVariants.map((question) => ({
        questionKey: `${course.level}:${assessmentType}:${assessmentType === "lesson_quiz" ? lesson.lessonNumber : moduleNumber}:${assessmentType === "milestone_quiz" ? lesson.lessonNumber : "module"}:${question.id}`,
        levelId: level.id,
        moduleId,
        lessonId: assessmentType === "lesson_quiz" ? lessonId : null,
        assessmentType,
        objectiveKey: question.reviewItemKey,
        itemType: question.assessmentFocus,
        difficulty: course.level === "A1" ? 1 : course.level === "A2" ? 2 : course.level === "B1" ? 3 : course.level === "B2" ? 4 : course.level === "C1" ? 5 : 6,
        questionData: question as unknown as Record<string, unknown>,
        reviewItemKey: question.reviewItemKey,
        contentVersion: SYNC_VERSION,
        active: 1,
      }));
    });
  });

  for (const batch of batches(vocabularyRows)) await db.insert(lessonVocabulary).values(batch);
  for (const batch of batches(grammarRows)) await db.insert(lessonGrammar).values(batch);
  for (const batch of batches(readingRows)) await db.insert(lessonReadings).values(batch);
  for (const batch of batches(writingRows)) await db.insert(lessonWritingTasks).values(batch);
  for (const batch of batches(questionRows)) await db.insert(assessmentQuestionBank).values(batch);
}

/** Populate the immutable course catalog when a managed database is available. */
export async function ensureCurriculumCatalog(courses: CourseDefinition[] = LEGACY_COURSES) {
  if (!syncPromise) {
    // A full curriculum refresh creates many normalized dependent rows.  Write
    // one course at a time so a large A2 migration does not compete with every
    // other level for the same managed-database connection.
    const task = (async () => {
      for (const course of courses) await syncCourse(course);
    })().catch((error) => {
      console.error("[Curriculum] Catalog synchronization failed:", error);
      throw error;
    });
    syncPromise = task.finally(() => { syncPromise = null; });
  }
  return syncPromise;
}

/**
 * Start-up guard: only run the comparatively expensive idempotent synchronizer
 * when a persisted level predates the current curriculum content version.
 */
export async function ensureCurrentCurriculumCatalog() {
  const db = await getDb();
  if (!db) return;
  const persistedLevels = await db.select().from(courseLevels);
  const levelByCode = new Map(persistedLevels.map((level) => [level.code, level]));
  const coursesNeedingSynchronization = (await Promise.all(LEGACY_COURSES.map(async (course) => {
    const level = levelByCode.get(course.level);
    if (!level) return course;
    const [persistedModules, persistedLessons] = await Promise.all([
      db.select().from(courseModules).where(eq(courseModules.levelId, level.id)),
      db.select().from(courseLessons).where(eq(courseLessons.levelId, level.id)),
    ]);
    const expectedVocabularyCount = course.lessons.reduce((count, lesson) => count + lesson.words.length, 0);
    const persistedLessonIds = persistedLessons.map((lesson) => lesson.id);
    const [persistedVocabulary, persistedGrammar, persistedReadings, persistedWriting, persistedQuestions] = persistedLessonIds.length
      ? await Promise.all([
        db.select({ lessonId: lessonVocabulary.lessonId })
          .from(lessonVocabulary)
          .where(inArray(lessonVocabulary.lessonId, persistedLessonIds))
          .limit(expectedVocabularyCount + 1),
        db.select({ lessonId: lessonGrammar.lessonId })
          .from(lessonGrammar)
          .where(inArray(lessonGrammar.lessonId, persistedLessonIds))
          .limit(course.totalLessons + 1),
        db.select({ lessonId: lessonReadings.lessonId })
          .from(lessonReadings)
          .where(inArray(lessonReadings.lessonId, persistedLessonIds))
          .limit(course.totalLessons + 1),
        db.select({ lessonId: lessonWritingTasks.lessonId })
          .from(lessonWritingTasks)
          .where(inArray(lessonWritingTasks.lessonId, persistedLessonIds))
          .limit(course.totalLessons + 1),
        db.select({ questionKey: assessmentQuestionBank.questionKey })
          .from(assessmentQuestionBank)
          .where(and(eq(assessmentQuestionBank.levelId, level.id), eq(assessmentQuestionBank.active, 1), eq(assessmentQuestionBank.contentVersion, SYNC_VERSION))),
      ])
      : [[], [], [], [], []];
    return courseNeedsCatalogSynchronization(
      course,
      level,
      persistedModules.length,
      persistedLessons,
      persistedVocabulary.length,
      {
        grammar: persistedGrammar.length,
        readings: persistedReadings.length,
        writing: persistedWriting.length,
      },
      persistedQuestions.length,
    ) ? course : null;
  }))).filter((course): course is CourseDefinition => course !== null);
  if (coursesNeedingSynchronization.length) await ensureCurriculumCatalog(coursesNeedingSynchronization);
}

/** Rebuild only persisted assessment questions after a question-bank policy change. */
export async function syncAssessmentQuestionBanks() {
  const db = await getDb();
  if (!db) return;
  for (const course of LEGACY_COURSES) {
    const level = await selectOne(
      db.select().from(courseLevels).where(eq(courseLevels.code, course.level)).limit(1),
      `Course level ${course.level} has not been synchronized.`,
    ) as typeof courseLevels.$inferSelect;

    for (let moduleNumber = 1; moduleNumber <= Math.ceil(course.totalLessons / course.lessonsPerModule); moduleNumber += 1) {
      const module = await selectOne(
        db.select().from(courseModules).where(and(eq(courseModules.levelId, level.id), eq(courseModules.moduleNumber, moduleNumber))).limit(1),
        `Module ${moduleNumber} for ${course.level} has not been synchronized.`,
      ) as typeof courseModules.$inferSelect;
      await db.update(assessmentQuestionBank).set({ active: 0 }).where(and(
        eq(assessmentQuestionBank.levelId, level.id),
        eq(assessmentQuestionBank.moduleId, module.id),
        eq(assessmentQuestionBank.assessmentType, "module_test"),
      ));
      await db.update(assessmentQuestionBank).set({ active: 0 }).where(and(
        eq(assessmentQuestionBank.levelId, level.id),
        eq(assessmentQuestionBank.moduleId, module.id),
        eq(assessmentQuestionBank.assessmentType, "milestone_quiz"),
      ));

      for (const lesson of course.lessons.filter((item) => item.moduleNumber === moduleNumber)) {
        const savedLesson = await selectOne(
          db.select().from(courseLessons).where(and(eq(courseLessons.levelId, level.id), eq(courseLessons.lessonNumber, lesson.lessonNumber))).limit(1),
          `Lesson ${course.level}-${lesson.lessonNumber} has not been synchronized.`,
        ) as typeof courseLessons.$inferSelect;
        await db.update(assessmentQuestionBank).set({ active: 0 }).where(and(
          eq(assessmentQuestionBank.levelId, level.id),
          eq(assessmentQuestionBank.lessonId, savedLesson.id),
          eq(assessmentQuestionBank.assessmentType, "lesson_quiz"),
        ));

        const variants = assessmentVariants(course, lesson);
        for (const assessmentType of ["lesson_quiz", "milestone_quiz", "module_test"] as const) {
          const scopedVariants = assessmentType === "lesson_quiz" ? variants : assessmentType === "milestone_quiz" ? variants : variants.filter((_, index) => index % 4 === 0 || index >= variants.length - 3);
          for (const question of scopedVariants) {
            const questionKey = `${course.level}:${assessmentType}:${assessmentType === "lesson_quiz" ? lesson.lessonNumber : moduleNumber}:${assessmentType === "milestone_quiz" ? lesson.lessonNumber : "module"}:${question.id}`;
            await db.insert(assessmentQuestionBank).values({
              questionKey,
              levelId: level.id,
              moduleId: module.id,
              lessonId: assessmentType === "lesson_quiz" ? savedLesson.id : null,
              assessmentType,
              objectiveKey: question.reviewItemKey,
              itemType: question.assessmentFocus,
              difficulty: course.level === "A1" ? 1 : course.level === "A2" ? 2 : course.level === "B1" ? 3 : course.level === "B2" ? 4 : course.level === "C1" ? 5 : 6,
              questionData: question as unknown as Record<string, unknown>,
              reviewItemKey: question.reviewItemKey,
              contentVersion: SYNC_VERSION,
            }).onConflictDoUpdate({ target: assessmentQuestionBank.questionKey, set: {
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
