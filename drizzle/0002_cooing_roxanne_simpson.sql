CREATE TABLE `assessmentInstanceItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instanceId` int NOT NULL,
	`questionBankId` int,
	`position` int NOT NULL,
	`questionKey` varchar(160) NOT NULL,
	`questionSnapshot` json NOT NULL,
	`answerSnapshot` varchar(500) NOT NULL,
	`reviewItemKey` varchar(128) NOT NULL,
	CONSTRAINT `assessmentInstanceItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_instance_item_position_unique` UNIQUE(`instanceId`,`position`)
);
--> statement-breakpoint
CREATE TABLE `assessmentInstances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int,
	`moduleNumber` int,
	`assessmentType` enum('lesson_quiz','module_test') NOT NULL,
	`seed` varchar(128) NOT NULL,
	`contentVersion` int NOT NULL DEFAULT 1,
	`status` enum('active','submitted','expired') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`submittedAt` timestamp,
	CONSTRAINT `assessmentInstances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessmentQuestionBank` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionKey` varchar(160) NOT NULL,
	`levelId` int NOT NULL,
	`moduleId` int,
	`lessonId` int,
	`assessmentType` enum('lesson_quiz','module_test') NOT NULL,
	`objectiveKey` varchar(160) NOT NULL,
	`itemType` varchar(64) NOT NULL,
	`difficulty` int NOT NULL DEFAULT 1,
	`questionData` json NOT NULL,
	`reviewItemKey` varchar(128) NOT NULL,
	`contentVersion` int NOT NULL DEFAULT 1,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessmentQuestionBank_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_question_key_unique` UNIQUE(`questionKey`)
);
--> statement-breakpoint
CREATE TABLE `courseLessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`moduleId` int NOT NULL,
	`topicId` int,
	`lessonNumber` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`titleArabic` varchar(160) NOT NULL,
	`learningPlan` json,
	`lexicalNetworks` json,
	`practiceBrief` json,
	`contentVersion` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseLessons_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_lesson_level_number_unique` UNIQUE(`levelId`,`lessonNumber`)
);
--> statement-breakpoint
CREATE TABLE `courseLevels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(4) NOT NULL,
	`title` varchar(160) NOT NULL,
	`titleArabic` varchar(160) NOT NULL,
	`totalLessons` int NOT NULL,
	`lessonsPerModule` int NOT NULL,
	`estimatedMinutes` int NOT NULL,
	`contentVersion` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseLevels_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_level_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `courseModules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`moduleNumber` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`titleArabic` varchar(160) NOT NULL,
	`overview` text NOT NULL,
	`overviewArabic` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseModules_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_module_level_number_unique` UNIQUE(`levelId`,`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `courseTopics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`topicNumber` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`titleArabic` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`descriptionArabic` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseTopics_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_topic_module_number_unique` UNIQUE(`moduleId`,`topicNumber`)
);
--> statement-breakpoint
CREATE TABLE `lessonGrammar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`itemKey` varchar(128) NOT NULL,
	`topic` varchar(200) NOT NULL,
	`arabicName` varchar(200) NOT NULL,
	`grammarData` json NOT NULL,
	CONSTRAINT `lessonGrammar_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_grammar_item_key_unique` UNIQUE(`itemKey`),
	CONSTRAINT `lesson_grammar_lesson_unique` UNIQUE(`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `lessonReadings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`titleArabic` varchar(200) NOT NULL,
	`passage` text NOT NULL,
	`questions` json NOT NULL,
	`contentVersion` int NOT NULL DEFAULT 1,
	CONSTRAINT `lessonReadings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessonVocabulary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`itemKey` varchar(128) NOT NULL,
	`position` int NOT NULL,
	`word` varchar(160) NOT NULL,
	`arabic` varchar(320) NOT NULL,
	`ipa` varchar(160) NOT NULL,
	`phoneticRespelling` varchar(160) NOT NULL,
	`partOfSpeech` varchar(96) NOT NULL,
	`definition` text NOT NULL,
	`exampleEN` text NOT NULL,
	`exampleAR` text NOT NULL,
	CONSTRAINT `lessonVocabulary_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_vocabulary_item_key_unique` UNIQUE(`itemKey`),
	CONSTRAINT `lesson_vocabulary_position_unique` UNIQUE(`lessonId`,`position`)
);
--> statement-breakpoint
CREATE TABLE `lessonWritingTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`instructionsEnglish` text NOT NULL,
	`instructionsArabic` text NOT NULL,
	`minimumWords` int NOT NULL,
	`successCriteria` json NOT NULL,
	`contentVersion` int NOT NULL DEFAULT 1,
	CONSTRAINT `lessonWritingTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD `assessmentInstanceId` int;--> statement-breakpoint
ALTER TABLE `assessmentInstanceItems` ADD CONSTRAINT `aii_instance_fk` FOREIGN KEY (`instanceId`) REFERENCES `assessmentInstances`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessmentInstanceItems` ADD CONSTRAINT `aii_question_fk` FOREIGN KEY (`questionBankId`) REFERENCES `assessmentQuestionBank`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessmentInstances` ADD CONSTRAINT `ai_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessmentQuestionBank` ADD CONSTRAINT `aqb_level_fk` FOREIGN KEY (`levelId`) REFERENCES `courseLevels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessmentQuestionBank` ADD CONSTRAINT `aqb_module_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessmentQuestionBank` ADD CONSTRAINT `aqb_lesson_fk` FOREIGN KEY (`lessonId`) REFERENCES `courseLessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseLessons` ADD CONSTRAINT `cl_level_fk` FOREIGN KEY (`levelId`) REFERENCES `courseLevels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseLessons` ADD CONSTRAINT `cl_module_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseLessons` ADD CONSTRAINT `cl_topic_fk` FOREIGN KEY (`topicId`) REFERENCES `courseTopics`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseModules` ADD CONSTRAINT `cm_level_fk` FOREIGN KEY (`levelId`) REFERENCES `courseLevels`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseTopics` ADD CONSTRAINT `ct_module_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonGrammar` ADD CONSTRAINT `lg_lesson_fk` FOREIGN KEY (`lessonId`) REFERENCES `courseLessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonReadings` ADD CONSTRAINT `lr_lesson_fk` FOREIGN KEY (`lessonId`) REFERENCES `courseLessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonVocabulary` ADD CONSTRAINT `lv_lesson_fk` FOREIGN KEY (`lessonId`) REFERENCES `courseLessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonWritingTasks` ADD CONSTRAINT `lwt_lesson_fk` FOREIGN KEY (`lessonId`) REFERENCES `courseLessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `assessment_instance_item_instance_index` ON `assessmentInstanceItems` (`instanceId`);--> statement-breakpoint
CREATE INDEX `assessment_instance_user_scope_index` ON `assessmentInstances` (`userId`,`level`,`assessmentType`,`lessonNumber`,`moduleNumber`);--> statement-breakpoint
CREATE INDEX `assessment_question_selection_index` ON `assessmentQuestionBank` (`levelId`,`assessmentType`,`lessonId`,`moduleId`);--> statement-breakpoint
CREATE INDEX `course_lesson_module_index` ON `courseLessons` (`moduleId`);--> statement-breakpoint
CREATE INDEX `course_lesson_topic_index` ON `courseLessons` (`topicId`);--> statement-breakpoint
CREATE INDEX `course_module_level_index` ON `courseModules` (`levelId`);--> statement-breakpoint
CREATE INDEX `course_topic_module_index` ON `courseTopics` (`moduleId`);--> statement-breakpoint
CREATE INDEX `lesson_reading_lesson_index` ON `lessonReadings` (`lessonId`);--> statement-breakpoint
CREATE INDEX `lesson_vocabulary_lesson_index` ON `lessonVocabulary` (`lessonId`);--> statement-breakpoint
CREATE INDEX `lesson_writing_task_lesson_index` ON `lessonWritingTasks` (`lessonId`);--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `qa_instance_fk` FOREIGN KEY (`assessmentInstanceId`) REFERENCES `assessmentInstances`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `quiz_attempt_instance_index` ON `quizAttempts` (`assessmentInstanceId`);
