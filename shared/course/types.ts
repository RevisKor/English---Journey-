export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type VocabularyItem = {
  id: string;
  word: string;
  arabic: string;
  ipa: string;
  phoneticRespelling: string;
  partOfSpeech: string;
  definition: string;
  exampleEN: string;
  exampleAR: string;
};

export type GrammarPractice = {
  question: string;
  answer: string;
  choices: string[];
};

export type GrammarTopic = {
  id: string;
  lessonNumber: number;
  topic: string;
  arabicName: string;
  concept: string;
  represents: string;
  arabicComparison: string;
  useWhen: string[];
  doNotUseWhen: string[];
  commonMistakes: Array<{ wrong: string; correct: string; explanation: string }>;
  structure: { positive: string; negative: string; question: string };
  examples: Array<{ en: string; ar: string }>;
  practice: GrammarPractice[];
};

export type LessonStep = {
  id: "start" | "explore" | "notice" | "build" | "respond" | "prove";
  title: string;
  titleArabic: string;
  purpose: string;
  estimatedMinutes: number;
};

export type RetrievalTarget = {
  sourceLevel: CefrLevel;
  language: string;
  prompt: string;
  purpose: string;
};

export type LessonOutcome = {
  canDo: string;
  canDoArabic: string;
  scenario: string;
  scenarioArabic: string;
};

export type LessonLearningPlan = {
  outcome: LessonOutcome;
  steps: LessonStep[];
  retrieval: RetrievalTarget[];
  englishFirst: boolean;
  studio: string;
};

export type LessonPracticeBrief = {
  readingBrief: string;
  writingPrompt: string;
};

export type MentorMomentId = "welcome" | "vocabulary" | "grammar" | "practice" | "reading" | "writing" | "check";

export type MentorMoment = {
  id: MentorMomentId;
  title: string;
  titleArabic: string;
  message: string;
  messageArabic: string;
};

export type LessonMentorGuide = {
  level: CefrLevel;
  lessonTitle: string;
  moments: MentorMoment[];
};

export type LexicalNetwork = {
  id: string;
  theme: string;
  themeArabic: string;
  anchor: string;
  wordFamilies: Array<{
    headword: string;
    forms: string[];
    note: string;
    noteArabic: string;
  }>;
  relatedWords: string[];
  chunks: string[];
  collocations: string[];
  register: "neutral" | "informal" | "formal" | "mixed";
  priorLevelLinks: string[];
  learningNote: string;
  learningNoteArabic: string;
};

export type LessonDefinition = {
  level: CefrLevel;
  lessonNumber: number;
  moduleNumber: number;
  title: string;
  titleArabic: string;
  words: VocabularyItem[];
  grammar: GrammarTopic;
  learningPlan?: LessonLearningPlan;
  lexicalNetworks?: LexicalNetwork[];
  practiceBrief?: LessonPracticeBrief;
};

export type CourseDefinition = {
  level: CefrLevel;
  title: string;
  titleArabic: string;
  totalLessons: number;
  lessonsPerModule: number;
  estimatedMinutes: number;
  lessons: LessonDefinition[];
};
