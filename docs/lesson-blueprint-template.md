# English Journey Lesson Blueprint Template

This template is completed before writing or revising a lesson. It supports varied activities while keeping the course coherent.

## 1. Identity and learner promise

| Field | Entry |
|---|---|
| Level / module / lesson | `A2 · Module 3 · Lesson 4` |
| Title | Short, natural English title |
| Arabic helper title | Concise learner-support translation, where useful |
| Dominant lesson family | Vocabulary, grammar, interaction, speaking, reading, writing, review, assessment, or real-world English |
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

## 3. Learning sequence

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

## 4. Quality, language, and accessibility

| Check | Decision |
|---|---|
| British English | Spelling, pronunciation model, and natural usage confirmed |
| Arabic support | Included only where it clarifies a genuine learning hurdle |
| Cognitive load | New material, task steps, and text difficulty are manageable for the level |
| Variation | Dominant lesson family does not repeat mechanically from the prior lesson |
| Accessibility | Keyboard order, headings, audio labels, contrast, RTL support, and reduced motion checked |
| Assessment integrity | Questions assess understanding/use, not accidental cues or misspellings |

## 5. Data fields for implementation

```ts
type LessonBlueprint = {
  identity: { level: string; module: number; lesson: number; family: string; minutes: number };
  canDo: string;
  scope: { primarySkill: string; secondarySkills: string[]; newVocabulary: string[]; recycledVocabulary: string[] };
  language: { target?: string; pronunciation?: string; arabicSpeakerRisks?: string[] };
  graph: { prerequisites: string[]; retrievalTargets: string[]; futureLinks: string[] };
  stages: Array<"orientation" | "encounter" | "notice" | "supportedPractice" | "meaningfulUse" | "retrieval" | "evidence">;
  assessment: { type: string; evidence: string; passRule?: string };
  quality: { britishEnglishChecked: boolean; accessibilityChecked: boolean; arabicSupportDecision: string };
};
```
