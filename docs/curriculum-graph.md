# English Journey Curriculum Graph

## Purpose

The curriculum graph is the common planning map for all authoring work. It prevents isolated lesson writing by showing how CEFR levels, modules, capabilities, recurring vocabulary, grammar, and assessments connect. The graph is a design contract; it does not replace the learner-facing syllabus.

## Course spine

| CEFR level | Lessons | Modules | Capability progression | Required cross-level hand-off |
|---|---:|---:|---|---|
| A1 | 90 | 6 | Immediate needs, simple naming, routine exchanges, basic descriptions | Core vocabulary, pronouns, simple present, classroom survival language |
| A2 | 135 | 9 | Everyday transactions, short narratives, simple connected messages | Past/future reference, comparisons, routines, confidence in familiar exchanges |
| B1 | 150 | 10 | Independent everyday communication, opinions, connected accounts | Narrative control, supported argument, wider lexical networks |
| B2 | 150 | 10 | Complex interaction, sustained reasoning, register awareness | Argument structure, inference, flexibility across familiar genres |
| C1 | 160 | 10 | Precise, context-sensitive communication and source synthesis | Nuance, cohesive longer discourse, formal/informal control |
| C2 | 180 | 12 | Strategic, natural, highly precise mediation and creation | Adaptable style, complex evaluation, accurate high-level expression |

## Required node types

Each curriculum item is modelled as a node with outgoing links. A lesson may have several node types, but one is designated as dominant.

| Node type | Required metadata | Typical links |
|---|---|---|
| Communicative capability | Can-do outcome, CEFR level, context | Prerequisite, assessment, transfer task |
| Vocabulary network | Lemma, meaning, Arabic support, pronunciation, register, source lesson | Revisit, contrast, collocation, word-bank entry |
| Language form / discourse tool | Form–meaning–use, Arabic-speaker risk, examples | Prerequisite, controlled practice, communicative use |
| Text or interaction genre | Audience, purpose, register, comprehension/production demands | Input, model, writing/speaking task |
| Activity | Activity family, modality, expected effort, support level | Learning objective, retrieval target |
| Assessment | Decision purpose, evidence, pass rule, feedback route | Objective, prerequisite, next action |

## Link vocabulary

| Link | Meaning | Editorial rule |
|---|---|---|
| **requires** | A learner must have this prior ability to succeed independently. | Use sparingly; declare support if it is not secure. |
| **introduces** | First meaningful encounter with a target. | Must be followed by guided use. |
| **retrieves** | Brings an earlier target back after a delay. | Change the context or demand, not merely the sentence order. |
| **contrasts** | Distinguishes a near neighbour or common Arabic-speaker confusion. | Explain the semantic or pragmatic difference. |
| **applies** | Uses a target in purposeful comprehension or production. | Prefer real or plausible communicative contexts. |
| **assesses** | Collects evidence of the stated can-do. | Never use recognition-only evidence for a productive outcome. |
| **prepares** | Makes later learning easier without requiring mastery now. | Document the future dependency. |

## Module graph template

Every module should have a one-page graph using this pattern:

```text
Module outcome
  ├─ Core communicative routine
  │    ├─ Vocabulary network
  │    ├─ Language/discourse tool
  │    └─ Pronunciation or interaction convention
  ├─ Guided input and noticing
  ├─ Controlled / supported use
  ├─ Retrieval from prior module(s)
  ├─ Real-world transfer
  └─ Module assessment → next-module prerequisite
```

## Graph quality gates

Before a module is published, the editor confirms that every lesson has an explicit module role, every new target has a future retrieval link, every assessment has evidence links, and the module has at least one transfer node. The graph must make it possible to answer: **What becomes easier for the learner because this lesson exists?**
