import type { CefrLevel, ImmersiveLessonBlueprint, ImmersiveModuleAuthoring, LessonType } from "./types";
import { A2_MODULE_ARCS } from "./a2-immersive-authoring";

export type ImmersiveDifficultyProfile = {
  level: CefrLevel;
  userBand: "basic" | "independent" | "proficient";
  moduleCount: number;
  lessonsPerModule: number;
  expectedReadingWords: number;
  expectedWritingWords: number;
  grammarDemand: string;
  discourseDemand: string;
  assessmentDemand: string;
  mentorMode: "high-scaffold" | "guided-independence" | "analytical" | "nuanced";
};

export type ProgressiveImmersiveModule = ImmersiveModuleAuthoring & {
  difficulty: ImmersiveDifficultyProfile;
  requiredSkills: string[];
  cumulativeReview: string;
};

export const IMMERSIVE_DIFFICULTY_PROFILES: Record<Exclude<CefrLevel, "A1">, ImmersiveDifficultyProfile> = {
  A2: {
    level: "A2", userBand: "basic", moduleCount: 9, lessonsPerModule: 15, expectedReadingWords: 180, expectedWritingWords: 80,
    grammarDemand: "Control high-frequency forms in connected everyday exchanges, with guided contrast and correction.",
    discourseDemand: "Link short clauses with time, reason, contrast, and sequence markers.",
    assessmentDemand: "Complete a practical interaction, short reading, supported paragraph, and contextual language review.",
    mentorMode: "high-scaffold",
  },
  B1: {
    level: "B1", userBand: "independent", moduleCount: 6, lessonsPerModule: 16, expectedReadingWords: 450, expectedWritingWords: 160,
    grammarDemand: "Choose and combine core tenses, modality, clauses, and lexical chunks to express personal meaning.",
    discourseDemand: "Sustain a connected account, explain reasons, compare options, and handle routine problems.",
    assessmentDemand: "Integrate listening or speaking, source-based reading, purposeful writing, and a reflective revision cycle.",
    mentorMode: "guided-independence",
  },
  B2: {
    level: "B2", userBand: "independent", moduleCount: 6, lessonsPerModule: 16, expectedReadingWords: 800, expectedWritingWords: 240,
    grammarDemand: "Control complex clauses, stance, register, cohesion, and precise collocation with occasional self-correction.",
    discourseDemand: "Develop arguments, qualify claims, synthesize viewpoints, and adapt language to audience and purpose.",
    assessmentDemand: "Interpret multiple perspectives, defend a position, produce structured prose, and revise for clarity and register.",
    mentorMode: "analytical",
  },
  C1: {
    level: "C1", userBand: "proficient", moduleCount: 6, lessonsPerModule: 18, expectedReadingWords: 1400, expectedWritingWords: 420,
    grammarDemand: "Use flexible grammar and lexical choices to manage nuance, emphasis, hedging, and rhetorical effect.",
    discourseDemand: "Trace implicit meaning, evaluate sources, mediate viewpoints, and sustain coherent extended discourse.",
    assessmentDemand: "Analyze demanding sources, synthesize evidence, write for a defined audience, and defend editorial choices.",
    mentorMode: "nuanced",
  },
  C2: {
    level: "C2", userBand: "proficient", moduleCount: 6, lessonsPerModule: 20, expectedReadingWords: 2200, expectedWritingWords: 650,
    grammarDemand: "Select language with fine control of implication, rhythm, idiom, genre, register, and rhetorical precision.",
    discourseDemand: "Mediate complex positions, detect stance and subtext, and create elegant, audience-aware communication.",
    assessmentDemand: "Synthesize demanding multimodal sources, produce a sustained genre-appropriate text, and justify interpretive decisions.",
    mentorMode: "nuanced",
  },
};

