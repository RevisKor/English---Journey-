# C2 Module 6 Quality Review — Risk, Discourse Power, and Lifelong Adaptation

## Scope

Lessons 76–90 form a fifteen-lesson C2 module that moves from calibrated risk communication through agency, framing, distributed expertise, and humane adaptation. The module ends with an accountable-adaptation transfer assessment rather than a recall-only test.

## Pedagogical review

Each lesson has one dominant objective and one short bilingual retrieval check. The sequence is deliberately non-rotational: listening establishes distinctions before interaction; reading makes institutional commitments and agency visible; grammar isolates presupposition; writing requires evidence-disciplined reframing and a realistic learning proposal; speaking rehearses crisis leadership and humane professional explanation; review lessons consolidate transfer questions; and Lesson 90 integrates the complete arc.

The module's progression is controlled. Lessons 76–80 separate hazard, exposure, likelihood, consequence, uncertainty, and proportionate action. Lessons 81–85 then move from agency and presupposition to institutional framing and responsibility. Lessons 86–90 connect expertise, professional change, access, support, and revision. Retrieval remains bilingual without forcing previous vocabulary into unnatural contexts.

## Visual and disclosure review

Every experience provides a first-view answer to what the lesson is, what the learner should do, what matters, and what comes next. Density varies between light, normal, and deep. Listening lessons are audio-first in the data model: transcript support is disclosed progressively rather than shown as the first encounter. Grammar and review lessons intentionally omit unnecessary encounter stages so the interface does not imply that every lesson must contain every stage.

Activity identity remains semantic and archetype-led. The map uses listening, interaction, reading, speaking, review, grammar, writing, and assessment routes without relying on a rigid rotation. Supports distinguish transcript, Arabic help, worked examples, extended rationale, word support, and external-AI prompts.

## Assessment review

Lesson 80 checks risk-control questions. Lesson 89 rehearses the six module transfer questions: risk, distribution, agency, framing, expertise, and adaptation evidence. Lesson 90 requires a defined audience, source limits, visible responsibility, accessible recommendation, and a revision trigger. External AI is optional and remains an external grading route; no per-request AI dependency is introduced.

## Engineering review

The activity corpus and experience map are integrated with Module 6 precedence ahead of Modules 1–5 for Lessons 76–90. The corpus uses the shared `LessonActivity`, `InteractionTurn`, `SpeakingLine`, `ReadingCheck`, and retrieval contracts. Focused regressions cover fifteen-lesson length, one activity per lesson, archetype variety, bilingual retrieval, first-view completeness, reading cadence, writing cadence, transcript disclosure, and final assessment semantics.

## Gate evidence

- Focused C2 regression: 9 tests passed.
- TypeScript check: passed.
- Full Vitest suite, production build, curriculum audit, and rearchitecture audit: required before checkpoint.
- Existing external database SSL startup synchronization warning is environmental and unrelated to curriculum source changes.

## Decision

Module 6 is ready for full release validation. The next curriculum milestone is C2 Module 7; credential-dependent Vercel verification and administrator-role evidence remain user-controlled items.
