import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import type { CourseDefinition, GrammarTopic, LessonDefinition, VocabularyItem } from "./types";

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

export const A1_LESSONS: LessonDefinition[] = Array.from({ length: 20 }, (_, index) => {
  const lessonNumber = index + 1;
  const [title, titleArabic] = lessonTitles[index];
  return {
    level: "A1",
    lessonNumber,
    moduleNumber: Math.ceil(lessonNumber / 5),
    title,
    titleArabic,
    words: A1_VOCABULARY.slice(index * 25, (index + 1) * 25),
    grammar: A1_GRAMMAR[index],
  };
});

export const A1_COURSE: CourseDefinition = {
  level: "A1",
  title: "Beginner foundations",
  titleArabic: "أساسيات المبتدئ",
  totalLessons: 20,
  lessonsPerModule: 5,
  estimatedMinutes: 100 * 60,
  lessons: A1_LESSONS,
};

export function getA1Lesson(lessonNumber: number) {
  return A1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