const THEMES: Record<Exclude<CefrLevel, "A1">, Array<{ title: string; titleArabic: string; focus: string; focusArabic: string }>> = {
  A2: [
    { title: "Health and Habits", titleArabic: "الصحة والعادات", focus: "describe routines, symptoms, and sensible changes", focusArabic: "وصف العادات والأعراض والتغييرات المفيدة" },
    { title: "Learning and Work", titleArabic: "التعلم والعمل", focus: "talk about experience, responsibilities, and goals", focusArabic: "الحديث عن الخبرة والمسؤوليات والأهداف" },
    { title: "Travel and Services", titleArabic: "السفر والخدمات", focus: "solve practical problems and make polite requests", focusArabic: "حل المشكلات العملية وتقديم الطلبات المهذبة" },
    { title: "Stories and Memories", titleArabic: "القصص والذكريات", focus: "narrate past events and describe reactions", focusArabic: "سرد أحداث الماضي ووصف ردود الفعل" },
    { title: "Nature and Community", titleArabic: "الطبيعة والمجتمع", focus: "describe places, rules, and simple change", focusArabic: "وصف الأماكن والقواعد والتغيير البسيط" },
    { title: "Choices and Plans", titleArabic: "الاختيارات والخطط", focus: "compare options and make supported plans", focusArabic: "مقارنة الاختيارات ووضع خطط مدعومة" },
    { title: "Communication and Technology", titleArabic: "التواصل والتقنية", focus: "exchange messages, solve digital problems, and clarify meaning", focusArabic: "تبادل الرسائل وحل المشكلات الرقمية وتوضيح المعنى" },
    { title: "Food, Shopping, and Services", titleArabic: "الطعام والتسوق والخدمات", focus: "make practical choices, compare products, and handle service conversations", focusArabic: "اتخاذ اختيارات عملية ومقارنة المنتجات والتعامل مع محادثات الخدمات" },
    { title: "Celebrations and Culture", titleArabic: "الاحتفالات والثقافة", focus: "describe traditions, invitations, feelings, and respectful cultural differences", focusArabic: "وصف التقاليد والدعوات والمشاعر والاختلافات الثقافية باحترام" },
  ],
  B1: [
    { title: "Identity and Belonging", titleArabic: "الهوية والانتماء", focus: "explain personal experience and belonging", focusArabic: "شرح التجربة الشخصية والانتماء" },
    { title: "Work in Transition", titleArabic: "العمل في مرحلة انتقال", focus: "discuss change, skills, and career decisions", focusArabic: "مناقشة التغيير والمهارات والقرارات المهنية" },
    { title: "Media and Trust", titleArabic: "الإعلام والثقة", focus: "summarize claims and distinguish fact from opinion", focusArabic: "تلخيص الادعاءات والتمييز بين الحقيقة والرأي" },
    { title: "Cities and Sustainability", titleArabic: "المدن والاستدامة", focus: "explain causes, effects, and practical proposals", focusArabic: "شرح الأسباب والنتائج والاقتراحات العملية" },
    { title: "Relationships and Conflict", titleArabic: "العلاقات والصراع", focus: "negotiate, apologize, and repair misunderstandings", focusArabic: "التفاوض والاعتذار وإصلاح سوء الفهم" },
    { title: "Culture and Creativity", titleArabic: "الثقافة والإبداع", focus: "interpret stories, preferences, and cultural choices", focusArabic: "تفسير القصص والتفضيلات والاختيارات الثقافية" },
  ],
  B2: [
    { title: "Public Argument", titleArabic: "الحجاج العام", focus: "evaluate evidence and build a qualified position", focusArabic: "تقييم الأدلة وبناء موقف مؤهل" },
    { title: "Technology and Agency", titleArabic: "التقنية والقدرة على الاختيار", focus: "debate benefits, risks, and responsibility", focusArabic: "مناقشة الفوائد والمخاطر والمسؤولية" },
    { title: "Workplace Communication", titleArabic: "التواصل في مكان العمل", focus: "manage register, meetings, feedback, and decisions", focusArabic: "إدارة السجل والاجتماعات والتغذية الراجعة والقرارات" },
    { title: "Science in Society", titleArabic: "العلم في المجتمع", focus: "translate specialist ideas for a general audience", focusArabic: "ترجمة الأفكار المتخصصة للجمهور العام" },
    { title: "Literature and Voice", titleArabic: "الأدب والصوت", focus: "analyze voice, viewpoint, and stylistic effect", focusArabic: "تحليل الصوت ووجهة النظر والأثر الأسلوبي" },
    { title: "Global Decisions", titleArabic: "القرارات العالمية", focus: "synthesize competing positions and recommend action", focusArabic: "تركيب المواقف المتنافسة والتوصية بإجراء" },
  ],
  C1: [
    { title: "Evidence and Interpretation", titleArabic: "الأدلة والتفسير", focus: "read critically and qualify interpretation", focusArabic: "القراءة النقدية وتأهيل التفسير" },
    { title: "Institutions and Power", titleArabic: "المؤسسات والقوة", focus: "analyze systems, incentives, and public language", focusArabic: "تحليل الأنظمة والحوافز واللغة العامة" },
    { title: "Language and Identity", titleArabic: "اللغة والهوية", focus: "mediate culturally situated perspectives", focusArabic: "التوسط بين وجهات نظر مرتبطة بالثقافة" },
    { title: "Ethics of Innovation", titleArabic: "أخلاقيات الابتكار", focus: "weigh uncertainty, consequence, and responsibility", focusArabic: "موازنة عدم اليقين والنتائج والمسؤولية" },
    { title: "Aesthetic and Rhetorical Choice", titleArabic: "الاختيار الجمالي والبلاغي", focus: "shape tone, emphasis, and reader response", focusArabic: "تشكيل النبرة والتوكيد واستجابة القارئ" },
    { title: "Mediation Studio", titleArabic: "مختبر التوسط", focus: "reframe complex sources for different audiences", focusArabic: "إعادة صياغة مصادر معقدة لجماهير مختلفة" },
  ],
  C2: [
    { title: "Uncertainty and Knowledge", titleArabic: "عدم اليقين والمعرفة", focus: "interrogate assumptions and competing explanations", focusArabic: "فحص الافتراضات والتفسيرات المتنافسة" },
    { title: "Public Discourse and Ideology", titleArabic: "الخطاب العام والأيديولوجيا", focus: "detect framing, implication, and ideological language", focusArabic: "اكتشاف التأطير والإيحاء واللغة الأيديولوجية" },
    { title: "Genre and Authority", titleArabic: "النوع والسلطة", focus: "write with deliberate genre and institutional authority", focusArabic: "الكتابة بنوع مقصود وسلطة مؤسسية" },
    { title: "Cross-Cultural Mediation", titleArabic: "التوسط بين الثقافات", focus: "resolve conceptual and pragmatic differences", focusArabic: "حل الاختلافات المفاهيمية والتداولية" },
    { title: "Style, Irony, and Subtext", titleArabic: "الأسلوب والسخرية والمعنى الضمني", focus: "interpret and create layered meaning", focusArabic: "تفسير وإنشاء معنى متعدد الطبقات" },
    { title: "Synthesis Capstone", titleArabic: "مشروع التركيب الختامي", focus: "turn complex sources into an original, defensible contribution", focusArabic: "تحويل المصادر المعقدة إلى إسهام أصيل قابل للدفاع" },
  ],
};

