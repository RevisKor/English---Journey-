import type { ImmersiveLessonBlueprint, ImmersiveModuleAuthoring, LessonType } from "./types";

const exposure = (lessonNumber: number, mode: ImmersiveLessonBlueprint["exposurePlan"][number]["mode"], task: string, taskArabic: string) => ({ lessonNumber, mode, task, taskArabic });

type ModuleSpec = {
  moduleNumber: number;
  title: string;
  titleArabic: string;
  overview: string;
  overviewArabic: string;
  mentorOpening: string;
  mentorOpeningArabic: string;
  vocabulary: string[];
  vocabularyArabic: string[];
  grammar: string[];
  grammarArabic: string[];
  topics: Array<[string, string, LessonType]>;
};

const SPECS: ModuleSpec[] = [
  {
    moduleNumber: 2,
    title: "Family and Home: People and Places That Matter",
    titleArabic: "العائلة والمنزل: الأشخاص والأماكن المهمة",
    overview: "Move from meeting people to talking about the people and places in everyday life. The learner names family members, rooms, furniture, and belongings, then combines them in short descriptions.",
    overviewArabic: "ننتقل من التعارف إلى الحديث عن الأشخاص والأماكن في الحياة اليومية. يسمي المتعلم أفراد العائلة والغرف والأثاث والممتلكات ثم يجمعها في أوصاف قصيرة.",
    mentorOpening: "You already know how to say who you are. Now English gives you a way to talk about the people and spaces around you. We will build each description slowly: who, what, and where.",
    mentorOpeningArabic: "أنت تعرف الآن كيف تقول من أنت. ستمنحك الإنجليزية طريقة للحديث عن الأشخاص والأماكن من حولك. سنبني كل وصف ببطء: من، ماذا، وأين.",
    vocabulary: ["family", "mother", "father", "sister", "brother", "home", "room", "kitchen", "bedroom", "table", "chair", "door", "window", "phone", "bag", "book", "cat", "dog", "pet", "animal"],
    vocabularyArabic: ["عائلة", "أم", "أب", "أخت", "أخ", "منزل", "غرفة", "مطبخ", "غرفة نوم", "طاولة", "كرسي", "باب", "نافذة", "هاتف", "حقيبة", "كتاب", "قطة", "كلب", "حيوان أليف", "حيوان"],
    grammar: ["have and has", "this and that", "there is and there are", "possessive 's", "in, on, under", "plural -s"],
    grammarArabic: ["have وhas", "this وthat", "there is وthere are", "ملكية 's", "in وon وunder", "الجمع -s"],
    topics: [["A family picture", "صورة عائلية", "visual-vocabulary"], ["This is my family", "هذه عائلتي", "interaction"], ["Have and has", "have وhas", "standard"], ["Rooms in a home", "غرف المنزل", "visual-vocabulary"], ["Where is the book?", "أين الكتاب؟", "interaction"], ["Furniture and belongings", "الأثاث والممتلكات", "standard"], ["There is a kitchen", "يوجد مطبخ", "standard"], ["A home tour", "جولة في المنزل", "speaking"], ["Read: My small home", "اقرأ: منزلي الصغير", "reading"], ["Pets and animals at home", "الحيوانات الأليفة في المنزل", "visual-vocabulary"], ["My room", "غرفتي", "writing"], ["Picture-to-sentence review", "مراجعة من الصورة إلى الجملة", "review"], ["A family visit", "زيارة عائلية", "interaction"], ["Describe and listen", "صف واستمع", "speaking"], ["Family and home checkpoint", "اختبار العائلة والمنزل", "assessment"]],
  },
  {
    moduleNumber: 3,
    title: "Food and Markets: Choosing What You Need",
    titleArabic: "الطعام والأسواق: اختيار ما تحتاج إليه",
    overview: "Use English to recognize everyday food, express likes and dislikes, ask for quantities, and complete a simple market exchange. The learner begins to connect words with choices and polite requests.",
    overviewArabic: "استخدم الإنجليزية للتعرف إلى الطعام اليومي والتعبير عن الإعجاب وعدم الإعجاب وطلب الكميات وإتمام حوار بسيط في السوق. يبدأ المتعلم بربط الكلمات بالاختيارات والطلبات المهذبة.",
    mentorOpening: "Words become useful when they help you choose. In this module, you will not only memorize food; you will use it to say what you want, what you do not want, and what you need to buy.",
    mentorOpeningArabic: "تصبح الكلمات مفيدة عندما تساعدك على الاختيار. في هذه الوحدة لن تحفظ الطعام فقط، بل ستستخدمه لتقول ما تريد وما لا تريد وما تحتاج إلى شرائه.",
    vocabulary: ["water", "tea", "coffee", "bread", "rice", "milk", "egg", "apple", "banana", "orange", "tomato", "potato", "chicken", "fish", "market", "price", "kilo", "some"],
    vocabularyArabic: ["ماء", "شاي", "قهوة", "خبز", "أرز", "حليب", "بيضة", "تفاحة", "موزة", "برتقالة", "طماطم", "بطاطا", "دجاج", "سمك", "سوق", "سعر", "كيلوغرام", "بعض"],
    grammar: ["like and do not like", "countable and uncountable nouns", "some and any", "a and an", "How much and How many", "Can I have...?"],
    grammarArabic: ["like وdo not like", "الأسماء المعدودة وغير المعدودة", "some وany", "a وan", "How much وHow many", "Can I have...?"],
    topics: [["Fruit basket", "سلة الفاكهة", "visual-vocabulary"], ["I like apples", "أحب التفاح", "standard"], ["Food and drinks", "الطعام والشراب", "standard"], ["A simple breakfast", "فطور بسيط", "reading"], ["Some rice, two eggs", "بعض الأرز وبيضتان", "standard"], ["At the market", "في السوق", "interaction"], ["Ask the price", "اسأل عن السعر", "speaking"], ["Vegetable choices", "اختيارات الخضار", "visual-vocabulary"], ["Read: A shopping list", "اقرأ: قائمة مشتريات", "reading"], ["Food meaning and grammar quiz", "اختبار معنى الطعام وقواعده", "standard"], ["My meal", "وجبتي", "writing"], ["Market role-play", "تمثيل دور في السوق", "interaction"], ["Hear and choose", "استمع واختر", "speaking"], ["Food review", "مراجعة الطعام", "review"], ["Market and meal checkpoint", "اختبار السوق والوجبة", "assessment"]],
  },
  {
    moduleNumber: 4,
    title: "Daily Life: Time, Routines, and Responsibilities",
    titleArabic: "الحياة اليومية: الوقت والروتين والمسؤوليات",
    overview: "Build a daily-life toolkit: tell the time, name routine actions, describe a normal day, and ask simple questions about schedules. Grammar grows from isolated be sentences into the present simple.",
    overviewArabic: "ابنِ أدوات للحياة اليومية: قل الوقت، وسم أفعال الروتين، وصف يوماً عادياً، واسأل أسئلة بسيطة عن الجداول. تنتقل القواعد من جمل be المنفصلة إلى المضارع البسيط.",
    mentorOpening: "A routine is a story that happens again and again. English can help you tell that story clearly. We will notice the small changes in verbs and practise them through your real day.",
    mentorOpeningArabic: "الروتين قصة تتكرر مرة بعد مرة. تساعدك الإنجليزية على سرد هذه القصة بوضوح. سنلاحظ التغييرات الصغيرة في الأفعال ونتدرب عليها من خلال يومك الحقيقي.",
    vocabulary: ["morning", "afternoon", "evening", "night", "wake up", "eat", "go", "work", "study", "come home", "sleep", "today", "every day", "Monday", "early", "late"],
    vocabularyArabic: ["صباح", "بعد الظهر", "مساء", "ليل", "يستيقظ", "يأكل", "يذهب", "يعمل", "يدرس", "يعود إلى المنزل", "ينام", "اليوم", "كل يوم", "الاثنين", "مبكراً", "متأخراً"],
    grammar: ["present simple I/you", "present simple he/she", "do and does questions", "adverbs of frequency", "at and on for time", "negative routines"],
    grammarArabic: ["المضارع البسيط مع I وyou", "المضارع البسيط مع he وshe", "أسئلة do وdoes", "ظروف التكرار", "at وon مع الوقت", "نفي الروتين"],
    topics: [["Parts of the day", "أجزاء اليوم", "visual-vocabulary"], ["My morning", "صباحي", "standard"], ["Action words", "كلمات الأفعال", "standard"], ["He works, she studies", "هو يعمل وهي تدرس", "standard"], ["What time is it?", "كم الساعة؟", "interaction"], ["A normal school day", "يوم دراسي عادي", "reading"], ["Always, sometimes, never", "دائماً وأحياناً وأبداً", "standard"], ["Ask about a routine", "اسأل عن روتين", "speaking"], ["Read: Two daily lives", "اقرأ: حياتان يوميتان", "reading"], ["Routine in context quiz", "اختبار الروتين في السياق", "standard"], ["My weekday", "يومي في أيام الأسبوع", "writing"], ["Plan tomorrow", "خطط لغد", "interaction"], ["Repeat the routine", "كرر الروتين", "speaking"], ["Time and routine review", "مراجعة الوقت والروتين", "review"], ["Daily-life checkpoint", "اختبار الحياة اليومية", "assessment"]],
  },
  {
    moduleNumber: 5,
    title: "Places and Getting Around: A Small World Outside",
    titleArabic: "الأماكن والتنقل: عالم صغير في الخارج",
    overview: "Take the learner outside the home. They identify places, use basic directions, ask where something is, and describe a short journey using familiar words in connected sentences.",
    overviewArabic: "نخرج بالمتعلم من المنزل. يحدد الأماكن ويستخدم الاتجاهات الأساسية ويسأل عن مكان شيء ويصف رحلة قصيرة باستخدام كلمات مألوفة في جمل مترابطة.",
    mentorOpening: "You have words for people, food, and routines. Now those words can travel with you. We will practise the language needed to find a place, ask for help, and understand a short answer.",
    mentorOpeningArabic: "لديك كلمات للأشخاص والطعام والروتين. الآن يمكن لهذه الكلمات أن ترافقك خارج المنزل. سنتدرب على اللغة اللازمة للعثور على مكان وطلب المساعدة وفهم إجابة قصيرة.",
    vocabulary: ["street", "school", "shop", "park", "hospital", "bank", "bus", "car", "train", "left", "right", "straight", "near", "far", "next to", "between"],
    vocabularyArabic: ["شارع", "مدرسة", "متجر", "حديقة", "مستشفى", "بنك", "حافلة", "سيارة", "قطار", "يسار", "يمين", "مستقيماً", "قريب", "بعيد", "بجانب", "بين"],
    grammar: ["where questions", "prepositions of place", "imperatives for directions", "can for ability and help", "present continuous in a place", "and, but, because"],
    grammarArabic: ["أسئلة where", "حروف الجر للمكان", "الأمر في الاتجاهات", "can للقدرة والمساعدة", "المضارع المستمر في المكان", "and وbut وbecause"],
    topics: [["Places in town", "أماكن المدينة", "visual-vocabulary"], ["Where is the bank?", "أين البنك؟", "interaction"], ["Left, right, straight", "يسار ويمين ومستقيم", "speaking"], ["A map with pictures", "خريطة بالصور", "visual-vocabulary"], ["Can you help me?", "هل يمكنك مساعدتي؟", "interaction"], ["Go to the shop", "اذهب إلى المتجر", "standard"], ["Near and far", "قريب وبعيد", "standard"], ["A short bus journey", "رحلة قصيرة بالحافلة", "reading"], ["Read a city message", "اقرأ رسالة عن المدينة", "reading"], ["Directions in context quiz", "اختبار الاتجاهات في السياق", "standard"], ["My route", "طريقي", "writing"], ["Lost and found role-play", "تمثيل دور الضائع والمرشد", "interaction"], ["Listen to the route", "استمع إلى الطريق", "speaking"], ["Places review", "مراجعة الأماكن", "review"], ["Getting-around checkpoint", "اختبار التنقل", "assessment"]],
  },
  {
    moduleNumber: 6,
    title: "Work, Hobbies, and Real Interactions",
    titleArabic: "العمل والهوايات والتفاعلات الحقيقية",
    overview: "Finish the A1 journey by combining personal information, work, hobbies, preferences, and simple plans. The learner must understand and produce short connected exchanges rather than isolated answers.",
    overviewArabic: "نُنهي رحلة A1 بجمع المعلومات الشخصية والعمل والهوايات والتفضيلات والخطط البسيطة. يجب على المتعلم فهم تبادلات قصيرة مترابطة وإنتاجها بدلاً من إجابات منفصلة.",
    mentorOpening: "At the beginning, one word was a success. Now you can connect several small ideas. This final A1 module is about becoming understandable in ordinary conversations, even when your English is still growing.",
    mentorOpeningArabic: "في البداية كانت الكلمة الواحدة نجاحاً. الآن يمكنك ربط عدة أفكار صغيرة. تتعلق هذه الوحدة الأخيرة في A1 بأن تكون مفهوماً في المحادثات العادية، حتى وإن كانت الإنجليزية لديك لا تزال تنمو.",
    vocabulary: ["job", "teacher", "doctor", "engineer", "student", "sport", "football", "music", "read", "watch", "play", "like", "want", "weekend", "tomorrow", "together"],
    vocabularyArabic: ["وظيفة", "معلم", "طبيب", "مهندس", "طالب", "رياضة", "كرة القدم", "موسيقى", "يقرأ", "يشاهد", "يلعب", "يحب", "يريد", "عطلة نهاية الأسبوع", "غداً", "معاً"],
    grammar: ["can and cannot", "want to and like to", "object pronouns", "present simple review", "going to for simple plans", "because and so"],
    grammarArabic: ["can وcannot", "want to وlike to", "ضمائر المفعول", "مراجعة المضارع البسيط", "going to للخطط البسيطة", "because وso"],
    topics: [["Jobs and people", "المهن والأشخاص", "visual-vocabulary"], ["What do you do?", "ماذا تعمل؟", "interaction"], ["Hobbies after work", "الهوايات بعد العمل", "standard"], ["I can play football", "أستطيع لعب كرة القدم", "standard"], ["Likes and reasons", "التفضيلات والأسباب", "standard"], ["A weekend invitation", "دعوة في عطلة نهاية الأسبوع", "interaction"], ["Plans for tomorrow", "خطط الغد", "writing"], ["Read: A busy but happy week", "اقرأ: أسبوع مزدحم وسعيد", "reading"], ["People at work", "الأشخاص في العمل", "reading"], ["Real interaction quiz", "اختبار التفاعل الحقيقي", "standard"], ["My work or study day", "يومي في العمل أو الدراسة", "writing"], ["Invite, accept, refuse", "ادعُ واقبل وارفض", "speaking"], ["A complete conversation", "محادثة كاملة", "interaction"], ["A1 journey review", "مراجعة رحلة A1", "review"], ["A1 real-world checkpoint", "اختبار A1 الواقعي", "assessment"]],
  },
];

