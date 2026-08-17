import rawGrammar from "./a1-grammar.json";
import rawVocabulary from "./a1-vocabulary.json";
import { A1_IMMERSIVE_MODULES } from "./a1-immersive-modules";
import { authoredActivitiesForA1Module1 } from "./a1-module-1-authored-activities";
import { authoredActivitiesForA1Module2 } from "./a1-module-2-authored-activities";
import { authoredActivitiesForA1Module3 } from "./a1-module-3-authored-activities";
import { A1_MODULE_4_AUTHORED_ACTIVITIES } from "./a1-module-4-authored-activities";
import { enrichLesson } from "./activity-plan";
import { createLessonExperience } from "./lesson-experience";
import { buildModuleDefinitions } from "./module-definitions";
import type {
  CourseDefinition,
  GrammarTopic,
  ImmersiveLessonBlueprint,
  LessonDefinition,
  LessonStep,
  ProgressiveSupport,
  VocabularyItem,
} from "./types";

export const A1_VOCABULARY = rawVocabulary as VocabularyItem[];
export const A1_GRAMMAR = rawGrammar as GrammarTopic[];

/**
 * The live A1 curriculum is intentionally authored as six fifteen-lesson
 * journeys.  Each journey uses the same word and structure in different
 * modalities rather than treating vocabulary and grammar as isolated lists.
 */
const A1_LESSONS_PER_MODULE = 15;

const moduleGrammarSchedule: number[][] = [
  [0, 5, 0, 2, 3, 0, 11, 13, 19, 5, 6, 0, 3, 19, 0],
  [5, 6, 4, 10, 8, 11, 2, 3, 10, 8, 19, 5, 11, 2, 10],
  [2, 3, 1, 9, 19, 11, 4, 1, 2, 3, 13, 8, 19, 1, 9],
  [1, 14, 9, 11, 19, 1, 7, 14, 9, 19, 15, 16, 17, 1, 19],
  [8, 13, 12, 19, 10, 8, 13, 7, 19, 15, 16, 17, 8, 19, 13],
  [1, 12, 6, 19, 7, 14, 11, 13, 19, 15, 16, 17, 18, 19, 0],
];

const A1_STEPS: LessonStep[] = [
  { id: "start", title: "Start together", titleArabic: "ابدأ معنا", purpose: "Connect today's situation to a familiar word, picture, or phrase.", estimatedMinutes: 4 },
  { id: "explore", title: "Meet the English", titleArabic: "تعرّف إلى الإنجليزية", purpose: "Hear and see a small set of useful words in a clear context.", estimatedMinutes: 8 },
  { id: "notice", title: "Notice the pattern", titleArabic: "لاحظ النمط", purpose: "See how English arranges the words and how the meaning changes.", estimatedMinutes: 7 },
  { id: "build", title: "Build a sentence", titleArabic: "ابنِ جملة", purpose: "Make one short, correct sentence with a model and helpful clues.", estimatedMinutes: 8 },
  { id: "respond", title: "Use it in life", titleArabic: "استخدمها في الحياة", purpose: "Say or write a simple message for a real everyday purpose.", estimatedMinutes: 8 },
  { id: "prove", title: "Check and remember", titleArabic: "تحقق وتذكّر", purpose: "Show what you can do, then bring one useful word back later.", estimatedMinutes: 5 },
];

const EXPERIENCE_STEPS: Record<NonNullable<ReturnType<typeof experienceForBlueprint>>["selectedStages"][number], LessonStep["id"]> = {
  orientation: "start",
  encounter: "explore",
  notice: "notice",
  "supported-practice": "build",
  "meaningful-use": "respond",
  retrieval: "prove",
  evidence: "prove",
  "next-bridge": "respond",
};

