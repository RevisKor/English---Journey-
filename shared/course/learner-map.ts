import type { CefrLevel, LessonDefinition } from "./types";
import { A1_MEETING_PEOPLE_IMMERSIVE } from "./a1-immersive-modules";
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
      immersiveRoadmap: level === "A1" && moduleNumber === 1 ? {
        plannedLessons: A1_MEETING_PEOPLE_IMMERSIVE.lessonBlueprints.length,
        lessonTypes: Array.from(new Set(A1_MEETING_PEOPLE_IMMERSIVE.lessonBlueprints.map((lesson) => lesson.type))),
        notice: "This module is being deepened into a 15-lesson guided journey. The current catalog lessons remain the active gated route while the new authoring is reviewed.",
        noticeArabic: "يجري تعميق هذه الوحدة إلى رحلة موجّهة من ١٥ درساً. تبقى دروس الكتالوج الحالية هي المسار النشط ذي البوابات أثناء مراجعة التأليف الجديد.",
      } : undefined,
    };
  });
}