const lesson = (spec: ModuleSpec, index: number, topic: [string, string, LessonType]): ImmersiveLessonBlueprint => {
  const lessonNumber = index + 1;
  const anchors = spec.vocabulary.slice((index * 2) % spec.vocabulary.length, (index * 2) % spec.vocabulary.length + 5);
  const safeAnchors = anchors.length === 5 ? anchors : [...anchors, ...spec.vocabulary.slice(0, 5 - anchors.length)];
  const grammarIndex = Math.min(Math.floor(index / 2), spec.grammar.length - 1);
  const grammar = spec.grammar[grammarIndex];
  const grammarArabic = spec.grammarArabic[grammarIndex];
  const isAssessment = topic[2] === "assessment";
  const explanation = `This lesson uses ${grammar} to help you communicate about ${topic[0].toLowerCase()}. First notice the pattern, then build a sentence with the words you already know. You do not need to memorize a grammar label before you can use the sentence.`;
  const explanationArabic = `يستخدم هذا الدرس ${grammarArabic} لمساعدتك على التواصل حول ${topic[1]}. لاحظ النمط أولاً، ثم كوّن جملة بالكلمات التي تعرفها. لا تحتاج إلى حفظ اسم القاعدة قبل أن تستخدم الجملة.`;
  const plan = [
    exposure(lessonNumber, index % 3 === 0 ? "see" : "learn", `Meet the key words for ${topic[0].toLowerCase()} and connect each one to a picture or Arabic meaning.`, `تعرّف إلى الكلمات الأساسية في ${topic[1]} واربط كل كلمة بصورة أو معناها العربي.`),
    exposure(lessonNumber, "use", `Use ${grammar} in a short sentence with two words from this lesson.`, `استخدم ${grammarArabic} في جملة قصيرة مع كلمتين من هذا الدرس.`),
    exposure(Math.min(15, lessonNumber + 1), index % 2 === 0 ? "read" : "hear", `Meet the same words again in a short ${topic[0].toLowerCase()} exchange.`, `قابل الكلمات نفسها مرة أخرى في تبادل قصير حول ${topic[1]}.`),
    exposure(Math.min(15, lessonNumber + 2), index % 3 === 1 ? "write" : "retrieve", `Recall the words without a spelling trap, then complete a meaningful sentence.`, `استرجع الكلمات من دون فخ إملائي ثم أكمل جملة ذات معنى.`),
  ];
  if (isAssessment) plan.push(exposure(15, "retrieve", "Use the module word bank to prepare, then complete the final contextual task.", "استخدم بنك كلمات الوحدة للتحضير ثم أكمل المهمة النهائية في سياقها."));
  return {
    lessonNumber,
    moduleNumber: spec.moduleNumber,
    type: topic[2],
    title: topic[0],
    titleArabic: topic[1],
    mentorPurpose: `The mentor leads you through ${topic[0].toLowerCase()} as the next small step in your everyday English. The goal is not to rush; it is to notice, try, and meet the language again.`,
    mentorPurposeArabic: `يرشدك المرشد خلال ${topic[1]} بوصفه الخطوة الصغيرة التالية في الإنجليزية اليومية. الهدف ليس السرعة، بل الملاحظة والمحاولة ومقابلة اللغة مرة أخرى.`,
    vocabularyAnchors: safeAnchors,
    grammarFocus: grammar,
    grammarFocusArabic: grammarArabic,
    beginnerExplanation: explanation,
    beginnerExplanationArabic: explanationArabic,
    exposurePlan: plan,
    practiceModes: isAssessment ? ["assessment", "reading", "writing", "speaking", "review"] : [topic[2], "standard", "review"],
    canDo: isAssessment ? `Complete a short A1 conversation, reading, writing, and contextual vocabulary task about ${topic[0].toLowerCase()}.` : `Use the new words and ${grammar} to communicate one useful idea about ${topic[0].toLowerCase()}.`,
    canDoArabic: isAssessment ? `ينجز محادثة قصيرة وقراءة وكتابة ومهمة مفردات في سياقها عن ${topic[1]}.` : `يستخدم الكلمات الجديدة و${grammarArabic} للتعبير عن فكرة مفيدة حول ${topic[1]}.`,
  };
};