const lessonTypes: LessonType[] = ["standard", "reading", "interaction", "speaking", "writing", "standard", "reading", "interaction", "speaking", "writing", "review", "standard", "reading", "writing", "review", "assessment", "reading", "writing", "speaking", "assessment"];

function buildLesson(level: Exclude<CefrLevel, "A1">, moduleNumber: number, lessonNumber: number, theme: (typeof THEMES)[typeof level][number], profile: ImmersiveDifficultyProfile, a2Arc?: (typeof A2_MODULE_ARCS)[number]["lessons"][number]): ImmersiveLessonBlueprint {
  const type = a2Arc?.type ?? lessonTypes[(lessonNumber - 1) % profile.lessonsPerModule];
  const isCheckpoint = type === "assessment" || lessonNumber === profile.lessonsPerModule;
  const advanced = level === "C1" || level === "C2";
  const readingTask = advanced ? "trace assumptions, stance, and implied meaning across the source" : "identify the main claim, useful language, and supporting detail";
  const writingTask = advanced ? "produce a controlled, audience-aware synthesis with deliberate rhetorical choices" : "produce a connected response with a clear purpose, support, and revision step";
  return {
    lessonNumber,
    moduleNumber,
    type,
    title: a2Arc ? a2Arc.title : `${theme.title}: ${isCheckpoint ? "Synthesis and checkpoint" : `Studio ${lessonNumber}`}`,
    titleArabic: a2Arc ? a2Arc.titleArabic : `${theme.titleArabic}: ${isCheckpoint ? "التركيب والاختبار" : `مختبر ${lessonNumber}`}`,
    mentorPurpose: `The mentor now expects you to connect ideas about ${theme.focus}. At ${level}, the important move is not only knowing language but choosing it for a purpose. ${profile.grammarDemand}`,
    mentorPurposeArabic: `يتوقع منك المرشد الآن ربط الأفكار حول ${theme.focusArabic}. في مستوى ${level} لا يقتصر التقدم على معرفة اللغة، بل يشمل اختيارها لغرض محدد. ${profile.grammarDemand}`,
    vocabularyAnchors: a2Arc?.anchors ?? [theme.title, theme.focus.split(" ").slice(0, 2).join(" "), "evidence", "purpose", "perspective"],
    grammarFocus: a2Arc?.grammar ?? profile.grammarDemand,
    grammarFocusArabic: a2Arc?.grammarArabic ?? "استخدام القواعد بمرونة لخدمة المعنى والسياق.",
    beginnerExplanation: `This is a level-aware explanation, not a list of labels. Notice how the language supports ${theme.focus}. Then retrieve it in a new context. Reading target: ${profile.expectedReadingWords} words. Writing target: ${profile.expectedWritingWords} words.`,
    beginnerExplanationArabic: `هذا شرح مناسب للمستوى وليس قائمة مصطلحات. لاحظ كيف تخدم اللغة موضوع ${theme.focusArabic}، ثم استرجعها في سياق جديد. هدف القراءة: ${profile.expectedReadingWords} كلمة. هدف الكتابة: ${profile.expectedWritingWords} كلمة.`,
    exposurePlan: [
      { lessonNumber, mode: "learn", task: `Establish the language needed to ${theme.focus}.`, taskArabic: `أسس اللغة اللازمة من أجل ${theme.focusArabic}.` },
      { lessonNumber: Math.min(lessonNumber + 1, profile.lessonsPerModule), mode: "read", task: `Read a ${level}-appropriate source and ${readingTask}.`, taskArabic: `اقرأ مصدراً مناسباً لمستوى ${level} و${readingTask}.` },
      { lessonNumber: Math.min(lessonNumber + 2, profile.lessonsPerModule), mode: "use", task: `Use the language in a purposeful exchange about ${theme.focus}.`, taskArabic: `استخدم اللغة في تبادل هادف حول ${theme.focusArabic}.` },
      { lessonNumber: Math.min(lessonNumber + 3, profile.lessonsPerModule), mode: "write", task: `${writingTask}.`, taskArabic: `اكتب نصاً ${advanced ? "مركباً وموجهاً لجمهور محدد" : "مترابطاً ذا غرض واضح"}.` },
      { lessonNumber: Math.min(lessonNumber + 4, profile.lessonsPerModule), mode: "retrieve", task: "Retrieve the language from memory, explain one choice, and revise one weakness.", taskArabic: "استرجع اللغة من الذاكرة واشرح اختياراً واحداً وراجع نقطة ضعف واحدة." },
    ],
    practiceModes: isCheckpoint ? ["assessment", "reading", "writing", "speaking", "review"] : [type, "reading", "writing", "review"],
    canDo: isCheckpoint ? `${profile.assessmentDemand} Theme: ${theme.focus}.` : `I can ${theme.focus}, while making language choices appropriate to ${level}.`,
    canDoArabic: isCheckpoint ? `أستطيع ${profile.assessmentDemand} الموضوع: ${theme.focusArabic}.` : `أستطيع ${theme.focusArabic} مع اختيار لغة مناسبة لمستوى ${level}.`,
  };
}

