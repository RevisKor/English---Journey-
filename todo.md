# Project TODO

- [x] Define and migrate the course, lesson, vocabulary, grammar, user-preference, progress, review-queue, quiz-attempt, and writing-submission data models.
- [x] Add tests that validate the file-backed course curriculum can be consumed as 20 complete A1 lessons.
- [x] Preserve Manus OAuth authentication and create user settings for British/American pronunciation preferences.
- [x] Create a validated, bilingual A1 curriculum containing 500 vocabulary records across 20 lessons and 20 grammar topics.
- [x] Build a responsive bilingual course dashboard with A1–C2 level map, lesson locks, XP, and streak tracking.
- [x] Build the A1 lesson experience with vocabulary cards, Arabic explanations, IPA, phonetic respellings, and browser TTS.
- [x] Build bilingual grammar lessons with Arabic-speaker guidance, examples, practice tasks, and speech playback.
- [x] Implement the server-side AI Word Tutor for lesson-aware bilingual vocabulary, synonym, spelling, and sentence help.
- [x] Implement controlled AI reading passages, comprehension questions, and Arabic feedback.
- [x] Implement AI writing prompts, structured bilingual grading, revision, and submission history.
- [x] Return reading-grade results through a strict structured schema and render per-question Arabic feedback in the lesson UI.
- [x] Add writing-submission history retrieval and a lesson UI showing prior attempts, scores, and feedback timestamps.
- [x] Implement an explicit writing revision flow that preserves each resubmission as a separate attempt.
- [x] Implement lesson quizzes with 80% pass gates and lesson unlocks.
- [x] Implement module tests every five lessons with gated module progression.
- [x] Implement a spaced-repetition review queue for missed vocabulary and grammar items.
- [x] Implement XP awards, daily streak calculation, and dashboard progress summaries.
- [x] Add automated unit tests for course rules, progress gating, and AI response validation.
- [x] Create a validated A2 curriculum, learner route, lexical networks, and active-level progression gates.
- [x] Define the B1–C2 curriculum release contract, normalized catalog, assessment-variation rules, and tutor quality targets.
- [x] Complete the normalized level, module, topic, lesson, vocabulary, grammar, reading, writing, and assessment database catalog while preserving A1/A2.
- [x] Build personalized per-user, per-attempt assessment snapshots and grading for varied lesson quizzes and module tests.
- [x] Author, integrate, and validate 24 B1 lessons across four cumulative modules with English-first support and structured performance tasks.
- [x] Author, integrate, and validate 24 B2 lessons across four cumulative modules with register, argument, and discourse-focused tasks.
- [x] Correct B2 dashboard rendering and course navigation.
- [x] Confirm the owner administrator-role grant with database evidence and retain protected API coverage.
- [x] Build an administrator content-review area for browsing stored level, module, topic, lesson, practice, and assessment-bank content.
- [x] Give the project owner direct review-mode access to all completed A1–B2 lesson content, including practice tasks and assessment items.
- [x] Fix administrator review loading through explicit protected catalog and lesson-detail requests, then re-run visual verification.
- [x] Preserve the requested protected review URL through sign-in so the owner returns directly to review mode after authentication.
- [x] Correct sidebar level navigation, active-level state, labels, and desktop/mobile behaviour so available course content is easy to inspect.
- [x] Remove application-level AI tutor, reading, and writing usage caps for the pilot while retaining server-side credentials, structured validation, timeouts, and basic abuse protection.
- [x] Validate the uncapped pilot AI router policy with automated tests, type checks, and a production build.
- [x] Replace live in-site AI generation and grading with copyable, lesson-specific external-AI prompts for reading, writing, vocabulary, and feedback across A1–B2.
- [x] Verify randomized eight-question lesson quiz selection from level-, module-, and lesson-marked A1–B2 question banks.
- [x] Make the application sidebar independently scrollable and add a keyboard-accessible collapse control.
- [x] Repair responsive layout and navigation issues across the learner dashboard and lesson workspaces.
- [x] Add regression coverage for lesson-aware external-AI prompt builders and include client tests in the Vitest suite.
- [x] Redesign A1–B2 quiz banks to test correctly spelled vocabulary, contextual meaning, collocation, learned-word retrieval, and grammar-in-context without spelling traps.
- [x] Add automated quality checks that reject misspelled distractors and verify vocabulary plus grammar coverage in each revised lesson bank.
- [x] Add explicit A1–B2 regression coverage for contextual meaning and collocation questions, and encode their assessment purpose in persisted question-bank data.
- [x] Add an A2–B2 mentor-guided in-lesson guidance layer with level-appropriate openings, transitions, technical purpose, and reflective encouragement.
- [x] Replace section-jumping lesson workspaces with a continuous mentor-led guided flow that naturally moves learners from vocabulary to grammar, contextual quizzes, reading, writing, and the next step.
- [x] Make lesson URL parameters open the requested A2–B2 guided lesson directly so mentor-led journey links are reviewable and shareable.
- [x] Add and verify A2–B2 mentor previews on the course map before learners enter a lesson.
- [x] Capture authenticated desktop and mobile evidence that A2, B1, and B2 course maps render the bilingual mentor preview before lesson entry.
- [x] Add focused regression coverage for the A2–B2 course-map mentor preview content and lesson-entry call to action.
- [x] Extend the mentor-guidance model and continuous lesson journey to C1 and C2 after those levels are authored.
- [x] Verify all 20 C1 lessons contain nuanced, source-aware reading passages and writing tasks.
- [x] Run a successful C1 catalog synchronization and verify four persisted modules and 20 persisted lessons.
- [x] Capture authenticated C1 course-map mentor-preview and guided-lesson evidence.
- [x] Capture authenticated owner-session evidence that direct review dispatches successful catalog and lesson-detail requests after page load.
- [x] Add UI-level regression coverage for direct review entry, catalog rendering, and selected-lesson detail resolution.
- [x] Author, integrate, and validate 20 C1 lessons across four cumulative modules with nuanced, source-aware reading and writing tasks.
- [x] Add C1 to the authenticated learner dashboard, level navigation, guided lesson dispatcher, progress queries, and mentor preview route.
- [x] Author, integrate, and validate 16 C2 lessons across four cumulative modules with flexible mastery, synthesis, and culturally aware language tasks.
- [x] Decide whether to retain the dormant server-side AI router or remove it entirely after the external-AI prompt migration.
- [x] Test complete A1–C2 navigation, gated progression, personalized assessments, learner feedback, responsive UI, keyboard use, Arabic-support behavior, and automated rules.
- [x] Present lesson quizzes in a modal session after study, with score review, right/wrong explanations, clear pass/fail actions, and an unlocked next-lesson action only after passing.
- [x] Add an Arabic sentence-explanation hint action during contextual quiz questions without revealing the answer.
- [x] Apply mentor-guided A1 lesson introductions and transitions while preserving the beginner bilingual experience.
- [x] Add longer milestone quizzes at level-appropriate checkpoints for every available level, plus cumulative module tests covering each level’s full learned curriculum.
- [x] Add first-use course tutorial guidance for every available level and a reusable help button to reopen it when a learner is stuck.
- [x] Document the expanded course architecture, save a verified final checkpoint, and provide a full user handoff.

