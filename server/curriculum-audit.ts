import {
  A1_COURSE,
  A2_COURSE,
  B1_COURSE,
  B2_COURSE,
  C1_COURSE,
  C2_COURSE,
  type CourseDefinition,
  type LessonArchetype,
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
  lessonArchetypeDistribution: Partial<Record<LessonArchetype, number>>;
  activityKindDistribution: Partial<Record<LessonType, number>>;
  missingLearningPlans: number[];
  missingActivities: number[];
  missingLessonExperience: number[];
  missingBilingualMetadata: number[];
  duplicateLessonNumbers: number[];
  longestRepeatedLessonTypeRun: number;
  longestRepeatedArchetypeRun: number;
  variationReview: string[];
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

function repeatedArchetypeRun(course: CourseDefinition) {
  let longest = 0;
  let current = 0;
  let previous: LessonArchetype | undefined;
  let previousModule: number | undefined;

  for (const lesson of course.lessons) {
    const archetype = lesson.experience?.archetype;
    if (!archetype) {
      current = 0;
      previous = undefined;
      previousModule = undefined;
      continue;
    }

    current = archetype === previous && lesson.moduleNumber === previousModule ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = archetype;
    previousModule = lesson.moduleNumber;
  }

  return longest;
}

function buildVariationReview(course: CourseDefinition): string[] {
  const authoredLessons = course.lessons.filter((lesson) => lesson.experience);
  if (authoredLessons.length < 3) return [];

  const review: string[] = [];
  const archetypeCounts = new Map<LessonArchetype, number>();
  const openingCounts = new Map<string, number>();
  const activitySequenceCounts = new Map<string, number>();

  for (const lesson of authoredLessons) {
    const experience = lesson.experience!;
    archetypeCounts.set(experience.archetype, (archetypeCounts.get(experience.archetype) ?? 0) + 1);

    const opening = experience.firstView.whatItIs.trim().toLocaleLowerCase();
    if (opening) openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);

    const sequence = (lesson.activities ?? []).map((activity) => `${activity.kind}:${activity.stage}`).join(" → ");
    if (sequence) activitySequenceCounts.set(sequence, (activitySequenceCounts.get(sequence) ?? 0) + 1);

    if (experience.selectedStages.includes("retrieval") && !lesson.learningPlan?.retrieval.length) {
      review.push(`Lesson ${lesson.lessonNumber} selects retrieval but does not name a source target.`);
    }
  }

  for (const [archetype, count] of Array.from(archetypeCounts.entries())) {
    if (count / authoredLessons.length >= 0.75) {
      review.push(`${archetype} is concentrated in ${count}/${authoredLessons.length} authored lessons; confirm that the objectives justify it.`);
    }
  }

  const repeatedArchetypes = repeatedArchetypeRun(course);
  if (repeatedArchetypes >= 3) {
    review.push(`${repeatedArchetypes} adjacent authored lessons share an archetype within a module; review whether the run is purposeful.`);
  }

  for (const [, count] of Array.from(openingCounts.entries())) {
    if (count >= 3) review.push(`${count} authored lessons repeat the same opening; review for unnecessary repetition.`);
  }
  for (const [, count] of Array.from(activitySequenceCounts.entries())) {
    if (count >= 3) review.push(`${count} authored lessons repeat the same activity sequence; review for unnecessary repetition.`);
  }

  return review;
}

export function auditCourse(course: CourseDefinition): CurriculumLevelAudit {
  const lessonTypeDistribution = emptyLessonTypeDistribution();
  const lessonArchetypeDistribution: Partial<Record<LessonArchetype, number>> = {};
  const activityKindDistribution: Partial<Record<LessonType, number>> = {};
  const seenLessonNumbers = new Set<number>();
  const duplicateLessonNumbers: number[] = [];
  const missingLearningPlans: number[] = [];
  const missingActivities: number[] = [];
  const missingLessonExperience: number[] = [];
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
    if (!lesson.experience) {
      missingLessonExperience.push(lesson.lessonNumber);
    } else {
      lessonArchetypeDistribution[lesson.experience.archetype] = (lessonArchetypeDistribution[lesson.experience.archetype] ?? 0) + 1;
    }
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
  const variationReview = buildVariationReview(course);
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
    lessonArchetypeDistribution,
    activityKindDistribution,
    missingLearningPlans,
    missingActivities,
    missingLessonExperience,
    missingBilingualMetadata,
    duplicateLessonNumbers,
    longestRepeatedLessonTypeRun: repeatedTypeRun(course),
    longestRepeatedArchetypeRun: repeatedArchetypeRun(course),
    variationReview,
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
    `| ${level.level} | ${level.totalLessons}/${level.expectedLessons} | ${level.modules}/${level.expectedModules} | ${level.vocabularyItems} | ${level.grammarTopics} | ${level.longestRepeatedLessonTypeRun} | ${level.longestRepeatedArchetypeRun} | ${level.totalLessons - level.missingLessonExperience.length}/${level.totalLessons} | ${level.variationReview.length} | ${level.warnings.length} |`,
  );

  return [
    "# English Journey Curriculum Audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "| Level | Lessons | Modules | Vocabulary items | Grammar topics | Longest repeated lesson-type run | Longest repeated archetype run | Lessons with experience | Variation reviews | Warnings |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...rows,
    "",
    `**Portfolio totals:** ${report.totals.levels} levels, ${report.totals.lessons} lessons, ${report.totals.vocabularyItems} vocabulary records, and ${report.totals.grammarTopics} grammar records.`,
  ].join("\n");
}
