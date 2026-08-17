# English Journey Six-Agent Production System

## Purpose

This operating procedure converts the uploaded six-agent brief into safe, coordinated workstreams. The agents are **roles with explicit hand-offs**, not permission for six processes to edit the same lesson or shared data file simultaneously.

## Workstream map

| Workstream | Role | Primary input | Required output | May change | Must not change |
|---|---|---|---|---|---|
| 1 | Researcher | Curriculum Bible questions and evidence gaps | Research Evidence Register entries | Research register only | Lesson sequence or final lesson copy |
| 2 | Curriculum Architect | Existing curriculum, evidence register, CEFR profiles | Lesson Blueprint Set and curriculum graph | Blueprint, dependency, and pacing metadata | Final prose and UI styling |
| 3 | Content Creator | Approved blueprints | Natural bilingual lesson content and activities | Authoring records tied to approved blueprint IDs | CEFR scope, module architecture, assessment policy |
| 4 | Pedagogical QA / Auditor | Blueprint, content, nearby lesson corpus | PASS / PASS WITH CHANGES / FAIL audit report | Audit findings and required-change records | Silent rewrites or scope changes |
| 5 | Learning Experience Designer | Approved content and visual language | Activity presentation specification and accessibility notes | Component tokens and presentation patterns | Learning objectives or assessment decisions |
| 6 | Assessment Architect | Blueprint, retrieval map, assessment policy | Assessment specifications and question-bank requirements | Assessment items and scoring/rubric metadata | Module order or primary learning outcomes |

## Dependency graph

```text
Research evidence ──┐
                   ▼
             Curriculum architecture
                   ▼
           ┌───────┴────────┐
           ▼                ▼
      Content creation   Assessment design
           │                │
           └───────┬────────┘
                   ▼
        Pedagogical quality audit
                   ▼
      Learning-experience presentation
                   ▼
              Release evidence
```

## Parallel execution policy

The following work may proceed in parallel because outputs are separate:

| Parallel lane | Deliverable | Integration boundary |
|---|---|---|
| A | Research evidence register | Curriculum Bible decision table |
| B | Lesson blueprint schema and curriculum graph | Shared type/database migration review |
| C | Activity library and lesson-family coverage audit | Shared activity-type taxonomy |
| D | Visual language and accessibility specification | Component-token review |
| E | Assessment hierarchy and question-form specification | Assessment schema and quiz-bank contract |
| F | Corpus-level QA audit rules and reporting format | Release-quality dashboard/report |

Content authoring begins only after a blueprint is approved. Assessment authoring begins after the target outcome and retrieval map are approved. Shared schema, catalog, and UI changes are merged sequentially by a coordinator after review.

## Review gates

| Gate | Evidence required | Decision |
|---|---|---|
| Blueprint gate | Can-do outcome, prerequisites, novelty/load, retrieval, assessment fit | Approve / revise |
| Content gate | Content pack mapped to blueprint and British/Arabic rules | Approve / revise |
| QA gate | Local and corpus-level audit with severity and remediation | PASS / PASS WITH CHANGES / FAIL |
| UX gate | Semantic activity treatment, keyboard/contrast/reduced-motion review | Approve / revise |
| Assessment gate | Target coverage, transfer, readability, answer validity, scoring decision | Approve / revise |
| Release gate | Module/level balance report, regression tests, catalog integrity, learner route check | Release / hold |

## Audit vocabulary

Use the following statuses consistently:

| Status | Meaning |
|---|---|
| **PASS** | Meets the relevant quality standard without a required change. |
| **PASS WITH CHANGES** | Suitable after a documented, bounded correction. |
| **FAIL** | The upstream blueprint, content, assessment, or presentation decision must be revised. |

An audit finding must always state: **problem, evidence, severity, required change, responsible role, and recheck condition**.

## Initial staged rollout

1. Establish the documents and audit contracts in this folder.
2. Add machine-readable blueprint and audit metadata without rewriting existing lessons.
3. Audit one representative module per CEFR band (A1/A2, B1/B2, C1/C2).
4. Correct systemic issues found in the pilot modules.
5. Apply the same tested standard in module-sized batches, never as an uncontrolled rewrite of all 865 lessons.
