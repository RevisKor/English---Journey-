import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/** Core identity table, maintained by the Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const learningProfiles = mysqlTable(
  "learningProfiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    preferredAccent: mysqlEnum("preferredAccent", ["british", "american"]).default("british").notNull(),
    interfaceLanguage: mysqlEnum("interfaceLanguage", ["bilingual", "english", "arabic"]).default("bilingual").notNull(),
    currentLevel: varchar("currentLevel", { length: 4 }).default("A1").notNull(),
    totalXp: int("totalXp").default(0).notNull(),
    currentStreak: int("currentStreak").default(0).notNull(),
    longestStreak: int("longestStreak").default(0).notNull(),
    lastActivityDate: varchar("lastActivityDate", { length: 10 }),
    lastActivityAt: timestamp("lastActivityAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("learning_profile_user_unique").on(table.userId)],
);

export const lessonProgress = mysqlTable(
  "lessonProgress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    status: mysqlEnum("status", ["locked", "available", "in_progress", "completed"]).default("locked").notNull(),
    vocabularyCompletedAt: timestamp("vocabularyCompletedAt"),
    grammarCompletedAt: timestamp("grammarCompletedAt"),
    pronunciationCompletedAt: timestamp("pronunciationCompletedAt"),
    readingCompletedAt: timestamp("readingCompletedAt"),
    quizBestScore: int("quizBestScore").default(0).notNull(),
    quizPassedAt: timestamp("quizPassedAt"),
    completedAt: timestamp("completedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("lesson_progress_user_lesson_unique").on(table.userId, table.level, table.lessonNumber),
    index("lesson_progress_user_level_index").on(table.userId, table.level),
  ],
);

export const moduleProgress = mysqlTable(
  "moduleProgress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    moduleNumber: int("moduleNumber").notNull(),
    status: mysqlEnum("status", ["locked", "available", "in_progress", "completed"]).default("locked").notNull(),
    testBestScore: int("testBestScore").default(0).notNull(),
    testPassedAt: timestamp("testPassedAt"),
    completedAt: timestamp("completedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("module_progress_user_module_unique").on(table.userId, table.level, table.moduleNumber),
    index("module_progress_user_level_index").on(table.userId, table.level),
  ],
);

export const reviewQueue = mysqlTable(
  "reviewQueue",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    itemType: mysqlEnum("itemType", ["vocabulary", "grammar"]).notNull(),
    itemKey: varchar("itemKey", { length: 128 }).notNull(),
    repetition: int("repetition").default(0).notNull(),
    intervalDays: int("intervalDays").default(1).notNull(),
    easeFactor: int("easeFactor").default(250).notNull(),
    dueAt: timestamp("dueAt").defaultNow().notNull(),
    lastReviewedAt: timestamp("lastReviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("review_queue_user_item_unique").on(table.userId, table.level, table.itemType, table.itemKey),
    index("review_queue_due_index").on(table.userId, table.dueAt),
  ],
);

/** Versioned course structure, shared by all learners. */
export const courseLevels = mysqlTable(
  "courseLevels",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 4 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
    totalLessons: int("totalLessons").notNull(),
    lessonsPerModule: int("lessonsPerModule").notNull(),
    estimatedMinutes: int("estimatedMinutes").notNull(),
    contentVersion: int("contentVersion").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("course_level_code_unique").on(table.code)],
);

