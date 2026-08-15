# English Journey — Pilot QA Record

**Scope:** authenticated A1 learning journey for the small pilot (up to six learners).

| Area | Evidence | Result |
|---|---|---|
| Curriculum completeness | `scripts/validate-a1-curriculum.mjs` validates all 500 vocabulary entries and 20 grammar topics for required bilingual, pronunciation, and structural fields. | Pass |
| Server rules | Vitest covers course data, assessment plans, streak rules, AI responses, protected course mutations, module prerequisites, pass/fail scoring, and warm-up persistence dispatch. | Pass |
| Responsive UI | Visual checks completed for the authenticated desktop dashboard, desktop A1 lesson workspace, and 375px mobile dashboard. | Pass |
| Arabic support | Learning cards, grammar notes, lesson labels, and key instructions use explicit `dir="rtl"` Arabic regions alongside English content. | Pass |
| Keyboard semantics | Vocabulary cards provide button semantics, `tabIndex`, and Enter/Space handlers; actions use native buttons. | Pass by code review |
| Loading and empty behavior | The public experience renders immediately while auth settles; no-review learners skip the warm-up; dashboard fallbacks render zero-state metrics safely. | Pass by code review |
| Error behavior | AI allowance rejection and structured-response handling are unit-tested; assessment components include loading and error display states. | Pass by test and code review |

## Pilot handoff checks

Before inviting learners, sign in once with each intended account and complete Lesson 1's words, grammar, AI tutor, reading, writing, and quiz flows in the live preview. Browser speech voices vary by operating system, so confirm that an `en-GB` voice is installed where British playback is important.

> A professional Arabic-English curriculum editor should still perform a native-speaker review before any broad public launch. This pilot validator verifies coverage, fields, and structure; it does not replace human pedagogical review.

