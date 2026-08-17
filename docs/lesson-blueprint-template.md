# English Journey Lesson Blueprint Template

This template is completed before writing or revising a lesson. It supports varied activities while keeping the course coherent.

## 1. Identity and learner promise

| Field | Entry |
|---|---|
| Level / module / lesson | `A2 · Module 3 · Lesson 4` |
| Title | Short, natural English title |
| Arabic helper title | Concise learner-support translation, where useful |
| Dominant lesson archetype | Discover, Notice, Vocabulary, Grammar, Listening, Speaking, Reading, Writing, Interaction, Real World, Integration, Review, or Assessment |
| Estimated effort | Light (10–15), normal (15–25), or deep (25–40 minutes) |
| Learner-facing can-do | “By the end, I can …” |
| Why this matters | One practical or personal reason, without generic motivation text |

## 2. Learning scope

| Area | Plan |
|---|---|
| Primary skill | Listening, speaking, reading, writing, interaction, mediation, language use, or integrated practice |
| Secondary skills | Specify only those used meaningfully |
| New vocabulary | Maximum manageable set; source, meaning, pronunciation, and example context |
| Recycled vocabulary | Previously taught words and retrieval source lesson |
| Language / discourse target | Form, meaning, use, exceptions, and likely Arabic-speaker confusion |
| Pronunciation | Word stress, sound contrast, connected speech, or no dedicated pronunciation target |
| Prerequisites | What learners need; how weak prerequisites will be supported |

## 3. Learner experience and selected stages

The stable lesson shell makes the lesson’s **purpose, next action, importance, and next step** visible. It does not require every lesson to use the same stage sequence. Select only the stages that help the learner meet the outcome; record why a conventional stage is intentionally absent when that prevents unnecessary repetition or overload.

| Stage | Learner experience | Evidence / authoring note |
|---|---|---|
| Orientation | Understand the situation and goal | State purpose in simple English; use Arabic only when it removes a real barrier |
| Encounter | Meet language in context | Dialogue, image, short text, audio, or real-world item |
| Notice | Identify form, meaning, use, or pragmatic choice | Include contrast if confusion is predictable |
| Supported practice | Try with cues, models, or constrained choice | Explain feedback, not just correct/incorrect |
| Meaningful use | Use the target for a plausible purpose | Avoid a second mechanical drill |
| Retrieval | Recall earlier learning in a changed context | Link the source lesson or module |
| Evidence | Show the can-do | Match the task to the outcome |
| Next bridge | Connect forward | State what will be reused next |

| Selection decision | Entry |
|---|---|
| Why this archetype now? | Explain the fit with objective, module position, previous lesson, and next lesson. |
| Chosen stages | List only the stages used in this lesson, in learner-facing order. |
| Stages intentionally absent | Explain why an omitted stage would not serve the objective. |
| Information shown first | Name the one action and one piece of information the learner sees on arrival. |
| Optional support | List help that appears progressively: Arabic explanation, worked example, tip, transcript, word support, or extended rationale. |

## 4. Quality, language, and accessibility

| Check | Decision |
|---|---|
| British English | Spelling, pronunciation model, and natural usage confirmed |
| Arabic support | Included only where it clarifies a genuine learning hurdle |
| Cognitive load | New material, task steps, and text difficulty are manageable for the level |
| Variation | Archetype, density, opening, activity pattern, dialogue shape, and question format are justified against adjacent lessons; no mechanical rotation is imposed |
| Progressive disclosure | The learner sees the immediate purpose and action first; rich authoring data appears only when it is needed |
| Accessibility | Keyboard order, headings, audio labels, contrast, RTL support, and reduced motion checked |
| Assessment integrity | Questions assess understanding/use, not accidental cues or misspellings |

## 5. Data fields for implementation

```ts
type LessonArchetype =
  | "discover" | "notice" | "vocabulary" | "grammar" | "listening"
  | "speaking" | "reading" | "writing" | "interaction" | "realWorld"
  | "integration" | "review" | "assessment";

type LessonStage =
  | "orientation" | "encounter" | "notice" | "supportedPractice"
  | "meaningfulUse" | "retrieval" | "evidence" | "nextBridge";

type LessonBlueprint = {
  identity: { level: string; module: number; lesson: number; archetype: LessonArchetype; density: "light" | "normal" | "deep"; minutes: number };
  canDo: string;
  scope: { primarySkill: string; secondarySkills: string[]; newVocabulary: string[]; recycledVocabulary: string[] };
  language: { target?: string; pronunciation?: string; arabicSpeakerRisks?: string[] };
  graph: { prerequisites: string[]; retrievalTargets: string[]; futureLinks: string[] };
  experience: {
    archetypeRationale: string;
    selectedStages: LessonStage[];
    intentionallyAbsentStages: Array<{ stage: LessonStage; reason: string }>;
    firstView: { whatItIs: string; whatToDo: string; whatMatters: string; whatNext: string };
    progressiveSupports: string[];
  };
  assessment: { type: string; evidence: string; passRule?: string };
  quality: { britishEnglishChecked: boolean; accessibilityChecked: boolean; arabicSupportDecision: string };
};
```
