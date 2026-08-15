# English Journey: B1–C2 System Contract

## Purpose

This contract defines the implementation boundary for the B1–C2 expansion. It converts the existing file-backed A1/A2 course into a versioned learning system that organizes content by **level, module, topic, lesson, and learning item**, while preserving the current learner-progress records and the 80% objective-assessment gate.

The curriculum will remain CEFR-informed. The CEFR presents six progressive proficiency levels through skill-specific can-do descriptors, rather than a single vocabulary ladder.[1] The design therefore treats reading, writing, interaction, mediation, grammar, vocabulary, and register as connected learning outcomes.[2]

| Level | Modules | Lessons | Primary learner shift |
| --- | ---: | ---: | --- |
| B1 | 4 | 24 | Connected narratives, opinions, and practical problem-solving |
| B2 | 4 | 24 | Argument, comparison, qualification, and register choice |
| C1 | 4 | 20 | Precision, nuance, synthesis, and persuasive control |
| C2 | 4 | 16 | Flexible, culturally aware mastery and critical synthesis |

## Curriculum database model

Course content will be stored through linked entities: `courseLevels`, `courseModules`, `courseTopics`, `courseLessons`, `lessonObjectives`, `lessonVocabulary`, `lessonGrammar`, `lessonReadings`, `lessonWritingTasks`, and `assessmentQuestionBank`. Each lesson will carry a stable public sequence number, a content version, its six-step learning plan, retrieval targets, lexical network, Arabic-help policy, and learner outcome.

This structure makes every item traceable to the lesson and topic that teach it. A database import will preserve the validated A1/A2 material, allowing the existing learner-progress, review-queue, and writing-history tables to continue using level and lesson identifiers while API reads progressively move to database-backed content.

## Personalized assessment contract

Assessment questions will be authored as banks with explicit objective, skill, item type, difficulty, answer data, distractors, review-item key, and curriculum version. When a learner opens an assessment, the server will create an `assessmentInstances` record and select a balanced question set through a deterministic server-side seed. `assessmentInstanceItems` will snapshot each selected question and ordering before the learner submits an answer.

| Rule | Learner outcome |
| --- | --- |
| Different user or new attempt | A fresh, objective-equivalent question set where inventory permits |
| Same active attempt | The exact same questions on reload, preventing accidental changes |
| Repeated attempt | Previously shown questions are deprioritized until the eligible bank is exhausted |
| Grading | Answers are scored against the snapshotted instance, not the current question bank |
| Progression | The 80% objective threshold and module prerequisites remain unchanged |

The initial module tests will combine randomized controlled checks with a structured reading/interpretation task and AI-graded writing. The learner will always see the result, feedback, and a revision path before progress is updated.

## Tutor quality and responsiveness contract

The tutor will keep server-only credentials and use a live-supported fast model for short guidance. The current catalog includes `gpt-5-mini`, which remains the default for routine structured tutor work; a stronger model is reserved only for re-validation after schema or quality failure. Prompts will pass only the relevant lesson context, use level-specific response schemas, enforce bounded output, validate parsed results, and record timing and failure signals without storing sensitive learner content outside the existing submission records.

The implementation will measure request duration before setting a production performance baseline. The working acceptance target is a concise word or sentence response within a learner-friendly few-second budget, with schema-valid outputs, clear error recovery, and no client-side API key exposure.

## Release evidence

Every new level must include curriculum integrity checks, duplicate detection, question-bank coverage checks, per-user/per-attempt variation tests, progression tests, AI schema tests, desktop/mobile verification, keyboard access checks, Arabic-help checks, and a production build. The higher-level content will continue to apply retrieval, extension, and transfer tasks in every lesson.

## References

[1] [Council of Europe, *The CEFR Levels*](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions)

[2] [Council of Europe, *CEFR Companion Volume* (2020)](https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4)
