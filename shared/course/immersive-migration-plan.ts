import type { CefrLevel, ImmersiveModuleAuthoring } from "./types";
import { A1_IMMERSIVE_MODULES } from "./a1-immersive-modules";
import { getProgressiveImmersiveModules, type ProgressiveImmersiveModule } from "./progressive-immersive";

export type ImmersiveMigrationLesson = {
  sourceKey: string;
  level: CefrLevel;
  moduleNumber: number;
  authoredLessonNumber: number;
  proposedCatalogLessonNumber: number;
  title: string;
  titleArabic: string;
  lessonType: string;
  vocabularyAnchors: string[];
  grammarFocus: string;
  canDo: string;
  canDoArabic: string;
};

export type ImmersiveMigrationModule = {
  sourceKey: string;
  level: CefrLevel;
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  lessonCount: number;
  status: "shadow-preview" | "ready-for-catalog-migration";
  lessons: ImmersiveMigrationLesson[];
};

function toPlan(module: ImmersiveModuleAuthoring | ProgressiveImmersiveModule, existingLessonCount: number): ImmersiveMigrationModule {
  const sourceKey = `${module.level}:immersive:module-${module.moduleNumber}`;
  return {
    sourceKey,
    level: module.level,
    moduleNumber: module.moduleNumber,
    title: module.title,
    titleArabic: module.titleArabic,
    overview: module.overview,
    overviewArabic: module.overviewArabic,
    lessonCount: module.lessonBlueprints.length,
    status: "shadow-preview",
    lessons: module.lessonBlueprints.map((lesson) => ({
      sourceKey: `${sourceKey}:lesson-${lesson.lessonNumber}`,
      level: module.level,
      moduleNumber: module.moduleNumber,
      authoredLessonNumber: lesson.lessonNumber,
      proposedCatalogLessonNumber: existingLessonCount + ((module.moduleNumber - 1) * module.lessonBlueprints.length) + lesson.lessonNumber,
      title: lesson.title,
      titleArabic: lesson.titleArabic,
      lessonType: lesson.type,
      vocabularyAnchors: lesson.vocabularyAnchors,
      grammarFocus: lesson.grammarFocus,
      canDo: lesson.canDo,
      canDoArabic: lesson.canDoArabic,
    })),
  };
}

export function buildA1ImmersiveMigrationPlan(existingLessonCount = 20) {
  return A1_IMMERSIVE_MODULES.map((module) => toPlan(module, existingLessonCount));
}

export function buildProgressiveImmersiveMigrationPlan(level: Exclude<CefrLevel, "A1">, existingLessonCount: number) {
  return getProgressiveImmersiveModules(level).map((module) => toPlan(module, existingLessonCount));
}

export function flattenImmersiveMigrationLessons(modules: ImmersiveMigrationModule[]) {
  return modules.flatMap((module) => module.lessons);
}
