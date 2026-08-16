import type { LessonDefinition, VocabularyItem } from "@shared/course";

type SupportedLevel = "A1" | "A2" | "B1" | "B2";

const levelWordRange: Record<SupportedLevel, string> = {
  A1: "80–100",
  A2: "160–200",
  B1: "250–350",
  B2: "350–450",
};

function isSupportedLevel(level: string): level is SupportedLevel {
  return level === "A1" || level === "A2" || level === "B1" || level === "B2";
}

function lessonLanguage(lesson: LessonDefinition) {
  return lesson.words.map((word) => `${word.word} (${word.arabic})`).join(", ");
}

function writingLength(lesson: LessonDefinition) {
  if (lesson.level === "B2") return "200–260 words";
  if (lesson.level === "B1") return "140–180 words";
  if (lesson.level === "A2") return "80–120 words";
  return "35–60 words";
}

export function buildWordHelpPrompt(input: {
  lesson: LessonDefinition;
  word: VocabularyItem;
  question?: string;
}) {
  const { lesson, word, question } = input;
  return `You are helping an Arabic-speaking English learner. Do not complete their quiz or write an answer for them. Give a concise, accurate bilingual explanation.

Course level: ${lesson.level}
Module: ${lesson.moduleNumber}
Lesson: ${lesson.lessonNumber} — ${lesson.title}
Target word: ${word.word}
Arabic translation in the course: ${word.arabic}
Part of speech: ${word.partOfSpeech}
Course definition: ${word.definition}
Course example: ${word.exampleEN}
Learner’s question: ${question?.trim() || "Explain the meaning, spelling, pronunciation, and a natural example."}

Please provide:
1. A simple English meaning, then a clear Arabic explanation.
2. British English pronunciation and one spelling tip.
3. One or two close synonyms only if they fit this level.
4. One natural ${lesson.level}-level example with Arabic translation.
5. One useful collocation if appropriate.
Keep the response focused on this word and do not use Markdown tables.`;
}

export function buildSentenceReviewPrompt(input: { lesson: LessonDefinition; sentence: string }) {
  const { lesson, sentence } = input;
  return `You are reviewing one English sentence written by an Arabic-speaking ${lesson.level} learner. Be kind, specific, and do not rewrite the learner’s idea unnecessarily.

Lesson: ${lesson.level} · Module ${lesson.moduleNumber} · Lesson ${lesson.lessonNumber}: ${lesson.title}
Grammar focus: ${lesson.grammar.topic}
Lesson words: ${lessonLanguage(lesson)}
Learner sentence: ${sentence.trim() || "[The learner has not entered a sentence yet.]"}

Reply with:
1. Correct / needs revision.
2. A corrected version only if needed.
3. The most important reason in simple English and Arabic.
4. One short next-step tip.
Do not give a score and do not introduce advanced grammar beyond ${lesson.level}.`;
}

export function buildReadingPrompt(lesson: LessonDefinition) {
  const level = isSupportedLevel(lesson.level) ? lesson.level : "A1";
  const brief = lesson.practiceBrief?.readingBrief ?? lesson.learningPlan?.outcome.canDo ?? lesson.title;
  return `Create an original ${levelWordRange[level]}-word British English reading practice for an Arabic-speaking ${lesson.level} learner.

Course context:
- Module ${lesson.moduleNumber}, lesson ${lesson.lessonNumber}: ${lesson.title}
- Lesson outcome: ${lesson.learningPlan?.outcome.canDo ?? "Use the language from this lesson accurately."}
- Grammar focus: ${lesson.grammar.topic}
- Target language: ${lessonLanguage(lesson)}
- Course reading brief: ${brief}

Requirements:
1. Keep the main passage in English only; do not translate the passage into Arabic.
2. Use target language naturally rather than forcing every item.
3. Match the learner’s ${lesson.level} level and use British English by default.
4. Add 3–4 comprehension questions in English, each followed by an Arabic translation.
5. Put a hidden-style answer key after a clear heading: “Answer key — check after trying”. Give a short Arabic explanation for each answer.
6. Do not use Markdown tables.`;
}

export function writingTaskFor(lesson: LessonDefinition) {
  const instructions = lesson.practiceBrief?.writingPrompt
    ?? `Write a ${writingLength(lesson)} response that shows you can ${lesson.learningPlan?.outcome.canDo ?? `use ${lesson.grammar.topic}`}.`;
  return {
    title: `Writing: ${lesson.title}`,
    instructions,
    instructionsArabic: `اكتب رداً بطول ${writingLength(lesson)} لتثبت أنك تستطيع ${lesson.learningPlan?.outcome.canDoArabic ?? `استخدام قاعدة ${lesson.grammar.arabicName}`}.`,
    usefulWords: lesson.words.slice(0, 8).map((word) => word.word),
    targetLength: writingLength(lesson),
  };
}

export function buildWritingFeedbackPrompt(input: { lesson: LessonDefinition; draft: string }) {
  const { lesson, draft } = input;
  const task = writingTaskFor(lesson);
  return `You are giving formative feedback to an Arabic-speaking ${lesson.level} English learner. Do not write a replacement essay. Preserve the learner’s ideas and help them revise.

Course context:
- Module ${lesson.moduleNumber}, lesson ${lesson.lessonNumber}: ${lesson.title}
- Intended length: ${task.targetLength}
- Writing task: ${task.instructions}
- Grammar focus: ${lesson.grammar.topic}
- Useful lesson words: ${task.usefulWords.join(", ")}

Learner draft:
${draft.trim() || "[The learner has not entered a draft yet.]"}

Please provide:
1. A short overall comment in English and Arabic.
2. Separate, actionable feedback on spelling, grammar, vocabulary, task completion, and organisation.
3. At most five corrections in this format: original → improved version → brief Arabic explanation.
4. A short revision checklist.
5. Do not assign a percentage, write a new draft, or use Markdown tables.`;
}
