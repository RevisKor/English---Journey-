# English Journey
## Product, Curriculum, Lesson-Style, and Application Architecture Report

**Prepared by:** Manus AI  
**Project:** English Journey  
**Audience:** Project owner, curriculum reviewers, developers, and early test users  
**Document status:** Implementation summary based on the current project source and deployment documentation

---

## 1. Executive Summary

English Journey is a bilingual Arabic–English learning platform for learners progressing through the **Common European Framework of Reference for Languages (CEFR)** from A1 beginner level to C2 mastery. It is designed as a guided course rather than a collection of isolated vocabulary cards. The learner moves through structured modules and lessons in which vocabulary, grammar, pronunciation, reading, writing, speaking, review, and assessment reinforce one another.

The platform’s central pedagogical idea is **repeated exposure in varied contexts**. A word is not considered learned merely because it was displayed once. It is introduced, translated, pronounced, placed in an example, reused in grammar, encountered in dialogue or reading, recalled in a quiz, and eventually used independently. The same principle applies to grammar: each topic is explained, modeled, practiced, revisited, and assessed.

The application is built for a small private cohort, initially approximately six users. It uses Google OAuth for identity, Vercel-hosted serverless application code, Vercel/Neon Postgres for learner and curriculum persistence, browser-native speech synthesis for pronunciation, and learner-owned external AI prompts for reading and writing support. The application intentionally avoids per-request paid AI APIs in its current architecture. The no-cost boundary is documented in the project’s Vercel setup guide.[1]

> **Important distinction:** English Journey contains AI-assisted learning workflows and prompt templates, but the current production architecture does not make a paid AI API request for every learner action. Pronunciation is handled in the browser, while the learner may copy prepared prompts into an AI service of their choice for optional reading or writing assistance.

---

## 2. Product Goals and Design Principles

English Journey is organized around six product goals. First, it should help an Arabic-speaking learner understand not only what English means, but also how English is structured and used. Second, it should make the path through a level visible, so the learner always knows what they are studying, why they are studying it, and what comes next. Third, it should teach through meaningful repetition rather than one-time exposure. Fourth, it should gradually shift responsibility from highly scaffolded practice toward independent language use. Fifth, it should preserve learner progress across sessions and devices through authenticated persistence. Finally, it should remain economical to operate while the project is private and experimental.

The resulting design favors guided workspaces, mentor explanations, bilingual scaffolding, clear progression gates, and reusable assessment banks. The lesson contract explicitly separates pedagogical shape from CEFR level, allowing a standard vocabulary lesson, a speaking lesson, a reading lesson, or an assessment lesson to exist at any level.[2]

| Principle | How it appears in the product |
|---|---|
| Guided learning | Mentor moments and a sequence of lesson steps lead learners from introduction to proof of understanding. |
| Repeated exposure | Vocabulary can be learned, seen, heard, used, read, written, and retrieved across a lesson arc. |
| Bilingual scaffolding | Key explanations, objectives, mentor text, examples, hints, and prompts can appear in English and Arabic. |
| Context before guessing | Quiz questions use sentence context and meaningful choices rather than relying primarily on visibly misspelled distractors. |
| Progressive independence | Beginner scaffolding is explicit; higher levels increase reading length, writing demands, lexical precision, and analytical expectations. |
| Evidence of learning | Lesson quizzes, milestone checkpoints, module tests, progress records, and review activity provide multiple signals of mastery. |
| Low operating cost | Browser speech synthesis and learner-owned external prompts replace paid per-request AI services in the current architecture. |

---

## 3. Curriculum Architecture

Each course level is represented as a structured course definition containing a CEFR level, bilingual title, total lesson count, lessons-per-module value, estimated time, lesson records, and module metadata. Each lesson carries its own level and module identity, title in both languages, vocabulary, grammar, learning plan, practice brief, and optional immersive activities.[2]

### 3.1 Implemented level sizes

The current curriculum follows the owner’s requested expansion path: A1 is a substantial foundation course, A2 grows beyond the beginner foundation, B1 and B2 provide extended independent-user study, and C1 and C2 increase the density and intellectual difficulty of the work.[3]

