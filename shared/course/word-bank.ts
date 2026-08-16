import type { CourseDefinition, ImmersiveWordBankEntry, ModuleWordBankEntry } from "./types";
import { buildImmersiveExposureIndex } from "./a1-immersive-modules";

export function buildModuleWordBank(course: CourseDefinition, moduleNumber: number, completedLessons: Set<number>): ModuleWordBankEntry[] {
  const lessonNumbers = course.modules?.find((module) => module.moduleNumber === moduleNumber)?.lessonNumbers ?? course.lessons.filter((lesson) => lesson.moduleNumber === moduleNumber).map((lesson) => lesson.lessonNumber);
  const entries = course.lessons.filter((lesson) => lessonNumbers.includes(lesson.lessonNumber)).flatMap((lesson) => lesson.words.map((word) => ({
    ...word,
    introducedLessonNumber: lesson.lessonNumber,
    reviewCount: completedLessons.has(lesson.lessonNumber) ? 1 : 0,
    familiarity: completedLessons.has(lesson.lessonNumber) ? "recognized" as const : "introduced" as const,
  })));
  return entries;
}

export function buildImmersiveModuleWordBank(course: CourseDefinition, moduleNumber: number, completedLessons: Set<number>): ImmersiveWordBankEntry[] {
  const baseEntries = buildModuleWordBank(course, moduleNumber, completedLessons);
  if (course.level !== "A1" || moduleNumber !== 1) return [];
  const exposureIndex = buildImmersiveExposureIndex();
  return baseEntries.flatMap((entry) => {
    const exposurePlan = exposureIndex[entry.word.toLowerCase()] ?? [];
    if (!exposurePlan.length) return [];
    const sourceLessonNumbers = Array.from(new Set(exposurePlan.map((item) => item.lessonNumber))).sort((a, b) => a - b);
    return [{ ...entry, sourceLessonNumbers, exposurePlan }];
  });
}

export function summarizeWordBank(entries: ModuleWordBankEntry[]) {
  return {
    total: entries.length,
    introduced: entries.filter((entry) => entry.familiarity === "introduced").length,
    recognized: entries.filter((entry) => entry.familiarity !== "introduced").length,
    preview: entries.slice(0, 8),
  };
}
