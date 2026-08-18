# C1 Module 2 Architecture — Public Reasoning and Institutional Voice

## Purpose

C1 Module 2 (Lessons 17–32) develops the learner’s ability to interpret and produce institution-facing English: recommendations, policy language, public explanations, and carefully qualified disagreement. The module treats advanced English as a tool for accountable judgement rather than as a list of difficult words. Each lesson has one primary objective, a short bilingual retrieval check, and a clear bridge to the next communicative decision.

The module follows the C1 cadence without rotating skills mechanically. Reading is frequent because learners need repeated contact with dense, source-aware prose. Listening appears in two audio-first routes with transcripts hidden until an initial attempt. Writing appears in four purposeful tasks, including the module assessment. Speaking and interaction are distributed where an audience, negotiation, or public explanation makes them necessary.

## Learner journey

| Lessons | Dominant route | Primary objective | Skill emphasis | Density |
|---|---|---|---|---|
| 17 | Notice | Distinguish institutional stance from personal opinion | discourse analysis, retrieval | light |
| 18 | Reading | Trace how a public document frames responsibility | source reading, evidence | deep |
| 19 | Grammar | Use attribution and stance markers with calibrated certainty | grammar-semantic precision | normal |
| 20 | Listening | Identify qualification and implied obligation in a public briefing | audio-first listening, speaking | normal |
| 21 | Interaction | Ask for clarification without escalating disagreement | interaction, pragmatics | normal |
| 22 | Vocabulary | Compare near-synonyms for formal recommendation and obligation | lexical precision, retrieval | light |
| 23 | Reading | Compare a consultation summary with a policy response | paired-source reading | deep |
| 24 | Writing | Produce a concise evidence-aware recommendation for a mixed audience | formal writing, external-AI prompt | deep |
| 25 | Review | Retrieve and reorganise institutional language across contexts | retrieval, transfer | normal |
| 26 | Speaking | Deliver a short public explanation while controlling emphasis | speaking, pronunciation | normal |
| 27 | Listening | Follow a disagreement in a committee exchange and identify concessions | audio-first listening, interaction | deep |
| 28 | Real World | Convert expert language into a clear public-facing explanation | mediation, register | normal |
| 29 | Grammar | Manage concessive clauses and counter-positioning without overclaiming | grammar-semantic precision | normal |
| 30 | Reading | Evaluate how evidence and audience shape a public argument | critical reading, assessment preparation | deep |
| 31 | Writing | Revise a recommendation for a different audience and purpose | audience-sensitive writing | deep |
| 32 | Assessment | Synthesize sources into an accountable institutional response | cumulative reading, writing, speaking | deep |

## Controls

Every authored lesson must satisfy the shared activity contract: English and Arabic title/objective support, a single primary objective, a progression stage selected for the route, and a short retrieval record containing both English and Arabic prompts plus an answer or success signal. The retrieval prompt must test the lesson’s intended transfer, not merely ask the learner to repeat a definition.

The UI should expose the lesson archetype through its icon and label, present the objective before detailed content, and keep Arabic help and model answers progressively disclosed. In listening lessons, the learner first receives an audio-first prompt and may reveal the transcript only after attempting the listening check. Writing routes provide copyable external-AI instructions; they do not invoke an application-side model.

## Assessment arc

Lesson 25 is a low-stakes retrieval and transfer review. Lesson 30 prepares the learner for cumulative synthesis by requiring evidence comparison and audience analysis. Lesson 32 is the module assessment: the learner interprets a paired institutional source, gives a short spoken or interactional response, and drafts a formal recommendation with explicit attribution, calibrated stance, and a clear next step. The assessment should reward defensible choices and responsible uncertainty rather than vocabulary density alone.

## Design rationale

The module opens by making institutional stance visible before asking the learner to produce it. It then moves through source interpretation, stance grammar, listening for obligation, pragmatic clarification, lexical precision, and audience-sensitive writing. The later lessons deliberately revisit the same discourse problem—how to make a recommendation accountable—from different perspectives and registers. This creates retrieval across contexts without forcing identical activity sequences.

The final four lessons increase independence: the learner must mediate expert language, control concessions, evaluate evidence, revise for audience, and finally synthesize. The progression is therefore from noticing public reasoning to producing a defensible public response.

## Quality gates

Before checkpointing, the module must pass TypeScript, production build, curriculum integrity, rearchitecture, focused C1/workspace tests, shared-course regression coverage, and a quality review covering pedagogy, visual disclosure, Arabic support, assessment validity, and listening transcript protection. The standing external database SSL startup warning must remain documented as an infrastructure issue unrelated to authored curriculum content.
