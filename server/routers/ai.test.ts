import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../_core/context";

const { countAiActionsToday, getLessonPractice, getWritingHistory, logAiUsage, saveReadingAttempt, saveWritingSubmission, invokeLLM } = vi.hoisted(() => ({
  countAiActionsToday: vi.fn(),
  getLessonPractice: vi.fn(),
  getWritingHistory: vi.fn(),
  logAiUsage: vi.fn(),
  saveReadingAttempt: vi.fn(),
  saveWritingSubmission: vi.fn(),
  invokeLLM: vi.fn(),
}));

vi.mock("../db", () => ({
  countAiActionsToday,
  getLessonPractice,
  getWritingHistory,
  logAiUsage,
  saveReadingAttempt,
  saveWritingSubmission,
}));

vi.mock("../_core/llm", () => ({
  invokeLLM,
}));

import { aiRouter } from "./ai";

function createContext(): TrpcContext {
  return {
    user: { id: 7, openId: "learner-7", name: "Learner", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function modelResponse(content: string) {
  return { choices: [{ message: { content } }] };
}

describe("AI course procedures", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    countAiActionsToday.mockResolvedValue(0);
    getLessonPractice.mockResolvedValue({ reading: undefined, writing: undefined });
    logAiUsage.mockResolvedValue(undefined);
    saveReadingAttempt.mockResolvedValue(undefined);
    saveWritingSubmission.mockResolvedValue(undefined);
    getWritingHistory.mockResolvedValue([]);
  });

  it("keeps the word tutor lesson-aware and applies a bounded response size", async () => {
    invokeLLM.mockResolvedValue(modelResponse("Meaning in English\nالمعنى بالعربية"));
    const caller = aiRouter.createCaller(createContext());

    await expect(caller.wordTutor({ lessonNumber: 1, word: "a" })).resolves.toEqual({ content: "Meaning in English\nالمعنى بالعربية" });
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5-mini", max_completion_tokens: 500 }));
    expect(logAiUsage).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, action: "word_tutor" }));
  });

  it("allows a learner action even when historical AI activity is high during the uncapped pilot", async () => {
    countAiActionsToday.mockResolvedValue(18);
    invokeLLM.mockResolvedValue(modelResponse("Meaning in English\nالمعنى بالعربية"));
    const caller = aiRouter.createCaller(createContext());

    await expect(caller.wordTutor({ lessonNumber: 1, word: "a" })).resolves.toEqual({ content: "Meaning in English\nالمعنى بالعربية" });
    expect(invokeLLM).toHaveBeenCalledOnce();
  });

  it("returns a controlled reading exercise from structured model content", async () => {
    getLessonPractice.mockResolvedValueOnce({ reading: { passage: "A stored reading brief about greetings." }, writing: undefined });
    invokeLLM.mockResolvedValue(modelResponse(JSON.stringify({
      title: "A Small Hello", titleArabic: "تحية صغيرة", passage: "Hello. I am Ali. I am at home with my family.",
      questions: [
        { question: "Who is at home?", questionArabic: "من في المنزل؟", answer: "Ali", explanationArabic: "النص يقول: I am Ali." },
        { question: "Where is Ali?", questionArabic: "أين علي؟", answer: "At home", explanationArabic: "النص يقول: at home." },
        { question: "Who is with Ali?", questionArabic: "من مع علي؟", answer: "His family", explanationArabic: "النص يقول: with my family." },
      ],
    })));
    const caller = aiRouter.createCaller(createContext());

    const result = await caller.generateReading({ lessonNumber: 1 });
    expect(result.questions).toHaveLength(3);
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ max_completion_tokens: 1000, response_format: expect.objectContaining({ type: "json_schema" }) }));
    expect(getLessonPractice).toHaveBeenCalledWith("A1", 1);
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ messages: expect.arrayContaining([expect.objectContaining({ content: expect.stringContaining("A stored reading brief about greetings.") })]) }));
  });

  it("uses the stored writing brief when generating a learner-facing writing task", async () => {
    getLessonPractice.mockResolvedValueOnce({ reading: undefined, writing: { instructionsEnglish: "Write a short note about your family." } });
    invokeLLM.mockResolvedValue(modelResponse(JSON.stringify({
      title: "A family note", instructionsEnglish: "Write about your family.", instructionsArabic: "اكتب عن عائلتك.", minimumSentences: 5, usefulWords: ["family", "happy"],
    })));
    const caller = aiRouter.createCaller(createContext());

    await caller.writingPrompt({ lessonNumber: 1 });

    expect(getLessonPractice).toHaveBeenCalledWith("A1", 1);
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ messages: expect.arrayContaining([expect.objectContaining({ content: expect.stringContaining("Write a short note about your family.") })]) }));
  });

  it("uses B1 lesson context and a higher-demand reading brief for the 24-lesson course", async () => {
    getLessonPractice.mockResolvedValueOnce({ reading: { passage: "Read an opinion article about a community decision." }, writing: undefined });
    invokeLLM.mockResolvedValue(modelResponse(JSON.stringify({
      title: "A Community Choice", titleArabic: "خيار مجتمعي", passage: "A local group discussed a proposal and explained why the decision could affect daily life for several residents.",
      questions: [
        { question: "What proposal did the group discuss?", questionArabic: "ما المقترح الذي ناقشته المجموعة؟", answer: "A local proposal", explanationArabic: "ينص النص على وجود مقترح محلي." },
        { question: "Why could the decision matter?", questionArabic: "لماذا قد يهم القرار؟", answer: "It could affect residents", explanationArabic: "يشرح النص أن القرار قد يؤثر في السكان." },
        { question: "What evidence supports this view?", questionArabic: "ما الدليل الذي يدعم هذا الرأي؟", answer: "The described daily-life impact", explanationArabic: "يشير النص إلى أثر القرار في الحياة اليومية." },
      ],
    })));
    const caller = aiRouter.createCaller(createContext());

    await expect(caller.generateReading({ level: "B1", lessonNumber: 24 })).resolves.toMatchObject({ title: "A Community Choice" });

    expect(getLessonPractice).toHaveBeenCalledWith("B1", 24);
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({ messages: expect.arrayContaining([
      expect.objectContaining({ content: expect.stringContaining("250–350") }),
      expect.objectContaining({ content: expect.stringContaining("inference or evidence question") }),
      expect.objectContaining({ content: expect.stringContaining("Read an opinion article about a community decision.") }),
    ]) }));
  });

  it("validates and persists structured writing feedback", async () => {
    invokeLLM.mockResolvedValue(modelResponse(JSON.stringify({
      overallScore: 80,
      scores: { spelling: 90, grammar: 80, vocabulary: 70, taskCompletion: 80, coherence: 80 },
      summaryArabic: "كتابة جيدة وواضحة.", strengthsArabic: ["استخدمت جملة كاملة."],
      corrections: [{ original: "I is", correction: "I am", explanationArabic: "نستخدم am مع I." }],
      nextStepArabic: "اكتب جملة أخرى باستخدام كلمة hello.",
    })));
    const caller = aiRouter.createCaller(createContext());

    const result = await caller.gradeWriting({ lessonNumber: 1, prompt: "Write about yourself.", response: "Hello. I am Ali. I am happy." });
    expect(result.overallScore).toBe(80);
    expect(saveWritingSubmission).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, overallScore: 80 }));
  });
});