export const courseModules = mysqlTable(
  "courseModules",
  {
    id: int("id").autoincrement().primaryKey(),
    levelId: int("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
    moduleNumber: int("moduleNumber").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
    overview: text("overview").notNull(),
    overviewArabic: text("overviewArabic").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("course_module_level_number_unique").on(table.levelId, table.moduleNumber),
    index("course_module_level_index").on(table.levelId),
  ],
);

export const courseTopics = mysqlTable(
  "courseTopics",
  {
    id: int("id").autoincrement().primaryKey(),
    moduleId: int("moduleId").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
    topicNumber: int("topicNumber").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
    description: text("description").notNull(),
    descriptionArabic: text("descriptionArabic").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("course_topic_module_number_unique").on(table.moduleId, table.topicNumber),
    index("course_topic_module_index").on(table.moduleId),
  ],
);

export const courseLessons = mysqlTable(
  "courseLessons",
  {
    id: int("id").autoincrement().primaryKey(),
    levelId: int("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
    moduleId: int("moduleId").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
    topicId: int("topicId").references(() => courseTopics.id, { onDelete: "set null" }),
    lessonNumber: int("lessonNumber").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    titleArabic: varchar("titleArabic", { length: 160 }).notNull(),
    learningPlan: json("learningPlan").$type<Record<string, unknown>>(),
    lexicalNetworks: json("lexicalNetworks").$type<Array<Record<string, unknown>>>(),
    practiceBrief: json("practiceBrief").$type<Record<string, unknown>>(),
    contentVersion: int("contentVersion").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("course_lesson_level_number_unique").on(table.levelId, table.lessonNumber),
    index("course_lesson_module_index").on(table.moduleId),
    index("course_lesson_topic_index").on(table.topicId),
  ],
);

export const lessonVocabulary = mysqlTable(
  "lessonVocabulary",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
    itemKey: varchar("itemKey", { length: 128 }).notNull(),
    position: int("position").notNull(),
    word: varchar("word", { length: 160 }).notNull(),
    arabic: varchar("arabic", { length: 320 }).notNull(),
    ipa: varchar("ipa", { length: 160 }).notNull(),
    phoneticRespelling: varchar("phoneticRespelling", { length: 160 }).notNull(),
    partOfSpeech: varchar("partOfSpeech", { length: 96 }).notNull(),
    definition: text("definition").notNull(),
    exampleEN: text("exampleEN").notNull(),
    exampleAR: text("exampleAR").notNull(),
  },
  (table) => [
    uniqueIndex("lesson_vocabulary_item_key_unique").on(table.itemKey),
    uniqueIndex("lesson_vocabulary_position_unique").on(table.lessonId, table.position),
    index("lesson_vocabulary_lesson_index").on(table.lessonId),
  ],
);

export const lessonGrammar = mysqlTable(
  "lessonGrammar",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
    itemKey: varchar("itemKey", { length: 128 }).notNull(),
    topic: varchar("topic", { length: 200 }).notNull(),
    arabicName: varchar("arabicName", { length: 200 }).notNull(),
    grammarData: json("grammarData").$type<Record<string, unknown>>().notNull(),
  },
  (table) => [
    uniqueIndex("lesson_grammar_item_key_unique").on(table.itemKey),
    uniqueIndex("lesson_grammar_lesson_unique").on(table.lessonId),
  ],
);

export const lessonReadings = mysqlTable(
  "lessonReadings",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    titleArabic: varchar("titleArabic", { length: 200 }).notNull(),
    passage: text("passage").notNull(),
    questions: json("questions").$type<Array<Record<string, unknown>>>().notNull(),
    contentVersion: int("contentVersion").default(1).notNull(),
  },
  (table) => [index("lesson_reading_lesson_index").on(table.lessonId)],
);

export const lessonWritingTasks = mysqlTable(
  "lessonWritingTasks",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    instructionsEnglish: text("instructionsEnglish").notNull(),
    instructionsArabic: text("instructionsArabic").notNull(),
    minimumWords: int("minimumWords").notNull(),
    successCriteria: json("successCriteria").$type<string[]>().notNull(),
    contentVersion: int("contentVersion").default(1).notNull(),
  },
  (table) => [index("lesson_writing_task_lesson_index").on(table.lessonId)],
);

export const assessmentQuestionBank = mysqlTable(
  "assessmentQuestionBank",
  {
    id: int("id").autoincrement().primaryKey(),
    questionKey: varchar("questionKey", { length: 160 }).notNull(),
    levelId: int("levelId").notNull().references(() => courseLevels.id, { onDelete: "cascade" }),
    moduleId: int("moduleId").references(() => courseModules.id, { onDelete: "cascade" }),
    lessonId: int("lessonId").references(() => courseLessons.id, { onDelete: "cascade" }),
    assessmentType: mysqlEnum("assessmentType", ["lesson_quiz", "milestone_quiz", "module_test"]).notNull(),
    objectiveKey: varchar("objectiveKey", { length: 160 }).notNull(),
    itemType: varchar("itemType", { length: 64 }).notNull(),
    difficulty: int("difficulty").default(1).notNull(),
    questionData: json("questionData").$type<Record<string, unknown>>().notNull(),
    reviewItemKey: varchar("reviewItemKey", { length: 128 }).notNull(),
    contentVersion: int("contentVersion").default(1).notNull(),
    active: int("active").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("assessment_question_key_unique").on(table.questionKey),
    index("assessment_question_selection_index").on(table.levelId, table.assessmentType, table.lessonId, table.moduleId),
  ],
);

