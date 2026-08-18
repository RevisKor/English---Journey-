# C1 Module 4 Quality Review

## Scope

This review covers Lessons 49–64, the contested-evidence and public-briefing arc defined in `c1-module-4-architecture.md`, the authored activity corpus, the adaptive experience map, and the live C1 enrichment pipeline.

## Pedagogical review

Each lesson has one dominant objective. The sequence moves from separating claims and assumptions, through source framing, attribution, methods, uncertainty, stakeholder representation, and provenance, toward proportionate recommendation and public briefing. Lessons deliberately alternate reading, listening, grammar-semantic noticing, interaction, review, synthesis writing, and assessment rather than using a fixed skill rotation.

Every authored lesson includes a short bilingual retrieval check. Retrieval asks learners to name, distinguish, qualify, attribute, or transfer the target judgement in English and Arabic. The corpus reuses earlier B2 language only where the source task makes the retrieval natural, while introducing C1 precision through calibrated claims, evidence limits, provenance, and audience-sensitive register.

## Visual and disclosure review

The experience map gives each lesson a visible route identity and first-view guidance without exposing the entire activity corpus at once. Reading and listening routes disclose support progressively. Audio-first lessons foreground the spoken line and keep the transcript hidden until the learner requests it. Semantic activity labels and icons remain available independently of colour, and Arabic support is present in titles, objectives, retrieval, prompts, and source text where relevant.

## Assessment review

The module contains low-stakes retrieval throughout, a paired-source audit, calibrated writing, stakeholder representation, an executive recommendation, and a culminating public-briefing route. Assessment evidence is distributed across interpretation, source attribution, uncertainty control, interactional fairness, and independent synthesis. The culminating tasks require a defensible position rather than a single memorised answer.

## Engineering review

Module 4 is wired after Modules 1–3 with explicit precedence for its lesson range. Its keyed authored activity records are wrapped into the shared `LessonActivity[]` contract, and its adaptive experiences are merged without changing prior module behaviour. The first un-authored C1 boundary is Lesson 65. Focused C1 and learner-workspace regressions cover the new authored routes, retrieval, listening disclosure, and the fallback boundary.

## Decision

Proceed to the full engineering gate. Any existing external database SSL startup warning remains infrastructure-related and is not evidence of a Module 4 curriculum or rendering defect.

## Evidence

- Architecture: `docs/module-packets/c1-module-4-architecture.md`
- Activities: `shared/course/c1-module-4-authored-activities.ts`
- Experiences: `shared/course/c1-module-4-experiences.ts`
- Integration: `shared/course/c1.ts`
- Focused regressions: `shared/course/c1.test.ts`, `client/src/components/ExternalLessonWorkspace.test.tsx`

Arabic/English learner-facing content is reviewed for compactness, purpose, and progressive disclosure. No external AI or media API was added.
