# English Journey Activity Visual Language

## Purpose

This specification turns the curriculum activity taxonomy into a calm, coherent learner-facing visual language. It preserves the existing English Journey interface and learning outcomes while ensuring that learners can recognise the kind of work they are about to do before they read the detailed instructions.

> **Design principle:** activity identity should reduce cognitive effort, not add decoration. A learner must be able to identify the task, its purpose, expected effort, and next action in a few seconds.

## Shared Activity Card Contract

Every activity card uses the same navigation hierarchy: a semantic **type marker**, a bilingual **title**, one-sentence **purpose**, estimated **effort**, and a single primary action. Arabic explanation remains available but does not compete with the English learning target. Cards vary in density and structure according to their lesson archetype; they do not become copies of one generic component.

| Element | Requirement | Accessibility rule |
|---|---|---|
| Type marker | Text label, purpose-matched icon, and semantic accent; never icon-only | Meaning must remain clear without colour or the icon |
| Title | English first; Arabic helper title beneath or in the learner-selected language | Use a semantic heading in sequence |
| Purpose | One concise sentence stating the learning action | Avoid unexplained pedagogical terminology |
| Time | Approximate minutes, not a countdown promise | Do not use time as a penalty or anxiety cue |
| Primary action | One verb-led button, such as “Read and check” | Full keyboard focus, visible focus ring, 44 px minimum target |
| Completion | Quiet confirmation and a clear next activity | Honour reduced-motion preferences |

## Semantic Visual Language

The core interface is calm and neutral: warm paper/stone surfaces, readable ink, modest borders, and restrained shadows. Accent colour communicates **what kind of work this is**, not how exciting it is. Every semantic accent is paired with a visible text label and icon so no learner must infer meaning from colour alone.

| Semantic element | Icon intention | Accent use | Learner-facing label |
|---|---|---|---|
| Objective | Target | A small goal marker, not a coloured banner | **Your goal** / **هدفك** |
| Example | Quote | A quiet inset surface with a left rule | **Example** / **مثال** |
| Tip | Lightbulb | Low-emphasis support surface | **Helpful tip** / **نصيحة** |
| Common mistake | Alert circle | Clear warning border, never red text alone | **Watch out** / **انتبه** |
| Vocabulary | Book open | Lexical accent on word cards and source labels | **Words to use** / **كلمات تستخدمها** |
| Grammar | Puzzle piece | Pattern accent on contrast and construction panels | **Notice the pattern** / **لاحظ النمط** |
| Activity | Compass | Action accent on the next learner task | **Try it** / **جرّب** |
| Retrieval | Rotate-ccw | Recall accent with source-lesson link | **Remember** / **تذكّر** |
| Assessment | Check circle | Neutral, explicit checkpoint treatment | **Check your progress** / **تحقق من تقدّمك** |

## Progressive Disclosure Contract

On entering any lesson, the learner sees only: **what this is, what to do now, why it matters, and what follows**. Longer explanations, translations, transcripts, extended examples, error notes, and optional external-AI prompts appear when the learner requests help or reaches the point where that support is useful. A deep lesson may contain more material, but it must still present a single visible next action.

## Activity Family Grammar

| Lesson family | Learner promise | Visual signature | Primary action | Completion signal |
|---|---|---|---|---|
| Visual vocabulary | “See the word and connect it to meaning.” | Image or illustration region, word chip, Word/Example speech controls | Explore words | A recognised-word check |
| Grammar studio | “Notice the pattern, then build with it.” | Calm rule panel, pattern rows, positive/negative/question columns | Try the pattern | One explained correction |
| Interaction | “Follow a real exchange, then choose a response.” | Distinct speaker labels and turn cards | Continue the conversation | Conversation outcome summary |
| Speaking | “Listen, repeat, and compare your phrasing.” | Short line cards with Word and Example audio controls | Listen and repeat | Self-check prompt, never fake pronunciation scoring |
| Reading | “Read for a purpose, then show what you understood.” | Comfortable line length, progress marker, vocabulary support | Read and answer | Comprehension feedback with evidence |
| Writing | “Plan, write, and revise for one clear reader.” | Prompt card, optional checklist, external-AI prompt hand-off | Draft response | Learner-controlled revision checklist |
| Review | “Retrieve earlier learning and strengthen memory.” | Calm recall queue, source-lesson link, compact progress indicator | Recall now | Spaced-review scheduling acknowledgement |
| Assessment | “Show what you can do independently.” | Neutral checkpoint card, explicit pass expectation, question count | Start checkpoint | Clear result and next step |

## Tone and Motion

The interface uses restrained illustration, rounded reading surfaces, low-contrast supportive backgrounds, and purposeful accent colours. It avoids gamified pressure, loud achievement effects, and countdown cues. Motion is limited to short opacity/transform transitions below 300 ms and is disabled or reduced under `prefers-reduced-motion`.

| State | Visual treatment | Copy style |
|---|---|---|
| Ready | Calm surface, clear action | “When you are ready, begin.” |
| In progress | Subtle stage marker and saved-state reassurance | “Your work is saved as you continue.” |
| Correct | Low-key confirmation plus why it works | “Yes — this fits because…” |
| Needs revision | Specific, non-judgmental guidance | “Try this pattern again. Notice…” |
| Completed | Next-step invitation, not celebration noise | “You are ready for the next practice.” |

## Implementation Checklist

- Keep Word-only and Example-sentence speech controls distinct.
- Render both English and Arabic text deliberately; never rely on browser translation for learning content.
- Never use colour as the only indicator of correctness, completion, or activity type.
- Keep prompts, feedback, and long reading passages responsive at mobile widths.
- Use the activity taxonomy in `shared/course/types.ts` as the source of truth for activity labels and analytics.
- Review every new activity with keyboard navigation, screen-reader labels, reduced motion, and RTL Arabic layout in mind.
