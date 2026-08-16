# English Journey: A1–C2 Curriculum Overhaul Contract

## Purpose

English Journey will evolve from a strong guided lesson route into a multi-modal course system. The expansion applies to **every authored level and module from A1 through C2**. A1 receives the most explicit Arabic scaffolding and absolute-beginner sequencing, while higher levels increase lexical range, discourse complexity, source awareness, independence, and the amount of English used in explanations.

> The goal is not to create more lessons for their own sake. Each lesson must move language through the sequence **introduced → recognized → understood → used → remembered**, then return to it in new contexts.

## Stable hierarchy

| Layer | Responsibility | Current compatibility rule |
|---|---|---|
| Level | CEFR-appropriate difficulty, language policy, and progression gate | Preserve the existing A1–C2 route and level locks |
| Module | A coherent thematic learning unit with its own word bank and cumulative assessment | Existing four-module catalog remains readable while longer module plans are introduced |
| Lesson | One focused pedagogical purpose and one primary lesson type | Existing `LessonDefinition` remains valid; new metadata is optional during migration |
| Activity | A bounded step inside a lesson: explanation, guided practice, independent practice, context, review, or assessment | Activity data is additive and can be rendered by specialized workspaces |
| Review bank | Persistent vocabulary and grammar retrieval across the module and level | Existing progress and review queues remain the source of truth for completion |

The requested long-term target is approximately **six or seven modules per level** and **fifteen to twenty focused lessons per module**. The migration must not invalidate the currently synchronized catalog, checkpoint lesson contracts, or existing shareable lesson URLs. Module expansion therefore happens through explicit catalog migrations rather than by silently changing lesson numbers.

## Lesson families

Each level should deliberately mix the following lesson families. The family controls the activity renderer and the type of practice; it does not replace the shared mentor-led journey.

| Lesson family | Primary learner experience | A1–A2 emphasis | B1–C2 emphasis |
|---|---|---|---|
| Standard | Vocabulary, grammar, pronunciation, examples, guided checks | Plain language, Arabic contrast, sentence frames | Register, collocation, discourse function, exceptions |
| Visual vocabulary | Image-supported recognition, pronunciation, meaning, example use | Concrete categories such as food, rooms, people, animals | Abstract and domain vocabulary, visual evidence, classification |
| Real-life interaction | Dialogue turns, purpose, alternatives, formal/informal choices | Greetings, shops, restaurants, requests | Negotiation, disagreement, workplace and academic situations |
| Speaking / repeat-after-me | Listen, repeat, replay, next line, complete dialogue | Confidence, rhythm, intelligibility | Intonation, stance, nuance, mediation, audience |
| Writing | Prompt, target language, sentence patterns, draft, feedback, revision | Short personal messages and descriptions | Argument, synthesis, source use, style, audience and revision |
| Reading | Leveled passage plus vocabulary and comprehension checks | Familiar words and explicit detail | Inference, evidence, perspective, rhetoric and source comparison |
| Review | Retrieval across earlier lessons and weak areas | Recognition to controlled use | Flexible transfer, precision and self-correction |
| Assessment | Mixed module checkpoint and cumulative performance evidence | Contextual vocabulary and grammar with short production | Integrated reading, writing, speaking and higher-order judgement |

## Shared lesson progression

Every lesson declares a progression, even when its primary family is visual, speaking, reading, or writing:

1. **Introduction** establishes purpose and connects to prior learning.
2. **Explanation** makes the language or task understandable.
3. **Guided practice** provides constrained choices, examples, or sentence frames.
4. **Independent practice** asks the learner to produce or select language without the answer embedded in the prompt.
5. **Real context** places the language in a dialogue, passage, image, or meaningful writing task.
6. **Review** retrieves earlier vocabulary and grammar from the same module.
7. **Assessment** checks transfer and determines the next gated action.

Individual lessons remain digestible. A large topic such as food is divided into focused units such as basic food, fruit, vegetables, drinks, meals, restaurant language, and restaurant interaction rather than being placed in one overloaded lesson.

## Vocabulary and grammar reinforcement

Every vocabulary record keeps its bilingual meaning, pronunciation, example, and introduction lesson. New activity contracts additionally allow an activity to reference vocabulary IDs and grammar IDs. This makes deliberate reuse possible across a module:

> A word may first be introduced in a vocabulary lesson, used in a grammar example, recognized in a picture lesson, spoken in an interaction, read in a passage, used in writing, and retrieved again in an assessment.

The same rule applies to grammar. A structure is not complete when the learner has read its explanation; it must reappear in examples, visual descriptions, dialogue, reading, writing, speaking, and contextual quizzes.

Each module exposes a persistent word bank with search, direction filters, pronunciation, example sentences, introduction lesson, and familiarity state. Familiarity progresses from **introduced** to **recognized**, **understood**, **used**, and **remembered** based on learner activity and review outcomes.

## Grammar teaching standard

Grammar entries may retain their current compact fields for compatibility, but expanded entries can provide:

| Teaching element | Requirement |
|---|---|
| What it is | Explain the concept in accessible language before using technical terms |
| Why it matters | Connect the form to a communicative purpose |
| Structure | Show positive, negative, question, and short-answer patterns |
| Terminology | Define subject, verb, noun, adjective, tense, clause, and similar terms when needed |
| Examples | Provide multiple bilingual examples, not a single isolated sentence |
| Use | Explain when the form is appropriate and when a simpler form is better |
| Arabic-speaker notes | Call out likely transfer errors without presenting Arabic as a defect |
| Exceptions | Include them only when relevant to the lesson goal |
| Practice | Move from recognition to guided production to independent use |

The level changes the density and independence of this explanation. A1 uses short English explanations with Arabic support; C1 and C2 can use English-first explanations, source examples, register analysis, and nuanced exceptions.

## Onboarding standard

The first-use tutorial must explain the whole platform, not only the existence of a course guide. It should cover levels, modules, lesson families, the mentor-led route, navigation, progress indicators, gated quizzes, writing and reading workflow, speaking practice, word banks, review, prompts for external AI, feedback, revision, returning to older lessons, and the meaning of completion. The reusable Guide action remains available on desktop and mobile.

## Migration sequence

The implementation proceeds in six controlled phases:

1. Introduce additive shared contracts and validation rules.
2. Add level-aware lesson metadata and activity plans to authored curricula without changing existing routes.
3. Add specialized renderers for visual, interaction, speaking, writing, reading, review, and detailed grammar activities.
4. Expand module and word-bank persistence using the existing database synchronization pipeline.
5. Add varied assessments and end-to-end validation for all levels.
6. Migrate longer module plans incrementally, preserving checkpoint provenance and documenting every catalog change.

This contract is the implementation source of truth for the overhaul. Existing authored content remains valid while each level is progressively enriched to meet the same all-level standard.

## AI architecture decision

The learner-facing flow remains **external-prompt-first**: the server prepares lesson-aware prompts, and the learner chooses an external AI tool. This preserves the no-per-request-AI-charge requirement and keeps the learning route deterministic. The dormant server-side AI router is retained as an isolated, protected migration seam for a later paid or local-model deployment; it is not called by the current learner workspace, and its presence does not change the external-prompt behavior.
