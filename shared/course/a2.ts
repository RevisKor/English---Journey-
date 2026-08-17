import rawDraft from "./a2-draft.json";
import { enrichLesson } from "./activity-plan";
import { A2_MODULE_1_AUTHORED_ACTIVITIES } from "./a2-module-1-authored-activities";
import { A2_MODULE_2_AUTHORED_ACTIVITIES } from "./a2-module-2-authored-activities";
import { A2_MODULE_3_AUTHORED_ACTIVITIES } from "./a2-module-3-authored-activities";
import { createLessonExperience } from "./lesson-experience";
import { buildModuleDefinitions } from "./module-definitions";
import { getProgressiveImmersiveModules } from "./progressive-immersive";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
  LessonExperience,
  LessonDefinition,
  LessonStep,
  VocabularyItem,
} from "./types";

type DraftVocabulary = {
  word: string;
  arabic: string;
  partOfSpeech: string;
  definition: string;
  exampleEN: string;
  exampleAR: string;
};

type DraftLesson = { vocabulary: DraftVocabulary[] };

/**
 * The original A2 draft remains a curated bilingual vocabulary seed.  The
 * active lesson sequence now comes from the nine authored immersive modules,
 * allowing every seed word to reappear in a wider set of communicative tasks.
 */
const SEEDED_VOCABULARY: VocabularyItem[] = (rawDraft as DraftLesson[])
  .flatMap((lesson) => lesson.vocabulary)
  .map((item, index) => ({
    id: `a2-seed-${index + 1}`,
    word: item.word,
    arabic: item.arabic,
    ipa: "",
    phoneticRespelling: item.word,
    partOfSpeech: item.partOfSpeech,
    definition: item.definition,
    exampleEN: item.exampleEN,
    exampleAR: item.exampleAR,
  }));

const seedByWord = new Map(SEEDED_VOCABULARY.map((item) => [item.word.toLocaleLowerCase(), item]));

const A2_STEPS: LessonStep[] = [
  { id: "start", title: "Connect", titleArabic: "اربط", purpose: "Retrieve a useful A1 phrase and identify today's situation.", estimatedMinutes: 5 },
  { id: "explore", title: "Meet the language", titleArabic: "تعرّف إلى اللغة", purpose: "Notice new words and a grammar choice in a practical context.", estimatedMinutes: 10 },
  { id: "notice", title: "Notice the choice", titleArabic: "لاحظ الاختيار", purpose: "Compare meaning, form, and an Arabic-speaker risk before using the pattern.", estimatedMinutes: 10 },
  { id: "build", title: "Build a response", titleArabic: "ابنِ استجابة", purpose: "Shape short connected sentences with support and feedback.", estimatedMinutes: 10 },
  { id: "respond", title: "Use it for a purpose", titleArabic: "استخدمها لغرض", purpose: "Speak or write for a real audience, situation, and goal.", estimatedMinutes: 15 },
  { id: "prove", title: "Check and retrieve", titleArabic: "تحقق واسترجع", purpose: "Check contextual understanding and schedule a short review.", estimatedMinutes: 10 },
];

function uniqueVocabulary(items: VocabularyItem[]) {
  return Array.from(new Map(items.map((item) => [item.word.toLocaleLowerCase(), item])).values());
}

function anchorVocabulary(anchor: string, blueprint: ImmersiveLessonBlueprint): VocabularyItem {
  const normalized = anchor.toLocaleLowerCase();
  const existing = seedByWord.get(normalized);
  if (existing) return existing;
  const id = `a2-anchor-${blueprint.lessonNumber}-${normalized.replace(/[^a-z0-9]+/g, "-")}`;
  return {
    id,
    word: anchor,
    arabic: `مفردة أساسية في درس «${blueprint.titleArabic}»`,
    ipa: "",
    phoneticRespelling: anchor,
    partOfSpeech: "useful word or phrase",
    definition: `A key word or phrase for the ${blueprint.title} situation.`,
    exampleEN: `Use “${anchor}” when you ${blueprint.canDo.toLocaleLowerCase().replace(/^i can /, "")}.`,
    exampleAR: `استخدم «${anchor}» عندما تنفذ هدف درس «${blueprint.titleArabic}».`,
  };
}

