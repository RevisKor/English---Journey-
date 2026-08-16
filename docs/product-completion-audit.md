# English Journey — Product Completion Audit

**Scope.** This audit compares the current authenticated learner shell, persisted course catalog, lesson flows, and roadmap against the product promise: a guided bilingual English-learning platform for Arabic speakers from A1 to C2. It assesses readiness rather than proposing speculative features.

## Current state

The core learning product is substantial. The active catalog contains A1–C2 curricula, gated lesson progression, contextual quizzes and milestone tests, user progress, streaks, module word banks, bilingual support, browser speech playback, and external-AI lesson prompts. B2, C1, and C2 were also promoted into the persistent version-5 catalog. The remaining work is primarily product-polish, learner self-service, and launch-hardening rather than a missing curriculum foundation.

## Priority findings

| Priority | Gap | Why it matters | Recommended outcome |
|---|---|---|---|
| **Now** | **Stale level summaries in the dashboard** | The level switcher still states the earlier lesson totals (for example, A1 as 20 lessons) despite the active catalog now containing 90–180 lessons. This conflicts with the course map and can reduce learner trust. | Derive the displayed lesson count and module detail from the active course definitions rather than hard-coding legacy totals. |
| **Now** | **Pronunciation is playback, not feedback** | A learner can hear the word or example sentence, but the app does not listen to the learner, detect pronunciation, or give corrective guidance. This leaves the original pronunciation-learning objective incomplete. | Add an optional speaking-practice flow: record/transcribe speech, compare target phrase coverage, provide careful learner-facing feedback, and retain a no-cost browser-only fallback. |
| **Now** | **No true study-review destination** | The database supports due-review items and the word bank supports a local reviewed flag, but the visible product lacks a dedicated, persistent daily review session, difficult-word list, and clear review queue entry point. | Add a “Today’s review” workspace with due words/grammar, answer feedback, and a return-to-lesson action. |
| **Pre-launch** | **Learner settings and data self-service are incomplete** | The data model contains profile values such as interface language and current level, while the exposed course API currently supports only accent updates. There is no learner-facing profile/settings view, data export, or account/data-deletion request flow. | Add settings for interface language and accent, plus a clear privacy page, personal-progress export, and account/data deletion workflow. |
| **Pre-launch** | **Essential explanatory pages are absent** | The route surface is a single learning shell. Learners do not yet have dedicated help, FAQ, learning-method, privacy, or terms pages. | Add lightweight, bilingual help and legal pages, including explanation of external AI prompts and browser speech behavior. |
| **Pre-launch** | **Reading and writing feedback depends on external tools without a closed loop** | The transparent external-prompt strategy avoids per-request AI charges, but learners have no guided place to save structured feedback, revision goals, or final drafts after using an external tool. | Add a simple reflection and revision capture workflow: pasted feedback, self-rating rubric, revision checklist, and saved draft history. |
| **Pre-launch** | **Accessibility hardening has not been demonstrated** | The interface uses strong visual structure and controls, but there is no recorded keyboard-only, screen-reader, reduced-motion, or contrast acceptance pass. | Run a focused accessibility audit, fix issues, and add regression checks for keyboard access and accessible names in lesson, dialog, quiz, and course-map controls. |
| **Later** | **Placement and re-entry flow** | New learners must begin the linear path; returning learners lack a guided diagnostic or structured way to choose an appropriate level. | Add an optional placement diagnostic and an admin-approved level recommendation—not an automatic skip. |
| **Later** | **Motivation and completion artefacts** | Progress is tracked through XP, streaks, modules, and tests, but learners cannot download a completion summary or view milestones outside the course map. | Add a learner progress report, module completion page, and printable/digital certificate only after assessment standards are finalised. |
| **Later** | **Study navigation utilities** | Course maps are ordered and clear, but they have no search, bookmarks, notes, saved phrases, or “resume last activity” history. | Add search and optional personal bookmarks/notes once the core review and feedback loops are complete. |

## Recommended implementation order

> **First, correct trust-visible data and close the daily study loop.**

1. **Fix the stale level cards** and make all course summaries definition-driven.
2. **Build the dedicated review workspace** around existing due-review data and word-bank progress.
3. **Add speaking practice with transparent limits**, preserving the current word-only and example playback controls.
4. **Add profile, privacy, help, and legal pages** before inviting regular learners.
5. **Capture reading/writing revision evidence** so external AI prompts produce a useful learning loop rather than a one-off interaction.
6. **Perform an accessibility and launch-hardening pass**, then consider placement, certificates, bookmarks, and richer study history.

## Non-blocking design improvements

The mobile route is functional and coherent, but it is visually repetitive over a long course map. The strongest non-blocking design enhancement is to make checkpoints, module transitions, and “next lesson” moments feel more like a learning journey, while preserving the existing warm cream, navy, and gold bilingual visual system.

## Decision needed

The recommended next milestone is **Study Foundation Completion**: definition-driven level metadata, a daily review workspace, and learner settings/privacy/help. This is the highest-value path because it improves both trust and repeated daily use without introducing per-request AI costs.
