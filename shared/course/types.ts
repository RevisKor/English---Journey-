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
  teachingGuide?: GrammarTeachingGuide;
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

/** The pedagogical shape of a lesson, intentionally separate from its CEFR level. */
export type LessonType =
  | "standard"
  | "visual-vocabulary"
  | "interaction"
  | "speaking"
  | "writing"
  | "reading"
  | "review"
  | "assessment";

export type LessonProgressionStage =
  | "introduction"
  | "explanation"
  | "guided-practice"
  | "independent-practice"
  | "real-context"
  | "review"
  | "assessment";

export type VisualVocabularyItem = {
  id: string;
  word: string;
  arabic: string;
  pronunciation: string;
  exampleEN: string;
  exampleAR: string;
  imageUrl?: string;
  altText?: string;
  category?: string;
  interactionHint?: string;
};

export type SpeakingLine = {
  id: string;
  speaker?: string;
  text: string;
  textArabic?: string;
  pronunciationHint?: string;
  audioText?: string;
};

export type InteractionTurn = {
  id: string;
  speaker: string;
  text: string;
  textArabic: string;
  purpose: string;
  alternatives?: string[];
};

export type ReadingCheck = {
  id: string;
  type: "vocabulary" | "true-false" | "multiple-choice" | "fill-blank" | "main-idea" | "detail" | "inference";
  prompt: string;
  promptArabic: string;
  choices?: string[];
  answer?: string;
  explanation?: string;
};

export type LessonActivity = {
  id: string;
  kind: LessonType;
  title: string;
  titleArabic: string;
  objective: string;
  objectiveArabic: string;
  stage: LessonProgressionStage;
  estimatedMinutes: number;
  vocabularyIds?: string[];
  grammarIds?: string[];
  visualItems?: VisualVocabularyItem[];
  interactionTurns?: InteractionTurn[];
  speakingLines?: SpeakingLine[];
  readingText?: string;
  readingTextArabic?: string;
  readingChecks?: ReadingCheck[];
  writingPrompt?: string;
  writingPromptArabic?: string;
  suggestedVocabulary?: string[];
  sentencePatterns?: string[];
};

export type GrammarTeachingGuide = {
  whatItIs: string;
  whyWeUseIt: string;
  terminology: Array<{ term: string; explanation: string; explanationArabic: string }>;
  positiveExamples: Array<{ en: string; ar: string }>;
  negativeExamples: Array<{ en: string; ar: string }>;
  questionExamples: Array<{ en: string; ar: string }>;
  shortAnswerExamples: Array<{ en: string; ar: string }>;
  whenToUse: string[];
  arabicSpeakerNotes: string[];
  exceptions?: string[];
};

export type ModuleDefinition = {
  moduleNumber: number;
  title: string;
  titleArabic: string;
  lessonNumbers: number[];
  theme?: string;
  themeArabic?: string;
};

export type ExposureMode = "learn" | "see" | "hear" | "use" | "read" | "write" | "retrieve";

export type VocabularyExposure = {
  lessonNumber: number;
  mode: ExposureMode;
  task: string;
  taskArabic: string;
};

export type ImmersiveLessonBlueprint = {
  lessonNumber: number;
  moduleNumber: number;
  type: LessonType;
  title: string;
  titleArabic: string;
  mentorPurpose: string;
  mentorPurposeArabic: string;
  vocabularyAnchors: string[];
  grammarFocus: string;
  grammarFocusArabic: string;
  beginnerExplanation: string;
  beginnerExplanationArabic: string;
  exposurePlan: VocabularyExposure[];
  practiceModes: LessonType[];
  canDo: string;
  canDoArabic: string;
};

export type ImmersiveModuleAuthoring = {
  level: CefrLevel;
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  mentorOpening: string;
  mentorOpeningArabic: string;
  lessonBlueprints: ImmersiveLessonBlueprint[];
  assessmentRecipe: string[];
  assessmentRecipeArabic: string[];
};

export type ModuleWordBankEntry = VocabularyItem & {
  introducedLessonNumber: number;
  reviewCount: number;
  familiarity: "introduced" | "recognized" | "understood" | "used" | "remembered";
};

export type ImmersiveWordBankEntry = ModuleWordBankEntry & {
  sourceLessonNumbers: number[];
  exposurePlan: VocabularyExposure[];
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
  domainFocus?: string;
  domainFocusArabic?: string;
  beginnerScaffold?: string;
  beginnerScaffoldArabic?: string;
  lessonType?: LessonType;
  activities?: LessonActivity[];
  progression?: LessonProgressionStage[];
};

export type CourseDefinition = {
  level: CefrLevel;
  title: string;
  titleArabic: string;
  totalLessons: number;
  lessonsPerModule: number;
  estimatedMinutes: number;
  lessons: LessonDefinition[];
  modules?: ModuleDefinition[];
};
