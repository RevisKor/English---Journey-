import type { CourseDefinition, ImmersiveWordBankEntry, ModuleWordBankEntry } from "./types";
import { buildImmersiveExposureIndex, getA1ImmersiveModule } from "./a1-immersive-modules";

export function buildModuleWordBank(course: CourseDefinition, moduleNumber: number, completedLessons: Set<number>): ModuleWordBankEntry[] {
  const lessonNumbers = course.modules?.find((module) => module.moduleNumber === moduleNumber)?.lessonNumbers ?? course.lessons.filter((lesson) => lesson.moduleNumber === moduleNumber).map((lesson) => lesson.lessonNumber);
  const sourceEntries = course.lessons.filter((lesson) => lessonNumbers.includes(lesson.lessonNumber)).flatMap((lesson) => lesson.words.map((word) => ({
    ...word,
    introducedLessonNumber: lesson.lessonNumber,
    reviewCount: completedLessons.has(lesson.lessonNumber) ? 1 : 0,
    familiarity: completedLessons.has(lesson.lessonNumber) ? "recognized" as const : "introduced" as const,
  })));
  // A word can deliberately recur across lessons as part of repeated exposure.
  // The module table should present that word once, with its first source lesson
  // and aggregate review state, so both the learner experience and React keys
  // remain stable.
  const entriesByIdentity = new Map<string, ModuleWordBankEntry>();
  for (const entry of sourceEntries) {
    // Catalog records use lesson-scoped IDs so a repeated word can be stored
    // safely in every lesson that revisits it.  Learners should still see one
    // cumulative row per word in a module, so aggregate by its display form
    // and part of speech rather than the persistence key.
    const identity = `${entry.word.trim().toLocaleLowerCase()}::${entry.partOfSpeech.trim().toLocaleLowerCase()}`;
    const existing = entriesByIdentity.get(identity);
    if (!existing) {
      entriesByIdentity.set(identity, entry);
      continue;
    }
    entriesByIdentity.set(identity, {
      ...existing,
      introducedLessonNumber: Math.min(existing.introducedLessonNumber, entry.introducedLessonNumber),
      reviewCount: existing.reviewCount + entry.reviewCount,
      familiarity: existing.reviewCount + entry.reviewCount > 0 ? "recognized" : "introduced",
    });
  }
  return Array.from(entriesByIdentity.values());
}

export function buildImmersiveModuleWordBank(course: CourseDefinition, moduleNumber: number, completedLessons: Set<number>): ImmersiveWordBankEntry[] {
  const baseEntries = buildModuleWordBank(course, moduleNumber, completedLessons);
  if (course.level !== "A1") return [];
  const authoredModule = getA1ImmersiveModule(moduleNumber);
  if (!authoredModule) return [];
  const exposureIndex = buildImmersiveExposureIndex(authoredModule);
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
