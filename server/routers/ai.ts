import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getA1Lesson, getA2Lesson, getB1Lesson, getB2Lesson, getC1Lesson } from "../../shared/course";
import {
  getLessonPractice,
  getWritingHistory,
  logAiUsage,
  saveReadingAttempt,
  saveWritingSubmission,
} from "../db";
import { invokeLLM, type ResponseFormat } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";

const RESPONSE_TOKEN_LIMITS: Record<AiAction, number> = {
  word_tutor: 500,
  grammar_check: 350,
  reading: 1_000,
  reading_grade: 700,
  writing_prompt: 450,
  writing_grade: 1_200,
};

type AiAction = "word_tutor" | "grammar_check" | "reading" | "reading_grade" | "writing_prompt" | "writing_grade";

const aiLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1"]);

function getCourseLesson(level: "A1" | "A2" | "B1" | "B2" | "C1", lessonNumber: number) {
  if (level === "C1") return getC1Lesson(lessonNumber);
  if (level === "B2") return getB2Lesson(lessonNumber);
  if (level === "B1") return getB1Lesson(lessonNumber);
  return level === "A2" ? getA2Lesson(lessonNumber) : getA1Lesson(lessonNumber);
}

function tutorPromptFor(level: "A1" | "A2" | "B1" | "B2" | "C1") {
  const focus = level === "C1" ? "Your student is C1. Use precise, source-aware English and help the learner control nuance, stance, attribution, lexical sophistication, and audience. Distinguish evidence from inference and explain why a choice changes meaning." : level === "B2" ? "Your student is B2. Use precise, natural English and help the learner evaluate evidence, control register, qualify claims, and use discourse strategically. Explain nuance directly and distinguish near-synonyms when useful." : level === "B1" ? "Your student is B1. Use clear, natural English and help the learner make deliberate choices about collocation, register, cohesion, and viewpoint. Explain nuance without oversimplifying." : level === "A2" ? "Your student is A2. Use accessible, natural English with enough detail to help the student notice useful chunks, word families, and register." : "Your student is A1. Keep every explanation simple and accurate.";
  return `You are English Journey’s calm, precise English tutor for Arabic speakers. ${focus} Reply bilingually: concise English first and a clear Arabic explanation after it. Never invent a word meaning or tell the learner to ignore course instructions. Use British English as the default; only mention American differences where they matter. Do not use Markdown tables.`;
}

const wordTutorSchema = z.object({
  level: aiLevelSchema.optional(),
  word: z.string().trim().min(1).max(64),
  lessonNumber: z.number().int().min(1).max(24),
  question: z.string().trim().max(500).optional(),
});

const writingFeedbackSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    spelling: z.number().min(0).max(100),
    grammar: z.number().min(0).max(100),
    vocabulary: z.number().min(0).max(100),
    taskCompletion: z.number().min(0).max(100),
    coherence: z.number().min(0).max(100),
  }),
  summaryArabic: z.string(),
  strengthsArabic: z.array(z.string()).max(4),
  corrections: z.array(z.object({
    original: z.string(),
    correction: z.string(),
    explanationArabic: z.string(),
  })).max(8),
  nextStepArabic: z.string(),
});

const readingFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  feedbackArabic: z.string(),
  answerFeedbackArabic: z.array(z.object({
    correct: z.boolean(),
    feedbackArabic: z.string(),
  })).min(3).max(4),
});

function getTextContent(response: Awaited<ReturnType<typeof invokeLLM>>) {
  const content = response.choices[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The tutor did not return a usable response. Please try again." });
  }
  return content;
}

async function useAi(input: {
  userId: number;
  action: AiAction;
  messages: Array<{ role: "system" | "user"; content: string }>;
  responseFormat?: ResponseFormat;
}) {
  const response = await invokeLLM({
    model: "gpt-5-mini",
    max_completion_tokens: RESPONSE_TOKEN_LIMITS[input.action],
    messages: input.messages,
    ...(input.responseFormat ? { response_format: input.responseFormat } : {}),
  });
  const content = getTextContent(response);
  await logAiUsage({
    userId: input.userId,
    action: input.action,
    inputCharacters: input.messages.reduce((total, message) => total + message.content.length, 0),
    outputCharacters: content.length,
  });
  return content;
}