> Note: “Uncapped” refers only to the application’s former per-user daily quotas. The current learner experience uses copyable prompts and does not invoke the model from the browser; any external AI service chosen by a learner has its own terms and privacy policy.
- [x] Wire A1 lessons into the mentor-guided workspace or render all A1 mentor moments inside the beginner lesson workspace.
- [x] Update the shared LessonMentorGuide contract so A1 is an official supported level without a type cast.
- [x] Add UI-facing regression coverage proving the A1 lesson route renders mentor introduction and transition content.
- [x] Implement longer milestone and cumulative assessment behavior for every authored level with coverage for question counts and gates.
- [x] Implement reusable first-use tutorial state and a reopenable help action across every authored level.
- [x] Author and integrate the 16-lesson C2 curriculum with catalog synchronization, mentor flow, and validation.
- [x] Remove the remaining LessonMentorGuide level cast and validate the shared contract.
- [x] Separate milestone assessments from gated cumulative module tests so lesson 5/10/15/20 checkpoints work correctly at every authored level.
- [x] Make the tutorial reopen action available on mobile and add regression coverage for first-open and manual reopen behavior.
- [x] Research and document CEFR-aligned skill progression and leading-course design references for the expanded curriculum.
- [x] Author and integrate C1 content with richer reading, writing, pronunciation, grammar, vocabulary, and mentor-led lesson sequencing.
- [x] Author and integrate 16 C2 lessons with advanced reading, writing, pronunciation, grammar, vocabulary, and mentor-led sequencing.
- [x] Expand A1–C2 course architecture toward named thematic modules with vocabulary-centered lessons and varied skill strands.
- [x] Add themed content such as animals, professions, and everyday domains at appropriate CEFR levels without weakening progression gates.
- [x] Validate the expanded A1–C2 catalog, database sync, question banks, mentor previews, mobile layout, Arabic support, and personalized assessments.
- [x] Prioritize C1 curriculum authoring and integration before broad lower-level content expansion.
- [x] Prioritize C2 curriculum authoring and integration immediately after C1, including the final 16-lesson sequence.
- [x] Restructure authored levels into richer named modules with coherent lesson arcs and varied skill strands.
- [x] Increase Arabic scaffolding in the first-use tutorial and early-level lessons, explanations, transitions, and learner prompts; preserve gradual English-first progression at higher levels.
- [x] Add C1 and C2 mentor-guidance regression coverage proving bilingual mentor guides and course-map previews.
- [x] Run and document a C1-specific catalog sync verification asserting four persisted modules and 20 persisted lessons.
- [x] Capture or automate C1 course-map mentor-preview and direct guided-lesson entry evidence.
- [x] Add direct C2 curriculum and assessment-builder regression coverage to the shared test suite.
- [x] Add explicit curriculum and assessment coverage for animals, professions, and everyday-domain themes at appropriate levels.
- [x] Add a C1-focused persistence mock asserting exactly four module rows and twenty lesson rows after synchronization.
- [x] Add UI-level C1 course-map mentor-preview and direct guided-lesson route coverage.
- [x] Reflect named thematic modules in learner-facing course-map rendering and lesson arcs, not only persisted metadata.
- [x] Add automated UI-level coverage for C1 course-map mentor preview and direct `?level=C1&lesson=1` guided-workspace entry.
- [x] Add authenticated Home/App-level regression coverage for C1 mentor preview, query parsing, and direct lesson workspace entry before the next checkpoint.
- [x] Include client `.test.tsx` files in Vitest discovery and execute an authenticated Home/App render regression for C1 mentor preview and direct lesson entry.
- [x] Add a Vitest UI regression that mounts the authenticated Home/AppShell with mocked auth and tRPC state, verifies the C1 mentor preview, and confirms `?level=C1&lesson=1` opens the guided workspace.
- [x] Generate milestone question-bank records through the normal catalog synchronization pipeline with explicit checkpoint scoping per authored level instead of relying on SQL backfill.
- [x] Add persisted-bank regression coverage for milestone sourcing, question counts, and checkpoint gating across A1, A2, B1, B2, C1, and C2.
- [x] Define consistent checkpoint locations for shorter authored levels such as C2 and encode the rule in shared assessment contracts and tests.
- [x] Update milestone assessment upserts to restore module and checkpoint lesson foreign keys on duplicate question keys, then verify stale rows are inactive.
- [x] Finish catalog synchronization so active milestone banks exist at every module-final checkpoint for all authored levels: A1/A2/C1 5/10/15/20, B1/B2 6/12/18/24, and C2 4/8/12/16.
- [x] Add a persisted-bank regression test that inspects synchronized milestone rows per level and module, including question counts and checkpoint lesson provenance.
- [x] Investigate incomplete later-module checkpoint rows for A1, A2, B1, B2, and C1, then rerun and verify the database state.
- [x] Add an interactive client regression that verifies the tutorial auto-opens on first visit and can be reopened manually on mobile.
- [x] Extend Arabic scaffolding beyond tutorial copy into A1/A2 lesson/workspace explanations, mentor transitions, and learner-facing prompts, with tests covering the new bilingual content.
- [x] Add an automated persistence regression for milestone banks asserting per-level/per-module checkpoint lesson numbers, active row presence, and question-count provenance after synchronization.
- [x] Add the explicit React runtime import required by the structured lesson workspace when rendered under Vitest.
- [x] Mount the authenticated Home/AppShell route contract with mocked state, verify the mobile Guide affordance, and retain tutorial storage-helper coverage for first-open semantics.
- [x] Add explicit A2 workspace and learner-prompt Arabic regression coverage alongside the existing A1 workspace render test.

