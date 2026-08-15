import type {
  InteractionTurn,
  GrammarTeachingGuide,
  LessonActivity,
  LessonDefinition,
  LessonProgressionStage,
  LessonType,
  SpeakingLine,
  VisualVocabularyItem,
} from "./types";

const lessonTypeByPosition: LessonType[] = [
  "standard",
  "visual-vocabulary",
  "interaction",
  "speaking",
  "reading",
  "writing",
  "review",
];

const progression: LessonProgressionStage[] = [
  "introduction",
  "explanation",
  "guided-practice",
  "independent-practice",
  "real-context",
  "review",
  "assessment",
];

function levelLanguage(level: LessonDefinition["level"]) {
  return level === "A1" || level === "A2"
    ? { tone: "Use short, concrete language with Arabic support when needed.", toneArabic: "استخدم لغة قصيرة وملموسة مع دعم عربي عند الحاجة." }
    : level === "B1" || level === "B2"
      ? { tone: "Connect the language to a situation, purpose, and audience.", toneArabic: "اربط اللغة بموقف وهدف وجمهور." }
      : { tone: "Track nuance, evidence, register, and the effect of each language choice.", toneArabic: "تتبّع الفروق الدقيقة والدليل والسجل وأثر كل اختيار لغوي." };
}

function visualMnemonic(word: string, lessonTitle: string) {
  const initial = word.slice(0, 1).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><title>${lessonTitle} · ${word}</title><rect width="640" height="360" rx="32" fill="#fff0bd"/><circle cx="520" cy="86" r="58" fill="#e7b84a" opacity=".55"/><circle cx="110" cy="290" r="74" fill="#cdebd6" opacity=".8"/><text x="320" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="180" font-weight="700" fill="#253453">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function visualCategory(lessonTitle: string) {
  const title = lessonTitle.toLowerCase();
  if (title.includes("food") || title.includes("cook") || title.includes("meal")) return "Food and daily life";
  if (title.includes("travel") || title.includes("place") || title.includes("city")) return "Places and movement";
  if (title.includes("work") || title.includes("profession") || title.includes("career")) return "People and work";
  if (title.includes("home") || title.includes("family")) return "Home and relationships";
  return "Useful words in context";
}

function visualItems(lesson: LessonDefinition): VisualVocabularyItem[] {
  const category = visualCategory(lesson.title);
  return lesson.words.slice(0, 6).map((word) => ({
    id: `${lesson.level.toLowerCase()}-visual-${lesson.lessonNumber}-${word.id}`,
    word: word.word,
    arabic: word.arabic,
    pronunciation: `${word.ipa} · ${word.phoneticRespelling}`,
    exampleEN: word.exampleEN,
    exampleAR: word.exampleAR,
    imageUrl: visualMnemonic(word.word, lesson.title),
    altText: `${word.word} visual vocabulary mnemonic for ${lesson.title}`,
    category,
    interactionHint: "Listen, reveal the example, then mark this word reviewed.",
  }));
}

function interactionTurns(lesson: LessonDefinition): InteractionTurn[] {
  const words = lesson.words.slice(0, 3);
  return [
    { id: `${lesson.level.toLowerCase()}-turn-${lesson.lessonNumber}-1`, speaker: "A", text: `Hello. I want to talk about ${words[0]?.word ?? "today's topic"}.`, textArabic: `مرحباً. أريد أن أتحدث عن ${words[0]?.arabic ?? "موضوع اليوم"}.`, purpose: "Open the situation clearly." },
    { id: `${lesson.level.toLowerCase()}-turn-${lesson.lessonNumber}-2`, speaker: "B", text: `That sounds useful. Can you explain ${words[1]?.word ?? "the idea"}?`, textArabic: `هذا مفيد. هل يمكنك شرح ${words[1]?.arabic ?? "الفكرة"}؟`, purpose: "Ask a focused follow-up question." },
    { id: `${lesson.level.toLowerCase()}-turn-${lesson.lessonNumber}-3`, speaker: "A", text: `Yes. Here is one example: ${words[2]?.exampleEN ?? "This is an example."}`, textArabic: `نعم. إليك مثالاً: ${words[2]?.exampleAR ?? "هذا مثال."}`, purpose: "Respond with an example or explanation." },
  ];
}

function speakingLines(lesson: LessonDefinition): SpeakingLine[] {
  return lesson.words.slice(0, 4).map((word, index) => ({
    id: `${lesson.level.toLowerCase()}-speak-${lesson.lessonNumber}-${index + 1}`,
    speaker: "Learner",
    text: word.exampleEN,
    textArabic: word.exampleAR,
    pronunciationHint: `${word.ipa} · ${word.phoneticRespelling}`,
    audioText: word.exampleEN,
  }));
}

function activity(kind: LessonType, lesson: LessonDefinition, stage: LessonProgressionStage, index: number): LessonActivity {
  const language = levelLanguage(lesson.level);
  const firstWords = lesson.words.slice(0, 5).map((word) => word.word);
  const titleByKind: Record<LessonType, [string, string]> = {
    standard: ["Learn the language", "تعلّم اللغة"],
    "visual-vocabulary": ["See and name it", "شاهد وسمِّ الكلمة"],
    interaction: ["Use it in a real situation", "استخدمها في موقف حقيقي"],
    speaking: ["Listen, repeat, and speak", "استمع وكرّر وتحدّث"],
    reading: ["Read for meaning", "اقرأ من أجل المعنى"],
    writing: ["Write something meaningful", "اكتب شيئاً ذا معنى"],
    review: ["Retrieve and reconnect", "استرجع واربط"],
    assessment: ["Show what you can do", "أثبت ما تستطيع فعله"],
  };
  const [title, titleArabic] = titleByKind[kind];
  return {
    id: `${lesson.level.toLowerCase()}-lesson-${lesson.lessonNumber}-activity-${index + 1}`,
    kind,
    title,
    titleArabic,
    objective: `${language.tone} Apply today's language in the ${lesson.title} theme.`,
    objectiveArabic: `${language.toneArabic} طبّق لغة اليوم في موضوع ${lesson.titleArabic}.`,
    stage,
    estimatedMinutes: kind === "standard" ? 12 : kind === "reading" || kind === "writing" ? 15 : 8,
    vocabularyIds: lesson.words.slice(0, 10).map((word) => word.id),
    grammarIds: lesson.grammar ? [lesson.grammar.id] : [],
    visualItems: kind === "visual-vocabulary" ? visualItems(lesson) : undefined,
    interactionTurns: kind === "interaction" ? interactionTurns(lesson) : undefined,
    speakingLines: kind === "speaking" ? speakingLines(lesson) : undefined,
    readingText: kind === "reading" ? lesson.words.slice(0, 5).map((word) => word.exampleEN).join(" ") : undefined,
    readingTextArabic: kind === "reading" ? lesson.words.slice(0, 5).map((word) => word.exampleAR).join(" ") : undefined,
    readingChecks: kind === "reading" ? [{ id: `${lesson.level.toLowerCase()}-check-${lesson.lessonNumber}`, type: "main-idea", prompt: `What is the main idea of this ${lesson.title} text?`, promptArabic: `ما الفكرة الرئيسة في نص ${lesson.titleArabic}؟` }] : undefined,
    writingPrompt: kind === "writing" ? `Write a short response about ${lesson.title}. Use at least three of these words: ${firstWords.join(", ")}.` : undefined,
    writingPromptArabic: kind === "writing" ? `اكتب إجابة قصيرة عن ${lesson.titleArabic}. استخدم ثلاث كلمات على الأقل من القائمة.` : undefined,
    suggestedVocabulary: kind === "writing" ? firstWords : undefined,
    sentencePatterns: lesson.grammar ? [lesson.grammar.structure.positive, lesson.grammar.structure.negative, lesson.grammar.structure.question] : undefined,
  };
}

export function lessonTypeFor(lesson: Pick<LessonDefinition, "lessonNumber" | "moduleNumber">): LessonType {
  const position = ((lesson.lessonNumber - 1) % lessonTypeByPosition.length + lesson.moduleNumber - 1) % lessonTypeByPosition.length;
  return lessonTypeByPosition[position];
}

export function buildLessonActivities(lesson: LessonDefinition): LessonActivity[] {
  const focus = lessonTypeFor(lesson);
  const focusIndex = lessonTypeByPosition.indexOf(focus);
  const kinds: LessonType[] = ["standard", focus, "review"];
  return kinds.map((kind, index) => activity(kind, lesson, progression[Math.min(focusIndex + index, progression.length - 1)], index));
}

function shortAnswerExamples(topic: string): Array<{ en: string; ar: string }> {
  const normalized = topic.toLowerCase();
  if (normalized.includes("be") || normalized.includes("am/is/are")) return [{ en: "Yes, I am. / No, I am not.", ar: "نعم، أنا كذلك. / لا، لست كذلك." }];
  if (normalized.includes("can") || normalized.includes("ability")) return [{ en: "Yes, I can. / No, I cannot.", ar: "نعم، أستطيع. / لا، لا أستطيع." }];
  if (normalized.includes("past") || normalized.includes("did")) return [{ en: "Yes, I did. / No, I did not.", ar: "نعم، فعلت. / لا، لم أفعل." }];
  if (normalized.includes("future") || normalized.includes("will")) return [{ en: "Yes, I will. / No, I will not.", ar: "نعم، سأفعل. / لا، لن أفعل." }];
  if (normalized.includes("have") || normalized.includes("present perfect")) return [{ en: "Yes, I have. / No, I have not.", ar: "نعم، فعلت ذلك من قبل. / لا، لم أفعل ذلك." }];
  return [{ en: "Yes, I do. / No, I do not.", ar: "نعم، أفعل. / لا، لا أفعل." }];
}

function buildGrammarTeachingGuide(lesson: LessonDefinition): GrammarTeachingGuide {
  const grammar = lesson.grammar;
  const examples = grammar.examples.slice(0, 4);
  return {
    whatItIs: `${grammar.topic}: ${grammar.represents}`,
    whyWeUseIt: grammar.concept,
    terminology: [{ term: grammar.topic, explanation: grammar.represents, explanationArabic: grammar.arabicComparison }],
    positiveExamples: [{ en: grammar.structure.positive, ar: grammar.arabicComparison }, ...examples],
    negativeExamples: [{ en: grammar.structure.negative, ar: grammar.arabicComparison }],
    questionExamples: [{ en: grammar.structure.question, ar: grammar.arabicComparison }],
    shortAnswerExamples: shortAnswerExamples(grammar.topic),
    whenToUse: grammar.useWhen,
    arabicSpeakerNotes: grammar.commonMistakes.map((mistake) => `${mistake.wrong} → ${mistake.correct}: ${mistake.explanation}`),
    exceptions: grammar.doNotUseWhen,
  };
}

export function enrichLesson(lesson: LessonDefinition): LessonDefinition {
  const lessonType = lesson.lessonType ?? lessonTypeFor(lesson);
  return {
    ...lesson,
    grammar: { ...lesson.grammar, teachingGuide: lesson.grammar.teachingGuide ?? buildGrammarTeachingGuide(lesson) },
    lessonType,
    activities: lesson.activities ?? buildLessonActivities({ ...lesson, lessonType }),
    progression: lesson.progression ?? progression,
  };
}

export function enrichLessons(lessons: LessonDefinition[]): LessonDefinition[] {
  return lessons.map(enrichLesson);
}
