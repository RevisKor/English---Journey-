# C2 Modules 11–12 Quality Review

## Scope

Modules 11–12 extend C2 Lessons 151–180 beyond the first ten authored modules. They use two distinct capstone-adjacent arcs: public memory, migration, belonging, and ethical welcome in Module 11; then lifelong practice, institutional transfer, and sustained language use in Module 12.

## Pedagogical review

Each lesson has one dominant objective and an explicit bilingual retrieval check. The generated corpora preserve varied activity kinds rather than forcing a fixed sequence: visual evidence, reading, listening, interaction, speaking, writing, review, standard synthesis, and assessment. Module 11 foregrounds how language mediates public memory and belonging. Module 12 turns C2 control into a durable practice plan, with terminal lessons requiring accountable synthesis rather than another isolated vocabulary drill.

The activity cadence remains intentionally non-rotational. Reading and writing recur at C2 frequency, listening records expose transcript support progressively, and the final assessment records retain an assessment semantic. The visual activity is deliberately sparse and evidence-oriented, appropriate for C2 rather than an A1-style picture lesson.

## Bilingual and progressive disclosure review

Every authored record includes English and Arabic objectives and retrieval prompts. Listening activities expose transcript-related progressive support without making the transcript the first-view experience. Visual evidence includes accessible alternative text, an Arabic gloss, pronunciation, example sentences, and a prompt that asks the learner to interpret before reading an explanation.

## Assessment review

The final lesson in each remaining module is an assessment route. Retrieval evidence asks for a transferable C2 principle, while reading checks and writing prompts require qualification, audience awareness, evidence boundaries, and responsible next steps. This preserves the project rule that C2 assessment measures judgement and transfer rather than recognition alone.

## Engineering evidence

The final release gate passed after the Module 11–12 integration and the multimodal regression correction:

- TypeScript: passed.
- Focused C2 curriculum suite: 14 tests passed.
- Complete Vitest suite: 50 files, 281 tests passed.
- Production build: passed, including the serverless Vercel function build.
- Curriculum audit: passed with 865 lessons, 8,454 vocabulary records, 865 grammar records, and no warnings.
- Rearchitecture audit: passed with no missing authored activities and no missing experiences.

The recurring development database SSL synchronization warning remains an environment/startup issue unrelated to the curriculum source and release gate.

## Remaining scope

The portfolio audit still reports B2 authored coverage at 135/150. The roadmap keeps the remaining B2 legacy-authored lessons open rather than claiming full reauthoring coverage. External Vercel secrets, Google OAuth runtime validation, persisted-progress verification, and administrator-role confirmation remain evidence-gated user-environment tasks.