# Curriculum & Lesson System Overhaul

- [x] Expand the curriculum contract to support approximately 6–7 modules per level and substantially longer modules without breaking existing A1–C2 routes.
- [x] Add explicit lesson-type metadata and varied activity contracts for standard, visual vocabulary, real-life interaction, speaking/repeat-after-me, writing, and reading lessons.
- [x] Deepen A1 from absolute beginner foundations through everyday domains with coherent vocabulary progression and Arabic scaffolding.
- [x] Expand grammar content and rendering with plain-language terminology, structure, positive/negative/question forms, short answers, use cases, Arabic-speaker mistakes, exceptions, examples, and progressive practice.
- [x] Add genuine visual vocabulary lesson support for category-based word learning with image, English, Arabic, pronunciation, example, and interaction fields.
- [x] Add speaking lesson support for listen, repeat, replay, next sentence, and complete-dialogue practice.
- [x] Add dedicated writing and reading lesson structures with level-aware prompts, target language, guidance, examples, and comprehension activities.
- [x] Expand first-use onboarding to explain levels, modules, lesson types, navigation, progress, assessments, word banks, review, prompts, feedback, and normal study flow.
- [x] Add per-module word-bank aggregation and learner review behavior tied to lesson progress.
- [x] Validate synchronization, gated progression, varied assessments, Arabic support, responsive accessibility, and the expanded lesson experiences across A1–C2.
- [x] Document the expanded course architecture and save a verified checkpoint for the overhaul.

> Scope note: The overhaul brief requests a materially larger curriculum and new activity families. Existing authored content and learner routes will be preserved while the new contracts are introduced incrementally, with validation after each phase.
- [x] Apply the new lesson-type, multimodal activity, detailed grammar, word-bank, reinforcement, and onboarding contracts consistently across every authored A1, A2, B1, B2, C1, and C2 module, with CEFR-appropriate complexity.
- [x] Remove hardcoded module and lesson caps from course procedures and derive valid ranges from the selected course definition.
- [x] Add regressions proving courses with more than four modules and more than twenty-four lessons can route, gate, and request assessments while existing A1–C2 behavior remains unchanged.
- [x] Wire dynamic course module metadata into server and client consumers so expanded module counts are first-class rather than documentation-only.
- [x] Implement explicit speaking-lesson controls for replay, next-sentence sequencing, and complete-dialogue practice, with regression tests.
- [x] Render reading comprehension activities from readingChecks in the learner UI and add tests proving level-aware reading/writing structures include prompts, guidance, examples, and checks.
- [x] Render grammar terminology, short-answer patterns, and positive/negative/question example groups from teachingGuide in the lesson UI, with regression tests.
- [x] Replace universal hardcoded short-answer text and mistake-derived negative examples with grammar-topic-appropriate generated examples.
- [x] Add regression coverage proving every authored lesson exposes complete grammar teaching content in the rendered workspace.
- [x] Add a dedicated module word-bank review experience with pronunciation playback, revisit/practice actions, and clear reviewed state.
- [x] Track word-bank review state from actual learner interactions rather than deriving familiarity only from lesson completion.
- [x] Add regression coverage proving the word-bank review UI exposes actions and updates its reviewed state.
- [x] Replace placeholder SVG initial-letter mnemonics with a genuine visual-vocabulary asset strategy for category-based words across authored lessons.
- [x] Render English and Arabic example sentences inside visual-vocabulary cards.
- [x] Add explicit visual-vocabulary reveal, listen, and review controls with regression coverage for image, English, Arabic, pronunciation, example, and interaction fields.
- [x] Add protected review-mode UI regression coverage for catalog rendering and selected lesson-detail resolution based on the verified owner-session route.
- [x] Mount the authenticated Home/AppShell route contract in Vitest, verify the mobile Guide affordance, and retain storage-helper coverage for first-use auto-open semantics.
- [x] Run and document full A1–C2 route, gate, assessment, Arabic, responsive, keyboard, and learner-feedback QA.
- [x] Revise and document the underlying A1 authored lesson progression beyond shared wrappers, with explicit beginner-domain sequencing and Arabic scaffolding.
- [x] Add focused A1 content regression proving the lesson-by-lesson vocabulary/domain progression and beginner-support goals.

# Immersive Module Authoring — New Scope

- [x] Author the first expanded A1 thematic module with 15–20 varied lessons and explicit lesson-purpose arcs.
- [x] Add repeated-exposure links so module vocabulary reappears in grammar, dialogue, speaking, reading, writing, quizzes, and review activities.
- [x] Expand A1 grammar teaching guides with beginner-safe terminology, bilingual explanations, forms, use cases, Arabic-speaker mistakes, exceptions, guided practice, and real-world usage.
- [x] Add detailed module word-bank provenance and continuously updating review data for the new authored content.
- [x] Extend module-level learner map and lesson flow to present the new immersive sequence without breaking A1–C2 routing or gates.
- [x] Add regression coverage for the new module structure, repeated vocabulary exposure, word-bank provenance, and beginner guidance.
- [x] Validate the authored milestone with TypeScript, Vitest, production build, and responsive preview checks before checkpointing.

