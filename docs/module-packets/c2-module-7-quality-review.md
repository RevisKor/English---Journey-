# C2 Module 7 Quality Review

## Scope

C2 Module 7 covers Lessons 91–105 and moves from institutional change and expertise through rights-based reasoning, access, and ethical urban design. It deliberately follows Module 6's risk, discourse-power, and adaptation arc without repeating its central decision sequence.

## Pedagogical review

Each lesson has one primary objective and one compact bilingual retrieval check. The sequence uses a non-rotational cadence: close reading establishes how expertise and omissions are represented; interaction and listening rehearse institutional qualification; writing asks for evidence-limited recommendations; rights lessons distinguish interference, authority, proportionality, precedent, and remedy; the final lessons transfer these distinctions into accessible and ethically revisable design decisions.

The module includes seven or more activity kinds, at least five reading experiences with checks, at least three writing experiences, and three listening experiences. Listening records provide transcript support as a progressive disclosure rather than a first-view default. The final lesson is an assessment, not another content introduction.

## Bilingual and level review

English remains the working language for C2 analysis, while Arabic is present in objectives, retrieval prompts, selected explanations, reading checks, and activity support. The language is intentionally precise and mediation-oriented: learners must qualify claims, compare competing interests, state what evidence does not establish, and make revision conditions visible.

## Visual and disclosure review

The experience map gives every lesson a first-view answer to what the lesson is, what to do, what matters, and what comes next. Density varies between light, normal, and deep. Supports such as word help, extended rationale, Arabic help, worked examples, and external-AI prompts are revealed progressively. Transcript support is explicitly delayed until after an initial listening attempt.

## Assessment review

The module uses embedded retrieval throughout, a checkpoint at Lesson 95, a second checkpoint at Lesson 100, and a cumulative transfer assessment at Lesson 105. The final assessment requires the learner to identify competing interests, protect access, propose a safeguard, and state a revision trigger. It therefore evaluates transfer rather than recognition of isolated vocabulary.

## Engineering review

Module 7 is integrated into `shared/course/c2.ts` with highest precedence for Lessons 91–105, while Modules 1–6 and legacy lessons retain fallback coverage. Focused C2 regressions verify lesson count, authored activity presence, archetype variety, bilingual retrieval, first-view completeness, reading checks, writing cadence, listening transcript disclosure, and final assessment semantics. TypeScript and the focused C2 suite pass. The recurring development database SSL synchronization warning is unrelated to curriculum source changes.

## Release decision

Module 7 is ready for the full release gate and checkpoint once the complete Vitest suite, production build, curriculum audit, and rearchitecture audit pass.
