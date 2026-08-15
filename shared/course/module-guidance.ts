import type { CefrLevel } from "./types";

export type CourseModuleTheme = {
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
};

export const COURSE_MODULE_THEMES: Record<CefrLevel, CourseModuleTheme[]> = {
  A1: [
    { title: "Meeting People", titleArabic: "التعرّف إلى الناس", overview: "Build a first survival toolkit for greetings, introductions, and simple personal information.", overviewArabic: "ابنِ أدواتك الأولى للتحية والتعارف والمعلومات الشخصية البسيطة." },
    { title: "Home and Routines", titleArabic: "البيت والروتين", overview: "Connect everyday words to home life, time, habits, and short descriptions.", overviewArabic: "اربط كلمات الحياة اليومية بالبيت والوقت والعادات والأوصاف القصيرة." },
    { title: "Around Town", titleArabic: "في أرجاء المدينة", overview: "Use practical English for places, food, directions, and simple services.", overviewArabic: "استخدم الإنجليزية العملية للأماكن والطعام والاتجاهات والخدمات البسيطة." },
    { title: "Everyday Choices", titleArabic: "الاختيارات اليومية", overview: "Move from naming things to expressing needs, preferences, and simple plans.", overviewArabic: "انتقل من تسمية الأشياء إلى التعبير عن الاحتياجات والتفضيلات والخطط البسيطة." },
  ],
  A2: [
    { title: "People and Plans", titleArabic: "الناس والخطط", overview: "Describe people, relationships, invitations, and plans with connected language.", overviewArabic: "صف الناس والعلاقات والدعوات والخطط بلغة مترابطة." },
    { title: "Home and Community", titleArabic: "البيت والمجتمع", overview: "Talk about homes, neighbourhoods, responsibilities, and everyday problems.", overviewArabic: "تحدث عن البيوت والأحياء والمسؤوليات والمشكلات اليومية." },
    { title: "Health and Travel", titleArabic: "الصحة والسفر", overview: "Handle practical conversations about wellbeing, journeys, and unexpected changes.", overviewArabic: "تعامل مع المحادثات العملية حول الصحة والرحلات والتغيّرات غير المتوقعة." },
    { title: "Stories and Decisions", titleArabic: "القصص والقرارات", overview: "Use past and future language to tell short stories and explain choices.", overviewArabic: "استخدم لغة الماضي والمستقبل لسرد قصص قصيرة وشرح الاختيارات." },
  ],
  B1: [
    { title: "Work and Study", titleArabic: "العمل والدراسة", overview: "Build the language for goals, skills, routines, and collaborative problem-solving.", overviewArabic: "ابنِ لغة الأهداف والمهارات والروتين وحل المشكلات بالتعاون." },
    { title: "Relationships and Society", titleArabic: "العلاقات والمجتمع", overview: "Explore communication, responsibility, community life, and respectful disagreement.", overviewArabic: "استكشف التواصل والمسؤولية والحياة المجتمعية والاختلاف باحترام." },
    { title: "Travel and Change", titleArabic: "السفر والتغيير", overview: "Narrate experiences, compare options, and explain how people respond to change.", overviewArabic: "اسرد التجارب وقارن الخيارات واشرح كيف يستجيب الناس للتغيير." },
    { title: "Stories and Opinions", titleArabic: "القصص والآراء", overview: "Read and produce connected texts that combine events, reasons, and personal viewpoints.", overviewArabic: "اقرأ واكتب نصوصاً مترابطة تجمع الأحداث والأسباب ووجهات النظر الشخصية." },
  ],
  B2: [
    { title: "Media and Influence", titleArabic: "الإعلام والتأثير", overview: "Analyse how language frames information, attention, credibility, and public response.", overviewArabic: "حلّل كيف تصوغ اللغة المعلومات والانتباه والمصداقية واستجابة الجمهور." },
    { title: "Work and Innovation", titleArabic: "العمل والابتكار", overview: "Discuss systems, proposals, risk, and the language of professional decision-making.", overviewArabic: "ناقش الأنظمة والمقترحات والمخاطر ولغة اتخاذ القرار المهني." },
    { title: "Culture and Society", titleArabic: "الثقافة والمجتمع", overview: "Interpret identity, values, behaviour, and cultural difference with greater nuance.", overviewArabic: "فسّر الهوية والقيم والسلوك والاختلاف الثقافي بقدر أكبر من الدقة." },
    { title: "Evidence and Debate", titleArabic: "الدليل والنقاش", overview: "Build balanced arguments, qualify claims, and respond to competing interpretations.", overviewArabic: "ابنِ حججاً متوازنة وقيّد الادعاءات واستجب للتفسيرات المتنافسة." },
  ],
  C1: [
    { title: "Sources and Perspectives", titleArabic: "المصادر ووجهات النظر", overview: "Trace claims, compare perspectives, and write with transparent source awareness.", overviewArabic: "تتبّع الادعاءات وقارن وجهات النظر واكتب بوعي واضح بالمصادر." },
    { title: "Systems and Change", titleArabic: "الأنظمة والتغيير", overview: "Explain complex relationships, consequences, and institutional or social change.", overviewArabic: "اشرح العلاقات المعقدة والنتائج والتغيير المؤسسي أو الاجتماعي." },
    { title: "Culture and Identity", titleArabic: "الثقافة والهوية", overview: "Handle ambiguity, identity, representation, and culturally sensitive interpretation.", overviewArabic: "تعامل مع الغموض والهوية والتمثيل والتفسير الحساس ثقافياً." },
    { title: "Public Reasoning", titleArabic: "التفكير العام", overview: "Synthesize evidence into persuasive, audience-aware writing and discussion.", overviewArabic: "ركّب الأدلة في كتابة ونقاش مقنعين وواعين بالجمهور." },
  ],
  C2: [
    { title: "Knowledge and Judgement", titleArabic: "المعرفة والحكم", overview: "Evaluate assumptions, uncertainty, and the consequences of choosing one formulation over another.", overviewArabic: "قيّم الافتراضات وعدم اليقين ونتائج اختيار صياغة دون أخرى." },
    { title: "Living Systems", titleArabic: "الأنظمة الحية", overview: "Move across scientific, ecological, and ethical registers without losing precision.", overviewArabic: "انتقل بين السجلات العلمية والبيئية والأخلاقية من دون فقدان الدقة." },
    { title: "Culture and Power", titleArabic: "الثقافة والقوة", overview: "Interpret discourse, identity, institutions, and the hidden effects of framing.", overviewArabic: "فسّر الخطاب والهوية والمؤسسات والآثار الخفية للتأطير." },
    { title: "Mediation and Synthesis", titleArabic: "الوساطة والتركيب", overview: "Turn complex material into clear, ethical, audience-sensitive communication.", overviewArabic: "حوّل المادة المعقدة إلى تواصل واضح وأخلاقي ومناسب للجمهور." },
  ],
};

export function moduleTheme(level: CefrLevel, moduleNumber: number) {
  return COURSE_MODULE_THEMES[level][moduleNumber - 1] ?? COURSE_MODULE_THEMES[level][0];
}
