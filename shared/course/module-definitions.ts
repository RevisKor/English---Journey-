import { moduleTheme } from "./module-guidance";
import type { CefrLevel, LessonDefinition, ModuleDefinition } from "./types";

export function buildModuleDefinitions(level: CefrLevel, lessons: LessonDefinition[]): ModuleDefinition[] {
  return Array.from(new Set(lessons.map((lesson) => lesson.moduleNumber)))
    .sort((a, b) => a - b)
    .map((moduleNumber) => {
      const theme = moduleTheme(level, moduleNumber);
      return {
        moduleNumber,
        title: theme.title,
        titleArabic: theme.titleArabic,
        lessonNumbers: lessons.filter((lesson) => lesson.moduleNumber === moduleNumber).map((lesson) => lesson.lessonNumber),
        theme: theme.overview,
        themeArabic: theme.overviewArabic,
      };
    });
}
