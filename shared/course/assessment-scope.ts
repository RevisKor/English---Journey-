import type { CourseDefinition } from "./types";

/**
 * Milestone checkpoints are attached to the final lesson of each module.
 * This preserves 5/10/15/20 for five-lesson courses while making C2's
 * shorter four-lesson modules resolve to 4/8/12/16 instead of invalid URLs.
 */
export function moduleNumberForLesson(course: CourseDefinition, lessonNumber: number) {
  return Math.ceil(lessonNumber / course.lessonsPerModule);
}

export function milestoneLessonNumbers(course: CourseDefinition) {
  return course.lessons
    .filter((lesson, index, lessons) => lessons[index + 1]?.moduleNumber !== lesson.moduleNumber)
    .map((lesson) => lesson.lessonNumber);
}

export function isMilestoneLesson(course: CourseDefinition, lessonNumber: number) {
  return milestoneLessonNumbers(course).includes(lessonNumber);
}