# Progressive Immersive Curriculum Expansion
- [x] Author remaining A1 thematic modules with 15–20 varied lessons, bilingual beginner scaffolding, mentor arcs, and repeated exposure plans.
- [x] Add A1 module-specific vocabulary, grammar, reading, writing, speaking, review, and contextual assessment content for each new module.
- [x] Create and expose a reversible A1 immersive migration plan with stable source keys, collision-safe proposed lesson numbers, and preserved active lesson gates pending approval.
- [x] Define and author progressively deeper immersive module contracts for A2, B1, B2, C1, and C2 with level-specific skill and assessment demands.
- [x] Create and expose representative A2–C2 migration plans and owner-review inventory without breaking existing routing, word banks, persistence, or review behavior.
- [x] Add regression coverage for module completeness, CEFR difficulty progression, repeated exposure, migration provenance, gates, and learner-map rendering.
- [x] Validate the progressive curriculum expansion with TypeScript, Vitest, production build, and responsive preview checks before checkpointing.

# A1 Immersive Visibility Follow-up
- [x] Diagnose whether the learner-facing A1 route is intentionally showing the legacy active catalog or failing to render the authored immersive modules.
- [x] Expose the authored A1 modules in the learner route or migrate them into the active catalog without breaking gates.
- [x] Add regression coverage proving the learner can access the authored A1 module content and that legacy progression remains safe.
- [x] Validate the A1 visibility fix with TypeScript, Vitest, production build, and responsive preview checks.

# Corrected Immersive Curriculum Migration
- [x] Audit the active normalized catalog and identify every legacy five-lesson module path that must be replaced.
- [x] Research and document a CEFR-aligned 6–7 module architecture with 15–20 varied lessons per module and level-specific skill progression.
- [x] Redesign catalog synchronization so authored immersive lessons become active learner lessons rather than preview-only records.
- [x] Author six deeply detailed A1 modules with 15–20 lessons each, beginner-safe grammar, bilingual scaffolding, repeated word-bank exposure, and varied skill activities.
- [x] Migrate the authored A1 modules into the active catalog, preserving gates, milestone tests, cumulative tests, and lesson provenance.
- [x] Define progressive A2–C2 module counts, lesson counts, content depth, and assessment expectations based on the researched architecture.
- [x] Add regression coverage proving active module counts, lesson counts, migration provenance, word-bank continuity, and gated progression.
- [x] Validate the corrected catalog with TypeScript, full Vitest, production build, and desktop/mobile preview before checkpointing.

# A1 Specification Review Pause
- [x] Research authoritative A1 CEFR descriptors and reputable course-design references for the review specification.
- [x] Design the exact A1 module and lesson architecture with 6–7 modules and 15–20 varied lessons per module.
- [x] Write a complete A1-only curriculum specification covering vocabulary, grammar, activities, repeated exposure, word bank, bilingual scaffolding, and assessments.
- [x] Deliver the A1 specification for user approval without migrating it into the active catalog yet.

# A1 Visual Consistency Requirements
- [x] Define a shared A1 expansion visual checklist covering design tokens, mentor tone, bilingual hierarchy, cards, navigation, progress, and accessibility.
- [x] Keep expanded A1 learner-map, lesson, word-bank, tutorial, and owner-review surfaces visually consistent with the established English Journey design system.
- [x] Verify visual consistency at desktop and mobile breakpoints alongside functional catalog and progression validation.

# Approved A1 Implementation and Future Curriculum Roadmap
- [x] Implement the approved active A1 catalog with six named modules and fifteen dense, varied lessons per module (90 active lessons).
- [x] Ensure every active A1 module interweaves vocabulary, visual identification, grammar, dialogue, speaking, reading, writing, punctuation, common phrases, word relationships, review, and contextual assessment where pedagogically appropriate.
- [x] Preserve A1 word-bank provenance, repeated exposure, contextual quiz variation, milestone and module-test gates throughout the 90-lesson migration.
- [x] Document the later curriculum targets: A2 at 135 lessons, B1 at 150 lessons, B2 at 150 lessons, and C1/C2 at approximately 160–180 lessons each with progressively denser, longer, more independent learning tasks.
- [x] Validate the active A1 migration and visual-system consistency across learner, word-bank, tutorial, and owner-review surfaces before beginning A2.