| Level | Implemented lessons | Standard lessons per module | Approximate curriculum character |
|---|---:|---:|---|
| A1 | 90 | 15 | Absolute-beginner foundations, everyday language, basic grammar, first interactions, and highly explicit scaffolding. |
| A2 | 135 | 15 | Basic independent communication, richer everyday themes, retrieval from A1, and more connected reading and writing. |
| B1 | 150 | 15 | Connected lives, informed choices, practical interaction, more sustained reading, and independent paragraph-level production. |
| B2 | 150 | 15 | Evidence, influence, judgement, argument, nuance, and more demanding written and spoken communication. |
| C1 | 160 | 16 | Responsible judgement, evidence, precision, extended reading, and advanced written organization. |
| C2 | 180 | 15 | Precision, mediation, independent judgement, register, implication, and highly demanding comprehension and production. |

The lesson totals and level metadata are defined in the course source modules rather than being inferred only from the interface.[3] The project also contains progressive immersive profiles that increase expected reading and writing demands as the learner advances. These profiles indicate that higher levels should not simply contain more words; they should require longer texts, more independent decisions, and more sophisticated language use.[4]

### 3.2 Modules and themes

A level is divided into named thematic modules. Modules may cover greetings, home and family, food, animals, professions, routines, travel, interaction, evidence, influence, judgement, or other appropriate domains. A module is therefore more than a database grouping: it provides a semantic environment in which vocabulary and grammar can recur naturally.

Within a module, lessons alternate among introduction, explanation, practice, real-context use, review, and assessment. Module metadata gives the learner a visible map, while lesson metadata gives the application enough information to render the appropriate workspace and to synchronize curriculum records in Postgres.

### 3.3 Lesson as a learning arc

The lesson contract supports six named steps: **start, explore, notice, build, respond, and prove**. These steps provide a consistent rhythm without forcing every lesson to look identical. In a vocabulary lesson, “explore” may introduce words and images; “notice” may draw attention to spelling or grammar; “build” may ask the learner to form sentences; “respond” may provide dialogue or comprehension practice; and “prove” may open a quiz.

Each lesson can also include a learning outcome, estimated minutes, retrieval targets from earlier levels, a studio or practice focus, and a can-do statement. The can-do statement connects the lesson to practical use instead of leaving the learner with a list of facts.[2]

---

## 4. Lesson Styles

The lesson system is deliberately varied. The `LessonType` contract currently supports **standard, visual-vocabulary, interaction, speaking, writing, reading, review, and assessment** lessons.[2] In practice, a complete learning journey combines several of these forms rather than presenting them as disconnected pages.

### 4.1 Standard vocabulary and language lesson

A standard lesson introduces a focused set of vocabulary and a grammar target. Each vocabulary item contains an English word, Arabic translation, IPA information, a phonetic respelling, part of speech, definition, English example, and Arabic example. This supports learners who need both meaning and a usable model.

The intended sequence is not “memorize a list and leave.” The learner first meets the word, then hears it, sees how it behaves in a sentence, notices its relationship to grammar, and uses it in a controlled response. The word can later return through review, a reading passage, a writing task, or a cumulative test.

### 4.2 Visual vocabulary lesson

Visual vocabulary lessons are designed for concrete categories such as fruits, vegetables, animals, objects, places, jobs, or everyday actions. A visual item may contain the target word, Arabic translation, pronunciation, example sentence, image URL, alt text, category, and an interaction hint.[2]

The visual format is particularly valuable at A1 and A2 because it reduces unnecessary translation pressure and connects language to a recognizable object or situation. Accessibility is preserved through alt text and bilingual text rather than relying on imagery alone.

### 4.3 Grammar explanation lesson

Grammar is taught as a usable system. A grammar topic includes its concept, Arabic comparison, when to use it, when not to use it, structures for positive statements, negatives, and questions, examples in both languages, common mistakes made by Arabic-speaking learners, exceptions, and guided practice.[2]

At beginner level, technical terms should be explained rather than assumed. The learner should understand what a subject, verb, question, tense, singular form, or negative form does before being asked to manipulate it. At higher levels, the explanation can become more compact and analytical, focusing on choice, nuance, register, implication, and discourse purpose.

### 4.4 Real-life interaction and dialogue lesson

