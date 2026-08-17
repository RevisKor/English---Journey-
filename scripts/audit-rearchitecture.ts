import { writeFileSync } from "node:fs";
import { A1_LESSONS } from "../shared/course/a1";
import { A2_LESSONS } from "../shared/course/a2";
import { B1_LESSONS } from "../shared/course/b1";
import { B2_LESSONS } from "../shared/course/b2";
import { C1_LESSONS } from "../shared/course/c1";
import { C2_LESSONS } from "../shared/course/c2";
import type { LessonDefinition } from "../shared/course/types";

const courses: Record<string, LessonDefinition[]> = { A1: A1_LESSONS, A2: A2_LESSONS, B1: B1_LESSONS, B2: B2_LESSONS, C1: C1_LESSONS, C2: C2_LESSONS };
const count = (values: Array<string | undefined>) => Object.fromEntries(Object.entries(values.reduce<Record<string, number>>((acc, value) => { if (value) acc[value] = (acc[value] ?? 0) + 1; return acc; }, {})).sort(([a], [b]) => a.localeCompare(b)));

const report = Object.fromEntries(Object.entries(courses).map(([level, lessons]) => {
  const withExperience = lessons.filter((lesson) => lesson.experience);
  const withActivities = lessons.filter((lesson) => lesson.activities?.length);
  const routeSignatures = lessons.map((lesson) => lesson.activities?.map((activity) => `${activity.kind}:${activity.stage}`).join("|") ?? "generated-fallback");
  const repeatedSignatures = Object.entries(count(routeSignatures)).filter(([, total]) => total > 1).sort((a, b) => b[1] - a[1]);
  const firstViewGaps = withExperience.filter((lesson) => !Object.values(lesson.experience!.firstView).every(Boolean)).map((lesson) => lesson.lessonNumber);
  return [level, {
    lessons: lessons.length,
    experienceCoverage: `${withExperience.length}/${lessons.length}`,
    activityCoverage: `${withActivities.length}/${lessons.length}`,
    archetypes: count(withExperience.map((lesson) => lesson.experience!.archetype)),
    density: count(withExperience.map((lesson) => lesson.experience!.density)),
    activityKinds: count(withActivities.flatMap((lesson) => lesson.activities!.map((activity) => activity.kind))),
    firstViewGaps,
    repeatedRouteSignatures: repeatedSignatures.slice(0, 5),
    missingExperience: lessons.filter((lesson) => !lesson.experience).map((lesson) => lesson.lessonNumber),
    missingActivities: lessons.filter((lesson) => !lesson.activities?.length).map((lesson) => lesson.lessonNumber),
  }];
}));

const output = JSON.stringify(report, null, 2);
if (process.env.WRITE_REPORT === "1") writeFileSync("docs/research/live-rearchitecture-audit.json", output);
console.log(output);
