# B2 Module 6 Quality Review

## Scope

B2 Module 6 covers Lessons 76–90 in the authoritative draft. The module develops responsibility and attribution, statistical interpretation, uncertainty, accessibility, representation, evidence-led reform, calibrated risk, expertise and trust, compromise, causal explanation, unequal progress, careful translation, belonging, public-policy argument, and responsible technology. The review follows the six-agent operating system and the owner-defined pacing controls.

## Pedagogical review

Each authored lesson has one primary objective and one compact bilingual retrieval/check record. The corpus does not force vocabulary, grammar, reading, writing, listening, speaking, interaction, and assessment into every lesson. It uses a purpose-led sequence: grammar (76), reading (77), interaction (78), writing (79), speaking (80), writing (81), listening (82), reading (83), interaction (84), grammar (85), reading (86), listening (87), writing (88), transfer assessment (89), and module assessment (90).

This is a balancing decision, not a rotation. Reading is frequent at B2, writing appears at several meaningful production points, listening is distinct at Lessons 82 and 87, and speaking is used where foregrounding an absent voice serves the objective. Grammar is separated at Lessons 76 and 85 rather than being placed in consecutive dominant grammar lessons. Retrieval is embedded in all fifteen lessons through a short check connected to the primary objective. Lessons 89 and 90 provide transfer and module-level assessment rather than turning every lesson into a test.

The skill layering also follows the broader programme rule: the course should introduce a new mode when it is useful and supported, not because a rotation demands it. The same principle is intended for early A1, where a short reading or writing route may appear around Lesson 5 using familiar language without turning the lesson into an all-skills bundle.

## Visual and progressive-disclosure review

The existing learner workspace remains calm and semantically labelled. The representative authored routes use the reusable semantic card language and bilingual labels rather than decorative density. Retrieval appears as a labelled “Quick check · تحقق سريع” card. Listening uses an audio-first route with the transcript behind “Reveal transcript / أظهر النص”, preserving challenge while keeping an accessible support available.

The Module 6 records provide only the payload needed by each route. Reading exposes a focused source, writing exposes a bounded prompt, interaction exposes a negotiation or choice, grammar exposes a small pattern focus, speaking exposes a deliberate production task, and listening exposes a transcript-controlled route. This keeps rich source data behind progressive disclosure instead of presenting every field at once.

## Assessment review

Lesson 89 checks the learner’s ability to construct a qualified public-policy argument with evidence, rebuttal, and a balanced recommendation. Lesson 90 is the module assessment: the learner evaluates evidence of algorithmic bias and proposes safeguards that balance fairness with practical consequences. These assessments match the B2 emphasis on calibrated judgement, evidence, responsibility, and transfer.

Every authored activity includes an expected-evidence description for its short retrieval check. The checks are intentionally formative and compact; they do not replace the larger transfer and module-assessment routes.

## Validation evidence

- TypeScript validation: passed after restoring the Module 6 corpus and experience map against the compiled contracts.
- Focused B2 curriculum and learner-workspace suite: 43 tests passed.
- Curriculum regression: Module 6 authored precedence, retrieval checks, listening transcript support, assessment routes, and fallback boundary to Lesson 91 pass.
- Workspace regression: Module 6 reading and calibrated-risk listening disclosure routes pass.
- Visual review: representative authored routes use the existing reusable learner workspace; no Module 6-specific UI implementation was required.
- Known unrelated runtime note: the development server continues to report the existing external database SSL startup-sync warning; curriculum tests and client rendering remain operational.

## Gate decision

**PASS with documented runtime note.** Module 6 is ready for the controlled application/shared-course/build/audit gates. The compact-lesson rule, explicit retrieval contract, non-rotational skill cadence, staged skill layering, and distinct listening disclosure remain acceptance criteria for subsequent modules.