const buildModule = (spec: ModuleSpec): ImmersiveModuleAuthoring => ({
  level: "A1",
  moduleNumber: spec.moduleNumber,
  title: spec.title,
  titleArabic: spec.titleArabic,
  overview: spec.overview,
  overviewArabic: spec.overviewArabic,
  mentorOpening: spec.mentorOpening,
  mentorOpeningArabic: spec.mentorOpeningArabic,
  lessonBlueprints: spec.topics.map((topic, index) => lesson(spec, index, topic)),
  assessmentRecipe: ["Review the module word bank and identify meaning from context.", "Complete a grammar-in-context choice rather than an isolated spelling trap.", "Read a short level-appropriate passage using familiar module words.", "Write a supported personal response using a clear sentence frame.", "Complete a short speaking or dialogue task and review before retrying."],
  assessmentRecipeArabic: ["راجع بنك كلمات الوحدة وحدد المعنى من السياق.", "أكمل اختياراً نحوياً في سياقه بدلاً من فخ إملائي منفصل.", "اقرأ نصاً قصيراً مناسباً للمستوى يستخدم كلمات مألوفة من الوحدة.", "اكتب استجابة شخصية مدعومة باستخدام إطار جملة واضح.", "أكمل مهمة كلام أو حوار قصيرة وراجع قبل إعادة المحاولة."],
});

