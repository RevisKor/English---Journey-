# Curriculum Audit Specification

## Objective

The audit system must inspect **the corpus as well as individual lessons**. It identifies imbalance, repetition, missing retrieval, missing assessment coverage, and abrupt changes in difficulty before a module or level is considered publishable.

## Required audit inputs

| Input | Current source or proposed extension |
|---|---|
| Level/module/lesson identity | Existing course definitions and active catalog records. |
| Lesson family and primary/secondary skill | Existing lesson type, extended through blueprint metadata. |
| Vocabulary, grammar, and retrieval targets | Existing vocabulary/grammar and retrieval data, normalised through blueprint metadata. |
| Assessment and question-bank coverage | Active assessment records and question-bank rows. |
| Complexity and duration | Proposed lesson blueprint metadata. |
| Accessibility and Arabic-support notes | Proposed lesson blueprint and visual-spec metadata. |

## Required audit reports

| Report | Checks | Threshold / interpretation |
|---|---|---|
| Lesson integrity | Outcome, prerequisite, retrieval, assessment, and language fields exist. | Missing required fields block release. |
| Neighbourhood variety | Previous/next five lessons for repeated family, context, grammar, or question form. | Repetition requires a documented pedagogical rationale. |
| Module skill balance | Distribution of vocabulary, grammar, reception, production, interaction, review, and assessment. | Targets guide review; they are not a mechanical rotation. |
| Retrieval coverage | Important prior language reappears after a meaningful delay and in a new context. | Flag missing or contextless retrieval. |
| Assessment coverage | Mini checks, checkpoints, milestones, module assessment, and level challenge exist where scheduled. | Missing assessment banks block a release. |
| Activity repetition | Repeated interaction format, prompt structure, visual pattern, or multiple-choice overuse. | Flag local clusters and corpus-wide dominance. |
| Progression | Change in lexical load, grammar complexity, reading/writing demand, independence, and instruction complexity. | Flag abrupt jumps and unexplained regressions. |
| Accessibility | Semantic labels, non-colour cues, contrast, focus, reduced motion, readable instructions. | Critical failure blocks release. |

## Alert format

```text
ALERT TYPE: ACTIVITY REPETITION
SCOPE: B1 Module 3, Lessons 4–10
EVIDENCE: Four consecutive contextual multiple-choice activities; no productive transfer task.
SEVERITY: Medium
RISK: Learners may practise recognition without developing the module outcome.
REQUIRED CHANGE: Replace at least one repeated activity with guided spoken or written transfer.
OWNER: Curriculum Architect + Content Creator
RECHECK: Neighbourhood variety report and assessment alignment.
```

## Release decision

A module passes only when critical alerts are resolved, the remaining medium-risk alerts have accountable plans, the catalog/question-bank integrity check passes, and a learner can complete the intended path without a broken route or unavailable assessment.
