import type {
  LessonArchetype,
  LessonDensity,
  LessonExperience,
  LessonExperienceStage,
  ProgressiveSupport,
} from "./types";

export type LessonExperienceInput = {
  archetype: LessonArchetype;
  density: LessonDensity;
  archetypeRationale: string;
  selectedStages: LessonExperienceStage[];
  intentionallyOmittedStages?: LessonExperience["intentionallyOmittedStages"];
  firstView: LessonExperience["firstView"];
  progressiveSupports?: ProgressiveSupport[];
};

const REQUIRED_FIRST_VIEW_FIELDS = [
  "whatItIs",
  "whatToDo",
  "whatMatters",
  "whatNext",
] as const satisfies ReadonlyArray<keyof LessonExperience["firstView"]>;

/**
 * Builds an author-selected experience record without prescribing a common
 * stage sequence. Validation protects learner orientation and data quality.
 */
export function createLessonExperience(input: LessonExperienceInput): LessonExperience {
  if (!input.archetypeRationale.trim()) {
    throw new Error("A lesson experience needs an archetype rationale.");
  }

  if (input.selectedStages.length === 0) {
    throw new Error("A lesson experience must select at least one learning stage.");
  }

  if (new Set(input.selectedStages).size !== input.selectedStages.length) {
    throw new Error("A lesson experience cannot repeat the same selected stage.");
  }

  for (const field of REQUIRED_FIRST_VIEW_FIELDS) {
    if (!input.firstView[field].trim()) {
      throw new Error(`A lesson experience needs a first-view ${String(field)} message.`);
    }
  }

  return {
    ...input,
    selectedStages: [...input.selectedStages],
    intentionallyOmittedStages: input.intentionallyOmittedStages?.map((entry) => ({ ...entry })),
    firstView: { ...input.firstView },
    progressiveSupports: [...(input.progressiveSupports ?? [])],
  };
}

/** Returns a count by author-selected archetype for a human variation review. */
export function countLessonArchetypes(experiences: LessonExperience[]): Record<LessonArchetype, number> {
  const counts: Record<LessonArchetype, number> = {
    discover: 0,
    notice: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    listening: 0,
    grammar: 0,
    vocabulary: 0,
    interaction: 0,
    "real-world": 0,
    integration: 0,
    review: 0,
    assessment: 0,
  };

  for (const experience of experiences) {
    counts[experience.archetype] += 1;
  }

  return counts;
}
