CREATE TYPE "public"."preferred_accent" AS ENUM('british', 'american');--> statement-breakpoint
CREATE TYPE "public"."ai_action" AS ENUM('word_tutor', 'grammar_check', 'reading', 'reading_grade', 'writing_prompt', 'writing_grade');--> statement-breakpoint
CREATE TYPE "public"."assessment_instance_status" AS ENUM('active', 'submitted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."assessment_type" AS ENUM('lesson_quiz', 'milestone_quiz', 'module_test', 'warm_up');--> statement-breakpoint
CREATE TYPE "public"."interface_language" AS ENUM('bilingual', 'english', 'arabic');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('locked', 'available', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."review_item_type" AS ENUM('vocabulary', 'grammar');--> statement-breakpoint
CREATE TYPE "public"."submission_kind" AS ENUM('checkpoint', 'module_test');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "aiUsageEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"action" "ai_action" NOT NULL,
	"requestDate" varchar(10) NOT NULL,
	"inputCharacters" integer DEFAULT 0 NOT NULL,
	"outputCharacters" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessmentInstanceItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"instanceId" integer NOT NULL,
	"questionBankId" integer,
	"position" integer NOT NULL,
	"questionKey" varchar(160) NOT NULL,
	"questionSnapshot" jsonb NOT NULL,
	"answerSnapshot" varchar(500) NOT NULL,
	"reviewItemKey" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessmentInstances" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer,
	"moduleNumber" integer,
	"assessmentType" "assessment_type" NOT NULL,
	"seed" varchar(128) NOT NULL,
	"contentVersion" integer DEFAULT 1 NOT NULL,
	"status" "assessment_instance_status" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"submittedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "assessmentQuestionBank" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionKey" varchar(160) NOT NULL,
	"levelId" integer NOT NULL,
	"moduleId" integer,
	"lessonId" integer,
	"assessmentType" "assessment_type" NOT NULL,
	"objectiveKey" varchar(160) NOT NULL,
	"itemType" varchar(64) NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"questionData" jsonb NOT NULL,
	"reviewItemKey" varchar(128) NOT NULL,
	"contentVersion" integer DEFAULT 1 NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courseLessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"levelId" integer NOT NULL,
	"moduleId" integer NOT NULL,
	"topicId" integer,
	"lessonNumber" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"titleArabic" varchar(160) NOT NULL,
	"learningPlan" jsonb,
	"lexicalNetworks" jsonb,
	"practiceBrief" jsonb,
	"contentVersion" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courseLevels" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(4) NOT NULL,
	"title" varchar(160) NOT NULL,
	"titleArabic" varchar(160) NOT NULL,
	"totalLessons" integer NOT NULL,
	"lessonsPerModule" integer NOT NULL,
	"estimatedMinutes" integer NOT NULL,
	"contentVersion" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courseModules" (
	"id" serial PRIMARY KEY NOT NULL,
	"levelId" integer NOT NULL,
	"moduleNumber" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"titleArabic" varchar(160) NOT NULL,
	"overview" text NOT NULL,
	"overviewArabic" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courseTopics" (
	"id" serial PRIMARY KEY NOT NULL,
	"moduleId" integer NOT NULL,
	"topicNumber" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"titleArabic" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"descriptionArabic" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learningProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"preferredAccent" "preferred_accent" DEFAULT 'british' NOT NULL,
	"interfaceLanguage" "interface_language" DEFAULT 'bilingual' NOT NULL,
	"currentLevel" varchar(4) DEFAULT 'A1' NOT NULL,
	"totalXp" integer DEFAULT 0 NOT NULL,
	"currentStreak" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"lastActivityDate" varchar(10),
	"lastActivityAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessonGrammar" (
	"id" serial PRIMARY KEY NOT NULL,
	"lessonId" integer NOT NULL,
	"itemKey" varchar(128) NOT NULL,
	"topic" varchar(200) NOT NULL,
	"arabicName" varchar(200) NOT NULL,
	"grammarData" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessonProgress" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer NOT NULL,
	"status" "progress_status" DEFAULT 'locked' NOT NULL,
	"vocabularyCompletedAt" timestamp with time zone,
	"grammarCompletedAt" timestamp with time zone,
	"pronunciationCompletedAt" timestamp with time zone,
	"readingCompletedAt" timestamp with time zone,
	"quizBestScore" integer DEFAULT 0 NOT NULL,
	"quizPassedAt" timestamp with time zone,
	"completedAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessonReadings" (
	"id" serial PRIMARY KEY NOT NULL,
	"lessonId" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"titleArabic" varchar(200) NOT NULL,
	"passage" text NOT NULL,
	"questions" jsonb NOT NULL,
	"contentVersion" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessonVocabulary" (
	"id" serial PRIMARY KEY NOT NULL,
	"lessonId" integer NOT NULL,
	"itemKey" varchar(128) NOT NULL,
	"position" integer NOT NULL,
	"word" varchar(160) NOT NULL,
	"arabic" varchar(320) NOT NULL,
	"ipa" varchar(160) NOT NULL,
	"phoneticRespelling" varchar(160) NOT NULL,
	"partOfSpeech" varchar(96) NOT NULL,
	"definition" text NOT NULL,
	"exampleEN" text NOT NULL,
	"exampleAR" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessonWritingTasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"lessonId" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"instructionsEnglish" text NOT NULL,
	"instructionsArabic" text NOT NULL,
	"minimumWords" integer NOT NULL,
	"successCriteria" jsonb NOT NULL,
	"contentVersion" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moduleProgress" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"moduleNumber" integer NOT NULL,
	"status" "progress_status" DEFAULT 'locked' NOT NULL,
	"testBestScore" integer DEFAULT 0 NOT NULL,
	"testPassedAt" timestamp with time zone,
	"completedAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizAttempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer NOT NULL,
	"assessmentType" "assessment_type" NOT NULL,
	"assessmentInstanceId" integer,
	"score" integer NOT NULL,
	"passed" integer DEFAULT 0 NOT NULL,
	"answers" jsonb,
	"missedItemKeys" jsonb,
	"submittedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readingAttempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer NOT NULL,
	"passage" text NOT NULL,
	"questions" jsonb,
	"answers" jsonb,
	"score" integer,
	"feedback" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewQueue" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer NOT NULL,
	"itemType" "review_item_type" NOT NULL,
	"itemKey" varchar(128) NOT NULL,
	"repetition" integer DEFAULT 0 NOT NULL,
	"intervalDays" integer DEFAULT 1 NOT NULL,
	"easeFactor" integer DEFAULT 250 NOT NULL,
	"dueAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastReviewedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(128) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "writingSubmissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"level" varchar(4) NOT NULL,
	"lessonNumber" integer NOT NULL,
	"submissionKind" "submission_kind" DEFAULT 'checkpoint' NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"overallScore" integer,
	"feedback" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aiUsageEvents" ADD CONSTRAINT "aiUsageEvents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentInstanceItems" ADD CONSTRAINT "assessmentInstanceItems_instanceId_assessmentInstances_id_fk" FOREIGN KEY ("instanceId") REFERENCES "public"."assessmentInstances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentInstanceItems" ADD CONSTRAINT "assessmentInstanceItems_questionBankId_assessmentQuestionBank_id_fk" FOREIGN KEY ("questionBankId") REFERENCES "public"."assessmentQuestionBank"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentInstances" ADD CONSTRAINT "assessmentInstances_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentQuestionBank" ADD CONSTRAINT "assessmentQuestionBank_levelId_courseLevels_id_fk" FOREIGN KEY ("levelId") REFERENCES "public"."courseLevels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentQuestionBank" ADD CONSTRAINT "assessmentQuestionBank_moduleId_courseModules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."courseModules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessmentQuestionBank" ADD CONSTRAINT "assessmentQuestionBank_lessonId_courseLessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."courseLessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseLessons" ADD CONSTRAINT "courseLessons_levelId_courseLevels_id_fk" FOREIGN KEY ("levelId") REFERENCES "public"."courseLevels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseLessons" ADD CONSTRAINT "courseLessons_moduleId_courseModules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."courseModules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseLessons" ADD CONSTRAINT "courseLessons_topicId_courseTopics_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."courseTopics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseModules" ADD CONSTRAINT "courseModules_levelId_courseLevels_id_fk" FOREIGN KEY ("levelId") REFERENCES "public"."courseLevels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseTopics" ADD CONSTRAINT "courseTopics_moduleId_courseModules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."courseModules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learningProfiles" ADD CONSTRAINT "learningProfiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessonGrammar" ADD CONSTRAINT "lessonGrammar_lessonId_courseLessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."courseLessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessonProgress" ADD CONSTRAINT "lessonProgress_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessonReadings" ADD CONSTRAINT "lessonReadings_lessonId_courseLessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."courseLessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessonVocabulary" ADD CONSTRAINT "lessonVocabulary_lessonId_courseLessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."courseLessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessonWritingTasks" ADD CONSTRAINT "lessonWritingTasks_lessonId_courseLessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."courseLessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleProgress" ADD CONSTRAINT "moduleProgress_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizAttempts" ADD CONSTRAINT "quizAttempts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizAttempts" ADD CONSTRAINT "quizAttempts_assessmentInstanceId_assessmentInstances_id_fk" FOREIGN KEY ("assessmentInstanceId") REFERENCES "public"."assessmentInstances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readingAttempts" ADD CONSTRAINT "readingAttempts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewQueue" ADD CONSTRAINT "reviewQueue_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writingSubmissions" ADD CONSTRAINT "writingSubmissions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_user_date_index" ON "aiUsageEvents" USING btree ("userId","requestDate");--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_instance_item_position_unique" ON "assessmentInstanceItems" USING btree ("instanceId","position");--> statement-breakpoint
CREATE INDEX "assessment_instance_item_instance_index" ON "assessmentInstanceItems" USING btree ("instanceId");--> statement-breakpoint
CREATE INDEX "assessment_instance_user_scope_index" ON "assessmentInstances" USING btree ("userId","level","assessmentType","lessonNumber","moduleNumber");--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_question_key_unique" ON "assessmentQuestionBank" USING btree ("questionKey");--> statement-breakpoint
CREATE INDEX "assessment_question_selection_index" ON "assessmentQuestionBank" USING btree ("levelId","assessmentType","lessonId","moduleId");--> statement-breakpoint
CREATE UNIQUE INDEX "course_lesson_level_number_unique" ON "courseLessons" USING btree ("levelId","lessonNumber");--> statement-breakpoint
CREATE INDEX "course_lesson_module_index" ON "courseLessons" USING btree ("moduleId");--> statement-breakpoint
CREATE INDEX "course_lesson_topic_index" ON "courseLessons" USING btree ("topicId");--> statement-breakpoint
CREATE UNIQUE INDEX "course_level_code_unique" ON "courseLevels" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "course_module_level_number_unique" ON "courseModules" USING btree ("levelId","moduleNumber");--> statement-breakpoint
CREATE INDEX "course_module_level_index" ON "courseModules" USING btree ("levelId");--> statement-breakpoint
CREATE UNIQUE INDEX "course_topic_module_number_unique" ON "courseTopics" USING btree ("moduleId","topicNumber");--> statement-breakpoint
CREATE INDEX "course_topic_module_index" ON "courseTopics" USING btree ("moduleId");--> statement-breakpoint
CREATE UNIQUE INDEX "learning_profile_user_unique" ON "learningProfiles" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_grammar_item_key_unique" ON "lessonGrammar" USING btree ("itemKey");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_grammar_lesson_unique" ON "lessonGrammar" USING btree ("lessonId");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_progress_user_lesson_unique" ON "lessonProgress" USING btree ("userId","level","lessonNumber");--> statement-breakpoint
CREATE INDEX "lesson_progress_user_level_index" ON "lessonProgress" USING btree ("userId","level");--> statement-breakpoint
CREATE INDEX "lesson_reading_lesson_index" ON "lessonReadings" USING btree ("lessonId");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_vocabulary_item_key_unique" ON "lessonVocabulary" USING btree ("itemKey");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_vocabulary_position_unique" ON "lessonVocabulary" USING btree ("lessonId","position");--> statement-breakpoint
CREATE INDEX "lesson_vocabulary_lesson_index" ON "lessonVocabulary" USING btree ("lessonId");--> statement-breakpoint
CREATE INDEX "lesson_writing_task_lesson_index" ON "lessonWritingTasks" USING btree ("lessonId");--> statement-breakpoint
CREATE UNIQUE INDEX "module_progress_user_module_unique" ON "moduleProgress" USING btree ("userId","level","moduleNumber");--> statement-breakpoint
CREATE INDEX "module_progress_user_level_index" ON "moduleProgress" USING btree ("userId","level");--> statement-breakpoint
CREATE INDEX "quiz_attempt_user_lesson_index" ON "quizAttempts" USING btree ("userId","level","lessonNumber");--> statement-breakpoint
CREATE INDEX "quiz_attempt_instance_index" ON "quizAttempts" USING btree ("assessmentInstanceId");--> statement-breakpoint
CREATE INDEX "reading_attempt_user_lesson_index" ON "readingAttempts" USING btree ("userId","level","lessonNumber");--> statement-breakpoint
CREATE UNIQUE INDEX "review_queue_user_item_unique" ON "reviewQueue" USING btree ("userId","level","itemType","itemKey");--> statement-breakpoint
CREATE INDEX "review_queue_due_index" ON "reviewQueue" USING btree ("userId","dueAt");--> statement-breakpoint
CREATE INDEX "writing_submission_user_lesson_index" ON "writingSubmissions" USING btree ("userId","level","lessonNumber");