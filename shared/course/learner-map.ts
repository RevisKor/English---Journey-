import type { CefrLevel, LessonDefinition } from "./types";
import { moduleTheme } from "./module-guidance";

export type LearnerCourseMapSection = {
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  lessons: LessonDefinition[];
};

export function buildLearnerCourseMap(level: CefrLevel, lessons: LessonDefinition[]): LearnerCourseMapSection[] {
  return Array.from(new Set(lessons.map((lesson) => lesson.moduleNumber)))
    .sort((a, b) => a - b)
    .map((moduleNumber) => ({ moduleNumber, ...moduleTheme(level, moduleNumber), lessons: lessons.filter((lesson) => lesson.moduleNumber === moduleNumber) }));
}