## Locked post-A1 authoring roadmap — do not begin until A1 review is approved
- [x] A2: author 9 modules × 15 lessons = 135 active lessons. Extend A1 foundations into daily problem-solving, connected speech, comparatives, past experiences, practical messages, paragraph writing, guided punctuation, phrase families, and longer dialogue/reading tasks.
- [x] B1: author 10 modules × 15 lessons = 150 active lessons. Build independent communication through opinion, narrative, travel/work/study scenarios, collocations, phrasal verbs, paragraph cohesion, formal/informal register, multi-paragraph writing, and evidence-based reading.
- [x] B2: author 10 modules × 15 lessons = 150 active lessons. Require nuanced comparison, argument, reports, presentations, idiomatic but appropriate phrasing, lexical precision, tone choices, source comparison, extended discussion, and revision of longer writing.
- [x] C1: author 10 modules × 16 lessons = 160 active lessons. Develop advanced academic/professional communication through complex syntax, rhetorical structure, collocation, implied meaning, mediation, critical reading, research-informed writing, and register control.
- [x] C2: author 12 modules × 15 lessons = 180 active lessons. Develop flexible, near-expert use through subtle connotation, genre transformation, critical synthesis, ambiguity, persuasive and creative discourse, high-level mediation, and substantial independent projects.
- [x] Across A2–C2: make lessons progressively longer and denser; add new communicative knowledge—not only additional word lists or grammar rules—through pictures, dialogues, pronunciation, punctuation, phrase comparison, synonyms/antonyms, collocation, reading, writing, speaking, review, and contextual assessment.
# A2 Expansion — Authored Curriculum Phase
- [x] Define the A2 9-module × 15-lesson architecture with CEFR-progressive goals and repeated-exposure requirements.
- [x] Author the complete A2 135-lesson inventory with bilingual mentor guidance, vocabulary, grammar, dialogue, speaking, reading, writing, review, and assessment coverage.
- [x] Add A2 lesson-family and activity-plan regression coverage for the expanded inventory.
- [x] Expose the authored A2 inventory in owner review while preserving the active gated catalog until migration approval.
- [x] Validate the A2 expansion with TypeScript, Vitest, production build, and desktop/mobile learner preview checks.
- [x] Document the A2 migration plan and leave B1–C2 roadmap targets unchanged.
- [x] Author and wire A2 Module 6 (Lessons 76–90) as explicit bilingual Choices and Plans journeys with varied activities and selected learner-experience stages.
- [x] Add focused A2 Module 6 curriculum and adaptive-workspace regressions.
- [x] Run controlled A2 Module 6 validation batches, production checks, and curriculum audit; then save a checkpoint.
- [x] Author, wire, test, and validate A2 Module 7 (Lessons 91–105) as Communication and Technology journeys aligned to the authoritative arc.
- [x] Save the validated A2 Module 7 Communication and Technology curriculum checkpoint.
- [x] Author, wire, test, and validate A2 Module 8 (Lessons 106–120) as Food, Shopping, and Services journeys aligned to the authoritative arc.
- [x] Save the validated A2 Module 8 Food, Shopping, and Services curriculum checkpoint.
- [x] Author, wire, test, validate, and checkpoint A2 Module 9 (Lessons 121–135) as Celebrations and Culture journeys aligned to the authoritative arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 1 (Lessons 1–15) as varied bilingual narrative, decision, community, workplace, and media-literacy journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 2 (Lessons 16–30) as varied bilingual relationships, society, identity, and collaboration journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 3 (Lessons 31–45) as varied bilingual travel, change, adaptation, and independent-action journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 4 (Lessons 46–60) as varied bilingual stories, opinions, narrative framing, and evidence-based discussion journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 5 (Lessons 61–75) as varied bilingual health, wellbeing, choices, advice, and self-management journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 6 (Lessons 76–90) as varied bilingual media, digital life, online safety, source awareness, and communication journeys aligned to the authoritative lesson arc.
- [x] Author, wire, test, validate, and checkpoint B1 Module 7 (Lessons 91–105) as varied bilingual environment, community action, evidence, participation, and practical-change journeys aligned to the authoritative lesson arc.

# A1 Lesson Workspace Stability Follow-up
- [x] Add regression coverage for missing or malformed activity metadata labels in the shared lesson workspace.
- [x] Re-run the complete Vitest suite, TypeScript check, and production build after the crash-guard fix.

# Learner Interface Refinements Requested in Visual Review
- [x] Give Arabic supporting text a distinct but accessible visual treatment so it is immediately recognisable without weakening English-first hierarchy.
- [x] Replace the inline course-home word-bank panel with a compact navigation action that opens the full tabular word-bank experience.
- [x] Make learner-course-map module sections collapsible with keyboard-accessible controls.
- [x] Render learner-course-map lessons as an ordered vertical list rather than side-by-side tiles.
- [x] Highlight meaningful keywords in learner-course-map explanatory copy without making the text noisy or inaccessible.
- [x] Add regression coverage and validate the revised learner map and course-home layout at desktop and mobile breakpoints.

# Recovery: Duplicate Keys and Course Navigation
- [x] Eliminate duplicate React keys in the A1 word-bank and immersive vocabulary render paths.
- [x] Add a regression that proves rendered vocabulary identifiers are unique even when a word recurs across source lessons.
- [x] Refine the course navigation layout and enlarge the word-bank action without causing desktop or mobile overflow.
- [x] Run regression, type, build, desktop, and mobile checks for the recovery changes.

# Word-Bank Table Readability Refinement
- [x] Increase the full word-bank dialog and column layout so vocabulary rows do not feel compressed.
- [x] Preserve a readable mobile fallback with horizontal table scrolling where necessary.
- [x] Validate the revised word-bank layout at desktop and mobile breakpoints, then create a checkpoint.

# Course Header Positioning Refinement
- [x] Raise the course header slightly so nearby text does not overlap or visually compete with its content.
- [x] Preserve responsive spacing and header readability on desktop and mobile.
- [x] Validate the refinement and create a checkpoint.

# Active Catalog Recovery: Repeated-Exposure Vocabulary
- [x] Make repeated A1 and A2 vocabulary occurrences lesson-scoped so globally unique catalog keys never collide.
- [x] Resume the interrupted A1 vocabulary snapshot and verify six modules, 90 lessons, and a complete vocabulary snapshot.
- [x] Verify the active A2 catalog has nine modules, 135 lessons, and a complete vocabulary snapshot at content version 3.
- [x] Add synchronization safeguards that treat incomplete vocabulary snapshots as stale, then validate automated contracts, TypeScript, production build, and desktop/mobile learner surfaces.

# Word-Bank Sticky Header and Row Readability Recovery
- [x] Stop the sticky word-bank column header from obscuring the first vocabulary row.
- [x] Rebalance the word, Arabic, pronunciation, context, and source cells so bilingual content remains readable.
- [x] Validate the corrected full table at desktop and mobile widths, then create a checkpoint.

