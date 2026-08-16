# English Journey Overhaul Handoff

## What is now implemented

English Journey now has an additive A1–C2 lesson architecture. Every authored lesson carries a CEFR-aware lesson family, a seven-stage progression, activity payloads, detailed grammar teaching guidance, bilingual mentor transitions, and level-aware reading, writing, speaking, interaction, review, and assessment hooks. The existing lesson URLs, gated progression rules, catalog synchronization, and milestone checkpoint provenance remain compatible.

The learner workspace now renders a continuous mentor-led activity deck. Visual-vocabulary cards include a category label, accessible inline visual asset, English and Arabic word meaning, pronunciation, bilingual example sentences, listen, reveal, and reviewed-state actions. Speaking activities provide replay, next-sentence, and complete-dialogue controls. Reading activities expose bilingual comprehension prompts and answer controls. Grammar panels render the concept, terminology, use cases, Arabic-speaker notes, exceptions, positive/negative/question forms, topic-aware short answers, and examples.

The dashboard now provides expanded first-use onboarding and a per-module word-bank review surface. Word-bank familiarity is derived from lesson progress and can also be changed through learner review actions, with browser-local persistence for the current pilot. Course module metadata is first-class in the shared course definitions and learner map, and course-router validation derives valid lesson and module ranges from the selected course rather than fixed four-module or twenty-four-lesson limits.

The learner-facing AI architecture remains external-prompt-first. Server procedures prepare lesson-aware prompts for the learner’s chosen external AI tool, avoiding per-request application AI charges. The dormant protected server-side AI router is intentionally retained as a future paid/local-model migration seam, but it is not called by the current learner workspace.

## Validation evidence

The latest validation completed successfully with **31 Vitest files and 92 tests passing**, TypeScript checking cleanly, and a successful production build. Desktop and mobile preview screenshots were captured for the public entry experience and the first-use tutorial overlay. The production build reports only a non-blocking bundle-size warning from Vite; it does not report a compilation or deployment error.

## Deliberate remaining work

The long-term content target is larger than the currently authored catalog: the architecture supports approximately six or seven modules per level and longer modules, but the existing authored A1–C2 course counts and checkpoint locations are preserved until each catalog expansion is deliberately authored and synchronized. The remaining QA items are authenticated owner-session evidence for direct review dispatch, a real mounted Home/AppShell tutorial regression, and full authenticated end-to-end navigation and gating verification. These are retained as open checklist items rather than represented as completed.

## Next recommended phase

The next implementation phase should author and synchronize the larger module plans incrementally, starting with a deeper A1 everyday-domain sequence and then applying the same standard to A2–C2. Each expansion should add vocabulary, grammar, reading, writing, speaking, interaction, review, and checkpoint question banks together, followed by database synchronization and authenticated UI verification.
