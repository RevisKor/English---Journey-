CREATE TABLE `aiUsageEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` enum('word_tutor','grammar_check','reading','reading_grade','writing_prompt','writing_grade') NOT NULL,
	`requestDate` varchar(10) NOT NULL,
	`inputCharacters` int NOT NULL DEFAULT 0,
	`outputCharacters` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiUsageEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learningProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`preferredAccent` enum('british','american') NOT NULL DEFAULT 'british',
	`interfaceLanguage` enum('bilingual','english','arabic') NOT NULL DEFAULT 'bilingual',
	`currentLevel` varchar(4) NOT NULL DEFAULT 'A1',
	`totalXp` int NOT NULL DEFAULT 0,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActivityDate` varchar(10),
	`lastActivityAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learningProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `learning_profile_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `lessonProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int NOT NULL,
	`status` enum('locked','available','in_progress','completed') NOT NULL DEFAULT 'locked',
	`vocabularyCompletedAt` timestamp,
	`grammarCompletedAt` timestamp,
	`pronunciationCompletedAt` timestamp,
	`readingCompletedAt` timestamp,
	`quizBestScore` int NOT NULL DEFAULT 0,
	`quizPassedAt` timestamp,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessonProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_progress_user_lesson_unique` UNIQUE(`userId`,`level`,`lessonNumber`)
);
--> statement-breakpoint
CREATE TABLE `moduleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`moduleNumber` int NOT NULL,
	`status` enum('locked','available','in_progress','completed') NOT NULL DEFAULT 'locked',
	`testBestScore` int NOT NULL DEFAULT 0,
	`testPassedAt` timestamp,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moduleProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `module_progress_user_module_unique` UNIQUE(`userId`,`level`,`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int NOT NULL,
	`assessmentType` enum('lesson_quiz','module_test','warm_up') NOT NULL,
	`score` int NOT NULL,
	`passed` int NOT NULL DEFAULT 0,
	`answers` json,
	`missedItemKeys` json,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `readingAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int NOT NULL,
	`passage` text NOT NULL,
	`questions` json,
	`answers` json,
	`score` int,
	`feedback` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `readingAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviewQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int NOT NULL,
	`itemType` enum('vocabulary','grammar') NOT NULL,
	`itemKey` varchar(128) NOT NULL,
	`repetition` int NOT NULL DEFAULT 0,
	`intervalDays` int NOT NULL DEFAULT 1,
	`easeFactor` int NOT NULL DEFAULT 250,
	`dueAt` timestamp NOT NULL DEFAULT (now()),
	`lastReviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviewQueue_id` PRIMARY KEY(`id`),
	CONSTRAINT `review_queue_user_item_unique` UNIQUE(`userId`,`level`,`itemType`,`itemKey`)
);
--> statement-breakpoint
CREATE TABLE `writingSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`level` varchar(4) NOT NULL,
	`lessonNumber` int NOT NULL,
	`submissionKind` enum('checkpoint','module_test') NOT NULL DEFAULT 'checkpoint',
	`prompt` text NOT NULL,
	`response` text NOT NULL,
	`overallScore` int,
	`feedback` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `writingSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `aiUsageEvents` ADD CONSTRAINT `aiUsageEvents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningProfiles` ADD CONSTRAINT `learningProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonProgress` ADD CONSTRAINT `lessonProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moduleProgress` ADD CONSTRAINT `moduleProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `quizAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `readingAttempts` ADD CONSTRAINT `readingAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviewQueue` ADD CONSTRAINT `reviewQueue_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `writingSubmissions` ADD CONSTRAINT `writingSubmissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ai_usage_user_date_index` ON `aiUsageEvents` (`userId`,`requestDate`);--> statement-breakpoint
CREATE INDEX `lesson_progress_user_level_index` ON `lessonProgress` (`userId`,`level`);--> statement-breakpoint
CREATE INDEX `module_progress_user_level_index` ON `moduleProgress` (`userId`,`level`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_user_lesson_index` ON `quizAttempts` (`userId`,`level`,`lessonNumber`);--> statement-breakpoint
CREATE INDEX `reading_attempt_user_lesson_index` ON `readingAttempts` (`userId`,`level`,`lessonNumber`);--> statement-breakpoint
CREATE INDEX `review_queue_due_index` ON `reviewQueue` (`userId`,`dueAt`);--> statement-breakpoint
CREATE INDEX `writing_submission_user_lesson_index` ON `writingSubmissions` (`userId`,`level`,`lessonNumber`);