# B1 Expansion — Ten-Module Active Curriculum
- [x] Audit the existing B1 contracts, seed inventory, CEFR progression helpers, assessment routing, and active catalog synchronization boundary.
- [x] Define ten B1 modules of fifteen lessons each: work/study, relationships/society, travel/change, stories/opinions, health/choices, media/digital life, environment/community action, culture/identity, problem-solving/decisions, and future pathways/projects.
- [x] Expand the bilingual B1 inventory to 150 lesson records with twelve lesson-scoped vocabulary records per lesson, grammar targets, A2 retrieval, lexical networks, reading briefs, and writing prompts.
- [x] Promote B1 into the active catalog with catalog synchronization version 4 and explicit ten-module/150-lesson persistence regression coverage.
- [x] Run the complete Vitest suite, TypeScript check, production build, and desktop/mobile learner-map preview checks before creating the B1 checkpoint.
- [x] Review B1 content quality and revise any lesson-family or CEFR-progression issues before beginning B2.

# Upper-Level Expansion — B2, C1, and C2
- [x] Add deterministic upper-level expansion tooling that preserves bilingual lesson contracts and repeated-exposure fields.
- [x] Expand B2 to 10 modules × 15 lessons = 150 lessons.
- [x] Expand C1 to 10 modules × 16 lessons = 160 lessons.
- [x] Expand C2 to 12 modules × 15 lessons = 180 lessons.
- [x] Expand C1/C2 module guidance metadata so learner maps expose every authored module with Arabic titles and overviews.
- [x] Update active-level routing, milestone boundaries, catalog persistence assertions, learner-map regressions, and UI route tests for the new module sizes.
- [x] Complete editorial regression coverage for B1 and upper-level lesson arcs, lexical breadth, bilingual metadata, and activity contracts.
- [x] Run the complete single-worker Vitest suite: 36 files and 128 tests passing.
- [x] Run TypeScript validation and production build successfully; Vite reports only the existing bundle-size advisory.
- [x] Promote B2, C1, and C2 into the persistent active catalog snapshot after owner review of the generated upper-level content.

# Vocabulary Word-Only Pronunciation Controls
- [x] Add a dedicated accessible control that speaks the target word only, without playing its example sentence.
- [x] Preserve a separate example-sentence playback control on shared vocabulary cards.
- [x] Apply and verify the control across A1, A2, and B1 guided lesson routes with regression coverage.

# Approved B2–C2 Active Catalog Promotion
- [x] Promote the reviewed B2, C1, and C2 curriculum snapshots through versioned catalog synchronization.
- [x] Verify persistent module, lesson, vocabulary, reading, writing, and assessment records for B2, C1, and C2.
- [x] Validate the active B2/C1/C2 learner routes, complete regression suite, TypeScript check, and production build.
- [x] Detect and safely recover any partial structured-practice snapshot where reading or writing records are incomplete after a restart.

# Product-Completion Audit
- [x] Audit learner flows, course content, accessibility, reliability, privacy, and launch readiness for remaining gaps.
- [x] Prioritize identified gaps into now, pre-launch, and later work before beginning further feature implementation.
- [x] Select the next completion milestone from the audited recommendations before implementation begins.

# No-Cost Study Foundation Completion
- [x] Replace legacy hard-coded level totals with live course-definition metadata in learner navigation.
- [x] Add a persistent daily review workspace using the existing spaced-review queue, without external speech or AI services.
- [x] Add learner settings for accent and interface preference using the existing profile data model.
- [x] Add bilingual help, privacy, and data-use information without third-party tracking or paid APIs.
- [x] Preserve the no-cost architecture: browser-native speech only, external learner-owned AI prompts only, and no paid external runtime API dependency.

# Vercel Hosting Assessment
- [x] Confirmed that the linked Vercel team currently has no existing English Journey project; deployment target and production environment remain user-controlled.
- [x] Audit Vercel compatibility for the Express/tRPC server, database connection, OAuth callback URLs, storage, and required environment variables.
- [x] Validate the configured Vercel token with a read-only Vercel identity endpoint; no deployment was performed.
- [x] Prepare user-controlled deployment instructions or compatibility changes only after the target Vercel project and environment are confirmed.

# Vercel Express/tRPC Adapter Preparation
- [x] Add a reusable Express app factory that can be imported by Vercel without starting a listening server or triggering long-lived startup synchronization.
- [x] Add a Vercel function entry point and rewrites for the frontend, OAuth, storage proxy, and tRPC routes.
- [x] Preserve the no-cost runtime architecture and document required database, OAuth, storage, and application environment variables.
- [x] Add adapter tests and run TypeScript, production build, and deployment-readiness validation without deploying.

# Clean Git Push Preparation
- [x] Audit tracked files, ignored files, Git history, generated artifacts, and credential-like values.
- [x] Remove or ignore secrets, local logs, sandbox metadata, build output, archives, and machine-specific files from the pushable repository.
- [x] Add a safe Git/Vercel setup guide and an environment-variable reference without real secret values.
- [x] Run repository integrity and secret-scan validation, then provide manual push commands without pushing on the user’s behalf.

# Vercel Deployment Configuration Guidance
- [x] Prepare the imported Vercel project settings with the build command, output directory, and API routing; the user applies them manually in Vercel.
- [x] Prepare the required encrypted Preview and Production environment-variable import; the user imports the filled values privately in Vercel.
- [x] Document the OAuth callback URL and Preview verification checklist; the user completes the domain-specific checks after deployment.

# Safe Vercel Environment Template
- [x] Create a placeholder-only environment template with variable names but no real credentials.
- [x] Explain private replacement and Vercel Import .env usage without committing the filled file.

# Vercel Deployment Error Investigation
- [x] Inspect the attached deployment log without exposing secret values.
- [x] Identify the root cause against the prepared adapter and Vercel configuration.
- [x] Apply and validate the minimal safe fix, or provide exact user-side remediation if the issue is account configuration.

