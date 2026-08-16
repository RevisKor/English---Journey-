export type AvailableCourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type CourseRoute = {
  level: AvailableCourseLevel;
  lessonNumber: number | null;
};

const availableLevels = new Set<AvailableCourseLevel>(["A1", "A2", "B1", "B2", "C1", "C2"]);

export function resolveCourseRoute(search: string): CourseRoute {
  const params = new URLSearchParams(search);
  const requestedLevel = params.get("level");
  const level = requestedLevel && availableLevels.has(requestedLevel as AvailableCourseLevel) ? requestedLevel as AvailableCourseLevel : "A1";
  const candidate = Number(params.get("lesson"));
  const lessonNumber = Number.isInteger(candidate) && candidate > 0 ? candidate : null;
  return { level, lessonNumber };
}

export function courseRoutePath(level: AvailableCourseLevel, lessonNumber?: number | null): string {
  const params = new URLSearchParams({ level });
  if (lessonNumber && Number.isInteger(lessonNumber) && lessonNumber > 0) params.set("lesson", String(lessonNumber));
  return `/?${params.toString()}`;
}
