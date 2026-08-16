import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const accent = pgEnum("preferred_accent", ["british", "american"]);
export const interfaceLanguage = pgEnum("interface_language", ["bilingual", "english", "arabic"]);
export const progressStatus = pgEnum("progress_status", ["locked", "available", "in_progress", "completed"]);
export const reviewItemType = pgEnum("review_item_type", ["vocabulary", "grammar"]);
export const assessmentType = pgEnum("assessment_type", ["lesson_quiz", "milestone_quiz", "module_test", "warm_up"]);
export const assessmentInstanceStatus = pgEnum("assessment_instance_status", ["active", "submitted", "expired"]);
export const submissionKind = pgEnum("submission_kind", ["checkpoint", "module_test"]);
export const aiAction = pgEnum("ai_action", ["word_tutor", "grammar_check", "reading", "reading_grade", "writing_prompt", "writing_grade"]);

/** Core identity table, maintained by Google OAuth. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export const learningProfiles = pgTable("learningProfiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  preferredAccent: accent("preferredAccent").default("british").notNull(),
  interfaceLanguage: interfaceLanguage("interfaceLanguage").default("bilingual").notNull(),
  currentLevel: varchar("currentLevel", { length: 4 }).default("A1").notNull(),
  totalXp: integer("totalXp").default(0).notNull(),
  currentStreak: integer("currentStreak").default(0).notNull(),
  longestStreak: integer("longestStreak").default(0).notNull(),
  lastActivityDate: varchar("lastActivityDate", { length: 10 }),
  lastActivityAt: timestamp("lastActivityAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("learning_profile_user_unique").on(table.userId)]);

export const lessonProgress = pgTable("lessonProgress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber").notNull(),
  status: progressStatus("status").default("locked").notNull(),
  vocabularyCompletedAt: timestamp("vocabularyCompletedAt", { withTimezone: true }),
  grammarCompletedAt: timestamp("grammarCompletedAt", { withTimezone: true }),
  pronunciationCompletedAt: timestamp("pronunciationCompletedAt", { withTimezone: true }),
  readingCompletedAt: timestamp("readingCompletedAt", { withTimezone: true }),
  quizBestScore: integer("quizBestScore").default(0).notNull(),
  quizPassedAt: timestamp("quizPassedAt", { withTimezone: true }),
  completedAt: timestamp("completedAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("lesson_progress_user_lesson_unique").on(table.userId, table.level, table.lessonNumber),
  index("lesson_progress_user_level_index").on(table.userId, table.level),
]);

export const moduleProgress = pgTable("moduleProgress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  moduleNumber: integer("moduleNumber").notNull(),
  status: progressStatus("status").default("locked").notNull(),
  testBestScore: integer("testBestScore").default(0).notNull(),
  testPassedAt: timestamp("testPassedAt", { withTimezone: true }),
  completedAt: timestamp("completedAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("module_progress_user_module_unique").on(table.userId, table.level, table.moduleNumber),
  index("module_progress_user_level_index").on(table.userId, table.level),
]);

export const reviewQueue = pgTable("reviewQueue", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber").notNull(),
  itemType: reviewItemType("itemType").notNull(),
  itemKey: varchar("itemKey", { length: 128 }).notNull(),
  repetition: integer("repetition").default(0).notNull(),
  intervalDays: integer("intervalDays").default(1).notNull(),
  easeFactor: integer("easeFactor").default(250).notNull(),
  dueAt: timestamp("dueAt", { withTimezone: true }).defaultNow().notNull(),
  lastReviewedAt: timestamp("lastReviewedAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("review_queue_user_item_unique").on(table.userId, table.level, table.itemType, table.itemKey),
  index("review_queue_due_index").on(table.userId, table.dueAt),
]);

/** Versioned course structure, shared by all learners. */
export const courseLevels = pgTable("courseLevels", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 4 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
  totalLessons: integer("totalLessons").notNull(),
  lessonsPerModule: integer("lessonsPerModule").notNull(),
  estimatedMinutes: integer("estimatedMinutes").notNull(),
  contentVersion: integer("contentVersion").default(1).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("course_level_code_unique").on(table.code)]);

