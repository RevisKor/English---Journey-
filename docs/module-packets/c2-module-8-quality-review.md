# C2 Module 8 Quality Review

## Scope

C2 Module 8 covers Lessons 106–120 and develops narrative reliability, repair, public mediation, and ethical persuasion. It is authored as fifteen compact bilingual journeys rather than a repeated lesson template.

## Pedagogical review

Each lesson has one dominant objective and one explicit English/Arabic retrieval check. The arc moves from testing narrative reliability, through repair and institutional response, into audience-aware mediation and ethical persuasion. The sequence deliberately varies discover, notice, reading, listening, interaction, speaking, synthesis, review, and assessment routes. Retrieval is continuous but remains tied to the current theme rather than forcing unrelated earlier vocabulary into every task.

The module includes at least seven activity kinds, three reading tasks with comprehension checks, three writing tasks, and three listening tasks. Listening activities expose transcripts progressively rather than placing them in the first view. The final lesson is a transfer assessment requiring evidence disclosure, uncertainty control, acknowledgement of harm, a defined audience, and a safeguard against manipulation.

## Bilingual and progressive-disclosure review

Every authored activity provides an English objective, Arabic objective, English task direction, Arabic task direction, and bilingual retrieval evidence. C2 learners see English first, while Arabic support remains available for difficult concepts and retrieval prompts. Experience maps provide the four learner-facing first-view answers: what the lesson is, what to do, what matters, and what comes next. Extended rationale, worked examples, transcript support, and external-AI prompts are disclosed by activity need rather than shown as a dense wall of content.

## Assessment review

The module assesses interpretation, source comparison, repair language, public explanation, register control, and responsible persuasion. Writing tasks use external-AI prompts for optional feedback and do not invoke per-request AI costs inside the platform. The final assessment checks transfer across narrative, repair, mediation, and persuasion rather than rewarding recall alone.

## Engineering review

Module 8 is integrated with highest precedence for Lessons 106–120 in `shared/course/c2.ts`. The focused C2 regression verifies fifteen authored lessons, single-activity compactness, activity diversity, bilingual retrieval, first-view completeness, reading and writing cadence, transcript disclosure, and assessment semantics. The full release gate passed:

- TypeScript check: passed.
- Focused C2 suite: 11 tests passed.
- Full Vitest suite: 50 files and 278 tests passed.
- Production build, including the serverless adapter: passed.
- Curriculum audit: passed with 865/865 lessons and no warnings.
- Rearchitecture audit: passed with no missing activities and no missing lessons.

The recurring development database SSL synchronization warning is unrelated to the curriculum source changes and does not affect the static curriculum gates.

## Decision

C2 Module 8 is acceptable for checkpointing as an authored curriculum milestone. The next queued curriculum milestone is C2 Module 9. Vercel deployment verification and administrator-role confirmation remain evidence-gated external tasks.