export const assessmentInstances = mysqlTable(
  "assessmentInstances",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber"),
    moduleNumber: int("moduleNumber"),
    assessmentType: mysqlEnum("assessmentType", ["lesson_quiz", "milestone_quiz", "module_test"]).notNull(),
    seed: varchar("seed", { length: 128 }).notNull(),
    contentVersion: int("contentVersion").default(1).notNull(),
    status: mysqlEnum("status", ["active", "submitted", "expired"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    submittedAt: timestamp("submittedAt"),
  },
  (table) => [
    index("assessment_instance_user_scope_index").on(table.userId, table.level, table.assessmentType, table.lessonNumber, table.moduleNumber),
  ],
);

export const assessmentInstanceItems = mysqlTable(
  "assessmentInstanceItems",
  {
    id: int("id").autoincrement().primaryKey(),
    instanceId: int("instanceId").notNull().references(() => assessmentInstances.id, { onDelete: "cascade" }),
    questionBankId: int("questionBankId").references(() => assessmentQuestionBank.id, { onDelete: "set null" }),
    position: int("position").notNull(),
    questionKey: varchar("questionKey", { length: 160 }).notNull(),
    questionSnapshot: json("questionSnapshot").$type<Record<string, unknown>>().notNull(),
    answerSnapshot: varchar("answerSnapshot", { length: 500 }).notNull(),
    reviewItemKey: varchar("reviewItemKey", { length: 128 }).notNull(),
  },
  (table) => [
    uniqueIndex("assessment_instance_item_position_unique").on(table.instanceId, table.position),
    index("assessment_instance_item_instance_index").on(table.instanceId),
  ],
);

export const quizAttempts = mysqlTable(
  "quizAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    assessmentType: mysqlEnum("assessmentType", ["lesson_quiz", "milestone_quiz", "module_test", "warm_up"]).notNull(),
    assessmentInstanceId: int("assessmentInstanceId").references(() => assessmentInstances.id, { onDelete: "set null" }),
    score: int("score").notNull(),
    passed: int("passed").default(0).notNull(),
    answers: json("answers").$type<Record<string, string | string[]>>(),
    missedItemKeys: json("missedItemKeys").$type<string[]>(),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  },
  (table) => [
    index("quiz_attempt_user_lesson_index").on(table.userId, table.level, table.lessonNumber),
    index("quiz_attempt_instance_index").on(table.assessmentInstanceId),
  ],
);

export const writingSubmissions = mysqlTable(
  "writingSubmissions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    submissionKind: mysqlEnum("submissionKind", ["checkpoint", "module_test"]).default("checkpoint").notNull(),
    prompt: text("prompt").notNull(),
    response: text("response").notNull(),
    overallScore: int("overallScore"),
    feedback: json("feedback").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("writing_submission_user_lesson_index").on(table.userId, table.level, table.lessonNumber)],
);

export const readingAttempts = mysqlTable(
  "readingAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    passage: text("passage").notNull(),
    questions: json("questions").$type<Array<{ question: string; answer: string }>>(),
    answers: json("answers").$type<string[]>(),
    score: int("score"),
    feedback: json("feedback").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("reading_attempt_user_lesson_index").on(table.userId, table.level, table.lessonNumber)],
);

/** Per-user AI request records make a six-person pilot safe to cap and audit. */
export const aiUsageEvents = mysqlTable(
  "aiUsageEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    action: mysqlEnum("action", ["word_tutor", "grammar_check", "reading", "reading_grade", "writing_prompt", "writing_grade"]).notNull(),
    requestDate: varchar("requestDate", { length: 10 }).notNull(),
    inputCharacters: int("inputCharacters").default(0).notNull(),
    outputCharacters: int("outputCharacters").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("ai_usage_user_date_index").on(table.userId, table.requestDate)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LearningProfile = typeof learningProfiles.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
