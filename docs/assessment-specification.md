# English Journey Assessment Specification

## Assessment purpose

Assessment in English Journey is evidence collection for learning decisions. A correct answer is not enough unless it supports an intended conclusion about what the learner can understand, say, read, write, or do.

## Assessment hierarchy

| Layer | Decision made | Design requirements | Typical scale |
|---|---|---|---:|
| Mini check | Is the immediate objective secure enough to continue? | Narrow, explained feedback, low pressure | 3–5 items |
| Lesson checkpoint | Can the learner retrieve and use recent targets? | Mixed item forms, contextual options, no trivial distractors | 8–15 items |
| Module milestone | Has the learner integrated the module capability? | Vocabulary, language use, reception, and practical communication as relevant | 20–30 items plus production where needed |
| Level challenge | Is CEFR progression credible? | Integrated task(s), genre/register fit, evidence beyond recognition | Level-specific |

## Item-writing rules

Every objective item must be classified by target, skill, construct, difficulty, prerequisite, distractor rationale, explanation, and revision status. Distractors must be plausible because they represent common confusions—not because they contain misspellings, arbitrary nonsense, or a visibly different length.

| Item type | Best use | Required quality check |
|---|---|---|
| Contextual multiple choice | Meaning, collocation, form–meaning–use decisions | All options are grammatically plausible in isolation; only context resolves the answer |
| Sentence completion | Grammar and lexis in use | The sentence has a communicative context and no accidental cue |
| Ordering / matching | Short exchanges, sequences, relationships | The interaction or sequence has a clear pragmatic logic |
| Short constructed response | Controlled production | A model response and an explanation of acceptable variation exist |
| Reading/listening comprehension | Reception strategy and meaning | Questions can be answered from the text, not from superficial word matching alone |
| Writing / speaking prompt | Extended production and transfer | Rubric aligns to the stated can-do and level expectations |

## Production rubrics

Writing and speaking are evaluated using level-appropriate criteria: task fulfilment, organisation, range, control, intelligibility where relevant, register, and response to the communicative situation. A1 feedback should name a small number of actionable next steps. C1–C2 feedback can address nuance, cohesion, register, precision, and rhetorical control.

## Fairness and accessibility

Assessment instructions use plain English with Arabic clarification at lower levels when needed. The interface does not penalise speed unless speed is part of the stated construct. Learners must be able to use keyboard navigation and accessible labels. Every wrong answer receives useful information without shaming language.

## Required assessment metadata

```ts
type AssessmentItemSpec = {
  id: string;
  level: string;
  module: number;
  lesson?: number;
  layer: "mini-check" | "checkpoint" | "milestone" | "level-challenge";
  construct: string;
  primarySkill: string;
  targetIds: string[];
  prompt: string;
  choices?: string[];
  answerKey: string | string[];
  distractorRationales?: Record<string, string>;
  explanation: string;
  difficulty: "supported" | "expected" | "stretch";
  reviewedAt: string;
};
```
