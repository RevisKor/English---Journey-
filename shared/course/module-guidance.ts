import type { CefrLevel } from "./types";

export type CourseModuleTheme = {
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
};

export const COURSE_MODULE_THEMES: Record<CefrLevel, CourseModuleTheme[]> = {
  A1: [
    { title: "Meeting People: Your First English Community", titleArabic: "التعرّف إلى الناس: مجتمعك الأول باللغة الإنجليزية", overview: "Start almost from zero with greetings, names, people words, and a first supported conversation.", overviewArabic: "ابدأ من الصفر تقريباً مع التحيات والأسماء وكلمات الأشخاص وأول محادثة مدعومة." },
    { title: "Family and Home: People and Places That Matter", titleArabic: "العائلة والمنزل: الأشخاص والأماكن المهمة", overview: "Use familiar people, rooms, objects, and possessions to make short personal descriptions.", overviewArabic: "استخدم الأشخاص والغرف والأشياء والملكية المألوفة لصنع أوصاف شخصية قصيرة." },
    { title: "Food and Markets: Choosing What You Need", titleArabic: "الطعام والأسواق: اختيار ما تحتاج إليه", overview: "Identify food, ask for what you need, compare simple options, and handle a friendly market exchange.", overviewArabic: "تعرّف إلى الطعام واطلب ما تحتاج إليه وقارن الخيارات البسيطة وتعامل مع حوار ودّي في السوق." },
    { title: "Daily Life: Time, Routines, and Responsibilities", titleArabic: "الحياة اليومية: الوقت والروتين والمسؤوليات", overview: "Connect time, routines, frequency, and responsibilities in a clear account of an ordinary day.", overviewArabic: "اربط الوقت والروتين والتكرار والمسؤوليات في وصف واضح ليوم عادي." },
    { title: "Places and Getting Around: A Small World Outside", titleArabic: "الأماكن والتنقل: عالم صغير في الخارج", overview: "Read simple place information, ask for directions, travel locally, and solve small practical problems.", overviewArabic: "اقرأ معلومات بسيطة عن الأماكن واسأل عن الاتجاهات وتنقّل محلياً وحل مشكلات عملية صغيرة." },
    { title: "Work, Hobbies, and Real Interactions", titleArabic: "العمل والهوايات والتفاعلات الحقيقية", overview: "Bring the course together through work, free time, invitations, opinions, and supported real-life exchanges.", overviewArabic: "اجمع مهارات الدورة من خلال العمل ووقت الفراغ والدعوات والآراء والتفاعلات الواقعية المدعومة." },
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
