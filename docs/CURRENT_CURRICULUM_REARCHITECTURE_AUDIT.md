# Current Curriculum Re-architecture Audit

**Audit source:** `scripts/audit-rearchitecture.ts` run against the live lesson arrays on 17 August 2026. The full machine-readable output is `docs/research/live-rearchitecture-audit.json`.

## Executive result

The course is **not yet architecturally complete** under the approved Curriculum Bible. A1, A2, and B1 have explicit experiences and authored activity coverage; B2 has explicit experiences only for Lessons 1–30. C1 and C2 currently have no explicit `LessonExperience` records. The existing generated activities are usable fallback scaffolds, but their repeated route signatures make them unsuitable as the final learner experience.

| Level | Lessons | Explicit experience | Explicit activity | Architecture status |
|---|---:|---:|---:|---|
| A1 | 90 | 90/90 | 90/90 | Re-audit and selectively revise repetition/imbalance. |
| A2 | 135 | 135/135 | 135/135 | Re-audit and selectively revise repeated single-route lessons. |
| B1 | 150 | 150/150 | 150/150 | Re-audit and selectively revise interaction/reading/writing concentration. |
| B2 | 150 | 30/150 | 150/150 | Re-author Modules 3–10; revise Modules 1–2 against formal handoffs. |
| C1 | 160 | 0/160 | 160/160 fallback routes | Re-architect before content authoring. |
| C2 | 180 | 0/180 | 180/180 fallback routes | Re-architect before content authoring. |

## Evidence and diagnosis

| Observation | Evidence | Interpretation | Required response |
|---|---|---|---|
| Explicit first-view guidance is present wherever an experience exists. | No first-view gaps in A1/A2/B1/B2 Modules 1–2. | Existing experience metadata meets learner-orientation baseline. | Preserve and QA its content during revisions. |
| A1 has 13 archetypes but interaction activities are common. | 61 interaction activities across 90 lessons; six assessment/review route repeats. | Diversity exists, but activity mechanics repeat more than desired. | Run module-level route audits; revise only high-frequency patterns. |
| A2 is structurally varied but has concentrated single-activity routes. | `interaction:real-context` repeats 20 times; reading introduction 16; speaking guided-practice 15. | Dominant archetype variety does not guarantee varied activity sequences. | Apply route-pattern caps and different task mechanics in corrective passes. |
| B1 leans heavily toward interaction, reading, and writing. | 26 interaction, 24 reading, 21 writing archetypes; 28 identical real-context interaction routes. | Appropriate for B1 independence, but current route repetition needs local redesign. | Preserve level appropriateness while diversifying stage/payload patterns. |
| B2 is only partially authored. | 120 lessons missing experiences, Lessons 31–150. | Generated fallbacks must not be treated as final content. | Architecture first, then author Modules 3–10 through six handoffs. |
| C1 and C2 have no experience records. | 160/160 and 180/180 missing experience respectively; top generated routes repeat 23–26 times each. | Both levels remain a high-priority architecture and content gap. | Design level/module blueprints before writing activity corpora. |

## Non-negotiable reauthoring gates

1. The architect creates a module map and every lesson blueprint before content creation.
2. A lesson selects its archetype, density, selected stages, and omitted-stage rationale from the objective—not a calendar rotation.
3. The audit flags any route signature used repeatedly within a module; repetition needs a written pedagogical rationale or a redesign.
4. Vocabulary, grammar, and retrieval are reused only in contexts where they help the learner accomplish the current task.
5. Pedagogical QA, visual/disclosure QA, assessment QA, engineering checks, and learner-route verification all produce evidence before a module is called complete.
6. A1–B1 corrections are **selective**, based on evidence. B2 Modules 3–10 and all C1/C2 work are **architecture-first reauthoring**.

## Prioritised backlog

| Priority | Scope | Why now | First controlled deliverable |
|---:|---|---|---|
| 1 | B2 Modules 3–10 | Largest partially authored active level; 120 lessons lack explicit experiences. | B2 module architecture map and Module 3 specialist packet. |
| 2 | C1 | 160 fallback lessons with no experience layer. | C1 level/module architecture map. |
| 3 | C2 | 180 fallback lessons with no experience layer and highest repetition. | C2 level/module architecture map. |
| 4 | A2/B1 targeted pass | Existing authored lessons need pattern/rhythm QA, not wholesale replacement. | Top-repetition module diagnostics. |
| 5 | A1 targeted pass | Strong coverage but needs beginner-load and activity-route review. | Module 1–2 load/disclosure review. |
