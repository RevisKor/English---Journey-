# C1 Module 6 Quality Review

## Scope

This review covers Lessons 81–96, a stewardship-and-futures arc in which learners turn specialist evidence into a responsible public recommendation. The review follows the authoritative Module 6 architecture packet, authored activity corpus, adaptive experience map, and integrated C1 pipeline.

## Pedagogical review

Each lesson has one primary objective and a short bilingual retrieval check. The sequence develops a defensible public recommendation step by step: learners distinguish expertise from evidence weight, qualify claims, compare sources, identify omitted assumptions, track consequences, preserve dissent, and communicate a proportionate course of action. The module deliberately varies encounter, notice, reading, grammar, listening, interaction, speaking, writing, review, synthesis, and assessment routes instead of rotating a universal lesson template.

The skill cadence is appropriate for C1. Reading and source interpretation recur across Lessons 81, 82, 86, 88, 92, and 95–96. Listening is audio-first in Lessons 84 and 89, with transcript support disclosed progressively. Writing escalates through audience-sensitive formal outputs in Lessons 85, 90, 95, and 96. Interaction and speaking appear when learners must clarify, reformulate, negotiate, or brief rather than as decorative additions. Grammar is embedded in useful moves such as hedging, concessive comparison, attribution, and proportionality.

Retrieval is explicit in all sixteen authored records and is bilingual. Checks ask learners to transfer a meaning-making move—such as separating a finding from an inference, qualifying certainty, naming an omitted assumption, or stating a review condition—rather than merely recognise isolated vocabulary.

## Visual and disclosure review

The experience map gives every lesson a semantic archetype, density level, first-view explanation, selected stages, and progressive supports. The first view answers the learner’s four navigation questions: what this is, what to do, what matters, and what comes next. English remains the primary route while Arabic explanations, objectives, retrieval prompts, and support lines remain immediately available.

Listening routes present the purpose and audio task before revealing transcript-like support. Writing and assessment routes expose the external-AI prompt pathway without implying that the site sends learner work to a model. Labels and icons identify activity types so colour is not the only cue. Detailed source framing and language support remain available on demand, protecting a calm first view for a dense C1 topic.

## Assessment review

The module samples evidence interpretation, attribution, calibrated uncertainty, fair reformulation, source comparison, formal writing, and concise oral synthesis. Lessons 90 and 94 are meaningful-use evidence points rather than isolated drills. Lesson 96 is the module checkpoint: it requires a 300–360-word formal recommendation and a 90-second spoken brief for a defined public audience. The learner must synthesise sources, acknowledge a limit, propose proportionate safeguards, and make the recommendation readable without manufacturing certainty.

The assessment therefore measures communicative judgement and transfer. It does not reduce the module to vocabulary recall, and its retrieval checks remain short enough to preserve the compact-lesson requirement.

## Engineering evidence

The focused C1 curriculum and learner-workspace regressions pass after the staged fallback moved from Lesson 81 to Lesson 97. The focused suite now covers 45 tests across the C1 curriculum and workspace files. TypeScript compilation is clean. The full release gate remains `pnpm check`, `pnpm build`, `pnpm audit:curriculum`, `pnpm audit:rearchitecture`, and the complete Vitest suite before checkpointing.

The recurring development database SSL startup synchronization warning is unrelated to authored curriculum content and does not affect the file-backed curriculum, workspace rendering, or focused tests.

## Decision

C1 Module 6 is pedagogically coherent, visually aligned with the shared English Journey system, and ready for the full engineering gate. Lesson 97 is the correct staged boundary for the next un-authored C1 route. Module 7 can begin only after the full gate and checkpoint are recorded.

## Evidence

- `docs/module-packets/c1-module-6-architecture.md`
- `shared/course/c1-module-6-authored-activities.ts`
- `shared/course/c1-module-6-experiences.ts`
- `shared/course/c1.ts`
- `shared/course/c1.test.ts`
- `client/src/components/ExternalLessonWorkspace.test.tsx`