function vocabularyForBlueprint(blueprint: ImmersiveLessonBlueprint) {
  const anchorWords = blueprint.vocabularyAnchors.map((anchor) => anchorVocabulary(anchor, blueprint));
  const rotationStart = ((blueprint.lessonNumber - 1) * 3) % SEEDED_VOCABULARY.length;
  const rotatedSeeds = Array.from({ length: 4 }, (_, index) => SEEDED_VOCABULARY[(rotationStart + index) % SEEDED_VOCABULARY.length]);
  // A seed intentionally appears again in later lessons for retrieval practice.
  // Persisted vocabulary rows are lesson-owned, however, so every occurrence
  // needs a lesson-scoped key even when its word and definition are shared.
  return uniqueVocabulary([...anchorWords, ...rotatedSeeds]).map((word) => ({
    ...word,
    id: `a2-lesson-${blueprint.lessonNumber}-${word.id}`,
  }));
}

function grammarForBlueprint(blueprint: ImmersiveLessonBlueprint): GrammarTopic {
  const focus = blueprint.grammarFocus;
  return {
    id: `a2-grammar-${blueprint.lessonNumber}`,
    lessonNumber: blueprint.lessonNumber,
    topic: focus,
    arabicName: blueprint.grammarFocusArabic,
    concept: blueprint.beginnerExplanation,
    represents: `Choose ${focus} to make your meaning clear in the ${blueprint.title} situation.`,
    arabicComparison: blueprint.beginnerExplanationArabic,
    useWhen: [
      `the ${blueprint.title} situation matches your purpose`,
      "you need to connect two short ideas clearly instead of translating word by word",
    ],
    doNotUseWhen: ["a shorter A1 pattern already expresses exactly the meaning you need"],
    commonMistakes: [{
      wrong: "Translating the Arabic sentence word by word before checking the English pattern.",
      correct: `Choose the ${focus} pattern, then check the meaning and punctuation.`,
      explanation: "English word order and grammar choices carry meaning. Start from the communicative purpose, not from a literal translation.",
    }],
    structure: {
      positive: `Use ${focus} in a clear affirmative sentence about ${blueprint.title.toLocaleLowerCase()}.`,
      negative: `Make the negative form carefully when ${focus} requires it.`,
      question: `Ask one useful follow-up question using ${focus}.`,
    },
    examples: [{
      en: `In this situation, I can ${blueprint.canDo.replace(/^I can /, "")}.`,
      ar: `في هذا الموقف، ${blueprint.canDoArabic.replace(/^أستطيع /, "أستطيع ")}`,
    }],
    practice: [],
  };
}