# Vercel-Only Runtime Migration
- [x] Audit all Manus OAuth, Forge, and managed-database dependencies in the application runtime.
- [x] Design a Vercel-compatible replacement for authentication and persisted learner progress.
- [x] Convert the Drizzle schema and database access layer from MySQL to Vercel-connected Postgres.
- [x] Replace Manus OAuth with Google OAuth and signed local sessions using secure runtime secrets.
- [x] Remove Manus-specific runtime service calls while preserving browser-native pronunciation and external learner-owned AI prompts.
- [x] Add migration-focused regression coverage and validate the Vercel-compatible production build.
- [x] Provision and connect Vercel Postgres for Production and Preview environments.
- [x] Apply the generated Postgres initialization migration to the connected Vercel database.
- [ ] Add the independent runtime secrets to Vercel and validate Google sign-in and persisted learner progress.
- [x] Document the user-controlled Google OAuth, database migration, and redeployment steps.

# Latest External GitHub Push
- [x] Push the latest Vercel-independent migration checkpoint to `RevisKor/English---Journey-`.
- [x] Verify the remote branch contains the Google OAuth replacement, Postgres migration, setup guide, and regression tests.

# Vercel TypeScript Deployment Repair
- [x] Diagnose the Express type-resolution failure reported by Vercel.
- [x] Repair the Vercel compilation contract and validate it locally.
- [x] Push the verified repair to GitHub for redeployment.

# Vercel Serverless Crash Recovery
- [x] Reproduce and diagnose the production TypeScript type-resolution errors that prevent the Vercel function from starting.
- [x] Repair the Vercel dependency, Express typing, and Vite plugin contracts without reintroducing Manus runtime dependencies.
- [x] Validate the serverless build and regression coverage, then publish the recovery commit to GitHub.
- [x] Ensure Vercel recognizes the self-contained generated API handler as a serverless function rather than returning an API-route 404.
- [x] Exclude Vite and its native CSS dependencies from the production API function bundle.
- [ ] Confirm the redeployed Vercel function loads and completes Google sign-in with persisted learner progress.

# Production Administrator Access
- [ ] Assign the administrator role only to the authenticated account with `revissskor@gmail.com` and verify the persisted role.

# Quiz Catalog Synchronization Recovery
- [x] Diagnose why production quizzes report that the requested course level has not been synchronized.
- [x] Repair the shared curriculum catalog loading or synchronization path for all quiz levels.
- [x] Validate representative quizzes and publish the recovery.

# Multi-owner Authorization
- [x] Support exact-match authorization for both configured owner email addresses, preserving the existing owner.
- [x] Add regression coverage, update Vercel configuration guidance, and publish the multi-owner change.

# Quiz Generation Follow-up
- [x] Trace why production quiz generation still fails after curriculum bootstrap.
- [x] Repair the exact quiz request or synchronization failure and add regression coverage.
- [x] Validate representative quiz generation and publish the recovery.
- [x] Bootstrap the catalog for the shared batched `/api/trpc` transport used by quiz queries.

# Level-specific Quiz Routing Recovery
- [x] Trace why quiz generation defaults every selected lesson to A1 Lesson 1.
- [x] Preserve the selected CEFR level and lesson through the client, tRPC batch, and server quiz procedure with regression coverage.
- [x] Validate level-specific quiz generation and publish the recovery.

# Non-default Lesson Quiz Recovery
- [x] Trace why only A1 Lesson 1 resolves while other modules and CEFR levels fail to generate quizzes.
- [x] Repair non-default lesson scope and quiz-bank resolution with cross-level regression coverage.
- [ ] Validate representative non-default quizzes and publish the recovery.

# Six-Agent Curriculum Production System
- [x] Establish a versioned Curriculum Bible that records course philosophy, CEFR progression, shared rules, activity taxonomy, assessment hierarchy, accessibility, Arabic support, British English, and editorial quality gates.
- [x] Create a research-evidence register that turns reputable pedagogy sources into traceable English Journey design decisions.
- [x] Define lesson-blueprint, curriculum-graph, activity-library, and assessment-specification contracts that separate architecture from authored content.
- [x] Build automated curriculum audit reports for lesson-type balance, skill distribution, retrieval coverage, activity repetition, assessment coverage, and level/module progression.
- [x] Define a calm, accessible visual-language specification for all activity types without changing existing learner outcomes.
- [x] Create the staged six-workstream operating procedure, including inputs, outputs, review gates, and hand-offs for the 865-lesson curriculum.
- [x] Normalise A1 lessons onto the shared `learningPlan` contract so the audit applies the same structured-planning checks across A1–C2.

# Six-Workstream Curriculum Restructuring Execution
- [x] Launch the first A1 restructuring batch, turning the shared graph, lesson blueprint, activity, assessment, visual, and quality contracts into concrete learner-facing content.
- [x] Rebuild the active A1 module journeys with deeper mentor guidance, repeated vocabulary exposure, varied activities, and level-appropriate assessment evidence.
- [x] Audit and validate the restructured A1 curriculum before using the same method to author A2, B1, B2, C1, and C2.
- [x] Apply the verified restructuring method to all remaining CEFR levels in staged, versioned, quality-gated authoring batches.

