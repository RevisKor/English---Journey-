# Curriculum Audit Baseline — 17 August 2026

This baseline is generated from the active A1–C2 source curriculum using `pnpm audit:curriculum`. It is an editorial quality-control snapshot, not a learner-facing scorecard.

| Level | Lessons | Modules | Vocabulary records | Grammar records | Longest repeated lesson-type run | Current audit warning count |
|---|---:|---:|---:|---:|---:|---:|
| A1 | 90 / 90 | 6 / 6 | 912 | 90 | 3 | 1 |
| A2 | 135 / 135 | 9 / 9 | 942 | 135 | 2 | 0 |
| B1 | 150 / 150 | 10 / 10 | 1,800 | 150 | 1 | 0 |
| B2 | 150 / 150 | 10 / 10 | 1,800 | 150 | 1 | 0 |
| C1 | 160 / 160 | 10 / 10 | 1,920 | 160 | 1 | 0 |
| C2 | 180 / 180 | 12 / 12 | 1,080 | 180 | 1 | 0 |
| **Portfolio** | **865** | **57** | **8,454** | **865** | — | **1** |

## Interpretation

The active course portfolio matches its declared lesson and module counts at every CEFR level. The audit found no duplicate lesson numbers. A2 through C2 currently satisfy the measured structured-learning-plan, activity, and bilingual metadata checks.

The single **A1 warning** is intentional audit visibility: the original A1 immersive records are activity-enriched, but do not yet expose the same explicit `learningPlan` object used by the progressive A2–C2 blueprint family. This does not mean that A1 has no guided experience; it identifies a schema-normalisation task so the audit can evaluate A1 and A2–C2 using the identical contract.

## Editorial Gate

Before a future curriculum release is promoted, run:

```bash
pnpm audit:curriculum
pnpm test
pnpm check
pnpm build
```

Any change in lesson/module count, duplicate lesson number, missing bilingual field, or unexpected increase in repeated activity runs requires curriculum-editor review before publication.
