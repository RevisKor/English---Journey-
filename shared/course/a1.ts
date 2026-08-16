import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, VocabularyItem } from "./types";
import { enrichLesson } from "./activity-plan";
import { buildModuleDefinitions } from "./module-definitions";

export const A1_VOCABULARY = rawVocabulary as VocabularyItem[];
export const A1_GRAMMAR = rawGrammar as GrammarTopic[];

const lessonTitles = [
  ["Hello & introductions", "التحية والتعارف"], ["People & family", "الأشخاص والعائلة"],
  ["Home & everyday objects", "المنزل والأشياء اليومية"], ["Daily routines", "الروتين اليومي"],
  ["Food & drink", "الطعام والشراب"], ["Time & the week", "الوقت وأيام الأسبوع"],
  ["Places in town", "أماكن في المدينة"], ["Study & work", "الدراسة والعمل"],
  ["Shopping & money", "التسوق والمال"], ["Weather & clothes", "الطقس والملابس"],
  ["Travel & transport", "السفر والمواصلات"], ["Health & the body", "الصحة والجسم"],
  ["Free time", "وقت الفراغ"], ["Plans & invitations", "الخطط والدعوات"],
  ["Past events", "أحداث في الماضي"], ["Directions & locations", "الاتجاهات والمواقع"],
  ["Describing people", "وصف الأشخاص"], ["Nature & the world", "الطبيعة والعالم"],
  ["Problems & solutions", "المشكلات والحلول"], ["A1 review & confidence", "مراجعة A1 والثقة"],
] as const;

const a1DomainProgression = [
  ["greetings and identity", "التحية والهوية", "Start with names, greetings, and safe sentence frames.", "ابدأ بالأسماء والتحيات وقوالب الجمل الآمنة."],
  ["family and people", "العائلة والأشخاص", "Reuse be and possessives to talk about people close to you.", "أعد استخدام be والملكية للحديث عن الأشخاص القريبين منك."],
  ["home and objects", "المنزل والأشياء", "Point, name, and describe familiar objects with there is and there are.", "أشر إلى الأشياء المألوفة وسمّها وصفها باستخدام there is وthere are."],
  ["daily routines", "الروتين اليومي", "Build short present-simple sentences about a normal day.", "كوّن جملاً قصيرة بالمضارع البسيط عن يوم عادي."],
  ["food and drink", "الطعام والشراب", "Make simple choices and requests in a café or at home.", "تعلّم الاختيار والطلب بجمل بسيطة في المقهى أو المنزل."],
  ["time and the week", "الوقت والأسبوع", "Connect routines to times, days, and simple frequency.", "اربط الروتين بالأوقات والأيام والتكرار البسيط."],
  ["town and places", "المدينة والأماكن", "Ask where places are and understand short directions.", "اسأل عن أماكن الأشياء وافهم الإرشادات القصيرة."],
  ["study and work", "الدراسة والعمل", "Introduce your role and ask practical classroom or work questions.", "قدّم دورك واسأل أسئلة عملية في الدراسة أو العمل."],
  ["shopping and money", "التسوق والمال", "Use numbers, prices, and polite requests in a shop.", "استخدم الأرقام والأسعار والطلبات المهذبة في المتجر."],
  ["weather and clothes", "الطقس والملابس", "Combine descriptions with choices about what to wear.", "اجمع بين الوصف والاختيار عند الحديث عما ترتديه."],
  ["travel and transport", "السفر والمواصلات", "Handle a short journey with tickets, times, and destinations.", "تعامل مع رحلة قصيرة تشمل التذاكر والأوقات والوجهات."],
  ["health and the body", "الصحة والجسم", "Describe a basic problem and understand a simple suggestion.", "صف مشكلة أساسية وافهم نصيحة بسيطة."],
  ["free time", "وقت الفراغ", "Talk about likes, abilities, and simple weekend activities.", "تحدث عن الإعجاب والقدرات وأنشطة عطلة نهاية الأسبوع."],
  ["plans and invitations", "الخطط والدعوات", "Invite someone, accept, refuse, and give a simple reason.", "ادعُ شخصاً واقبل الدعوة أو ارفضها مع سبب بسيط."],
  ["past events", "الأحداث الماضية", "Tell a short sequence about yesterday or last weekend.", "احكِ تسلسلاً قصيراً عن الأمس أو عطلة نهاية الأسبوع الماضية."],
  ["directions and locations", "الاتجاهات والمواقع", "Combine place words and imperatives to guide someone safely.", "اجمع كلمات المكان وصيغ الأمر لإرشاد شخص بأمان."],
  ["describing people", "وصف الأشخاص", "Join adjectives, appearance, and familiar relationships.", "اربط الصفات والمظهر والعلاقات المألوفة."],
  ["nature and the world", "الطبيعة والعالم", "Use simple facts and comparisons to describe the world around you.", "استخدم حقائق ومقارنات بسيطة لوصف العالم من حولك."],
  ["problems and solutions", "المشكلات والحلول", "Explain a small everyday problem and ask for help.", "اشرح مشكلة يومية صغيرة واطلب المساعدة."],
  ["A1 review and confidence", "مراجعة A1 والثقة", "Bring the course together in a supported real-life conversation.", "اجمع مهارات الدورة في محادثة واقعية مدعومة."],
] as const;

export const A1_LESSONS: LessonDefinition[] = Array.from({ length: 20 }, (_, index) => {
  const [domainFocus, domainFocusArabic, beginnerScaffold, beginnerScaffoldArabic] = a1DomainProgression[index];
  const lessonNumber = index + 1;
  const [title, titleArabic] = lessonTitles[index];
  return {
    level: "A1" as const,
    lessonNumber,
    moduleNumber: Math.ceil(lessonNumber / 5),
    title,
    titleArabic,
    words: A1_VOCABULARY.slice(index * 25, (index + 1) * 25),
    grammar: A1_GRAMMAR[index],
    domainFocus,
    domainFocusArabic,
    beginnerScaffold,
    beginnerScaffoldArabic,
  };
}).map(enrichLesson);

export const A1_COURSE: CourseDefinition = {
  level: "A1",
  title: "Beginner foundations",
  titleArabic: "أساسيات المبتدئ",
  totalLessons: 20,
  lessonsPerModule: 5,
  estimatedMinutes: 100 * 60,
  lessons: A1_LESSONS,
  modules: buildModuleDefinitions("A1", A1_LESSONS),
};

export function getA1Lesson(lessonNumber: number) {
  return A1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
