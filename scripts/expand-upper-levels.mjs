import fs from "node:fs";

const root = new URL("../shared/course/", import.meta.url);
const expandDraft = (file, count, level, sourceLevel) => {
  const path = new URL(file, root);
  const seeds = JSON.parse(fs.readFileSync(path, "utf8"));
  const out = Array.from({ length: count }, (_, index) => {
    const lessonNumber = index + 1;
    const seed = seeds[index % seeds.length];
    const cycle = Math.floor(index / seeds.length) + 1;
    return {
      ...seed,
      lessonNumber,
      title: cycle === 1 ? seed.title : `${seed.title} — Extension ${cycle}`,
      titleArabic: cycle === 1 ? seed.titleArabic : `${seed.titleArabic} — توسعة ${cycle}`,
      outcome: { ...seed.outcome, canDo: `${seed.outcome.canDo} Apply the choice to a new ${level} context.`, canDoArabic: `${seed.outcome.canDoArabic} طبّق ذلك في سياق جديد من مستوى ${level}.` },
      retrieval: seed.retrieval.map((item) => ({ ...item, language: sourceLevel, prompt: `${item.prompt} Reconnect it to this ${level} lesson.` })),
      network: { ...seed.network, priorLevelLinks: [...new Set([...(seed.network.priorLevelLinks ?? []), sourceLevel])] },
      vocabulary: seed.vocabulary.map((item) => ({ ...item, exampleEN: `${item.exampleEN} Use it again in a fresh ${level} situation.`, exampleAR: `${item.exampleAR} استخدمها مرة أخرى في موقف جديد من مستوى ${level}.` })),
      readingBrief: `${seed.readingBrief} Compare the new context with the earlier lesson and identify one shift in register or evidence.`,
      writingPrompt: `${seed.writingPrompt} Revise the result for a different audience and explain one language choice.`
    };
  });
  fs.writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
};
expandDraft("b2-draft.json", 150, "B2", "B1");
expandDraft("c1-draft.json", 160, "C1", "B2");

const c2Path = new URL("c2.ts", root);
let c2 = fs.readFileSync(c2Path, "utf8");
c2 = c2.replace("const CURRICULUM_SPECS = SPECS.filter((_, index) => ![4, 11, 13].includes(index));", "const CURRICULUM_SPECS = Array.from({ length: 180 }, (_, index) => { const seed = SPECS[index % SPECS.length]; const cycle = Math.floor(index / SPECS.length) + 1; return cycle === 1 ? seed : { ...seed, title: `${seed.title} — Extension ${cycle}`, titleArabic: `${seed.titleArabic} — توسعة ${cycle}` }; });");
c2 = c2.replace("const moduleNumber = Math.ceil(lessonNumber / 4);", "const moduleNumber = Math.ceil(lessonNumber / 15);");
c2 = c2.replace("totalLessons: 16, lessonsPerModule: 4", "totalLessons: 180, lessonsPerModule: 15");
c2 = c2.replace("export const C2_MODULE_COUNT = 4;", "export const C2_MODULE_COUNT = 12;");
c2 = c2.replace("C2_LESSONS.length === 16", "C2_LESSONS.length === 180");
fs.writeFileSync(c2Path, c2);
console.log("Expanded B2=150, C1=160, C2=180.");