Interaction lessons place vocabulary and grammar inside a situation: greeting someone, asking for information, ordering food, discussing routines, solving a practical problem, explaining a choice, or participating in a more complex professional or academic exchange. Each turn can include speaker, English text, Arabic text, purpose, and alternative expressions.

The learner is therefore exposed to the social purpose of language. A phrase is not merely translated; it is connected to who says it, when it is appropriate, how formal it is, and what response it invites.

### 4.5 Speaking and repeat-after-me lesson

Speaking lessons use short lines or dialogue turns. A line may include a speaker, English text, Arabic support, pronunciation guidance, and audio text. The learner can listen, repeat, replay, continue to the next sentence, and complete the full dialogue.

The current no-cost implementation uses browser-native speech synthesis rather than a paid pronunciation API. Vocabulary cards also distinguish between **reading only the target word** and **reading the full example sentence**, which is important when a learner wants focused pronunciation practice.[5]

### 4.6 Reading lesson

Reading lessons are level-aware. They provide a reading brief, a passage or reading text, target vocabulary, and comprehension checks. Checks may test vocabulary, true or false understanding, multiple choice, fill-in-the-blank knowledge, main idea, detail, or inference.[2]

At A1, reading is short, concrete, and closely supported by recently taught language. At A2 and B1, texts become more connected and require the learner to combine clues across sentences. At B2, C1, and C2, the learner is expected to track evidence, assumptions, qualification, tone, implications, and the writer’s organization. The progressive immersive profiles specify approximate reading-word expectations that rise from basic-level texts to substantially longer advanced-level material.[4]

### 4.7 Writing lesson

Writing lessons contain a prompt, Arabic support, suggested vocabulary, sentence patterns, guidance, and an intended level of independence. At A1, the learner may write a few controlled sentences. At A2 and B1, the learner works toward connected paragraphs. At B2, C1, and C2, tasks increasingly require organization, audience awareness, evidence, qualification, cohesion, revision, and precision.

The current product does not make a paid in-app AI grading request for every essay. Instead, it can provide a carefully scoped prompt for the learner to use with an external AI service of their choice. This preserves the no-per-request-cost requirement, while making clear that the quality of external feedback depends on the learner’s chosen service and instructions.

### 4.8 Review lesson and word-bank retrieval

Review is treated as a learning activity rather than a passive archive. The module word bank aggregates vocabulary introduced across lessons and records source lessons, review count, familiarity stage, and exposure plan. Familiarity can progress from introduced to recognized, understood, used, and remembered.[2]

This allows the learner to revisit language by module and to encounter it again after the first lesson. A review session may ask the learner to retrieve a word, distinguish similar meanings, use a phrase, recognize a grammatical pattern, or produce a sentence rather than simply reread a definition.

### 4.9 Assessment lesson

Assessment lessons and quiz checkpoints collect evidence after learning has occurred. They are separate from ordinary instruction and can be attached to lesson-level, milestone, and module-level progression. An assessment is intended to measure contextual understanding of both vocabulary and grammar.

The quiz interface states an **80% pass requirement**. It presents contextual prompts, bilingual support, answer choices, optional Arabic hints that do not reveal the answer, answer review, score, pass/fail state, and XP when the learner passes.[5]

---

## 5. Standard Learner Journey Through a Lesson

A normal study session is designed to feel guided rather than fragmented. The learner enters a course map, chooses an available module or lesson, and opens a workspace that explains the lesson objective. The interface then leads the learner through the relevant activities in an intentional order.

| Stage | Learner experience | Learning purpose |
|---|---|---|
| 1. Orientation | A mentor message introduces the topic, objective, and practical situation in English with Arabic support. | Establishes purpose and reduces the feeling of entering a raw database record. |
| 2. Encounter | The learner meets words, grammar, images, examples, or dialogue. | Creates the first meaningful exposure. |
| 3. Notice | The learner observes spelling, pronunciation, structure, collocation, form, or difference in meaning. | Turns exposure into conscious understanding. |
| 4. Guided practice | The learner selects, completes, repeats, matches, reads, or builds controlled responses. | Builds accuracy with support. |
| 5. Contextual use | The learner reads, speaks, continues a dialogue, or writes using the target language. | Moves language from isolated knowledge to communication. |
| 6. Retrieval | The learner recalls language without relying entirely on the original card. | Strengthens memory and reveals gaps. |
| 7. Proof | The learner takes a quiz or checkpoint. | Provides evidence for progression and identifies what to review. |
| 8. Continuation | A passed assessment unlocks or recommends the next part of the journey. | Keeps the course path coherent and motivating. |

