import type { CefrLevel, LessonDefinition } from "./types";
import { moduleTheme } from "./module-guidance";
import type { ModuleDefinition } from "./types";

export type LearnerCourseMapSection = {
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  lessons: LessonDefinition[];
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
    };
  });
}
