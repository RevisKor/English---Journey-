import { and, eq } from "drizzle-orm";
import {
  A1_COURSE,
  A2_COURSE,
  B1_COURSE,
  B2_COURSE,
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
import { buildAssessmentVariants } from "../shared/course/assessment-questions";

const LEGACY_COURSES: CourseDefinition[] = [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE];
const SYNC_VERSION = 2;
let syncPromise: Promise<void> | null = null;

type CatalogQuestion = QuizQuestion & { id: string };

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

    await db.update(assessmentQuestionBank).set({ active: 0 }).where(and(
      eq(assessmentQuestionBank.levelId, level.id),
      eq(assessmentQuestionBank.moduleId, module.id),
      eq(assessmentQuestionBank.assessmentType, "module_test"),
    ));

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

      await db.update(assessmentQuestionBank).set({ active: 0 }).where(and(
        eq(assessmentQuestionBank.levelId, level.id),
        eq(assessmentQuestionBank.lessonId, savedLesson.id),
        eq(assessmentQuestionBank.assessmentType, "lesson_quiz"),
      ));

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
            itemType: question.assessmentFocus,
            difficulty: course.level === "A1" ? 1 : course.level === "A2" ? 2 : course.level === "B1" ? 3 : 4,
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
              itemType: question.assessmentFocus,
              difficulty: course.level === "A1" ? 1 : course.level === "A2" ? 2 : course.level === "B1" ? 3 : 4,
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