The lesson workspace is intended to make the transitions explicit. A learner should understand why the next task follows the current one: vocabulary prepares the reading, grammar supports the writing, pronunciation supports the dialogue, and the quiz checks the complete lesson rather than an arbitrary isolated fact.

---

## 6. Assessment and Progression System

### 6.1 Lesson quizzes

A lesson quiz is generated from a pre-authored question bank associated with a CEFR level, module, lesson, and question type. The current UI requests a lesson quiz using the selected level and lesson number, then displays the returned assessment instance and questions. The learner answers every question before submission, receives a score and review, and must reach 80% to pass.[5]

Questions are designed to test contextual choice. Instead of making the answer obvious through crude misspellings, the intended format presents a sentence or situation and asks the learner to choose the expression that best continues or completes the context. The same principle applies to grammar: the learner must choose the form that fits the meaning and structure of the sentence.

### 6.2 Milestone checkpoints

Milestone checkpoints appear at defined lesson boundaries. They revisit the preceding learning and use a larger assessment bank. The learner is expected to integrate vocabulary and grammar rather than succeed through memorizing the last screen.

The catalog synchronization system creates and maintains active milestone banks for all authored levels and module boundaries. It also checks for incomplete assessment-question records so that a catalog containing lessons but lacking usable question banks is not treated as complete.

### 6.3 Module tests

Module tests are cumulative assessments. They sample learning across the module rather than focusing on one lesson. This is important because the course model emphasizes repeated exposure and transfer: a learner should be able to retrieve language after moving beyond the first presentation.

### 6.4 Scoring and learner state

The assessment result includes pass/fail state, score, XP awarded, and per-question review. Correct and incorrect responses are presented with the prompt, bilingual prompt support, the learner’s answer, and the correct answer when the response was incorrect.[5]

Successful completion refreshes dashboard and warm-up state so the learner’s course map and next-lesson availability can reflect the new progress. Progress is stored against the authenticated learner rather than only in browser memory.

---

## 7. Bilingual Arabic–English Experience

English Journey is not an English-only interface with an occasional translation. Arabic scaffolding is distributed through the instructional system. Lesson titles, objectives, outcomes, mentor messages, explanations, examples, dialogue turns, reading checks, writing prompts, quiz prompts, hints, and result messages can all carry Arabic counterparts.

The design generally follows an **English-first learning direction** while retaining Arabic support at the point where it is pedagogically useful. The learner should be encouraged to process English, but should not be left unable to understand the task. This balance becomes more important at A1 and A2, while advanced levels can reduce support and increase English exposure.

Arabic support also addresses predictable transfer issues. Grammar topics can compare English structure with Arabic patterns, identify common Arabic-speaker mistakes, and explain why a direct translation may sound unnatural. This is more useful than presenting a generic grammar rule without reference to the learner’s linguistic background.

---

## 8. Vocabulary and Pronunciation System

Every vocabulary item is designed to answer several learner questions at once: What is the word? What does it mean in Arabic? How is it pronounced? What part of speech is it? What does it mean in a sentence? How is it used in the current topic? The core vocabulary contract stores English, Arabic, IPA, phonetic respelling, part of speech, definition, English example, and Arabic example.[2]

Pronunciation controls are intentionally split. The learner can play the target word alone when focusing on pronunciation, or play the full example sentence when practicing connected speech and context. This distinction prevents the common problem in which a learner wants to repeat one word but is forced to listen to a long sentence.

The browser-native approach keeps the operating cost low. It also means pronunciation quality and available voices depend partly on the learner’s browser and operating system. The application should therefore treat pronunciation as an assistive practice tool, not as a replacement for exposure to multiple authentic accents.

British English is the default preference, while the product supports both British and American accent options. The learner’s preferred accent and bilingual interface preferences are persisted with the account where supported by the current profile model.

---

## 9. Mentor-Guided and Immersive Learning Model

