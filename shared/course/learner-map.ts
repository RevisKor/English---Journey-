import type { CefrLevel, LessonDefinition } from "./types";
import { getA1ImmersiveModule } from "./a1-immersive-modules";
import { getProgressiveImmersiveModules } from "./progressive-immersive";
import { moduleTheme } from "./module-guidance";
import type { ModuleDefinition } from "./types";

export type LearnerCourseMapSection = {
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  lessons: LessonDefinition[];
  immersiveRoadmap?: {
    plannedLessons: number;
    lessonTypes: string[];
    notice: string;
    noticeArabic: string;
    difficultyNotice?: string;
    difficultyNoticeArabic?: string;
  };
};

export function buildLearnerCourseMap(level: CefrLevel, lessons: LessonDefinition[], modules?: ModuleDefinition[]): LearnerCourseMapSection[] {
  const moduleNumbers = modules?.map((module) => module.moduleNumber) ?? Array.from(new Set(lessons.map((lesson) => lesson.moduleNumber))).sort((a, b) => a - b);
  return moduleNumbers.map((moduleNumber) => {
    const definition = modules?.find((module) => module.moduleNumber === moduleNumber);
    const fallback = moduleTheme(level, moduleNumber);
    return {
      moduleNumber,
      title: definition?.title ?? fallback.title,
      titleArabic: definition?.titleArabic ?? fallback.titleArabic,
      overview: definition?.theme ?? fallback.overview,
      overviewArabic: definition?.themeArabic ?? fallback.overviewArabic,
      lessons: lessons.filter((lesson) => definition?.lessonNumbers.includes(lesson.lessonNumber) ?? lesson.moduleNumber === moduleNumber),
      immersiveRoadmap: level === "A1" && getA1ImmersiveModule(moduleNumber) ? {
        plannedLessons: getA1ImmersiveModule(moduleNumber)!.lessonBlueprints.length,
        lessonTypes: Array.from(new Set(getA1ImmersiveModule(moduleNumber)!.lessonBlueprints.map((lesson) => lesson.type))),
        notice: "This module is being deepened into a 15-lesson guided journey. The current catalog lessons remain the active gated route while the new authoring is reviewed.",
        noticeArabic: "يجري تعميق هذه الوحدة إلى رحلة موجّهة من ١٥ درساً. تبقى دروس الكتالوج الحالية هي المسار النشط ذي البوابات أثناء مراجعة التأليف الجديد.",
      } : level !== "A1" && getProgressiveImmersiveModules(level).find((module) => module.moduleNumber === moduleNumber) ? (() => {
        const authored = getProgressiveImmersiveModules(level).find((module) => module.moduleNumber === moduleNumber)!;
        return {
          plannedLessons: authored.lessonBlueprints.length,
          lessonTypes: Array.from(new Set(authored.lessonBlueprints.map((lesson) => lesson.type))),
          notice: `This ${level} module is designed as a ${authored.lessonBlueprints.length}-lesson immersive arc. The current catalog remains the active gated route while the deeper authoring is reviewed.`,
          noticeArabic: `صُممت هذه الوحدة في مستوى ${level} كمسار غامر من ${authored.lessonBlueprints.length} درساً. يبقى الكتالوج الحالي هو المسار النشط ذي البوابات أثناء مراجعة التأليف الأعمق.`,
          difficultyNotice: `${authored.difficulty.expectedReadingWords}-word reading target; ${authored.difficulty.expectedWritingWords}-word writing target. ${authored.difficulty.assessmentDemand}`,
          difficultyNoticeArabic: `هدف القراءة ${authored.difficulty.expectedReadingWords} كلمة؛ وهدف الكتابة ${authored.difficulty.expectedWritingWords} كلمة. ${authored.difficulty.assessmentDemand}`,
        };
      })() : undefined,
    };
  });
}