export function buildProgressiveImmersiveModule(level: Exclude<CefrLevel, "A1">, moduleNumber: number): ProgressiveImmersiveModule {
  const profile = IMMERSIVE_DIFFICULTY_PROFILES[level];
  const theme = THEMES[level][moduleNumber - 1];
  if (!theme) throw new Error(`No immersive theme for ${level} module ${moduleNumber}`);
  const a2ModuleArc = level === "A2" ? A2_MODULE_ARCS[moduleNumber - 1] : undefined;
  const lessonBlueprints = Array.from({ length: profile.lessonsPerModule }, (_, index) => buildLesson(level, moduleNumber, index + 1, theme, profile, a2ModuleArc?.lessons[index]));
  return {
    level,
    moduleNumber,
    title: a2ModuleArc?.title ?? theme.title,
    titleArabic: a2ModuleArc?.titleArabic ?? theme.titleArabic,
    overview: `A ${level} immersive module about how to ${a2ModuleArc?.focus ?? theme.focus}. ${profile.discourseDemand}`,
    overviewArabic: `وحدة غامرة في مستوى ${level} حول كيفية ${a2ModuleArc?.focusArabic ?? theme.focusArabic}. ${profile.discourseDemand}`,
    mentorOpening: `At this stage, the mentor will not give you every sentence. You will investigate, test, revise, and return to the same language through richer contexts. ${profile.assessmentDemand}`,
    mentorOpeningArabic: `في هذه المرحلة لن يقدم لك المرشد كل جملة. ستبحث وتجرب وتراجع وتعود إلى اللغة نفسها عبر سياقات أغنى. ${profile.assessmentDemand}`,
    lessonBlueprints,
    assessmentRecipe: [profile.assessmentDemand, `Read approximately ${profile.expectedReadingWords} words and explain the source's purpose.`, `Write approximately ${profile.expectedWritingWords} words for a defined audience.`, "Complete a spoken mediation or interaction task.", "Review vocabulary, grammar, register, and one personal improvement target."],
    assessmentRecipeArabic: ["ينجز المتعلم متطلبات التقييم المناسبة للمستوى.", `يقرأ نحو ${profile.expectedReadingWords} كلمة ويشرح غرض المصدر.`, `يكتب نحو ${profile.expectedWritingWords} كلمة لجمهور محدد.`, "ينجز مهمة توسط أو تفاعل شفهي.", "يراجع المفردات والقواعد والسجل وهدف تحسين شخصي."],
    difficulty: profile,
    requiredSkills: ["vocabulary in context", "grammar and discourse", "reading", "writing", "speaking", "mediation", "self-revision"],
    cumulativeReview: `Every new module deliberately retrieves language from earlier ${level} modules before adding new complexity.`,
  };
}

export const PROGRESSIVE_IMMERSIVE_MODULES: ProgressiveImmersiveModule[] = (Object.keys(IMMERSIVE_DIFFICULTY_PROFILES) as Array<Exclude<CefrLevel, "A1">>).flatMap((level) =>
  Array.from({ length: IMMERSIVE_DIFFICULTY_PROFILES[level].moduleCount }, (_, index) => buildProgressiveImmersiveModule(level, index + 1)),
);

export function getProgressiveImmersiveModules(level: Exclude<CefrLevel, "A1">) {
  return PROGRESSIVE_IMMERSIVE_MODULES.filter((module) => module.level === level);
}