The mentor layer is the narrative and motivational structure of the platform. It explains what the learner is doing, why the topic matters, how it connects to earlier learning, and what kind of effort is expected next. At A2, the mentor can provide a clear course-navigation guide in accessible English. At B1 and above, the mentor voice can become more reflective and intellectually engaging, connecting language topics to habits, choices, work, relationships, evidence, culture, and judgement.

Mentor moments are organized around welcome, vocabulary, grammar, practice, reading, writing, and checking. Each moment has an English and Arabic title and message. This allows the course to feel authored and accompanied rather than assembled from disconnected database fields.

The progressive immersive model also records retrieval targets from earlier levels. For example, an advanced lesson may deliberately ask the learner to retrieve a prior concept before introducing a more sophisticated one. This creates vertical continuity from A1 through C2 instead of treating each level as an unrelated course.

---

## 10. Application Architecture

### 10.1 Frontend

The frontend is a React and TypeScript application built with Vite, Tailwind CSS, and reusable interface components. The main authenticated experience presents the course map, progress state, mentor preview, lesson workspaces, review tools, word bank, pronunciation controls, and assessment dialogs.

The frontend communicates with the backend through typed tRPC procedures. The quiz component, for example, requests lesson, milestone, or module assessments with explicit level and lesson/module scope, then submits the selected answers through the corresponding mutation.[5]

### 10.2 Backend

The backend is an Express application with tRPC routers and Drizzle ORM. Production uses a self-contained Vercel serverless entry path. Local development retains the Vite development path, while the production API bundle excludes the local frontend middleware and native frontend build dependencies.

The course catalog synchronization layer converts authored curriculum records into persisted course levels, modules, lessons, vocabulary, grammar, activities, and assessment records. It includes completeness checks so that missing assessment banks cause the catalog to be considered incomplete rather than silently usable with only a default lesson.

### 10.3 Database and persistence

The production database is Vercel-connected Neon Postgres. The schema contains users, course levels, modules, lessons, vocabulary and grammar records, lesson progress, assessment questions, assessment instances, answers, and related learner-state records. The initial Postgres migration is stored in the repository and was applied to the connected database during setup.[1]

Learner progress is associated with the authenticated user. This supports refreshing the page, returning later, signing out and back in, and continuing the course without relying only on local browser state. Curriculum synchronization is separate from learner progress, which allows authored content to be maintained and progress records to remain tied to the learner.

### 10.4 Authentication

Google OAuth is the production identity provider. The callback route creates or updates the learner account and establishes a signed session cookie. The session is signed using `JWT_SECRET`, and the server reads the cookie to construct the authenticated tRPC context.

Administrator authorization is based on exact email matching. The current implementation supports a comma-separated `OWNER_EMAILS` variable, preserving the legacy single-owner variable when the plural variable is absent. The intended configuration for the two authorized accounts is:

```text
OWNER_EMAILS=revissskor@gmail.com,Yahya205080@gmail.com
```

The value should be configured in Vercel for Production and Preview and should never be committed to GitHub as a secret-bearing `.env` file. The setup guide documents this contract.[1]

### 10.5 Deployment

Vercel hosts the static frontend and serverless API. The repository’s production build creates the client output and a self-contained API handler that Vercel can recognize as a function. The Vercel setup requires `DATABASE_URL` from the Neon integration, Google OAuth credentials, a private JWT signing secret, and optional owner-email configuration.

Google must contain the exact callback URL for the production domain, using the path `/api/auth/callback/google`. Temporary Vercel deployment URLs should not be used as the only callback if learners are expected to use a stable production alias or custom domain.[1]

---

## 11. Cost and External-Service Boundary

The application is designed to avoid paid per-request AI costs in its current private/testing phase. The boundary is as follows:

| Capability | Current implementation | Per-request paid AI cost in the application |
|---|---|---:|
| Pronunciation | Browser-native speech synthesis | No |
| Vocabulary meaning and grammar explanation | Authored bilingual curriculum and structured explanations | No |
| Lesson quizzes | Persisted authored question banks, shuffled or selected by assessment logic | No |
| Reading support | Prepared learner-owned external prompt | No application API call |
| Writing feedback | Prepared learner-owned external prompt | No application API call |
| Authentication | Google OAuth | No application AI cost; Google account/service terms apply |
| Data persistence | Vercel/Neon Postgres | Hosting/database plan limits apply |

