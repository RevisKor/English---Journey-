# Six-Agent Protocol Gap Audit

**Status:** Draft corrective record — authoring paused after B2 Module 2.

## Scope

This record compares the curriculum work completed through B2 Module 2 with the production protocol supplied by the project owner in `pasted_content.txt`. It distinguishes **implemented course improvements** from the required **governance process**. Passing automated tests, TypeScript checks, builds, and the existing curriculum audit does not by itself satisfy the six-agent protocol.

## Summary finding

The work delivered explicit bilingual activity corpora, varied lesson archetypes, adaptive experience maps, focused regressions, production builds, and zero-warning runs of the existing curriculum audit. However, it **did not implement or document the required six-role controlled production pipeline**. Major curriculum decisions were made within a combined authoring workflow rather than through separately recorded research, architecture, content, pedagogical QA, visual-design, and assessment handoffs.

> The supplied protocol requires six distinct responsibilities, a shared Curriculum Bible, formal quality gates, and a rule that a rejected lesson returns to the responsible upstream role rather than being silently rewritten.

## Protocol conformance matrix

| Protocol requirement | Current state | Evidence from completed work | Gap and impact | Required remediation |
|---|---|---|---|---|
| Agent 1 — Researcher | **Partial, undocumented** | Authoring used authoritative internal draft data and occasional source checking, but no research-evidence ledger was created per module or level. | Principles, source quality, risks, and level applicability are not traceable. | Build a research evidence register from approved sources before further B2+ authoring. |
| Agent 2 — Curriculum Architect | **Partial, implicit** | Lesson titles, outcomes, vocabulary, grammar, and retrieval data came from the draft curriculum; adaptive maps added archetypes, density, and stages. | No separately approved Lesson Blueprint Set with prerequisites, future dependencies, cognitive load, mood, or activity pattern for every lesson. | Create a Curriculum Bible and a machine-readable lesson-blueprint schema, then record a Module Blueprint Set before content authoring. |
| Agent 3 — Content Creator | **Implemented, but not independently gated** | Explicit bilingual authored activity files and experience maps were produced for A1, A2, B1, B2 Modules 1–2. | Content may be strong in individual places, but it has not passed the mandated upstream/downstream handoff process. | Freeze authoring outputs until blueprint approval and downstream QA outcomes are recorded. |
| Agent 4 — Pedagogical QA and Curriculum Auditor | **Partial, technical only** | Existing tests validate activity contracts, selected assertions, TypeScript, builds, and the current curriculum audit. | There is no formal PASS / PASS WITH CHANGES / FAIL verdict with evidence, severity, and required change for each lesson or module; no mandatory recent-lesson pattern detector is operating as the protocol specifies. | Implement lesson-, module-, level-, and corpus-level audit reports with rejection routing. |
| Agent 5 — Learning Experience and Visual Designer | **Partial, unformalised** | The workspace has semantic cards, labels, responsive checks, and screenshots. | No formal visual-system acceptance review confirms hierarchy, restraint, accessible colour-plus-icon-plus-label treatment, screen-reader behaviour, and density rules across all activity types. | Create visual-language specification and an auditable UI review checklist linked to the activity taxonomy. |
| Agent 6 — Assessment Architect | **Partial, content-level only** | Lesson assessments and selected assessment activity payloads exist. | No documented assessment graph covering 3–5-item mini checks, 10-lesson checkpoints, 30-lesson milestones, module assessments, level challenges, skill-transfer rubrics, or question-form balance. | Create assessment blueprint data and validate coverage against the lesson and curriculum graph. |
| Shared Curriculum Bible | **Not implemented as one source of truth** | Course drafts, activity files, tests, types, and TODO history contain fragments of the required information. | Decisions are distributed; an author can unintentionally diverge from research, CEFR, visual, Arabic-support, or assessment rules. | Consolidate the required philosophy, progression, module maps, distributions, rules, sources, quality gates, exclusions, and decision log. |
| Controlled handoffs | **Not implemented** | The workflow completed authoring, integration, assertions, and technical validation in one continuous track. | Failures were corrected directly rather than formally assigned to the responsible role. | Record structured handoff files and require explicit approval status before each downstream phase. |
| Assessment hierarchy | **Incomplete** | Individual lesson assessment routes exist. | The specified checkpoints, milestone assessments, and level challenges are not yet proven as an authored progressive system. | Build an assessment coverage matrix and remediation backlog. |

## What must not be claimed

Until the corrective work is complete, the project must not claim that all reauthored lessons have passed the owner's complete six-agent production protocol. It can accurately state that the reauthored modules passed the existing automated contract, regression, type, build, curriculum-audit, and preview checks.

## Corrective quality gates

Further authoring should follow these gates in order:

1. **Research gate:** evidence register contains source, principle, rationale, CEFR applicability, application, risk, and priority.
2. **Architecture gate:** the Module Blueprint Set specifies a can-do outcome, module arc, lesson purposes, prerequisites, retrieval, future connections, primary and secondary skills, cognitive load, and intended assessment evidence.
3. **Content gate:** authored activities only implement approved blueprints and record the selected activity-library pattern.
4. **Pedagogical QA gate:** an auditor returns `PASS`, `PASS WITH CHANGES`, or `FAIL` with evidence, severity, and required changes. A failure is routed upstream rather than silently overwritten.
5. **Visual-experience gate:** the learner UI is reviewed against semantic recognition, hierarchy, accessible colour-plus-icon-plus-label, keyboard and reduced-motion criteria.
6. **Assessment gate:** lesson mini checks, checkpoints, module tests, and transfer tasks are mapped to outcomes and validated for diversity and readability.
7. **Technical gate:** existing Vitest, TypeScript, production build, curriculum audit, and visual checks run after the preceding gates pass.

## Immediate effect

No further B2 Module 3 lesson authoring should occur until the owner reviews and approves the corrective setup. The new TODO item tracks this work separately from the pending B2 Module 3 milestone.
