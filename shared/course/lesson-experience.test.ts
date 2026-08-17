import { describe, expect, it } from "vitest";
import { countLessonArchetypes, createLessonExperience } from "./lesson-experience";

const firstView = {
  whatItIs: "A name exchange",
  whatToDo: "Reply to Noor",
  whatMatters: "Names make a conversation personal",
  whatNext: "Use the exchange in a role-play",
};

describe("createLessonExperience", () => {
  it("preserves an author-selected interaction journey without adding unchosen stages", () => {
    const experience = createLessonExperience({
      archetype: "interaction",
      density: "light",
      archetypeRationale: "A2 learners need to take turns before studying a detached rule.",
      selectedStages: ["retrieval", "encounter", "meaningful-use", "evidence"],
      intentionallyOmittedStages: [{ stage: "notice", reason: "The contrast appears inside the exchange." }],
      firstView,
      progressiveSupports: ["arabic-help", "worked-example"],
    });

    expect(experience.selectedStages).toEqual(["retrieval", "encounter", "meaningful-use", "evidence"]);
    expect(experience.selectedStages).not.toContain("notice");
    expect(experience.progressiveSupports).toEqual(["arabic-help", "worked-example"]);
  });

  it("requires a meaningful authoring rationale and a complete learner first view", () => {
    expect(() =>
      createLessonExperience({
        archetype: "discover",
        density: "light",
        archetypeRationale: "",
        selectedStages: ["encounter"],
        firstView,
      }),
    ).toThrow("archetype rationale");

    expect(() =>
      createLessonExperience({
        archetype: "discover",
        density: "light",
        archetypeRationale: "A concrete encounter lowers first-lesson uncertainty.",
        selectedStages: ["encounter"],
        firstView: { ...firstView, whatNext: "" },
      }),
    ).toThrow("whatNext");
  });

  it("counts archetypes for review without imposing a rotation", () => {
    const discover = createLessonExperience({
      archetype: "discover",
      density: "normal",
      archetypeRationale: "The language is new and concrete.",
      selectedStages: ["encounter", "evidence"],
      firstView,
    });
    const review = createLessonExperience({
      archetype: "review",
      density: "light",
      archetypeRationale: "The lesson strengthens spaced recall.",
      selectedStages: ["retrieval", "evidence"],
      firstView,
    });

    expect(countLessonArchetypes([discover, review])).toMatchObject({ discover: 1, review: 1, grammar: 0 });
  });
});
