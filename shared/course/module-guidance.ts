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
    { title: "Health and Habits", titleArabic: "الصحة والعادات", overview: "Describe routines, symptoms, and sensible changes with connected everyday language.", overviewArabic: "صف العادات والأعراض والتغييرات المفيدة بلغة يومية مترابطة." },
    { title: "Learning and Work", titleArabic: "التعلم والعمل", overview: "Talk about experience, responsibilities, and goals while linking short ideas clearly.", overviewArabic: "تحدث عن الخبرة والمسؤوليات والأهداف مع ربط الأفكار القصيرة بوضوح." },
    { title: "Travel and Services", titleArabic: "السفر والخدمات", overview: "Solve practical problems, make polite requests, and manage routine service conversations.", overviewArabic: "حل المشكلات العملية وقدم الطلبات المهذبة وتعامل مع محادثات الخدمات اليومية." },
    { title: "Stories and Memories", titleArabic: "القصص والذكريات", overview: "Narrate past events, sequence details, and describe reactions with growing confidence.", overviewArabic: "اسرد أحداث الماضي ورتب التفاصيل وصف ردود الفعل بثقة متزايدة." },
    { title: "Nature and Community", titleArabic: "الطبيعة والمجتمع", overview: "Describe places, rules, responsibilities, and simple changes in the world around you.", overviewArabic: "صف الأماكن والقواعد والمسؤوليات والتغييرات البسيطة في العالم من حولك." },
    { title: "Choices and Plans", titleArabic: "الاختيارات والخطط", overview: "Compare options, explain reasons, and make supported plans for everyday situations.", overviewArabic: "قارن الخيارات واشرح الأسباب وضع خططاً مدعومة للمواقف اليومية." },
    { title: "Communication and Technology", titleArabic: "التواصل والتقنية", overview: "Exchange messages, clarify meaning, and solve common digital communication problems.", overviewArabic: "تبادل الرسائل ووضح المعنى وحل مشكلات التواصل الرقمي الشائعة." },
    { title: "Food, Shopping, and Services", titleArabic: "الطعام والتسوق والخدمات", overview: "Make practical choices, compare products, and handle a wider range of service conversations.", overviewArabic: "اتخذ اختيارات عملية وقارن المنتجات وتعامل مع نطاق أوسع من محادثات الخدمات." },
    { title: "Celebrations and Culture", titleArabic: "الاحتفالات والثقافة", overview: "Describe traditions, invitations, feelings, and respectful cultural differences.", overviewArabic: "صف التقاليد والدعوات والمشاعر والاختلافات الثقافية باحترام." },
  ],
  B1: [
    { title: "Work and Study", titleArabic: "العمل والدراسة", overview: "Build the language for goals, skills, routines, and collaborative problem-solving.", overviewArabic: "ابنِ لغة الأهداف والمهارات والروتين وحل المشكلات بالتعاون." },
    { title: "Relationships and Society", titleArabic: "العلاقات والمجتمع", overview: "Explore communication, responsibility, community life, and respectful disagreement.", overviewArabic: "استكشف التواصل والمسؤولية والحياة المجتمعية والاختلاف باحترام." },
    { title: "Travel and Change", titleArabic: "السفر والتغيير", overview: "Narrate experiences, compare options, and explain how people respond to change.", overviewArabic: "اسرد التجارب وقارن الخيارات واشرح كيف يستجيب الناس للتغيير." },
    { title: "Stories and Opinions", titleArabic: "القصص والآراء", overview: "Read and produce connected texts that combine events, reasons, and personal viewpoints.", overviewArabic: "اقرأ واكتب نصوصاً مترابطة تجمع الأحداث والأسباب ووجهات النظر الشخصية." },
    { title: "Health and Everyday Choices", titleArabic: "الصحة والاختيارات اليومية", overview: "Explain habits, wellbeing, advice, and the evidence behind practical choices.", overviewArabic: "اشرح العادات والرفاهية والنصيحة والأدلة وراء الاختيارات العملية." },
    { title: "Media and Digital Life", titleArabic: "الإعلام والحياة الرقمية", overview: "Interpret messages, discuss reliability, and communicate clearly across digital settings.", overviewArabic: "فسّر الرسائل وناقش الموثوقية وتواصل بوضوح في البيئات الرقمية." },
    { title: "Environment and Community Action", titleArabic: "البيئة والعمل المجتمعي", overview: "Describe local challenges, propose realistic responses, and collaborate on solutions.", overviewArabic: "صف التحديات المحلية واقترح استجابات واقعية وتعاون في الحلول." },
    { title: "Culture and Identity", titleArabic: "الثقافة والهوية", overview: "Compare traditions, explain personal identity, and ask respectful questions about difference.", overviewArabic: "قارن التقاليد واشرح الهوية الشخصية واطرح أسئلة محترمة عن الاختلاف." },
    { title: "Problem-Solving and Decisions", titleArabic: "حل المشكلات واتخاذ القرارات", overview: "Weigh options, justify decisions, and negotiate practical next steps.", overviewArabic: "وازن الخيارات وبرّر القرارات وتفاوض بشأن الخطوات العملية التالية." },
    { title: "Future Pathways and Projects", titleArabic: "المسارات والمشروعات المستقبلية", overview: "Reflect on experience, plan a next chapter, and present a coherent personal project.", overviewArabic: "تأمل الخبرة وخطط للمرحلة التالية وقدّم مشروعاً شخصياً مترابطاً." },
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