# Full Lesson-by-Lesson Curriculum Reauthoring
- [x] Produce a review-ready Markdown sample showing the fully reauthored A1 Lessons 1–5 before applying the approved style to the remaining curriculum.
- [x] Replace any universal lesson-template assumption with objective-led lesson archetypes, varied density, and adaptive stage selection across the 865-lesson authoring system.
- [ ] Define and enforce the calm shared visual language for objectives, examples, tips, common mistakes, vocabulary, grammar, activities, retrieval, and assessment without using colour as the only cue.
- [x] Revise the A1 Lessons 1–5 review sample to demonstrate genuinely varied lesson experiences, activity patterns, introductions, dialogue structures, and assessment formats.
- [x] Add lesson-archetype, density, selected-stage, progressive-support, and visual-semantic metadata to the structured authoring data.
- [x] Implement reusable semantic lesson components that render objectives, examples, tips, common mistakes, vocabulary, grammar, activities, retrieval, and assessments with labels, icons, and accessible non-colour cues.
- [x] Extend the curriculum audit to flag possible archetype concentration, repeated openings, repeated activity sequences, dialogue-shape repetition, assessment monotony, and forced retrieval for human review.
- [x] Update the tutorial, course map, and learner-facing route language so navigation is predictable while each lesson’s selected activity journey remains purposeful and variable.
- [x] Create the complete batch plan and acceptance criteria for reauthoring all 865 lessons, making the distinction between infrastructure and content production explicit.
- [x] Maintain a six-workstream A1 authoring ledger for curriculum mapping, pedagogy, activities, assessments, visual language, and independent audit evidence; pause unrelated deployment follow-ups.
- [x] Reauthor and render the first five A1 Module 1 lessons as a live varied-archetype pilot with explicit bilingual activity data and learner evidence.
- [x] Reauthor A1 Module 1 Lessons 6–8 with objective-led archetypes, natural retrieval, and varied assessment evidence.
- [x] Reauthor A1 Module 1 Lessons 9–11 as distinct reading, writing, and interaction journeys with integrated evidence.
- [x] Reauthor A1 Module 1 Lessons 12–15 as distinct visual, real-world, review, and module-assessment journeys.
- [x] Reauthor A1 Module 2 Lessons 16–20 as varied family-and-home journeys with voluntary personal disclosure, natural vocabulary reuse, and distinct learner evidence.
- [x] Reauthor A1 Module 2 Lessons 21–25 as varied home, pet, and descriptive-language journeys with purposeful listening and interaction.
- [x] Reauthor A1 Module 2 Lessons 26–30 as varied writing, real-world, review, and supportive module-assessment journeys.
- [x] Reauthor every A1 lesson and six module tests with beginner-safe explanations, repeated-exposure activity sequences, and authored mentor transitions.
- [ ] Reauthor every A2 and B1 lesson and module assessment with progressively more independent reading, interaction, and writing evidence.
- [ ] Reauthor every B2, C1, and C2 lesson and module assessment with advanced discourse, precision, register, and synthesis practice.
- [ ] Verify every reauthored lesson against the curriculum graph, assessment specification, and learner workspace, then release audited level-by-level checkpoints.
- [x] Reauthor A1 Module 3 Lessons 31–45 as varied, beginner-safe food-and-market learner journeys with explicit bilingual activity data and learner evidence.
- [x] Reauthor A1 Module 4 Lessons 46–60 as varied, beginner-safe daily-life learner journeys with explicit bilingual activity data and learner evidence.
- [x] Reauthor A1 Module 5 Lessons 61–75 as varied, beginner-safe places-and-getting-around learner journeys with explicit bilingual activity data and learner evidence.
- [x] Reauthor A1 Module 6 Lessons 76–90 as varied, beginner-safe work-hobbies-and-connected-life learner journeys with explicit bilingual activity data and learner evidence.
- [x] Validate the complete authored A1 level through controlled UI/API and course-content batches, TypeScript, production build, curriculum audit, and preview inspection.
- [x] Reauthor A2 Module 1 Lessons 1–15 as varied, high-scaffold health-and-habits learner journeys with explicit bilingual activity data, connected A1 retrieval, and learner evidence.
- [x] Reauthor A2 Module 2 Lessons 16–30 as varied, connected learning-and-work learner journeys with explicit bilingual activity data, purposeful A1/A2 retrieval, and learner evidence.
- [x] Reauthor A2 Module 3 Lessons 31–45 as varied, practical travel-and-services learner journeys with explicit bilingual activity data, polite problem-solving language, and learner evidence.
- [x] Reauthor A2 Module 4 Lessons 46–60 as varied, connected Stories and Memories learner journeys with explicit bilingual activity data, narrative sequencing, reflection, and learner evidence.
- [x] Reauthor A2 Module 5 Lessons 61–75 as varied, connected Nature and Community learner journeys with explicit bilingual activity data, practical problem-solving, and learner evidence.
- [x] Reauthor A2 Module 6 Lessons 76–90 as varied, connected Choices and Plans learner journeys with explicit bilingual activity data, comparison, future planning, and learner evidence.
- [x] Reauthor A2 Module 7 Lessons 91–105 as varied, connected Communication and Technology learner journeys with explicit bilingual activity data, message clarity, safe digital communication, and learner evidence.

- [x] Reauthor, wire, test, validate, and checkpoint B1 Module 8 (Lessons 106–120) as varied bilingual culture, identity, belonging, perspective, and mediation journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B1 Module 9 (Lessons 121–135) as varied bilingual Problem-solving and Decisions journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B1 Module 10 (Lessons 136–150) as varied bilingual future pathways, personal goals, choices, applications, and reflective-transfer journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B2 Module 1 (Lessons 1–15) as varied bilingual advanced routines, work, study, argument, and evidence-led learner journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B2 Module 2 (Lessons 16–30) as varied bilingual social change, institutions, collaboration, explanation, and critical-response journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B2 Module 3 (Lessons 31–45) as varied bilingual systems, pressure, media, professional judgement, and nuanced recommendation journeys aligned to the authoritative lesson arc.

- [x] Reauthor, wire, test, validate, and checkpoint B2 Module 4 (Lessons 46–60) as varied bilingual work, heritage, verification, institutional trust, data interpretation, and negotiated public-choice journeys aligned to the authoritative lesson arc.

- [x] Prepare, author, review, validate, and checkpoint B2 Module 5 (Lessons 61–75) through the six-agent operating system, preserving compact objective-led lessons and the owner-defined skill cadence.

- [x] Apply and audit the owner-defined programme-level skill cadence, explicit per-lesson retrieval/check, and checkpoint/assessment rhythm across the active B2 Module 4 packet before validation, then use it as a mandatory architecture control for all subsequent modules.

- [x] Encode and audit staged skill layering: early A1 may introduce a short supported reading or writing route by roughly Lesson 5 using familiar language, while no lesson is packed with every skill by default.

- [x] Audit the current curriculum work against the supplied six-agent protocol; create the shared Curriculum Bible, specialist handoff records, corpus-level pedagogical QA gates, visual-experience review criteria, and assessment-architecture validation before any further lesson authoring.
