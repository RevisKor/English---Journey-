# Reauthoring Operating System

## Purpose

This operating system converts the Curriculum Bible from an aspiration into a required production sequence. It applies to **every module**, including corrective revisions of existing A1–B2 content and all new B2–C2 work. A module cannot be described as complete merely because it compiles or has activities; it must leave evidence at every handoff.

## Required specialist handoffs

| Gate | Owner | Required artefact | Pass condition | Failure response |
|---|---|---|---|---|
| 1. Curriculum research | Research specialist | Source ledger and learner/context notes | Source claims are traceable; claims are appropriate to CEFR and Arabic-speaking learners. | Return to research; no blueprint begins. |
| 2. Architecture | Curriculum architect | Module arc, lesson blueprint table, archetype/density choices, retrieval map, assessment map | Every lesson has an objective-led dominant archetype; route repetition is justified or avoided. | Redesign the module sequence. |
| 3. Content | Content author | Explicit bilingual activity corpus and mentor voice notes | Activity choice, task mechanics, supports, and Arabic use realise the blueprint rather than a stock sequence. | Rewrite the lesson corpus. |
| 4. Pedagogy | Pedagogical QA | PASS/FAIL checklist with evidence by lesson | Scope, language load, progression, scaffolding, retrieval, and learner agency meet the level rules. | Return failed lessons to architecture or content. |
| 5. Visual/disclosure | Visual experience reviewer | First-view and semantic-card review | Learners can identify what it is, what to do, what matters, and what comes next; colour is never the only cue. | Refine metadata or UI mapping. |
| 6. Assessment | Assessment architect | Evidence map and assessment review | Assessment measures intended transfer, includes no misleading distractors, and has a proportionate support policy. | Redesign evidence task or item bank. |
| 7. Engineering | Engineering QA | Unit/regression results, `audit:rearchitecture`, `audit:curriculum`, TypeScript/build results, preview review | Tests and quality commands pass; no contract or rendering regression remains. | Fix implementation; re-run all affected gates. |

## Lesson blueprint record

Before authoring a lesson, create a record with the following fields:

| Field | Requirement |
|---|---|
| Learner purpose | A concrete thing the learner can understand, decide, say, read, write, or do after the lesson. |
| Dominant archetype | One experience that serves the purpose; not an arbitrary rotation. |
| Density | Light, normal, or deep, with a reason grounded in novelty, risk, and transfer demand. |
| Selected and omitted stages | The deliberately chosen learning stages plus a short reason for omissions. |
| Activity mechanics | The interaction, text, evidence, visual, speaking, or writing mechanism; must differ from neighbouring lessons when possible. |
| New and retrieved language | New language plus only retrieval that is necessary and natural in the task. |
| Arabic support | Exact support needed, not automatic translation of all advanced content. |
| Evidence | What demonstrates learning and how the learner knows the next step. |

## Automated and human quality signals

`pnpm audit:rearchitecture` reports coverage, archetype/density distribution, activity kinds, repeated route signatures, and first-view gaps. It is a diagnostic, not a mechanical template generator. Its findings must be read at module and level level before declaring a module complete.

| Signal | Threshold | Human interpretation required |
|---|---|---|
| Experience coverage | 100% for a completed level/module | A record may be technically present but pedagogically weak. |
| Activity coverage | 100% for a completed level/module | Activities must fulfil their payload and purposeful role. |
| Repeated signatures | Investigate any pattern repeated in a module; investigate high-frequency level patterns | Repetition can be justified for review/assessment only when learner value is documented. |
| Archetype mix | Compare to the architecture matrix rather than a fixed quota | A local skew is allowed when the module objective demands it. |
| Density mix | Compare to the architecture matrix | Dense lessons need a clear payoff; light lessons need a clear purpose. |
| First-view clarity | No missing experience metadata | Review the rendered learner route, not just its data. |

## Completion packet

A completed module stores or links its research notes, architecture blueprint, authored corpus, pedagogy review, visual review, assessment review, audit output, tests, build result, curriculum audit, and preview evidence. The checkpoint message must name the module scope and the successful gates. 

## Change-control rule

No further B2–C2 authoring can start from generated fallback content alone. Its module packet must pass Gates 1–2 before implementation. Existing A1–B1 authored modules are revised selectively, beginning with patterns identified in `CURRENT_CURRICULUM_REARCHITECTURE_AUDIT.md`.
