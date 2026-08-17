import {
  A1_COURSE,
  A2_COURSE,
  B1_COURSE,
  B2_COURSE,
  C1_COURSE,
  C2_COURSE,
  type CourseDefinition,
  type LessonType,
} from "../shared/course";

export const ACTIVE_COURSES: CourseDefinition[] = [
  A1_COURSE,
  A2_COURSE,
  B1_COURSE,
  B2_COURSE,
  C1_COURSE,
  C2_COURSE,
];

export type CurriculumLevelAudit = {
  level: CourseDefinition["level"];
  totalLessons: number;
  expectedLessons: number;
  modules: number;
  expectedModules: number;
  vocabularyItems: number;
  grammarTopics: number;
  lessonTypeDistribution: Record<LessonType, number>;
  activityKindDistribution: Partial<Record<LessonType, number>>;
  missingLearningPlans: number[];
  missingActivities: number[];
  missingBilingualMetadata: number[];
  duplicateLessonNumbers: number[];
  longestRepeatedLessonTypeRun: number;
  warnings: string[];
};

export type CurriculumAuditReport = {
  generatedAt: string;
  levels: CurriculumLevelAudit[];
  totals: {
    levels: number;
    lessons: number;
    vocabularyItems: number;
    grammarTopics: number;
  };
};

const lessonTypes: LessonType[] = [
  "standard",
  "visual-vocabulary",
  "interaction",
  "speaking",
  "writing",
  "reading",
  "review",
  "assessment",
];

function emptyLessonTypeDistribution(): Record<LessonType, number> {
  return Object.fromEntries(lessonTypes.map((type) => [type, 0])) as Record<LessonType, number>;
}

function repeatedTypeRun(course: CourseDefinition) {
  let longest = 0;
  let current = 0;
  let previous: LessonType | undefined;

  for (const lesson of course.lessons) {
    const lessonType = lesson.lessonType ?? "standard";
    current = lessonType === previous ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = lessonType;
  }

  return longest;
}

export function auditCourse(course: CourseDefinition): CurriculumLevelAudit {
  const lessonTypeDistribution = emptyLessonTypeDistribution();
  const activityKindDistribution: Partial<Record<LessonType, number>> = {};
  const seenLessonNumbers = new Set<number>();
  const duplicateLessonNumbers: number[] = [];
  const missingLearningPlans: number[] = [];
  const missingActivities: number[] = [];
  const missingBilingualMetadata: number[] = [];

  for (const lesson of course.lessons) {
    const lessonType = lesson.lessonType ?? "standard";
    lessonTypeDistribution[lessonType] += 1;

    if (seenLessonNumbers.has(lesson.lessonNumber)) {
      duplicateLessonNumbers.push(lesson.lessonNumber);
    }
    seenLessonNumbers.add(lesson.lessonNumber);

    if (!lesson.learningPlan) missingLearningPlans.push(lesson.lessonNumber);
    if (!lesson.activities?.length) missingActivities.push(lesson.lessonNumber);
    if (!lesson.titleArabic || !lesson.grammar.arabicName || lesson.words.some((word) => !word.arabic || !word.exampleAR)) {
      missingBilingualMetadata.push(lesson.lessonNumber);
    }

    for (const activity of lesson.activities ?? []) {
      activityKindDistribution[activity.kind] = (activityKindDistribution[activity.kind] ?? 0) + 1;
    }
  }

  const modules = new Set(course.lessons.map((lesson) => lesson.moduleNumber)).size;
  const expectedModules = Math.ceil(course.totalLessons / course.lessonsPerModule);
  const warnings: string[] = [];
  if (course.lessons.length !== course.totalLessons) warnings.push("Lesson count differs from course metadata.");
  if (modules !== expectedModules) warnings.push("Module count differs from course metadata.");
  if (duplicateLessonNumbers.length) warnings.push("Duplicate lesson numbers detected.");
  if (missingLearningPlans.length) warnings.push(`${missingLearningPlans.length} lessons have no learning plan.`);
  if (missingActivities.length) warnings.push(`${missingActivities.length} lessons have no structured activities.`);
  if (missingBilingualMetadata.length) warnings.push(`${missingBilingualMetadata.length} lessons have incomplete bilingual metadata.`);

  return {
    level: course.level,
    totalLessons: course.lessons.length,
    expectedLessons: course.totalLessons,
    modules,
    expectedModules,
    vocabularyItems: course.lessons.reduce((total, lesson) => total + lesson.words.length, 0),
    grammarTopics: course.lessons.filter((lesson) => Boolean(lesson.grammar)).length,
    lessonTypeDistribution,
    activityKindDistribution,
    missingLearningPlans,
    missingActivities,
    missingBilingualMetadata,
    duplicateLessonNumbers,
    longestRepeatedLessonTypeRun: repeatedTypeRun(course),
    warnings,
  };
}

export function buildCurriculumAuditReport(now = new Date()): CurriculumAuditReport {
  const levels = ACTIVE_COURSES.map(auditCourse);
  return {
    generatedAt: now.toISOString(),
    levels,
    totals: {
      levels: levels.length,
      lessons: levels.reduce((total, level) => total + level.totalLessons, 0),
      vocabularyItems: levels.reduce((total, level) => total + level.vocabularyItems, 0),
      grammarTopics: levels.reduce((total, level) => total + level.grammarTopics, 0),
    },
  };
}

export function formatCurriculumAudit(report: CurriculumAuditReport) {
  const rows = report.levels.map((level) =>
    `| ${level.level} | ${level.totalLessons}/${level.expectedLessons} | ${level.modules}/${level.expectedModules} | ${level.vocabularyItems} | ${level.grammarTopics} | ${level.longestRepeatedLessonTypeRun} | ${level.warnings.length} |`,
  );

  return [
    "# English Journey Curriculum Audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "| Level | Lessons | Modules | Vocabulary items | Grammar topics | Longest repeated lesson-type run | Warnings |",
    "|---|---:|---:|---:|---:|---:|---:|",
    ...rows,
    "",
    `**Portfolio totals:** ${report.totals.levels} levels, ${report.totals.lessons} lessons, ${report.totals.vocabularyItems} vocabulary records, and ${report.totals.grammarTopics} grammar records.`,
  ].join("\n");
}
