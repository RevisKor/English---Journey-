# English Journey — Final A1–C2 QA Matrix

## Validation scope

This matrix records the final validation pass for the all-level curriculum overhaul. The project currently exposes authored A1–C2 course definitions, dynamic course-derived routing, milestone and cumulative assessments, bilingual learner guidance, visual vocabulary, speaking controls, reading and writing activities, module word-bank review, and protected owner review.

| Area | Evidence | Result |
|---|---|---|
| A1–C2 curriculum shape | `shared/course/a1.test.ts`, `a2.test.ts`, `b1.test.ts`, `b2.test.ts`, `c1.test.ts`, `c2.test.ts`, and `Home.route.test.tsx` | Passed. Every authored course resolves its declared lesson count, boundary lesson, Arabic titles, activity plans, grammar teaching guide, and module metadata. |
| A1 beginner progression | `shared/course/a1.test.ts` authored-domain regression | Passed. Twenty ordered domains run from greetings and identity through everyday problem solving and A1 review; each lesson retains 25 words and bilingual beginner scaffolding. |
| Dynamic navigation | `server/routers/course.test.ts`, `shared/course-route.test.ts`, `Home.route.test.tsx` | Passed. Validation derives lesson and module ranges from course definitions rather than fixed four-module or twenty-four-lesson caps. Locked direct entry remains rejected. |
| Gated progression | `server/assessment-rules.test.ts`, `shared/course/assessment-scope.test.ts`, `Home.route.test.tsx` | Passed. Lesson, milestone, and cumulative gates remain distinct; direct final-lesson entry is accepted only for an unlocked learner. |
| Personalized assessments | `server/course-catalog-sync.test.ts`, `shared/course/assessment-questions.test.ts`, `shared/course/quiz.test.ts`, `shared/course/*-quiz.test.ts` | Passed. Question banks preserve level/module/lesson provenance, checkpoint lesson numbers, active rows, count expectations, and varied-attempt selection rules. |
| Lesson activity families | `shared/course/activity-plan.test.ts`, `client/src/components/A2LessonWorkspace.test.tsx` | Passed. All authored lessons receive CEFR-aware staged activities. Visual vocabulary, interaction, speaking, reading, writing, review, and assessment families render with their expected data. |
| Grammar teaching | `shared/course/activity-plan.test.ts`, `A2LessonWorkspace.test.tsx` | Passed. Grammar guides expose terminology, forms, use cases, short answers, examples, Arabic notes, mistakes, exceptions, and progressive practice. |
| Arabic support | `Home.route.test.tsx`, `A2LessonWorkspace.test.tsx`, `shared/course/a1.test.ts`, mentor-guidance tests | Passed. Course titles, lesson titles, onboarding, mentor transitions, prompts, examples, and beginner scaffolding contain bilingual support. |
| Word-bank review | `shared/course/word-bank.test.ts`, `Home.route.test.tsx` | Passed. Module aggregation respects declared lesson membership, and the dashboard exposes pronunciation, review, and reviewed-state interactions with local persistence. |
| Owner review | `Home.route.test.tsx`, `ContentReview.tsx` initial-data loaded-state regression, protected admin router tests, authenticated preview verification | Passed. The protected review contract requests catalog and selected lesson detail; the actual review component is tested beyond loading state with rendered modules, lesson detail, learning outcome, and learner-view action. |
| Onboarding and help | `Home.tutorial.test.ts`, `Home.route.test.tsx` | Passed. First-use storage semantics, tutorial copy, authenticated shell contract, and mobile Guide affordance are covered. |
| Responsive and keyboard behavior | Desktop and mobile preview screenshots; sidebar and control regressions; semantic button controls in lesson workspace and review UI | Passed for inspected layouts and automated control contracts. The sidebar remains independently scrollable and collapsible; speaking, review, quiz, and Guide actions are buttons with accessible labels. |
| Production readiness | `pnpm check`, `pnpm test -- --`, prior production build, desktop/mobile screenshots | Passed. Final validation reports 31 test files and 97 tests passing with TypeScript clean. |

## Final command evidence

```text
pnpm check
> tsc --noEmit

pnpm test -- --
Test Files  31 passed (31)
Tests       97 passed (97)
```

The remaining AI-generation behavior is intentionally external-prompt based. The dormant server-side AI router remains isolated as a future migration seam; the current learner flow does not invoke per-request model generation from the browser.

## Explicit interpretation

The curriculum is structurally prepared for longer modules and additional authored content through dynamic course definitions, first-class module metadata, shared activity plans, and course-derived route validation. The current authored catalog remains A1: 20 lessons, A2: 20 lessons, B1: 24 lessons, B2: 24 lessons, C1: 20 lessons, and C2: 16 lessons. Expanding a level beyond those authored counts is now a content-authoring task rather than a routing or schema rewrite.
