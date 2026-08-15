# English Journey — Pilot Handoff

## What is ready

English Journey is a **bilingual A1 English-learning pilot** for Arabic-speaking learners. It includes Manus OAuth sign-in, persistent learner preferences and progress, a 20-lesson A1 path containing **500 vocabulary items**, 20 bilingual grammar topics, British/American speech preference, server-side AI support, lesson quizzes, module gates, XP, streaks, and a spaced-review queue.

## Learner flow

1. Sign in from the landing page.
2. Open **Lesson 01** from the course map.
3. Work through Words, Grammar, Speak, Read, and Write.
4. Use **Ask your tutor** for a bilingual explanation of any current lesson word.
5. Complete the Quiz tab with at least **80%** to unlock the next lesson.
6. Revisit missed items through the warm-up review before a subsequent lesson.
7. Complete a module test after every five lessons to continue to the next module.

## AI operations

The AI tutor, controlled reading practice, and writing feedback run **server-side**. The pilot is configured with conservative model selection, response caps, and per-learner daily action controls to keep a six-person pilot predictable. No learner needs to supply an API key.

## Validation completed

Run the following from the project root:

```bash
node scripts/validate-a1-curriculum.mjs
pnpm test
pnpm check
pnpm build
```

The current validation confirms the A1 structure has 500 bilingual vocabulary records and 20 bilingual grammar topics. The test suite covers curriculum shape, assessment rules, protected course mutations, and AI response handling.

## Pilot notes

Browser text-to-speech depends on voices installed on the learner’s device. The interface requests British English by default (`en-GB`) and supports American English (`en-US`) in the learner preference. For a broad public release, commission a native Arabic-English educator to review the instructional nuance of every translation and example; the included validator checks structure and coverage rather than replacing pedagogical editorial review.

## Next recommended iteration

After you evaluate the AI experience, expand the same data and course architecture to A2–C2. For a larger audience, move from the built-in pilot configuration to a dedicated AI provider or model-routing strategy, add rate observability, and conduct a full Arabic instructional editorial pass.