function experienceForBlueprint(blueprint: ImmersiveLessonBlueprint, moduleNumber = 1) {
  if (moduleNumber === 2) {
    return experienceForModule2(blueprint.lessonNumber);
  }
  if (moduleNumber === 3) {
    return experienceForModule3(blueprint.lessonNumber);
  }
  if (moduleNumber === 4) {
    return experienceForModule4(blueprint.lessonNumber);
  }
  if (moduleNumber !== 1) return undefined;

  const shared: { progressiveSupports: ProgressiveSupport[] } = {
    progressiveSupports: ["arabic-help", "worked-example", "word-support"],
  };

  switch (blueprint.lessonNumber) {
    case 1:
      return createLessonExperience({
        archetype: "discover",
        density: "normal",
        archetypeRationale: "The learner needs a safe social encounter before a formal language explanation.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "A full grammar explanation would distract from the first communicative success." },
          { stage: "evidence", reason: "A short, supported social response is sufficient first-lesson evidence." },
        ],
        firstView: {
          whatItIs: "Your first English social moment",
          whatToDo: "Listen to a tiny class exchange and choose a greeting.",
          whatMatters: "Use a greeting that fits the moment.",
          whatNext: "Try one short hello-and-goodbye exchange.",
        },
        ...shared,
      });
    case 2:
      return createLessonExperience({
        archetype: "interaction",
        density: "light",
        archetypeRationale: "Turn-taking and meaning are more useful here than a detached possessive-word lecture.",
        selectedStages: ["retrieval", "encounter", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "My and your are noticed within conversation turns." }],
        firstView: {
          whatItIs: "A name exchange",
          whatToDo: "Answer Noor’s question, then ask one back.",
          whatMatters: "Choose my or your for the correct speaker.",
          whatNext: "Use the exchange in a short role-play.",
        },
        ...shared,
      });
    case 3:
      return createLessonExperience({
        archetype: "grammar",
        density: "deep",
        archetypeRationale: "English identity sentences need a careful Arabic-English contrast before learners use them independently.",
        selectedStages: ["orientation", "notice", "supported-practice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The lesson protects depth for a new structural hinge." }],
        firstView: {
          whatItIs: "A small pattern workshop",
          whatToDo: "Compare two identity sentences and build one.",
          whatMatters: "I needs am; you needs are.",
          whatNext: "Use the pattern to describe a person.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "tip"],
      });
    case 4:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "light",
        archetypeRationale: "Image, sound, and a useful caption make people words concrete without overloading the learner.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [{ stage: "orientation", reason: "The picture-and-audio task provides the orientation directly." }],
        firstView: {
          whatItIs: "Picture English: people around you",
          whatToDo: "Hear a word and choose the matching person.",
          whatMatters: "Connect the sound, picture, and English label.",
          whatNext: "Make one simple picture caption.",
        },
        ...shared,
      });
    case 5:
      return createLessonExperience({
        archetype: "integration",
        density: "normal",
        archetypeRationale: "A supported mini-conversation shows the learner that earlier language can work together in one real exchange.",
        selectedStages: ["orientation", "retrieval", "supported-practice", "meaningful-use", "evidence", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "This lesson integrates existing language instead of introducing another grammar rule." }],
        firstView: {
          whatItIs: "Your first complete mini-conversation",
          whatToDo: "Choose a role-play mode and rehearse four lines.",
          whatMatters: "Help the other person understand you, not perfection.",
          whatNext: "Carry this introduction into the numbers lesson.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"],
      });
    case 6:
      return createLessonExperience({
        archetype: "discover",
        density: "light",
        archetypeRationale: "Numbers enter through a useful personal meaning—age—without turning the lesson into an overloaded counting drill.",
        selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "supported-practice", reason: "A small number-card and answer choice already provide enough support for this light discovery lesson." },
          { stage: "evidence", reason: "A private or invented answer is purposeful practice, not a high-stakes performance." },
        ],
        firstView: {
          whatItIs: "Numbers for a real question",
          whatToDo: "Meet a few number words, then practise one age answer.",
          whatMatters: "English uses I am for age.",
          whatNext: "Add one age line to your introduction if you want to.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 7:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Visible classroom objects invite a sound-image-phrase journey, with one concise grammar notice only where it helps the phrase work.",
        selectedStages: ["encounter", "notice", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [
          { stage: "orientation", reason: "The visual gallery immediately explains what the learner will do." },
          { stage: "retrieval", reason: "This focused vocabulary lesson protects space for a new colour-object connection." },
          { stage: "evidence", reason: "One chosen description is enough feedback at this point; assessment comes later in the module." },
        ],
        firstView: {
          whatItIs: "Picture English: colours and classroom things",
          whatToDo: "Listen, choose the matching phrase, then describe one object.",
          whatMatters: "English puts the colour before the object.",
          whatNext: "Use the phrases when you ask for help in class.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 8:
      return createLessonExperience({
        archetype: "interaction",
        density: "deep",
        archetypeRationale: "A learner needs a repair phrase at the moment misunderstanding can happen; the social interaction, not a grammar list, is the lesson’s centre.",
        selectedStages: ["retrieval", "notice", "supported-practice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [
          { stage: "orientation", reason: "The first classroom scenario provides an immediate, concrete orientation." },
          { stage: "next-bridge", reason: "The confidence reflection supplies a natural closure before the reading lesson changes mode." },
        ],
        firstView: {
          whatItIs: "A phrase for when you need help",
          whatToDo: "Hear a classroom direction, then practise asking for a repeat politely.",
          whatMatters: "Not understanding is normal; Can you repeat, please? keeps the conversation moving.",
          whatNext: "Use familiar classroom words inside a short reading.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 9:
      return createLessonExperience({
        archetype: "reading",
        density: "normal",
        archetypeRationale: "A short, highly supported profile lets the learner experience reading for meaning before writing a profile of their own.",
        selectedStages: ["encounter", "notice", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "meaningful-use", reason: "The next lesson deliberately owns the profile-writing task; this lesson protects reading attention." },
          { stage: "evidence", reason: "Guided meaning checks provide sufficient low-stakes evidence for this first reading experience." },
        ],
        firstView: {
          whatItIs: "Your first small English reading card",
          whatToDo: "Read slowly, then find the name, place, and object in the card.",
          whatMatters: "Return to the line that contains the answer; you do not need every word.",
          whatNext: "Keep one useful line ready for your own short profile.",
        },
        progressiveSupports: ["arabic-help", "transcript", "word-support", "worked-example"],
      });
    case 10:
      return createLessonExperience({
        archetype: "writing",
        density: "deep",
        archetypeRationale: "The learner now has enough meaningful language to produce a private or invented profile with focused, beginner-safe writing support.",
        selectedStages: ["retrieval", "notice", "supported-practice", "evidence"],
        intentionallyOmittedStages: [
          { stage: "encounter", reason: "The learner has just met a model profile in the preceding reading lesson." },
          { stage: "meaningful-use", reason: "The supported writing itself is the meaningful use; adding a separate production stage would repeat the task." },
        ],
        firstView: {
          whatItIs: "Your first short English profile",
          whatToDo: "Choose only the details you want, then write three to five supported lines.",
          whatMatters: "A capital I, a full stop, and one clear message are enough for today.",
          whatNext: "Keep one line for a future conversation or improve it after a friendly check.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt", "tip"],
      });
    case 11:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Family language enters through a safe fictional picture story so new words and two useful patterns can be used without demanding personal disclosure.",
        selectedStages: ["encounter", "notice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "supported-practice", reason: "The fictional family card supplies enough immediate contextual support before the learner chooses a personal or fictional line." },
          { stage: "evidence", reason: "An optional, low-pressure profile addition is more appropriate than a graded family disclosure." },
        ],
        firstView: {
          whatItIs: "Family words through a fictional story",
          whatToDo: "Meet three picture words, then choose one short family sentence to use.",
          whatMatters: "I have ... and This is my ... do different useful jobs.",
          whatNext: "Use a fictional line or add an optional detail to your profile.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 12:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "Professions are most useful when learners connect a person, a role, and a short job sentence before a real meeting asks them to choose a relevant detail.",
        selectedStages: ["encounter", "notice", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "meaningful-use", reason: "The next lesson gives job language a more natural communicative role inside a first meeting." },
          { stage: "evidence", reason: "A concise scene choice is sufficient feedback before the interaction lesson." },
        ],
        firstView: {
          whatItIs: "People and their jobs",
          whatToDo: "Match a person to a job, then keep one useful sentence chunk.",
          whatMatters: "A job word works best inside a whole short sentence.",
          whatNext: "Decide whether one job detail belongs in a first meeting.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 13:
      return createLessonExperience({
        archetype: "interaction",
        density: "deep",
        archetypeRationale: "A first meeting asks the learner to choose details and questions responsively, making interaction—not an isolated question-word worksheet—the right dominant experience.",
        selectedStages: ["retrieval", "notice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [
          { stage: "encounter", reason: "The first-meeting decision task provides immediate context and retrieves only language the learner needs." },
          { stage: "supported-practice", reason: "The conversation includes in-the-moment choices and transcript support rather than a separate mechanical drill." },
        ],
        firstView: {
          whatItIs: "A first meeting with real choices",
          whatToDo: "Choose a useful question, listen to the answer, then add one relevant detail.",
          whatMatters: "Good conversation responds to what a person has already said.",
          whatNext: "Hear the same meeting as a smooth, short conversation.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 14:
      return createLessonExperience({
        archetype: "speaking",
        density: "normal",
        archetypeRationale: "After several supported encounters, the learner benefits from choosing an introduction length they can say clearly rather than producing a longer scripted performance.",
        selectedStages: ["encounter", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "The model transcript and pronunciation hints support speaking directly; a separate language analysis would dilute rehearsal time." },
          { stage: "evidence", reason: "A self-chosen clarity target is safer and more useful than an accent-scored speaking test." },
        ],
        firstView: {
          whatItIs: "A version you can say clearly",
          whatToDo: "Listen once, choose a short, medium, or full introduction, then rehearse it calmly.",
          whatMatters: "Being understood is more important than sounding like someone else.",
          whatNext: "Use one clear version in the module check if you are ready.",
        },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 15:
      return createLessonExperience({
        archetype: "assessment",
        density: "deep",
        archetypeRationale: "A supportive module assessment can gather reading, writing, and speaking evidence while letting the learner choose one precise next review target.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use", "evidence", "next-bridge"],
        intentionallyOmittedStages: [
          { stage: "notice", reason: "The assessment checks application of previously noticed language rather than adding a new explanation." },
          { stage: "retrieval", reason: "The final review decision identifies an intentional next target instead of forcing an extra recall task." },
        ],
        firstView: {
          whatItIs: "Module 1: show what you can use",
          whatToDo: "Read a short profile, make your own, say a small introduction, then choose one review target.",
          whatMatters: "The check looks for usable messages and a helpful next step—not perfect recall or accent.",
          whatNext: "Carry the one target you chose into the next module.",
        },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "external-ai-prompt", "tip"],
      });
    default:
      return undefined;
  }
}

function experienceForModule2(localLessonNumber: number) {
  const shared: { progressiveSupports: ProgressiveSupport[] } = {
    progressiveSupports: ["arabic-help", "worked-example", "word-support"],
  };

  switch (localLessonNumber) {
    case 1:
      return createLessonExperience({
        archetype: "discover",
        density: "normal",
        archetypeRationale: "A family picture makes new people words meaningful while protecting the learner’s privacy.",
        selectedStages: ["encounter", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "Recognition and one safe sentence are the appropriate first evidence for this new family vocabulary." }],
        firstView: { whatItIs: "A family picture, not a personal questionnaire", whatToDo: "Meet four people, point, and use one sentence frame.", whatMatters: "You can always use the practice family instead of your own.", whatNext: "Use one person in a short picture conversation." },
        ...shared,
      });
    case 2:
      return createLessonExperience({
        archetype: "interaction",
        density: "light",
        archetypeRationale: "Family vocabulary becomes useful when the learner can take a small conversational turn.",
        selectedStages: ["retrieval", "encounter", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "This is a communication lesson; the sentence frame can remain implicit." }],
        firstView: { whatItIs: "A two-turn family picture conversation", whatToDo: "Ask Who is this? and give one answer.", whatMatters: "Use the picture or a fictional person if you prefer.", whatNext: "Notice how have and has add information about people." },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"],
      });
    case 3:
      return createLessonExperience({
        archetype: "grammar",
        density: "normal",
        archetypeRationale: "The learner now needs one small form contrast to describe familiar people and possessions.",
        selectedStages: ["notice", "supported-practice", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [{ stage: "encounter", reason: "The family vocabulary is already established and returns naturally in the grammar examples." }],
        firstView: { whatItIs: "A small have / has pattern", whatToDo: "Match the person to have or has, then write two fictional lines.", whatMatters: "Notice who the sentence is about before choosing the word.", whatNext: "Use the same ideas to explore rooms at home." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt", "tip"],
      });
    case 4:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "A linked home scene supports meaningful room vocabulary without a long disconnected list.",
        selectedStages: ["encounter", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "Pointing, hearing, and one room choice are enough before the location-question lesson." }],
        firstView: { whatItIs: "A small home you can walk through", whatToDo: "Find four room words, hear two tour lines, and choose a room for a purpose.", whatMatters: "Room is the general word; kitchen and bedroom are specific places.", whatNext: "Ask where an object is in one of these rooms." },
        progressiveSupports: ["arabic-help", "transcript", "word-support", "tip"],
      });
    case 5:
      return createLessonExperience({
        archetype: "interaction",
        density: "normal",
        archetypeRationale: "A location question turns new home vocabulary into an immediately useful exchange.",
        selectedStages: ["encounter", "notice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The lesson’s final room mission already requires a natural recall-and-use moment." }],
        firstView: { whatItIs: "Find an object in a room", whatToDo: "Ask Where is the book? and give one location answer.", whatMatters: "Say the whole useful answer, not only the word on.", whatNext: "Use room words with furniture and belongings." },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 6:
      return createLessonExperience({
        archetype: "vocabulary",
        density: "normal",
        archetypeRationale: "A single furniture scene lets new words join the existing location language without becoming a disconnected list.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "Two meaningful placement choices provide sufficient light evidence while the vocabulary is new." }],
        firstView: { whatItIs: "A room with useful furniture and belongings", whatToDo: "Find four things, make one caption, then place a book or bag.", whatMatters: "Use earlier on only when the picture gives it a real job.", whatNext: "Describe what exists in a room with there is." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 7:
      return createLessonExperience({
        archetype: "grammar",
        density: "normal",
        archetypeRationale: "There is is introduced as one useful meaning chunk inside a familiar room rather than as an abstract rule.",
        selectedStages: ["notice", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The lesson stays deliberately focused on one new construction before a later home-tour reuse." }],
        firstView: { whatItIs: "One small pattern for saying something is present", whatToDo: "Notice there is, choose it from a room picture, and write two fictional lines.", whatMatters: "Use there is for one thing today; accuracy matters more than a long description.", whatNext: "Hear the pattern inside a guided home tour." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt", "extended-rationale"],
      });
    case 8:
      return createLessonExperience({
        archetype: "speaking",
        density: "light",
        archetypeRationale: "A short home tour builds spoken confidence through a small, optional picture-led performance rather than a heavy grammar task.",
        selectedStages: ["retrieval", "encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "A two-line low-pressure tour is practice, not a scored speaking performance." }],
        firstView: { whatItIs: "A two-room home tour", whatToDo: "Hear three short lines, then guide a visitor through a practice picture.", whatMatters: "A fictional house, a diagram, or quiet rehearsal all count.", whatNext: "Read a short home description with the same familiar anchors." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 9:
      return createLessonExperience({
        archetype: "reading",
        density: "normal",
        archetypeRationale: "The learner can now read a compact meaningful description using names, room words, and familiar patterns as anchors.",
        selectedStages: ["encounter", "supported-practice", "evidence"],
        intentionallyOmittedStages: [{ stage: "meaningful-use", reason: "This lesson protects reading attention; its evidence comes from returning to the text." }],
        firstView: { whatItIs: "A short text about a small home", whatToDo: "Read once for anchors, answer three checks, and find the proving sentence.", whatMatters: "You do not have to translate every word to understand the main details.", whatNext: "Meet home animals through a visual scene and a short dialogue." },
        progressiveSupports: ["arabic-help", "transcript", "word-support", "worked-example", "tip"],
      });
    case 10:
      return createLessonExperience({
        archetype: "real-world",
        density: "light",
        archetypeRationale: "Animal vocabulary becomes a calm contextual interaction while personal pet ownership remains entirely optional.",
        selectedStages: ["encounter", "meaningful-use", "retrieval"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "Has returns naturally in the dialogue but is not treated as a second grammar lesson." }],
        firstView: { whatItIs: "Four animals near a home", whatToDo: "Meet the words, name one animal in a fictional picture, and recall one natural home sentence.", whatMatters: "Use the practice scene; you never need to discuss your own home or pets.", whatNext: "Move into the module’s next carefully chosen topic with the home language secure." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 11:
      return createLessonExperience({
        archetype: "writing",
        density: "deep",
        archetypeRationale: "A slow, fictional room description lets the learner turn the module’s useful language into connected writing without personal disclosure pressure.",
        selectedStages: ["retrieval", "supported-practice", "meaningful-use", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "A supportive self-check is more appropriate than a scored product at this early writing stage." }],
        firstView: { whatItIs: "A small fictional room-writing task", whatToDo: "Choose a room, use three model lines, then check one thing at a time.", whatMatters: "A fictional room is enough; clear sentences matter more than personal detail.", whatNext: "Turn a picture into a true sentence during a short review." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "external-ai-prompt", "tip"],
      });
    case 12:
      return createLessonExperience({
        archetype: "review",
        density: "light",
        archetypeRationale: "A picture-to-sentence review deliberately uses what the learner already knows rather than adding a new topic.",
        selectedStages: ["encounter", "supported-practice", "evidence"],
        intentionallyOmittedStages: [{ stage: "meaningful-use", reason: "The lesson protects a short, retrieval-led review experience before the family visit interaction." }],
        firstView: { whatItIs: "A picture-to-sentence review", whatToDo: "Spot the clues, build one true sentence, and choose meaning from context.", whatMatters: "Read the whole option; the goal is meaning, not catching a strange misspelling.", whatNext: "Use familiar greetings and family words in a fictional visit." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support"],
      });
    case 13:
      return createLessonExperience({
        archetype: "interaction",
        density: "normal",
        archetypeRationale: "A fictional family visit gives greeting and introduction language a realistic social purpose while keeping privacy choices explicit.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The existing greeting and family language is embedded naturally in the interaction itself." }],
        firstView: { whatItIs: "A short family-visit exchange", whatToDo: "Follow the greeting, choose a friendly reply, then rehearse two lines your way.", whatMatters: "Use the fictional family card; speech, quiet rehearsal, and writing all count.", whatNext: "Listen for key details and describe a new room picture." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 14:
      return createLessonExperience({
        archetype: "listening",
        density: "normal",
        archetypeRationale: "A compact listen-and-describe experience builds listening confidence from language the learner can already recognise in print.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The listened-for details are immediately reused in a new picture rather than tested out of context." }],
        firstView: { whatItIs: "A short room description to hear and reuse", whatToDo: "Listen for two details, choose them, then describe one new picture.", whatMatters: "Use the transcript only after a first try if you need it.", whatNext: "Show what you can do in a kind family-and-home checkpoint." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "external-ai-prompt"],
      });
    case 15:
      return createLessonExperience({
        archetype: "assessment",
        density: "normal",
        archetypeRationale: "The module closes with small contextual evidence and a clear review choice, not a single intimidating high-stakes test.",
        selectedStages: ["retrieval", "evidence", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "encounter", reason: "The checkpoint deliberately introduces no new content." }],
        firstView: { whatItIs: "A supportive family-and-home checkpoint", whatToDo: "Complete four small context tasks, then choose one useful next review.", whatMatters: "A result shows what to practise next; it is not a judgement of your ability.", whatNext: "Carry the useful people-and-place language into the next module." },
        progressiveSupports: ["worked-example", "word-support", "tip"],
      });
    default:
      return undefined;
  }
}

function experienceForModule3(localLessonNumber: number) {
  const shared: { progressiveSupports: ProgressiveSupport[] } = {
    progressiveSupports: ["arabic-help", "worked-example", "word-support"],
  };

  switch (localLessonNumber) {
    case 1:
      return createLessonExperience({
        archetype: "vocabulary", density: "normal",
        archetypeRationale: "A small picture basket makes first food words concrete before learners need to make a preference sentence.",
        selectedStages: ["encounter", "supported-practice", "retrieval"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "Grammar would distract from the sound-picture-meaning connection." }],
        firstView: { whatItIs: "A small basket of food words", whatToDo: "Hear four words, choose one basket item, then name one before looking again.", whatMatters: "Connect the English sound, image, and useful meaning.", whatNext: "Use a food word to say what you like." },
        ...shared,
      });
    case 2:
      return createLessonExperience({
        archetype: "notice", density: "normal",
        archetypeRationale: "Like and do not like work best when learners see contrasting choices in a friendly café scene.",
        selectedStages: ["notice", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "The short contrast lesson reserves final attention for one clear preference." }],
        firstView: { whatItIs: "Two useful ways to share a preference", whatToDo: "Compare two café cards, then rehearse one preference line.", whatMatters: "Like and do not like can both be calm, useful answers.", whatNext: "Meet more meal words in a breakfast scene." },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 3:
      return createLessonExperience({
        archetype: "discover", density: "light",
        archetypeRationale: "A breakfast table lets learners sort food and drink through meaning before more language work.",
        selectedStages: ["encounter", "meaningful-use", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "This lexical discovery deliberately carries only two words into the reading lesson." }],
        firstView: { whatItIs: "A breakfast table to explore", whatToDo: "Sort food and drinks, then say one simple breakfast line.", whatMatters: "You need only a few words for today’s small scene.", whatNext: "Look for two of your words in a breakfast reading." },
        ...shared,
      });
    case 4:
      return createLessonExperience({
        archetype: "reading", density: "normal",
        archetypeRationale: "A short breakfast card gives new readers a clear purpose: find a person’s food choice in familiar text.",
        selectedStages: ["encounter", "supported-practice", "evidence"],
        intentionallyOmittedStages: [{ stage: "meaningful-use", reason: "The next lesson owns the production demand; this one protects attention for reading evidence." }],
        firstView: { whatItIs: "A short breakfast reading card", whatToDo: "Read slowly, find what each person has, then return to the answer line.", whatMatters: "Reading is finding meaning in the text, not knowing every word first.", whatNext: "Notice a practical quantity difference through food." },
        progressiveSupports: ["arabic-help", "word-support", "worked-example", "tip"],
      });
    case 5:
      return createLessonExperience({
        archetype: "grammar", density: "deep",
        archetypeRationale: "Countable pieces and shared amounts need a slow, visual market explanation before learners request them naturally.",
        selectedStages: ["orientation", "notice", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "New quantity language deserves patient supported use before recall." }],
        firstView: { whatItIs: "A market idea about pieces and amounts", whatToDo: "Compare eggs with rice, build a basket, then say one request.", whatMatters: "Count visible pieces; use some for an amount such as rice or water.", whatNext: "Use the idea in a friendly market exchange." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 6:
      return createLessonExperience({
        archetype: "interaction", density: "normal",
        archetypeRationale: "A seller and customer exchange gives quantities a real communicative job without demanding a long memorised script.",
        selectedStages: ["encounter", "supported-practice", "evidence"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "Can I have is practised as a useful whole request, not an abstract formula." }],
        firstView: { whatItIs: "Your first short practice-market exchange", whatToDo: "Follow the greeting, build one polite request, then choose the line that fits.", whatMatters: "Can I have ... please? is a friendly way to ask.", whatNext: "Listen for prices and use a simple price question." },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 7:
      return createLessonExperience({
        archetype: "listening", density: "light",
        archetypeRationale: "A compact price-listening task builds confidence with a repeatable question before vocabulary grows again.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "The outcome is a small rehearsal, not a scored listening performance." }],
        firstView: { whatItIs: "A question for a market price", whatToDo: "Listen to one price, pair it with a question, then ask about one item.", whatMatters: "How much is it? is one useful listening-and-speaking chunk.", whatNext: "Open a new vegetable crate using the same market confidence." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "tip"],
      });
    case 8:
      return createLessonExperience({
        archetype: "vocabulary", density: "normal",
        archetypeRationale: "Vegetables arrive through colour and shape clues, anchoring labels in a visible market scene.",
        selectedStages: ["encounter", "supported-practice", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "meaningful-use", reason: "The shopping-list reading gives vegetables a more natural use than an extra isolated sentence." }],
        firstView: { whatItIs: "A vegetable crate with picture clues", whatToDo: "Hear four labels, use colour clues, and keep two words for the next list.", whatMatters: "Use the picture to help the word stay in your memory.", whatNext: "Find two vegetables inside a real-world shopping list." },
        ...shared,
      });
    case 9:
      return createLessonExperience({
        archetype: "reading", density: "normal",
        archetypeRationale: "A shopping list is bounded real-world text that rewards scanning quantities and needs.",
        selectedStages: ["encounter", "supported-practice", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "evidence", reason: "Low-stakes detail checks prepare learners for tomorrow’s contextual meaning check." }],
        firstView: { whatItIs: "A short real-world shopping list", whatToDo: "Read for what is needed, ticking an item only when the whole text supports it.", whatMatters: "A familiar word may still be absent from the list—check the line.", whatNext: "Use the list’s eggs and rice to choose meaning in a compact check." },
        progressiveSupports: ["arabic-help", "word-support", "worked-example", "tip"],
      });
    case 10:
      return createLessonExperience({
        archetype: "assessment", density: "light",
        archetypeRationale: "Three contextual choices give useful feedback about food quantities without making a mid-module check a barrier.",
        selectedStages: ["notice", "evidence", "retrieval"],
        intentionallyOmittedStages: [{ stage: "meaningful-use", reason: "The next lesson deliberately owns connected written production." }],
        firstView: { whatItIs: "A short food-meaning check", whatToDo: "Complete three useful choices, then select one review target.", whatMatters: "Choose from the food situation—not from a spelling trick.", whatNext: "Use familiar food language to write a tiny meal card." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 11:
      return createLessonExperience({
        archetype: "writing", density: "deep",
        archetypeRationale: "A fictional or real meal card permits connected beginner writing with an achievable scope.",
        selectedStages: ["retrieval", "supported-practice", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "encounter", reason: "The module has already supplied concise meal and preference models." }],
        firstView: { whatItIs: "A tiny meal-writing task", whatToDo: "Choose three words, write two or three lines, and check one sentence at a time.", whatMatters: "A fictional meal is welcome; a capital I and a clear full stop are enough.", whatNext: "Use food language in a flexible market role-play." },
        progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"],
      });
    case 12:
      return createLessonExperience({
        archetype: "real-world", density: "deep",
        archetypeRationale: "A choose-your-mission market role-play lets learners decide which familiar language matters, avoiding one fixed dialogue.",
        selectedStages: ["orientation", "meaningful-use", "evidence"],
        intentionallyOmittedStages: [{ stage: "notice", reason: "The role-play reuses language already explained elsewhere and centres responsive communication." }],
        firstView: { whatItIs: "A choose-your-own market role-play", whatToDo: "Select a mission, take a role, and use a repair line if needed.", whatMatters: "Choose a meaningful line for your mission; you do not need every line.", whatNext: "Listen for food-and-quantity language without seeing the basket first." },
        progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support", "tip"],
      });
    case 13:
      return createLessonExperience({
        archetype: "listening", density: "normal",
        archetypeRationale: "A listen-first basket task moves attention from visible labels to catching one item and quantity in speech.",
        selectedStages: ["encounter", "supported-practice", "meaningful-use"],
        intentionallyOmittedStages: [{ stage: "retrieval", reason: "Heard details are immediately reused as a helpful market response." }],
        firstView: { whatItIs: "A market basket to hear first", whatToDo: "Listen once, choose the basket, then give the next helpful response.", whatMatters: "Listen for one item and one quantity; use the transcript after your first try.", whatNext: "Collect useful paths in a short review." },
        progressiveSupports: ["arabic-help", "transcript", "worked-example", "word-support", "tip"],
      });
    case 14:
      return createLessonExperience({
        archetype: "review", density: "light",
        archetypeRationale: "A selective tray review asks learners for language that serves a preference or market path, not every word in a dense list.",
        selectedStages: ["retrieval", "supported-practice", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "encounter", reason: "This deliberately introduces no additional food words before the checkpoint." }],
        firstView: { whatItIs: "A selective food-and-market review", whatToDo: "Name useful chunks, follow two meaning paths, then choose one checkpoint helper.", whatMatters: "Choose language that serves the situation; you do not need every module word.", whatNext: "Show what you can use in a calm contextual checkpoint." },
        progressiveSupports: ["worked-example", "word-support", "tip"],
      });
    case 15:
      return createLessonExperience({
        archetype: "assessment", density: "normal",
        archetypeRationale: "A modular checkpoint checks usable food and market language while ending with a learner-selected next step.",
        selectedStages: ["retrieval", "evidence", "next-bridge"],
        intentionallyOmittedStages: [{ stage: "encounter", reason: "The checkpoint adds no new language; it makes visible what the learner can use." }],
        firstView: { whatItIs: "A supportive food-and-market checkpoint", whatToDo: "Complete four small contextual tasks, then select one useful next review.", whatMatters: "The result points to practice; it is not a judgement of your ability.", whatNext: "Carry one confident routine into the next daily-life module." },
        progressiveSupports: ["worked-example", "word-support", "transcript", "tip"],
      });
    default:
      return undefined;
  }
}

function experienceForModule4(localLessonNumber: number) {
  const shared: { progressiveSupports: ProgressiveSupport[] } = {
    progressiveSupports: ["arabic-help", "worked-example", "word-support"],
  };

  switch (localLessonNumber) {
    case 1:
      return createLessonExperience({ archetype: "vocabulary", density: "normal", archetypeRationale: "Time-of-day words become concrete through light and place clues before learners build a full daily routine.", selectedStages: ["encounter", "supported-practice", "retrieval"], intentionallyOmittedStages: [{ stage: "notice", reason: "Grammar would distract from the first sound-picture-meaning connection." }], firstView: { whatItIs: "Four parts of one day", whatToDo: "Match the light clue, hear the word, then say one small time sentence.", whatMatters: "A time word helps a listener place an action in your day.", whatNext: "Put two actions into a calm morning sequence." }, ...shared });
    case 2:
      return createLessonExperience({ archetype: "discover", density: "normal", archetypeRationale: "A ready-made morning sequence lets beginners feel what a routine is before attending to a language pattern.", selectedStages: ["orientation", "notice", "meaningful-use"], intentionallyOmittedStages: [{ stage: "evidence", reason: "A first-person pattern needs patient use, not an early score." }], firstView: { whatItIs: "A small morning story to build", whatToDo: "Order three actions, notice the I + verb pattern, then make two gentle lines.", whatMatters: "A routine is a sequence; each short English line tells one step.", whatNext: "Meet more action words through sound and picture." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"] });
    case 3:
      return createLessonExperience({ archetype: "vocabulary", density: "light", archetypeRationale: "Four action pictures create a compact sound-and-meaning lesson with a natural routine chain as its only use demand.", selectedStages: ["encounter", "supported-practice"], intentionallyOmittedStages: [{ stage: "retrieval", reason: "The following contrast lesson reuses the actions immediately with another person." }], firstView: { whatItIs: "Four actions that move a day forward", whatToDo: "Hear each action, find its picture, then add one action to a short chain.", whatMatters: "Learn useful phrases as whole actions, not isolated translations.", whatNext: "See what changes when the routine belongs to he or she." }, ...shared });
    case 4:
      return createLessonExperience({ archetype: "grammar", density: "deep", archetypeRationale: "A two-person contrast makes the small he/she verb change visible and speakable without overloading a new learner.", selectedStages: ["notice", "supported-practice", "meaningful-use"], intentionallyOmittedStages: [{ stage: "retrieval", reason: "The learner benefits more from a clear visual contrast before recall is expected." }], firstView: { whatItIs: "One small verb change for another person", whatToDo: "Compare I with he or she, give each person a routine, then say the pair aloud.", whatMatters: "He and she usually need a small ending on the action word here.", whatNext: "Use familiar actions with a clock time." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"] });
    case 5:
      return createLessonExperience({ archetype: "interaction", density: "normal", archetypeRationale: "Clock matching and a short exchange introduce time as a practical conversation rather than a list of numbers.", selectedStages: ["encounter", "supported-practice"], intentionallyOmittedStages: [{ stage: "evidence", reason: "The goal is a low-pressure rehearsal with o'clock times, not a time-telling test." }], firstView: { whatItIs: "A clock and one useful question", whatToDo: "Match two clocks, then practise asking and answering about one time.", whatMatters: "Use at before a clock time when an action happens then.", whatNext: "Find these actions and times in a short school-day reading." }, progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"] });
    case 6:
      return createLessonExperience({ archetype: "reading", density: "normal", archetypeRationale: "A one-person school-day postcard makes new routine language readable with familiar time and action anchors.", selectedStages: ["meaningful-use", "supported-practice"], intentionallyOmittedStages: [{ stage: "notice", reason: "The reading task preserves attention for finding a few useful details." }], firstView: { whatItIs: "A short school-day postcard", whatToDo: "Read slowly, locate two actions and their times, then echo one useful sentence.", whatMatters: "You can understand a text by finding the words you know first.", whatNext: "Choose how often a routine action happens." }, progressiveSupports: ["arabic-help", "word-support", "transcript", "tip"] });
    case 7:
      return createLessonExperience({ archetype: "notice", density: "normal", archetypeRationale: "A simple frequency line conveys always, sometimes, and never as meaning choices before learners write their own examples.", selectedStages: ["notice", "meaningful-use", "retrieval"], intentionallyOmittedStages: [{ stage: "evidence", reason: "Frequency language is first used as an expressive choice, not a scored rule." }], firstView: { whatItIs: "Three words that change how often", whatToDo: "Place the words on a frequency line, then complete two routine cards.", whatMatters: "Always, sometimes, and never tell a listener how often something happens.", whatNext: "Use a short question to ask about a routine." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"] });
    case 8:
      return createLessonExperience({ archetype: "speaking", density: "normal", archetypeRationale: "A fictional routine interview creates a safe purpose for do questions and short answers without requiring personal disclosure.", selectedStages: ["supported-practice", "meaningful-use"], intentionallyOmittedStages: [{ stage: "encounter", reason: "The lesson begins with the ready-to-say exchange rather than more vocabulary introduction." }], firstView: { whatItIs: "A short routine interview", whatToDo: "Listen to the model, take one speaking turn, then choose the question that fits an answer.", whatMatters: "Do starts a question with I or you; Yes, I do and No, I do not are useful replies.", whatNext: "Compare two daily lives in a reading." }, progressiveSupports: ["arabic-help", "worked-example", "transcript", "tip"] });
    case 9:
      return createLessonExperience({ archetype: "reading", density: "deep", archetypeRationale: "Two contrasting daily lives give the learner a reason to read for a difference and reuse but naturally.", selectedStages: ["meaningful-use", "supported-practice"], intentionallyOmittedStages: [{ stage: "retrieval", reason: "The comparison task already calls for focused meaning use from the text." }], firstView: { whatItIs: "Two people, two daily lives", whatToDo: "Read both short profiles, find one difference, then choose a comparison line.", whatMatters: "Read for what changes between people, not every word all at once.", whatNext: "Check routine choices in real situations." }, progressiveSupports: ["arabic-help", "word-support", "worked-example", "tip"] });
    case 10:
      return createLessonExperience({ archetype: "assessment", density: "light", archetypeRationale: "A compact context check gives feedback on routine meaning and a single repair task without interrupting the growing day story.", selectedStages: ["evidence", "retrieval"], intentionallyOmittedStages: [{ stage: "encounter", reason: "This is an evidence lesson; it deliberately introduces no further language." }], firstView: { whatItIs: "A short routine-in-context check", whatToDo: "Choose the line that fits each clue, then repair one small line with a model.", whatMatters: "The context helps you choose; this is not a spelling-trick test.", whatNext: "Write a gentle weekday postcard." }, progressiveSupports: ["arabic-help", "worked-example", "tip"] });
    case 11:
      return createLessonExperience({ archetype: "writing", density: "deep", archetypeRationale: "A short weekday postcard supports connected beginner writing while giving learners the privacy of an invented person or typical day.", selectedStages: ["orientation", "meaningful-use"], intentionallyOmittedStages: [{ stage: "evidence", reason: "The value is in drafting with support; any self-check remains learner-paced." }], firstView: { whatItIs: "A four-line weekday postcard", whatToDo: "Choose a person or typical day, borrow the structure, then change two details.", whatMatters: "Four clear, short sentences can tell a whole weekday story.", whatNext: "Use time words to plan a simple tomorrow." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"] });
    case 12:
      return createLessonExperience({ archetype: "real-world", density: "normal", archetypeRationale: "A small plan board gives at and on a practical job in a message that another person could understand.", selectedStages: ["meaningful-use", "supported-practice"], intentionallyOmittedStages: [{ stage: "notice", reason: "The necessary prepositions are learned through purposeful cards, not isolated explanation." }], firstView: { whatItIs: "A tiny plan for tomorrow", whatToDo: "Combine a day, time, and action card, then write one planning message.", whatMatters: "Use on with a day and at with a clock time.", whatNext: "Listen to the rhythm of a connected routine." }, ...shared });
    case 13:
      return createLessonExperience({ archetype: "listening", density: "normal", archetypeRationale: "Rhythmic repetition shifts routine language from visible text to short connected phrases learners can hear and say.", selectedStages: ["encounter", "supported-practice"], intentionallyOmittedStages: [{ stage: "evidence", reason: "The learner’s outcome is a supported listening-and-speaking rehearsal, not a score." }], firstView: { whatItIs: "A routine to hear in short chunks", whatToDo: "Listen, repeat with a natural pause, then choose the next action after one heard line.", whatMatters: "Listen for a useful chunk; the transcript appears after your first try.", whatNext: "Collect the module’s most useful routine tools." }, progressiveSupports: ["arabic-help", "transcript", "worked-example", "tip"] });
    case 14:
      return createLessonExperience({ archetype: "review", density: "light", archetypeRationale: "A selective tool board invites retrieval of language that helps a learner describe or ask about a daily routine.", selectedStages: ["retrieval", "meaningful-use"], intentionallyOmittedStages: [{ stage: "encounter", reason: "This review deliberately adds no new words before the checkpoint." }], firstView: { whatItIs: "Four useful routine tools to collect", whatToDo: "Choose a time, action, frequency word, and question; then repair a tiny dialogue.", whatMatters: "Keep language that helps your own routine story; you do not need every word.", whatNext: "Show what you can use in a supportive daily-life checkpoint." }, progressiveSupports: ["worked-example", "word-support", "transcript", "tip"] });
    case 15:
      return createLessonExperience({ archetype: "assessment", density: "normal", archetypeRationale: "A varied daily-life checkpoint checks usable time, routine, person, reading, and planning language before the course moves outside the home.", selectedStages: ["evidence", "next-bridge"], intentionallyOmittedStages: [{ stage: "encounter", reason: "The checkpoint adds no new content; it makes learners’ usable language visible." }], firstView: { whatItIs: "A supportive daily-life checkpoint", whatToDo: "Complete four small contextual tasks, then take one routine line into the town module.", whatMatters: "The result shows a next practice step, not a judgement of your ability.", whatNext: "Use familiar routine language as you begin moving around town." }, progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"] });
    default:
      return undefined;
  }
}

function stepsForBlueprint(blueprint: ImmersiveLessonBlueprint, moduleNumber: number) {
  const experience = experienceForBlueprint(blueprint, moduleNumber);
  if (!experience) return A1_STEPS;

  const selectedIds = new Set(experience.selectedStages.map((stage) => EXPERIENCE_STEPS[stage]));
  return A1_STEPS.filter((step) => selectedIds.has(step.id));
}

const vocabularyByWord = new Map(A1_VOCABULARY.map((item) => [item.word.toLocaleLowerCase(), item]));

function uniqueVocabulary(items: VocabularyItem[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function fallbackVocabulary(word: string, moduleTitle: string): VocabularyItem {
  const id = `a1-immersive-${word.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return {
    id,
    word,
    arabic: "كلمة أو عبارة أساسية لهذا الدرس",
    ipa: "",
    phoneticRespelling: word,
    partOfSpeech: "useful word or phrase",
    definition: `A useful English word or phrase in the ${moduleTitle} learning journey.`,
    exampleEN: `Use “${word}” in the guided conversation for this lesson.`,
    exampleAR: `استخدم «${word}» في المحادثة الموجّهة لهذا الدرس.`,
  };
}

function vocabularyForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  moduleVocabulary: VocabularyItem[],
  moduleTitle: string,
  activeLessonNumber: number,
) {
  const localLesson = ((blueprint.lessonNumber - 1) % A1_LESSONS_PER_MODULE) + 1;
  const rotatingModuleSet = moduleVocabulary.slice((localLesson - 1) * 5, localLesson * 5);
  const anchors = blueprint.vocabularyAnchors.map(
    (word) => vocabularyByWord.get(word.toLocaleLowerCase()) ?? fallbackVocabulary(word, moduleTitle),
  );
  // A word can return in later activities for retrieval practice.  The managed
  // catalog uses a globally unique item key, so each lesson occurrence needs
  // its own persistence identity even when the learner-facing word is shared.
  return uniqueVocabulary([...anchors, ...rotatingModuleSet]).map((word) => ({
    ...word,
    id: `a1-lesson-${activeLessonNumber}-${word.id}`,
  }));
}

function grammarForBlueprint(moduleIndex: number, localLesson: number, activeLessonNumber: number) {
  const grammarIndex = moduleGrammarSchedule[moduleIndex][localLesson - 1];
  const guide = A1_GRAMMAR[grammarIndex] ?? A1_GRAMMAR[0];
  return {
    ...guide,
    id: `${guide.id}-m${moduleIndex + 1}-l${localLesson}`,
    lessonNumber: activeLessonNumber,
  };
}

function learningPlanForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  module: (typeof A1_IMMERSIVE_MODULES)[number],
) {
  return {
    outcome: {
      canDo: blueprint.canDo,
      canDoArabic: blueprint.canDoArabic,
      scenario: module.overview,
      scenarioArabic: module.overviewArabic,
    },
    steps: stepsForBlueprint(blueprint, module.moduleNumber),
    retrieval: blueprint.exposurePlan.slice(0, 3).map((exposure) => ({
      sourceLevel: "A1" as const,
      language: exposure.task,
      prompt: `Remember one word or phrase, then use it in the ${blueprint.title} situation.`,
      purpose: exposure.taskArabic,
    })),
    englishFirst: false,
    studio: "A1 First Steps Studio",
  };
}

function mentorGuideForBlueprint(
  blueprint: ImmersiveLessonBlueprint,
  module: (typeof A1_IMMERSIVE_MODULES)[number],
) {
  const firstRetrieval = blueprint.exposurePlan.find((exposure) => exposure.mode === "retrieve") ?? blueprint.exposurePlan.at(-1);
  const firstPractice = blueprint.exposurePlan.find((exposure) => exposure.mode === "use" || exposure.mode === "write" || exposure.mode === "hear") ?? blueprint.exposurePlan[0];

  return {
    level: "A1" as const,
    lessonTitle: blueprint.title,
    moments: [
      {
        id: "welcome" as const,
        title: "Your guide for today",
        titleArabic: "دليلك اليوم",
        message: blueprint.lessonNumber === 1 ? module.mentorOpening : `You are continuing ${module.title}. Small steps count: today you will add one useful piece to the English you already know.`,
        messageArabic: blueprint.lessonNumber === 1 ? module.mentorOpeningArabic : `أنت تتابع الآن وحدة ${module.titleArabic}. الخطوات الصغيرة مهمة: اليوم ستضيف جزءاً مفيداً إلى الإنجليزية التي تعرفها بالفعل.`,
      },
      {
        id: "vocabulary" as const,
        title: "First, meet the useful words",
        titleArabic: "أولاً: تعرّف إلى الكلمات المفيدة",
        message: `Do not try to memorise every word at once. Notice the key words, listen to them, and use one in the ${blueprint.title} situation.`,
        messageArabic: `لا تحاول حفظ كل كلمة دفعة واحدة. لاحظ الكلمات الأساسية، واستمع إليها، ثم استخدم كلمة واحدة في موقف ${blueprint.titleArabic}.`,
      },
      {
        id: "grammar" as const,
        title: "Then, notice one small pattern",
        titleArabic: "ثم لاحظ نمطاً صغيراً واحداً",
        message: blueprint.beginnerExplanation,
        messageArabic: blueprint.beginnerExplanationArabic,
      },
      {
        id: "practice" as const,
        title: "Now make it your own",
        titleArabic: "الآن اجعلها لغتك أنت",
        message: firstPractice?.task ?? "Use one of today’s words in a short sentence. A clear attempt is enough.",
        messageArabic: firstPractice?.taskArabic ?? "استخدم كلمة واحدة من كلمات اليوم في جملة قصيرة. محاولة واضحة تكفي.",
      },
      {
        id: "reading" as const,
        title: "See the language in context",
        titleArabic: "شاهد اللغة في سياق",
        message: `When you read or listen today, look for the words and pattern you have just met. Repeated encounters help the language stay with you.`,
        messageArabic: `عندما تقرأ أو تستمع اليوم، ابحث عن الكلمات والنمط اللذين قابلتهما للتو. التعرّض المتكرر يساعد اللغة على البقاء في ذاكرتك.`,
      },
      {
        id: "writing" as const,
        title: "Use a short model, then choose your words",
        titleArabic: "استخدم نموذجاً قصيراً ثم اختر كلماتك",
        message: `Start with one sentence frame. Then change one detail so the sentence says something true about you or your world.`,
        messageArabic: `ابدأ بقالب جملة واحد، ثم غيّر تفصيلاً واحداً لتقول الجملة شيئاً حقيقياً عنك أو عن عالمك.`,
      },
      {
        id: "check" as const,
        title: "Finish by remembering, not guessing",
        titleArabic: "اختم بالتذكر لا بالتخمين",
        message: firstRetrieval?.task ?? "Before you finish, say one useful word or sentence without looking at the page.",
        messageArabic: firstRetrieval?.taskArabic ?? "قبل أن تنهي الدرس، قل كلمة أو جملة مفيدة واحدة من دون النظر إلى الصفحة.",
      },
    ],
  };
}

export const A1_LESSONS: LessonDefinition[] = A1_IMMERSIVE_MODULES.flatMap((module, moduleIndex) => {
  const moduleVocabulary = A1_VOCABULARY.slice(moduleIndex * 75, (moduleIndex + 1) * 75);
  return module.lessonBlueprints.map((blueprint) => {
    const localLesson = ((blueprint.lessonNumber - 1) % A1_LESSONS_PER_MODULE) + 1;
    const activeLessonNumber = moduleIndex * A1_LESSONS_PER_MODULE + localLesson;
    return enrichLesson({
      level: "A1",
      lessonNumber: activeLessonNumber,
      moduleNumber: module.moduleNumber,
      title: blueprint.title,
      titleArabic: blueprint.titleArabic,
      words: vocabularyForBlueprint(blueprint, moduleVocabulary, module.title, activeLessonNumber),
      grammar: grammarForBlueprint(moduleIndex, localLesson, activeLessonNumber),
      learningPlan: learningPlanForBlueprint(blueprint, module),
      domainFocus: module.overview,
      domainFocusArabic: module.overviewArabic,
      beginnerScaffold: blueprint.beginnerExplanation,
      beginnerScaffoldArabic: blueprint.beginnerExplanationArabic,
      mentorGuide: mentorGuideForBlueprint(blueprint, module),
      lessonType: blueprint.type,
      experience: experienceForBlueprint(blueprint, module.moduleNumber),
      activities:
        authoredActivitiesForA1Module1(activeLessonNumber) ??
        authoredActivitiesForA1Module2(activeLessonNumber) ??
        authoredActivitiesForA1Module3(activeLessonNumber) ??
        A1_MODULE_4_AUTHORED_ACTIVITIES[activeLessonNumber],
    });
  });
});

export const A1_COURSE: CourseDefinition = {
  level: "A1",
  title: "A1: Everyday English from the first hello",
  titleArabic: "A1: الإنجليزية اليومية من أول تحية",
  totalLessons: 90,
  lessonsPerModule: A1_LESSONS_PER_MODULE,
  estimatedMinutes: 90 * 40,
  lessons: A1_LESSONS,
  modules: buildModuleDefinitions("A1", A1_LESSONS),
};

export function getA1Lesson(lessonNumber: number) {
  return A1_LESSONS.find((lesson) => lesson.lessonNumber === lessonNumber);
}
