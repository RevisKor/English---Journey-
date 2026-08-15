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

export type LessonDefinition = {
  level: CefrLevel;
  lessonNumber: number;
  moduleNumber: number;
  title: string;
  titleArabic: string;
  words: VocabularyItem[];
  grammar: GrammarTopic;
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