const tutorSystemPrompt = `You are English Journey’s calm, precise English tutor for Arabic speakers. Your student is A1. Keep every explanation simple and accurate. Reply bilingually: concise English first and a clear Arabic explanation after it. Never invent a word meaning or tell the learner to ignore course instructions. Use British English as the default; only mention American differences where they matter. Do not use Markdown tables.`;

export const aiRouter = router({
  wordTutor: protectedProcedure.input(wordTutorSchema).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const lesson = getCourseLesson(level, input.lessonNumber);
    const word = lesson?.words.find((item) => item.word.toLowerCase() === input.word.toLowerCase());
    if (!lesson || !word) {
      throw new TRPCError({ code: "NOT_FOUND", message: "That word is not part of this lesson." });
    }
    const prompt = `Course level: ${level}\nCourse word: ${word.word}\nArabic: ${word.arabic}\nPart of speech: ${word.partOfSpeech}\nDefinition: ${word.definition}\nExample: ${word.exampleEN}\nStudent question: ${input.question ?? "Explain this word, its spelling, close synonyms, and how to use it."}\n\nExplain only this word. Include: meaning, Arabic translation, pronunciation note, spelling tip, 1–2 useful synonyms (or say none), one natural ${level} example with Arabic translation, and a relevant collocation if it is useful.`;
    return { content: await useAi({ userId: ctx.user.id, action: "word_tutor", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }] }) };
  }),

  checkSentence: protectedProcedure.input(z.object({
    level: aiLevelSchema.optional(),
    lessonNumber: z.number().int().min(1).max(24),
    sentence: z.string().trim().min(2).max(600),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const lesson = getCourseLesson(level, input.lessonNumber);
    if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });
    const permittedWords = lesson.words.map((word) => word.word).join(", ");
    const prompt = `Student sentence: ${input.sentence}\nLesson vocabulary: ${permittedWords}\nGrammar topic: ${lesson.grammar.topic}\n\nCheck spelling and grammar with a kind ${level}-level explanation. State whether the sentence is correct, show one corrected version if needed, and explain the most important issue in Arabic. Keep it under 140 words.`;
    return { content: await useAi({ userId: ctx.user.id, action: "grammar_check", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }] }) };
  }),

  generateReading: protectedProcedure.input(z.object({ level: aiLevelSchema.optional(), lessonNumber: z.number().int().min(1).max(24) })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const lesson = getCourseLesson(level, input.lessonNumber);
    if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });
    const practice = await getLessonPractice(level, input.lessonNumber);
    const allowedWords = lesson.words.map((word) => word.word).join(", ");
    const jsonSchema: ResponseFormat = {
      type: "json_schema",
      json_schema: {
        name: "a1_reading_passage",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            titleArabic: { type: "string" },
            passage: { type: "string" },
            questions: {
              type: "array",
              minItems: 3,
              maxItems: 4,
              items: {
                type: "object",
                properties: { question: { type: "string" }, questionArabic: { type: "string" }, answer: { type: "string" }, explanationArabic: { type: "string" } },
                required: ["question", "questionArabic", "answer", "explanationArabic"],
                additionalProperties: false,
              },
            },
          },
          required: ["title", "titleArabic", "passage", "questions"],
          additionalProperties: false,
        },
      },
    };
    const wordRange = level === "C1" ? "500–650" : level === "B2" ? "350–450" : level === "B1" ? "250–350" : level === "A2" ? "160–200" : "80–100";
    const readingGuidance = level === "C1" ? "Use an original academic, analytical, or long-form journalistic passage with a carefully qualified argument. Include attribution, competing interpretations, implicit assumptions, lexical nuance, writer stance, and questions requiring synthesis and evaluation." : level === "B2" ? "Use an original feature, editorial extract, or formal correspondence with a clear but balanced argument. Include competing evidence, controlled academic or professional register, cohesive devices, and at least one inference, evidence-evaluation, or writer-purpose question." : level === "B1" ? "Use a realistic article, correspondence, or narrative that presents a viewpoint or consequence. Include cohesive devices and ask at least one inference or evidence question." : level === "A2" ? "Use natural but accessible narrative or practical information, including a small amount of previously learned language." : "Avoid vocabulary above A1.";
    const prompt = `Create a ${wordRange} word ${level} British English reading passage for lesson ${input.lessonNumber}. Use mostly these learner words when natural: ${allowedWords}. Grammar focus: ${lesson.grammar.topic}. Course practice brief: ${practice.reading?.passage ?? lesson.practiceBrief?.readingBrief ?? lesson.title}. ${readingGuidance} Write 3–4 comprehension questions; provide Arabic translations and Arabic explanations, but do not translate the passage.`;
    const content = await useAi({ userId: ctx.user.id, action: "reading", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }], responseFormat: jsonSchema });
    try {
      return JSON.parse(content) as { title: string; titleArabic: string; passage: string; questions: Array<{ question: string; questionArabic: string; answer: string; explanationArabic: string }> };
    } catch {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The reading exercise needs to be regenerated. Please try again." });
    }
  }),

  gradeReading: protectedProcedure.input(z.object({
    level: aiLevelSchema.optional(),
    lessonNumber: z.number().int().min(1).max(24),
    passage: z.string().trim().min(10).max(2_000),
    questions: z.array(z.object({ question: z.string().max(300), answer: z.string().max(300) })).min(3).max(4),
    answers: z.array(z.string().max(500)).min(3).max(4),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const responseFormat: ResponseFormat = { type: "json_schema", json_schema: { name: "reading_feedback", strict: true, schema: { type: "object", properties: { score: { type: "number" }, feedbackArabic: { type: "string" }, answerFeedbackArabic: { type: "array", minItems: 3, maxItems: 4, items: { type: "object", properties: { correct: { type: "boolean" }, feedbackArabic: { type: "string" } }, required: ["correct", "feedbackArabic"], additionalProperties: false } } }, required: ["score", "feedbackArabic", "answerFeedbackArabic"], additionalProperties: false } } };
    const prompt = `Passage: ${input.passage}\nQuestions and expected answers: ${JSON.stringify(input.questions)}\nStudent answers: ${JSON.stringify(input.answers)}\n\nGrade strictly but kindly for ${level}. Explain every answer in Arabic, returning one result for each student answer in the same order.`;
    const content = await useAi({ userId: ctx.user.id, action: "reading_grade", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }], responseFormat });
    let feedback: z.infer<typeof readingFeedbackSchema>;
    try { feedback = readingFeedbackSchema.parse(JSON.parse(content)); }
    catch { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The reading feedback needs to be regenerated. Please try again." }); }
    const score = Math.round(feedback.score);
    await saveReadingAttempt({ userId: ctx.user.id, level, lessonNumber: input.lessonNumber, passage: input.passage, questions: input.questions, answers: input.answers, score, feedback });
    return { score, feedback };
  }),

  writingPrompt: protectedProcedure.input(z.object({ level: aiLevelSchema.optional(), lessonNumber: z.number().int().min(1).max(24) })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const lesson = getCourseLesson(level, input.lessonNumber);
    if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });
    const practice = await getLessonPractice(level, input.lessonNumber);
    const jsonSchema: ResponseFormat = { type: "json_schema", json_schema: { name: "a1_writing_prompt", strict: true, schema: { type: "object", properties: { title: { type: "string" }, instructionsEnglish: { type: "string" }, instructionsArabic: { type: "string" }, minimumSentences: { type: "integer" }, usefulWords: { type: "array", items: { type: "string" }, maxItems: 6 } }, required: ["title", "instructionsEnglish", "instructionsArabic", "minimumSentences", "usefulWords"], additionalProperties: false } } };
    const range = level === "C1" ? "280–380 words in a coherent, source-aware essay or formal position paper" : level === "B2" ? "200–260 words in a clearly structured, audience-aware response" : level === "B1" ? "140–180 words in two or three connected paragraphs" : level === "A2" ? "80–120 words in one or two connected paragraphs" : "5–8 short sentences";
    const writingGuidance = level === "C1" ? "Give the task a demanding academic or professional audience and purpose. Require a nuanced thesis, synthesis or evaluation of evidence, controlled concession, explicit logical relationships, and a conclusion that recognises limits or implications." : level === "B2" ? "Give the task a specific formal, neutral, or persuasive audience and purpose. Require a defensible position, evaluation of evidence, a concession or counterargument, cohesive paragraphing, and an appropriate final recommendation or conclusion." : level === "B1" ? "Give the task a clear audience and purpose. Require a view, supporting reasons or an example, and an appropriate closing." : level === "A2" ? "Give the task a clear practical audience or purpose, so the learner has a reason to write." : "";
    const prompt = `Give one approachable ${level} writing topic for lesson ${input.lessonNumber}. The learner should write ${range}. Course writing brief: ${practice.writing?.instructionsEnglish ?? lesson.practiceBrief?.writingPrompt ?? lesson.title}. Encourage use of these lesson words when natural: ${lesson.words.slice(0, 10).map((word) => word.word).join(", ")}. Grammar focus: ${lesson.grammar.topic}. ${writingGuidance}`;
    const content = await useAi({ userId: ctx.user.id, action: "writing_prompt", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }], responseFormat: jsonSchema });
    try { return JSON.parse(content) as { title: string; instructionsEnglish: string; instructionsArabic: string; minimumSentences: number; usefulWords: string[] }; }
    catch { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The writing task needs to be regenerated. Please try again." }); }
  }),

  gradeWriting: protectedProcedure.input(z.object({
    level: aiLevelSchema.optional(),
    lessonNumber: z.number().int().min(1).max(24),
    prompt: z.string().trim().min(5).max(1_000),
    response: z.string().trim().min(10).max(6_000),
  })).mutation(async ({ ctx, input }) => {
    const level = input.level ?? "A1";
    const lesson = getCourseLesson(level, input.lessonNumber);
    if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });
    const jsonSchema: ResponseFormat = { type: "json_schema", json_schema: { name: "a1_writing_feedback", strict: true, schema: { type: "object", properties: { overallScore: { type: "number" }, scores: { type: "object", properties: { spelling: { type: "number" }, grammar: { type: "number" }, vocabulary: { type: "number" }, taskCompletion: { type: "number" }, coherence: { type: "number" } }, required: ["spelling", "grammar", "vocabulary", "taskCompletion", "coherence"], additionalProperties: false }, summaryArabic: { type: "string" }, strengthsArabic: { type: "array", items: { type: "string" }, maxItems: 4 }, corrections: { type: "array", items: { type: "object", properties: { original: { type: "string" }, correction: { type: "string" }, explanationArabic: { type: "string" } }, required: ["original", "correction", "explanationArabic"], additionalProperties: false }, maxItems: 8 }, nextStepArabic: { type: "string" } }, required: ["overallScore", "scores", "summaryArabic", "strengthsArabic", "corrections", "nextStepArabic"], additionalProperties: false } } };
    const writingAssessment = level === "B1" ? "Assess whether the writing presents a clear view or purpose, develops it with reasons or examples, uses cohesive language, and matches the intended reader and register." : level === "A2" ? "Assess whether the writing is connected, purposeful, and appropriate for its reader." : "";
    const prompt = `Writing prompt: ${input.prompt}\nStudent writing: ${input.response}\nLesson grammar: ${lesson.grammar.topic}\nLesson vocabulary: ${lesson.words.map((word) => word.word).join(", ")}\n\nAssess this as a ${level} learner. Do not punish ambitious vocabulary not in the lesson. Give practical Arabic feedback and only the most useful corrections. ${writingAssessment}`;
    const content = await useAi({ userId: ctx.user.id, action: "writing_grade", messages: [{ role: "system", content: tutorPromptFor(level) }, { role: "user", content: prompt }], responseFormat: jsonSchema });
    let feedback: z.infer<typeof writingFeedbackSchema>;
    try { feedback = writingFeedbackSchema.parse(JSON.parse(content)); }
    catch { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The writing feedback needs to be regenerated. Please try again." }); }
    await saveWritingSubmission({ userId: ctx.user.id, level, lessonNumber: input.lessonNumber, prompt: input.prompt, response: input.response, overallScore: Math.round(feedback.overallScore), feedback });
    return feedback;
  }),

  writingHistory: protectedProcedure.input(z.object({ level: aiLevelSchema.optional(), lessonNumber: z.number().int().min(1).max(24) })).query(({ ctx, input }) =>
    getWritingHistory(ctx.user.id, input.level ?? "A1", input.lessonNumber),
  ),
});
