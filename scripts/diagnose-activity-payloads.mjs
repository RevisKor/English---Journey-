import { A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE } from '../shared/course/index.ts';

for (const course of [A1_COURSE, A2_COURSE, B1_COURSE, B2_COURSE, C1_COURSE, C2_COURSE]) {
  const byType = new Map();
  for (const lesson of course.lessons) {
    const lessons = byType.get(lesson.lessonType) ?? [];
    lessons.push(lesson);
    byType.set(lesson.lessonType, lessons);
  }
  const checks = {
    visual: byType.get('visual-vocabulary')?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.visualItems?.length && activity.visualItems.every((item) => item.imageUrl?.startsWith('data:image/svg+xml') && item.altText)))),
    interaction: byType.get('interaction')?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.interactionTurns?.length))),
    speaking: byType.get('speaking')?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.speakingLines?.length))),
    reading: byType.get('reading')?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.readingText && activity.readingChecks?.length))),
    writing: byType.get('writing')?.some((lesson) => lesson.activities?.some((activity) => Boolean(activity.writingPrompt && activity.suggestedVocabulary?.length))),
  };
  const allActivities = course.lessons.flatMap((lesson) => lesson.activities ?? []);
  console.log(course.level, checks, allActivities.reduce((counts, activity) => { counts[activity.kind] = (counts[activity.kind] ?? 0) + 1; if (activity.visualItems?.length) counts.visual = (counts.visual ?? 0) + 1; if (activity.writingPrompt) counts.writingPrompt = (counts.writingPrompt ?? 0) + 1; return counts; }, {}));
}
