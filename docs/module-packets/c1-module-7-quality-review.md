# C1 Module 7 Quality Review

## Scope and learning arc

C1 Module 7 covers Lessons 97–112 and extends the C1 studio from evidence stewardship into **public reasoning under disagreement**. The module asks learners to move from defending a conditional proposal, through calibration, source comparison, framing, lived experience, consent, representation, metrics, and deliberative design, to a final historical-judgement recommendation.

| Review dimension | Evidence in Module 7 | Result |
| --- | --- | --- |
| Primary objective | Every lesson has one dominant communicative or interpretive purpose, from qualifying a claim to defending a reviewable recommendation. | Pass |
| Bilingual access | Titles, objectives, scenarios, interaction turns, reading texts, writing prompts, retrieval prompts, and expected evidence include Arabic support where the activity requires it. | Pass |
| Compactness | Lessons use a single authored activity route with estimated times from 20–38 minutes; the final assessment is intentionally deeper. | Pass |
| Retrieval | Every authored activity includes an English and Arabic retrieval prompt plus expected evidence in both languages. | Pass |
| Progressive disclosure | Listening routes provide a transcript support only as a disclosed aid; writing routes provide external-AI prompts rather than an in-product paid model call. | Pass |

## Pedagogical review

The module does not rotate mechanically through reading, writing, speaking, and listening. The sequence begins with interaction and stance calibration because learners need a reason to use proposal language before they analyse it. Lessons 99 and 104 use listening for spoken concession, omission, and transparency. Lessons 101, 102, 106, and 108 use reading to develop increasingly demanding source comparison and interpretation. Lessons 105 and 112 own formal writing, while Lesson 111 gives the learner a spoken deliberative-design rehearsal. Lesson 110 is deliberately a retrieval transfer lesson rather than another content-heavy explanation.

The skill cadence is appropriate for C1. Reading appears frequently enough to support source-aware interpretation, writing is concentrated around meaningful proposals rather than forced into every lesson, and listening and speaking are distributed across authentic public-reasoning scenarios. Lesson 100 provides the small ten-lesson checkpoint, while Lesson 112 functions as the module assessment and transfers the evidence moves to a fresh archival controversy.

> The module’s core progression is: acknowledge pressure → calibrate certainty → compare evidence → inspect framing → preserve lived experience → test convenience → question power → evaluate metrics → design deliberation → make a responsible historical judgement.

The activity corpus also supports transfer. For example, a learner first distinguishes a positive result from permission to expand, then later applies the same distinction to a public metric and finally to a heritage recommendation. This is more demanding than simple repetition because the language move travels across domains while the topic changes.

## Archetype and density review

The experience map uses multiple dominant archetypes rather than a universal lesson layout. The sixteen lessons include interaction, grammar, listening, integration, reading, writing, real-world, review, speaking, and assessment routes. Density alternates between normal and deep according to the reasoning demand. The deep lessons are concentrated around source comparison, synthesis, formal writing, and the final assessment; lighter review and listening rehearsals protect attention and prevent every lesson from becoming an essay.

| Lessons | Dominant experience | Intended learner work |
| --- | --- | --- |
| 97, 107 | Interaction / real-world | Respond to objections and test ethical conditions in context. |
| 98, 103 | Grammar / language focus | Calibrate certainty and responsibility through stance and conditional language. |
| 99, 104, 109 | Listening | Hear concession, limitation, sampling concerns, and metric trade-offs before revealing support. |
| 100, 110 | Integration / review | Transfer source-aware moves to a new policy decision. |
| 101, 102, 106, 108 | Reading | Infer framing, compare methods, preserve lived experience, and examine decision power. |
| 105 | Writing | Produce a bounded, reviewable formal conclusion. |
| 111 | Speaking | Defend a deliberative forum with diplomatic rebuttal. |
| 112 | Assessment | Synthesize provenance, uncertainty, historical interpretation, and consequence. |

Every experience includes the first-view fields **What it is, What to do, What matters, and What next**, ensuring that rich content remains navigable rather than overwhelming. Progressive supports are semantic and purposeful: worked examples, Arabic help, transcript disclosure, external-AI prompts, and extended rationale are used where the objective calls for them.

## Visual and disclosure review

Module 7 uses the existing learner-workspace visual language rather than introducing a new component pattern. Activity semantic roles distinguish grammar, activity, examples, retrieval, and assessment through labels and icons as well as restrained colour. The authored data remains rich, but the learner sees a bounded route: one action, one reason, and one bridge to the next lesson.

The listening lessons include spoken lines but mark `transcript` as a progressive support. This keeps the transcript available for careful review without making the first listen a reading exercise. Writing lessons include `external-ai-prompt`, which preserves the project’s no-per-request-AI-cost decision and makes the grading workflow explicit: the learner copies a structured prompt to an external tool of their choice.

The final assessment does not expose every support as mandatory content. Worked examples and extended rationale are available for preparation, while the learner still has to make the final judgement independently. This maintains progressive disclosure and prevents a dense C1 dossier from becoming an undifferentiated wall of text.

## Assessment and retrieval review

The module includes a retrieval check in all sixteen authored activities. The checks are not spelling-only prompts; they ask learners to retrieve a reasoning move and show evidence of transfer. Examples include distinguishing a measured result from a mandate, separating visibility from decision-making power, and connecting a forecast consequence to a mitigation.

The final assessment requires a 340–420-word formal recommendation about a contested monument. It asks the learner to attribute at least two sources, acknowledge uncertainty, explain likely consequences, and recommend a concrete next step. The assessment therefore measures the C1 target as a combination of **source handling, calibrated stance, ethical representation, formal register, and actionable judgement**, rather than rewarding a memorised essay structure.

## Engineering review

Module 7 is integrated into `shared/course/c1.ts` with authored activities and experiences taking precedence over the generated draft route for Lessons 97–112. The C1 regression suite verifies lesson count, module boundaries, bilingual completeness, archetype diversity, explicit retrieval, reading checks, writing prompts with external-AI support, listening transcript disclosure, speaking presence, and assessment presence. The learner-workspace regression has also advanced its fallback boundary to Lesson 113, the first un-authored C1 lesson after Module 7.

The focused validation completed successfully:

| Gate | Result |
| --- | --- |
| TypeScript compilation | Passed |
| C1 curriculum regression | 8 tests passed |
| Learner-workspace regression | 38 tests passed |
| Combined focused suite | 46 tests passed |

The recurring development database SSL synchronization warning is unrelated to the curriculum files and does not affect the authored-content or client regression results.

## Review decision

**C1 Module 7 is ready for the full engineering gate and checkpoint once the remaining repository-wide audits complete.** Its content is compact, bilingual, varied in archetype, explicit about retrieval, and progressively disclosed. The next curriculum milestone is C1 Module 8, while Lesson 113 remains the intentional learner-workspace fallback boundary until that module is authored.