export const courseModules = pgTable("courseModules", {
  id: serial("id").primaryKey(),
  levelId: integer("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
  moduleNumber: integer("moduleNumber").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
  overview: text("overview").notNull(),
  overviewArabic: text("overviewArabic").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_module_level_number_unique").on(table.levelId, table.moduleNumber),
  index("course_module_level_index").on(table.levelId),
]);

export const courseTopics = pgTable("courseTopics", {
  id: serial("id").primaryKey(),
  moduleId: integer("moduleId").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  topicNumber: integer("topicNumber").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
  description: text("description").notNull(),
  descriptionArabic: text("descriptionArabic").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_topic_module_number_unique").on(table.moduleId, table.topicNumber),
  index("course_topic_module_index").on(table.moduleId),
]);

export const courseLessons = pgTable("courseLessons", {
  id: serial("id").primaryKey(),
  levelId: integer("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
  moduleId: integer("moduleId").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  topicId: integer("topicId").references(() => courseTopics.id, { onDelete: "set null" }),
  lessonNumber: integer("lessonNumber").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
  learningPlan: jsonb("learningPlan").$type<Record<string, unknown>>(),
  lexicalNetworks: jsonb("lexicalNetworks").$type<Array<Record<string, unknown>>>(),
  practiceBrief: jsonb("practiceBrief").$type<Record<string, unknown>>(),
  contentVersion: integer("contentVersion").default(1).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("course_lesson_level_number_unique").on(table.levelId, table.lessonNumber),
  index("course_lesson_module_index").on(table.moduleId),
  index("course_lesson_topic_index").on(table.topicId),
]);

export const lessonVocabulary = pgTable("lessonVocabulary", {
  id: serial("id").primaryKey(),
  lessonId: integer("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
  itemKey: varchar("itemKey", { length: 128 }).notNull(),
  position: integer("position").notNull(),
  word: varchar("word", { length: 160 }).notNull(),
  arabic: varchar("arabic", { length: 320 }).notNull(),
  ipa: varchar("ipa", { length: 160 }).notNull(),
  phoneticRespelling: varchar("phoneticRespelling", { length: 160 }).notNull(),
  partOfSpeech: varchar("partOfSpeech", { length: 96 }).notNull(),
  definition: text("definition").notNull(),
  exampleEN: text("exampleEN").notNull(),
  exampleAR: text("exampleAR").notNull(),
}, (table) => [
  uniqueIndex("lesson_vocabulary_item_key_unique").on(table.itemKey),
  uniqueIndex("lesson_vocabulary_position_unique").on(table.lessonId, table.position),
  index("lesson_vocabulary_lesson_index").on(table.lessonId),
]);

export const lessonGrammar = pgTable("lessonGrammar", {
  id: serial("id").primaryKey(),
  lessonId: integer("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
  itemKey: varchar("itemKey", { length: 128 }).notNull(),
  topic: varchar("topic", { length: 200 }).notNull(),
  arabicName: varchar("arabicName", { length: 200 }).notNull(),
  grammarData: jsonb("grammarData").$type<Record<string, unknown>>().notNull(),
}, (table) => [
  uniqueIndex("lesson_grammar_item_key_unique").on(table.itemKey),
  uniqueIndex("lesson_grammar_lesson_unique").on(table.lessonId),
]);

export const lessonReadings = pgTable("lessonReadings", {
  id: serial("id").primaryKey(),
  lessonId: integer("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  titleArabic: varchar("titleArabic", { length: 200 }).notNull(),
  passage: text("passage").notNull(),
  questions: jsonb("questions").$type<Array<Record<string, unknown>>>().notNull(),
  contentVersion: integer("contentVersion").default(1).notNull(),
}, (table) => [index("lesson_reading_lesson_index").on(table.lessonId)]);

export const lessonWritingTasks = pgTable("lessonWritingTasks", {
  id: serial("id").primaryKey(),
  lessonId: integer("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  instructionsEnglish: text("instructionsEnglish").notNull(),
  instructionsArabic: text("instructionsArabic").notNull(),
  minimumWords: integer("minimumWords").notNull(),
  successCriteria: jsonb("successCriteria").$type<string[]>().notNull(),
  contentVersion: integer("contentVersion").default(1).notNull(),
}, (table) => [index("lesson_writing_task_lesson_index").on(table.lessonId)]);

export const assessmentQuestionBank = pgTable("assessmentQuestionBank", {
  id: serial("id").primaryKey(),
  questionKey: varchar("questionKey", { length: 160 }).notNull(),
  levelId: integer("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
  moduleId: integer("moduleId").references(() => courseModules.id, { onDelete: "cascade" }),
  lessonId: integer("lessonId").references(() => courseLessons.id, { onDelete: "cascade" }),
  assessmentType: assessmentType("assessmentType").notNull(),
  objectiveKey: varchar("objectiveKey", { length: 160 }).notNull(),
  itemType: varchar("itemType", { length: 64 }).notNull(),
  difficulty: integer("difficulty").default(1).notNull(),
  questionData: jsonb("questionData").$type<Record<string, unknown>>().notNull(),
  reviewItemKey: varchar("reviewItemKey", { length: 128 }).notNull(),
  contentVersion: integer("contentVersion").default(1).notNull(),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("assessment_question_key_unique").on(table.questionKey),
  index("assessment_question_selection_index").on(table.levelId, table.assessmentType, table.lessonId, table.moduleId),
]);

export const assessmentInstances = pgTable("assessmentInstances", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber"),
  moduleNumber: integer("moduleNumber"),
  assessmentType: assessmentType("assessmentType").notNull(),
  seed: varchar("seed", { length: 128 }).notNull(),
  contentVersion: integer("contentVersion").default(1).notNull(),
  status: assessmentInstanceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  submittedAt: timestamp("submittedAt", { withTimezone: true }),
}, (table) => [index("assessment_instance_user_scope_index").on(table.userId, table.level, table.assessmentType, table.lessonNumber, table.moduleNumber)]);

export const assessmentInstanceItems = pgTable("assessmentInstanceItems", {
  id: serial("id").primaryKey(),
  instanceId: integer("instanceId").notNull().references(() => assessmentInstances.id, { onDelete: "cascade" }),
  questionBankId: integer("questionBankId").references(() => assessmentQuestionBank.id, { onDelete: "set null" }),
  position: integer("position").notNull(),
  questionKey: varchar("questionKey", { length: 160 }).notNull(),
  questionSnapshot: jsonb("questionSnapshot").$type<Record<string, unknown>>().notNull(),
  answerSnapshot: varchar("answerSnapshot", { length: 500 }).notNull(),
  reviewItemKey: varchar("reviewItemKey", { length: 128 }).notNull(),
}, (table) => [
  uniqueIndex("assessment_instance_item_position_unique").on(table.instanceId, table.position),
  index("assessment_instance_item_instance_index").on(table.instanceId),
]);

export const quizAttempts = pgTable("quizAttempts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber").notNull(),
  assessmentType: assessmentType("assessmentType").notNull(),
  assessmentInstanceId: integer("assessmentInstanceId").references(() => assessmentInstances.id, { onDelete: "set null" }),
  score: integer("score").notNull(),
  passed: integer("passed").default(0).notNull(),
  answers: jsonb("answers").$type<Record<string, string | string[]>>(),
  missedItemKeys: jsonb("missedItemKeys").$type<string[]>(),
  submittedAt: timestamp("submittedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("quiz_attempt_user_lesson_index").on(table.userId, table.level, table.lessonNumber),
  index("quiz_attempt_instance_index").on(table.assessmentInstanceId),
]);

export const writingSubmissions = pgTable("writingSubmissions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber").notNull(),
  submissionKind: submissionKind("submissionKind").default("checkpoint").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  overallScore: integer("overallScore"),
  feedback: jsonb("feedback").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("writing_submission_user_lesson_index").on(table.userId, table.level, table.lessonNumber)]);

export const readingAttempts = pgTable("readingAttempts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 4 }).notNull(),
  lessonNumber: integer("lessonNumber").notNull(),
  passage: text("passage").notNull(),
  questions: jsonb("questions").$type<Array<{ question: string; answer: string }>>(),
  answers: jsonb("answers").$type<string[]>(),
  score: integer("score"),
  feedback: jsonb("feedback").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("reading_attempt_user_lesson_index").on(table.userId, table.level, table.lessonNumber)]);

/** Retained solely for historical audit compatibility; no paid AI requests are issued. */
export const aiUsageEvents = pgTable("aiUsageEvents", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: aiAction("action").notNull(),
  requestDate: varchar("requestDate", { length: 10 }).notNull(),
  inputCharacters: integer("inputCharacters").default(0).notNull(),
  outputCharacters: integer("outputCharacters").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("ai_usage_user_date_index").on(table.userId, table.requestDate)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LearningProfile = typeof learningProfiles.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
