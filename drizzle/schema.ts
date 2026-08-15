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

export const quizAttempts = mysqlTable(
  "quizAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 4 }).notNull(),
    lessonNumber: int("lessonNumber").notNull(),
    assessmentType: mysqlEnum("assessmentType", ["lesson_quiz", "module_test", "warm_up"]).notNull(),
    score: int("score").notNull(),
    passed: int("passed").default(0).notNull(),
    answers: json("answers").$type<Record<string, string | string[]>>(),
    missedItemKeys: json("missedItemKeys").$type<string[]>(),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  },
  (table) => [index("quiz_attempt_user_lesson_index").on(table.userId, table.level, table.lessonNumber)],
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