const A2_MODULE_1_EXPERIENCES: Record<number, LessonExperience> = {
  1: createLessonExperience({ archetype: "discover", density: "light", archetypeRationale: "Frequency language begins with familiar morning routines.", selectedStages: ["orientation", "encounter", "retrieval", "next-bridge"], firstView: { whatItIs: "A routine-language discovery", whatToDo: "Map one morning and choose one frequency phrase.", whatMatters: "Usually and sometimes change how true a routine is.", whatNext: "Carry one time phrase forward." }, progressiveSupports: ["arabic-help", "worked-example", "word-support"] }),
  2: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A connected note gives reasons and results a clear purpose.", selectedStages: ["encounter", "notice", "supported-practice", "retrieval"], firstView: { whatItIs: "A reason-and-result reading", whatToDo: "Read for the reason, then sort because and so.", whatMatters: "The connector changes the relationship between ideas.", whatNext: "Use one connector with food language." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  3: createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Visual food language gives some and any concrete meaning.", selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A visual food-and-energy lesson", whatToDo: "Explore three cards, then open the kitchen task.", whatMatters: "Some and any depend on the message you make.", whatNext: "Use the words in a weekly routine." }, progressiveSupports: ["arabic-help", "word-support", "worked-example"] }),
  4: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Frequency becomes useful in a supportive interview.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A weekly-routine interview", whatToDo: "Ask one question and give one supported answer.", whatMatters: "How often asks about a pattern, not a single event.", whatNext: "Use frequency to make advice specific." }, progressiveSupports: ["arabic-help", "worked-example", "transcript"] }),
  5: createLessonExperience({ archetype: "speaking", density: "normal", archetypeRationale: "Advice needs a calm spoken model before extended feedback.", selectedStages: ["notice", "supported-practice", "meaningful-use", "evidence"], firstView: { whatItIs: "A gentle-advice rehearsal", whatToDo: "Hear two models, then write for a character.", whatMatters: "Should suggests; it does not command.", whatNext: "Use respectful tone in a pharmacy exchange." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  6: createLessonExperience({ archetype: "real-world", density: "deep", archetypeRationale: "A pharmacy interaction gives polite requests a real listener and purpose.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A practical pharmacy conversation", whatToDo: "Follow the dialogue and choose the softer request.", whatMatters: "Could you helps you sound clear and respectful.", whatNext: "Describe a simple symptom safely." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  7: createLessonExperience({ archetype: "writing", density: "normal", archetypeRationale: "Description language is practised in a privacy-safe fictional message.", selectedStages: ["notice", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A safe description-and-message lesson", whatToDo: "Match descriptions, then write for a fictional person.", whatMatters: "Describe what you notice; do not diagnose.", whatNext: "Place one event on yesterday's timeline." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  8: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "A visual time line makes past forms meaningful.", selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A yesterday time-line lesson", whatToDo: "Order three moments, then retell a calm day.", whatMatters: "Past forms locate an event before now.", whatNext: "Read a fuller week of small changes." }, progressiveSupports: ["arabic-help", "worked-example", "transcript"] }),
  9: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "A connected diary checks sequence, detail, and inference at A2.", selectedStages: ["orientation", "encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A connected weekly diary", whatToDo: "Read once for the main idea, then trace time markers.", whatMatters: "Before, after, and then organise a story.", whatNext: "Use that structure in a paragraph." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  10: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "The learner can now plan, draft, and review a short paragraph.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A guided healthy-choice paragraph", whatToDo: "Plan three linked actions for a character.", whatMatters: "Clear order and one reason guide the reader.", whatNext: "Turn the same ideas into questions." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  11: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "Question helpers are compared through a useful information task.", selectedStages: ["notice", "supported-practice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A practical question workshop", whatToDo: "Sort current and past questions, then choose two.", whatMatters: "The helper shows whether a question is about now or before.", whatNext: "Ask for clarification with confidence." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
  12: createLessonExperience({ archetype: "listening", density: "light", archetypeRationale: "Clarification phrases are short heard-and-repeated tools.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A listening-and-clarifying practice", whatToDo: "Hear an instruction and choose a follow-up.", whatMatters: "Clarifying is active communication, not failure.", whatNext: "Reconnect the module's key choices." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  13: createLessonExperience({ archetype: "review", density: "normal", archetypeRationale: "This lesson retrieves and lets the learner choose a gap to revisit.", selectedStages: ["retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A choice-based health map", whatToDo: "Connect four cards, then select one gap.", whatMatters: "Retrieval makes final writing more independent.", whatNext: "Reopen only the card you chose." }, progressiveSupports: ["arabic-help", "word-support", "tip"] }),
  14: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A practical message joins routines, advice, reasons, and punctuation.", selectedStages: ["orientation", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A practical supportive message", whatToDo: "Write for a fictional reader, then revise for clarity.", whatMatters: "Tone and punctuation help a reader trust you.", whatNext: "Use the connected language in the checkpoint." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  15: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "A checkpoint gathers connected evidence before broader independent-life topics.", selectedStages: ["orientation", "retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A health-and-habits checkpoint", whatToDo: "Complete four short scenario tasks.", whatMatters: "You are connecting ideas, not reciting perfectly.", whatNext: "Carry one strong pattern to the next module." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
};

const A2_MODULE_2_EXPERIENCES: Record<number, LessonExperience> = {
  16: createLessonExperience({ archetype: "notice", density: "light", archetypeRationale: "A focused contrast makes routine and in-progress work language meaningful before more extended practice.", selectedStages: ["orientation", "notice", "retrieval", "next-bridge"], firstView: { whatItIs: "A now-or-usually contrast", whatToDo: "Sort two short sentences, then carry one A1 time phrase forward.", whatMatters: "The verb form tells the reader whether an action is routine or happening now.", whatNext: "Use that contrast when describing a learner's skills." }, progressiveSupports: ["arabic-help", "worked-example", "word-support"] }),
  17: createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Visual skill cards make new learning-and-work words concrete before a low-risk profile-writing task.", selectedStages: ["encounter", "notice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A visual skills lesson", whatToDo: "Explore three cards, then build a fictional learner profile.", whatMatters: "Can and be good at describe different kinds of ability.", whatNext: "Meet those abilities inside a connected workday." }, progressiveSupports: ["arabic-help", "word-support", "worked-example", "external-ai-prompt"] }),
  18: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A short workday diary gives when and while a natural sequence and a reason for close reading.", selectedStages: ["encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A workday diary reading", whatToDo: "Read the sequence, then locate what happened during another action.", whatMatters: "When and while organise connected events differently.", whatNext: "Use the same precision when checking team rules." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  19: createLessonExperience({ archetype: "real-world", density: "normal", archetypeRationale: "Workplace signs and a first-day dialogue make responsibility language useful rather than abstract.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use"], firstView: { whatItIs: "A first-day rules conversation", whatToDo: "Follow a colleague exchange, then choose the strength of each rule.", whatMatters: "Have to, do not have to, and must not communicate different responsibilities.", whatNext: "Turn one responsibility into a practical plan." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  20: createLessonExperience({ archetype: "speaking", density: "light", archetypeRationale: "A small study-plan rehearsal develops future-intention language without asking for an extended personal plan.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A small-plan rehearsal", whatToDo: "Write two fictional intentions, then say one calmly.", whatMatters: "Be going to connects a plan with a specific next time.", whatNext: "Use planning language to offer help." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "transcript"] }),
  21: createLessonExperience({ archetype: "interaction", density: "light", archetypeRationale: "Offering help is best learned through a short exchange where object pronouns matter to the listener.", selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A helpful-colleague exchange", whatToDo: "Follow the link problem, then repeat one clear offer.", whatMatters: "It and you prevent unnecessary repetition in a helpful response.", whatNext: "Give a brief update on a task you have finished." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  22: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "Recent results need a concise present-perfect contrast and a purposeful spoken progress update.", selectedStages: ["notice", "supported-practice", "meaningful-use", "evidence"], firstView: { whatItIs: "A recent-results workshop", whatToDo: "Compare result cards, then give a two-line update.", whatMatters: "Present perfect links a finished action with now.", whatNext: "Read how experience changes a work profile." }, progressiveSupports: ["arabic-help", "worked-example", "extended-rationale"] }),
  23: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A profile gives ever, never, and before a human experience context instead of an isolated exercise.", selectedStages: ["orientation", "encounter", "notice", "evidence"], firstView: { whatItIs: "An experience-profile reading", whatToDo: "Read for earlier experience and identify what has never happened.", whatMatters: "Ever, never, and before describe experience without naming an exact time.", whatNext: "Compare two useful ways to learn." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  24: createLessonExperience({ archetype: "grammar", density: "light", archetypeRationale: "A focused comparison task supports fair choices about learning strategies without an overloaded grammar lecture.", selectedStages: ["notice", "supported-practice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A fair-comparison workshop", whatToDo: "Complete two comparison cards about study choices.", whatMatters: "Comparatives explain why one option fits a purpose.", whatNext: "Ask for feedback on your choice politely." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
  25: createLessonExperience({ archetype: "speaking", density: "light", archetypeRationale: "Feedback requests are short, high-value phrases that benefit from gentle listening-and-speaking rehearsal.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A polite feedback rehearsal", whatToDo: "Repeat two respectful question openings, then select one for a task.", whatMatters: "An indirect question protects both clarity and tone.", whatNext: "Notice how preparation changes a later experience." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  26: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "A second-chance story makes the relationship between an earlier event and current preparation meaningful at A2.", selectedStages: ["orientation", "encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A second-chance story", whatToDo: "Trace the earlier event, then find actions that still matter.", whatMatters: "Past simple tells the earlier event; present perfect connects experience to now.", whatNext: "Use linked reasons and results to solve a practical problem." }, progressiveSupports: ["arabic-help", "transcript", "extended-rationale"] }),
  27: createLessonExperience({ archetype: "real-world", density: "normal", archetypeRationale: "A small work problem creates a natural need for because, so, and but as problem-solving connectors.", selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A calm problem-solving dialogue", whatToDo: "Follow the printer problem and identify its reason, result, and contrast.", whatMatters: "Connectors make a problem and proposed solution easier to understand.", whatNext: "Retrieve the module's strongest learning-and-work patterns." }, progressiveSupports: ["arabic-help", "worked-example", "transcript"] }),
  28: createLessonExperience({ archetype: "review", density: "normal", archetypeRationale: "A compact grid enables intentional retrieval across the module without forcing every skill into another full lesson.", selectedStages: ["retrieval", "supported-practice", "evidence", "next-bridge"], firstView: { whatItIs: "A learning-and-work retrieval grid", whatToDo: "Fill five small boxes, then choose one pattern to revisit.", whatMatters: "Retrieval shows what is ready to use and what needs another look.", whatNext: "Use your chosen patterns in a concise progress report." }, progressiveSupports: ["arabic-help", "word-support", "worked-example"] }),
  29: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A bounded progress report gives the learner a connected, assessable writing purpose with focused editing.", selectedStages: ["orientation", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A three-sentence progress report", whatToDo: "Draft for a fictional learner, then revise capitals, a comma, and the closing.", whatMatters: "A reader needs a clear update, one useful detail, and a next step.", whatNext: "Use the same connected control in the module checkpoint." }, progressiveSupports: ["arabic-help", "worked-example", "external-ai-prompt", "tip"] }),
  30: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "A contextual checkpoint gathers evidence of plans, progress, responsibilities, and solutions before service situations.", selectedStages: ["orientation", "retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A learning-and-work checkpoint", whatToDo: "Complete four short connected prompts, then keep one practical phrase.", whatMatters: "The goal is connected communication, not a perfect recital.", whatNext: "Carry a respectful request into the next module's service situations." }, progressiveSupports: ["arabic-help", "extended-rationale", "word-support"] }),
};

const A2_MODULE_3_EXPERIENCES: Record<number, LessonExperience> = {
  31: createLessonExperience({ archetype: "grammar", density: "light", archetypeRationale: "A short arrangement board makes future present continuous meaningful before the learner has to plan anything extensive.", selectedStages: ["orientation", "notice", "retrieval", "next-bridge"], firstView: { whatItIs: "A future-arrangement board", whatToDo: "Read two arrangements, then add one clear time phrase.", whatMatters: "Present continuous can describe an arrangement that is already organised.", whatNext: "Use station words to make the arrangement more specific." }, progressiveSupports: ["arabic-help", "worked-example", "word-support"] }),
  32: createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Accessible station cards give travel nouns a concrete reference before short detail work.", selectedStages: ["encounter", "notice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A visual station-language lesson", whatToDo: "Explore three cards and complete one ticket detail.", whatMatters: "A journey becomes easier when you can identify place, ticket, and platform.", whatNext: "Use those details in a polite hotel arrival." }, progressiveSupports: ["arabic-help", "word-support", "tip"] }),
  33: createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Hotel check-in creates a natural reason to distinguish can, could, and would.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A polite hotel check-in", whatToDo: "Follow the exchange and notice the respectful request.", whatMatters: "Polite language is clear without being demanding.", whatNext: "Understand a journey problem described in the past." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  34: createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "A delayed-journey update gives past continuous a useful background situation and supports inferential reading.", selectedStages: ["orientation", "encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A delayed-journey update", whatToDo: "Read once for the problem, then find what was happening during it.", whatMatters: "Past continuous sets the scene around a key event.", whatNext: "Ask for a service with a calm connected phrase." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  35: createLessonExperience({ archetype: "speaking", density: "light", archetypeRationale: "Would like is a high-value service phrase best built through a short spoken rehearsal.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "next-bridge"], firstView: { whatItIs: "A polite service rehearsal", whatToDo: "Listen to two requests and say one at a comfortable pace.", whatMatters: "Would like keeps a request friendly and direct.", whatNext: "Give someone a clear route with a landmark." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  36: createLessonExperience({ archetype: "grammar", density: "normal", archetypeRationale: "Route building lets movement prepositions show their meaning through an actual listener journey.", selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A landmark-route workshop", whatToDo: "Complete a short route, then say one complete direction.", whatMatters: "A clear preposition helps another person picture where to go.", whatNext: "Offer an alternative when a route changes." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "transcript"] }),
  37: createLessonExperience({ archetype: "real-world", density: "normal", archetypeRationale: "A changed travel plan is an authentic reason to use if and when for a practical alternative.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use"], firstView: { whatItIs: "A changed-plan conversation", whatToDo: "Follow one delay and select the calm alternative.", whatMatters: "If introduces a possible problem; when introduces the next expected step.", whatNext: "Read a message for the exact details that matter." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  38: createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A concise travel message develops selective reading for real information rather than extended narrative reading.", selectedStages: ["encounter", "notice", "supported-practice", "evidence"], firstView: { whatItIs: "A travel-detail reading", whatToDo: "Scan for place, time, and the action you need to take.", whatMatters: "Travel messages often hide the most important detail in a short line.", whatNext: "Use these details to explain a booking issue." }, progressiveSupports: ["arabic-help", "transcript", "word-support"] }),
  39: createLessonExperience({ archetype: "interaction", density: "deep", archetypeRationale: "A booking problem requires a complete sequence of polite opening, explanation, request, and solution.", selectedStages: ["orientation", "encounter", "notice", "meaningful-use", "evidence"], firstView: { whatItIs: "A booking-problem dialogue", whatToDo: "Follow the problem, then identify the sentence that asks for a solution.", whatMatters: "Clear facts plus a respectful request make service conversations easier.", whatNext: "Compare practical options before choosing one." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  40: createLessonExperience({ archetype: "notice", density: "light", archetypeRationale: "A compact choice table supports comparison language without turning a practical decision into a long lecture.", selectedStages: ["notice", "supported-practice", "meaningful-use", "retrieval"], firstView: { whatItIs: "A travel-choice comparison", whatToDo: "Complete two sentences that compare three options.", whatMatters: "Comparatives explain a difference; a superlative identifies one standout option.", whatNext: "Turn your choice into a useful note for a visitor." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] }),
  41: createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A fictional visitor note brings sequence, direction, reminders, and audience awareness into one bounded task.", selectedStages: ["orientation", "supported-practice", "meaningful-use", "evidence", "next-bridge"], firstView: { whatItIs: "A useful fictional travel note", whatToDo: "Plan a route, draft a short note, then revise for a visitor.", whatMatters: "Order and an explicit reminder let a reader act confidently.", whatNext: "Listen for the details that a traveller should repeat back." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt"] }),
  42: createLessonExperience({ archetype: "listening", density: "light", archetypeRationale: "Confirmation language is deliberately small and oral so the learner can focus on accurate key details.", selectedStages: ["orientation", "encounter", "supported-practice", "meaningful-use"], firstView: { whatItIs: "A detail-confirmation rehearsal", whatToDo: "Hear a travel detail and repeat only date, time, and place.", whatMatters: "Checking key details prevents a practical misunderstanding.", whatNext: "Retrieve the module's strongest travel tools." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  43: createLessonExperience({ archetype: "review", density: "normal", archetypeRationale: "A compact card retrieval lets the learner reconnect requests, conditions, directions, and comparisons without another full task of each type.", selectedStages: ["retrieval", "supported-practice", "evidence", "next-bridge"], firstView: { whatItIs: "A travel-language retrieval set", whatToDo: "Complete four small cards and reopen one uncertain pattern.", whatMatters: "Retrieval shows which phrases are ready for a real service conversation.", whatNext: "Use those cards in one complete conversation." }, progressiveSupports: ["arabic-help", "word-support", "worked-example"] }),
  44: createLessonExperience({ archetype: "integration", density: "normal", archetypeRationale: "A complete service conversation deliberately combines the module's language choices into one manageable interaction.", selectedStages: ["orientation", "encounter", "meaningful-use", "evidence"], firstView: { whatItIs: "A complete service conversation", whatToDo: "Follow the five-part exchange and name its polite solution.", whatMatters: "Opening, explanation, request, and closing each help the listener cooperate.", whatNext: "Show your connected travel language in the checkpoint." }, progressiveSupports: ["arabic-help", "transcript", "worked-example"] }),
  45: createLessonExperience({ archetype: "assessment", density: "deep", archetypeRationale: "Short practical prompts gather evidence of travel planning and service problem-solving without overloading one response.", selectedStages: ["orientation", "retrieval", "evidence", "next-bridge"], firstView: { whatItIs: "A travel-and-services checkpoint", whatToDo: "Respond to four small fictional travel situations.", whatMatters: "The evidence is clear, useful communication across connected tasks.", whatNext: "Carry one confident request into stories and memories." }, progressiveSupports: ["arabic-help", "word-support", "extended-rationale"] }),
};

function lessonFromBlueprint(blueprint: ImmersiveLessonBlueprint, module: ReturnType<typeof getProgressiveImmersiveModules>[number]): LessonDefinition {
  const words = vocabularyForBlueprint(blueprint);
  const generatedLesson = enrichLesson({
    level: "A2",
    lessonNumber: blueprint.lessonNumber,
    moduleNumber: blueprint.moduleNumber,
    title: blueprint.title,
    titleArabic: blueprint.titleArabic,
    words,
    grammar: grammarForBlueprint(blueprint),
    learningPlan: {
      outcome: {
        canDo: blueprint.canDo,
        canDoArabic: blueprint.canDoArabic,
        scenario: module.overview,
        scenarioArabic: module.overviewArabic,
      },
      steps: A2_STEPS,
      retrieval: blueprint.exposurePlan.slice(0, 3).map((exposure) => ({
        sourceLevel: "A1" as const,
        language: exposure.task,
        prompt: `Retrieve one phrase, then use it for the ${blueprint.title} situation.`,
        purpose: exposure.taskArabic,
      })),
      englishFirst: true,
      studio: "A2 Life Lab",
    },
    lexicalNetworks: [{
      id: `a2-network-${blueprint.lessonNumber}`,
      theme: module.title,
      themeArabic: module.titleArabic,
      anchor: blueprint.vocabularyAnchors[0] ?? blueprint.title,
      wordFamilies: [],
      relatedWords: words.slice(0, 6).map((word) => word.word),
      chunks: ["Could you explain that, please?", "I think this is useful because…", "What happened after that?"],
      collocations: blueprint.vocabularyAnchors.slice(0, 3).map((word) => `use ${word} in context`),
      register: "mixed",
      priorLevelLinks: ["A1 greetings", "A1 everyday questions", "A1 basic time and place language"],
      learningNote: blueprint.mentorPurpose,
      learningNoteArabic: blueprint.mentorPurposeArabic,
    }],
    practiceBrief: {
      readingBrief: `Read a connected A2 text about ${module.title.toLocaleLowerCase()}, identify the main purpose, and notice ${blueprint.grammarFocus}.`,
      writingPrompt: `Write 80–100 words for the ${blueprint.title} situation. Show that you can ${blueprint.canDo.replace(/^I can /, "").replace(/\.$/, "")}. Use at least three lesson words naturally, connect your ideas, and revise punctuation before checking your work.`,
    },
    domainFocus: module.overview,
    domainFocusArabic: module.overviewArabic,
    beginnerScaffold: blueprint.beginnerExplanation,
    beginnerScaffoldArabic: blueprint.beginnerExplanationArabic,
    lessonType: blueprint.type,
  });

  const authoredActivities = A2_MODULE_1_AUTHORED_ACTIVITIES[blueprint.lessonNumber]
    ?? A2_MODULE_2_AUTHORED_ACTIVITIES[blueprint.lessonNumber]
    ?? A2_MODULE_3_AUTHORED_ACTIVITIES[blueprint.lessonNumber];
  const experience = A2_MODULE_1_EXPERIENCES[blueprint.lessonNumber]
    ?? A2_MODULE_2_EXPERIENCES[blueprint.lessonNumber]
    ?? A2_MODULE_3_EXPERIENCES[blueprint.lessonNumber];
  return authoredActivities || experience
    ? { ...generatedLesson, activities: authoredActivities ?? generatedLesson.activities, experience: experience ?? generatedLesson.experience }
    : generatedLesson;
}

const A2_MODULES = getProgressiveImmersiveModules("A2");

export const A2_LESSONS: LessonDefinition[] = A2_MODULES.flatMap((module) =>
  module.lessonBlueprints.map((blueprint, index) => lessonFromBlueprint({
    ...blueprint,
    lessonNumber: ((module.moduleNumber - 1) * 15) + index + 1,
  }, module)),
);

export const A2_VOCABULARY = A2_LESSONS.flatMap((lesson) => lesson.words);
export const A2_GRAMMAR = A2_LESSONS.map((lesson) => lesson.grammar);

export const A2_COURSE: CourseDefinition = {
  level: "A2",
  title: "A2: Connected English for everyday independence",
  titleArabic: "A2: إنجليزية مترابطة للاستقلالية اليومية",
  totalLessons: 135,
  lessonsPerModule: 15,
  estimatedMinutes: 135 * 55,
  lessons: A2_LESSONS,
  modules: buildModuleDefinitions("A2", A2_LESSONS),
};

export function getA2Lesson(lessonNumber: number) {
  return A2_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