export const A1_FAMILY_HOME_IMMERSIVE = buildModule(SPECS[0]);
export const A1_FOOD_MARKETS_IMMERSIVE = buildModule(SPECS[1]);
export const A1_DAILY_LIFE_IMMERSIVE = buildModule(SPECS[2]);
export const A1_PLACES_TRAVEL_IMMERSIVE = buildModule(SPECS[3]);
export const A1_WORK_HOBBIES_IMMERSIVE = buildModule(SPECS[4]);

export const A1_REMAINING_IMMERSIVE_MODULES: ImmersiveModuleAuthoring[] = [
  A1_FAMILY_HOME_IMMERSIVE,
  A1_FOOD_MARKETS_IMMERSIVE,
  A1_DAILY_LIFE_IMMERSIVE,
  A1_PLACES_TRAVEL_IMMERSIVE,
  A1_WORK_HOBBIES_IMMERSIVE,
];

export const A1_ALL_IMMERSIVE_MODULES: ImmersiveModuleAuthoring[] = A1_REMAINING_IMMERSIVE_MODULES;

export function getExpandedA1ImmersiveModule(moduleNumber: number) {
  return A1_REMAINING_IMMERSIVE_MODULES.find((module) => module.moduleNumber === moduleNumber);
}

export function buildExpandedA1ExposureIndex() {
  const index: Record<string, ImmersiveLessonBlueprint["exposurePlan"]> = {};
  for (const module of A1_REMAINING_IMMERSIVE_MODULES) {
    for (const lesson of module.lessonBlueprints) {
      for (const word of lesson.vocabularyAnchors) {
        index[word] = [...(index[word] ?? []), ...lesson.exposurePlan];
      }
    }
  }
  return index;
}