This architecture is intentionally conservative. It gives the project a usable learning experience without making every hint, correction, reading, or writing action depend on an application-owned AI API key. A future version could add an optional paid or locally hosted AI service, but that would be a deliberate architecture change rather than an implicit dependency.

---

## 12. What a Learner Should Do in a Normal Study Session

A learner should begin by opening the course map and reviewing the mentor introduction for the current level or module. They should then open the next available lesson and read the outcome before touching the quiz. The learner should study the vocabulary, play each target word separately, listen to the example sentences, and notice the Arabic meaning and English usage.

Next, the learner should work through the grammar explanation and guided practice. They should pay attention to the positive, negative, and question forms, as well as the Arabic-speaker notes. The learner should then complete the relevant interaction, speaking, reading, or writing activity rather than skipping directly to the assessment.

When ready, the learner should take the lesson quiz. If the result is below 80%, the intended action is to read the answer review, return to the weak vocabulary or grammar point, and try again. If the learner passes, the next lesson or checkpoint becomes available according to the progression rules. Periodically, the learner should open Daily Review and the Word Bank to retrieve language introduced earlier.

The most important behavior is not speed. The course is designed for **accurate, repeated use**. A learner who can recognize a word but cannot pronounce it, place it in a sentence, distinguish it from a related word, or retrieve it later has not yet completed the learning cycle.

---

## 13. Current Implementation Status and Known Operational Boundaries

The curriculum, lesson contracts, bilingual scaffolding, mentor-guided structure, lesson-level assessment UI, Postgres migration, Google OAuth architecture, Vercel serverless adapter, and no-cost pronunciation/external-prompt model are implemented in the current project source.

The project has also undergone several production-oriented fixes. These include removing Manus runtime dependencies from the Vercel path, separating local Vite setup from the API-only serverless factory, exposing a source-visible self-contained API handler, adding batched tRPC quiz bootstrap detection, preserving the selected CEFR level in the quiz request, and detecting incomplete non-default assessment banks during catalog synchronization.

The remaining operational boundary is **final user-side production confirmation**. The owner should verify a non-default quiz, such as A2 Lesson 1 or B1 Lesson 6, after the latest deployment and confirm that the questions belong to the selected level and lesson. The owner should also verify that both configured owner accounts receive administrator status after signing in and that lesson progress persists across refresh and a later sign-in.

---

## 14. Recommended Review Checklist

| Review area | Question for the project owner |
|---|---|
| Curriculum quality | Does each module feel like a coherent learning journey rather than a list of records? |
| A1 accessibility | Could a learner with almost no English complete the lesson without knowing grammatical terminology in advance? |
| Repeated exposure | Does each important word return in more than one meaningful mode? |
| Grammar depth | Are Arabic-speaker mistakes explained accurately and respectfully? |
| Lesson variety | Does the level contain a balanced mix of vocabulary, grammar, interaction, speaking, reading, writing, review, and assessment? |
| Assessment validity | Do questions test contextual understanding instead of answer-pattern recognition? |
| Progression | Is the next step clear after a pass or an unsuccessful attempt? |
| Bilingual balance | Does Arabic support understanding without replacing the need to process English? |
| Pronunciation | Are word-only and sentence playback controls both clear and useful? |
| Production readiness | Do Google sign-in, admin role assignment, progress persistence, and non-default quizzes work on the deployed domain? |

---

## References

[1]: `./vercel-independent-setup.md` "English Journey Vercel-independent setup guide"

[2]: `../shared/course/types.ts` "English Journey shared curriculum and lesson type contracts"

[3]: `../shared/course/a1.ts` "English Journey A1 course definition"; `../shared/course/a2.ts` "English Journey A2 course definition"; `../shared/course/b1.ts` "English Journey B1 course definition"; `../shared/course/b2.ts` "English Journey B2 course definition"; `../shared/course/c1.ts` "English Journey C1 course definition"; `../shared/course/c2.ts` "English Journey C2 course definition"

[4]: `../shared/course/progressive-immersive.ts` "English Journey progressive immersive difficulty profiles"

[5]: `../client/src/components/QuizPractice.tsx` "English Journey quiz practice interface and assessment request flow"
