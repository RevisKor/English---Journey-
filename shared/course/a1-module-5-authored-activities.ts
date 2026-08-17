import type {
  LessonActivity,
  LessonExperienceStage,
  LessonProgressionStage,
  ProgressiveSupport,
  ReadingCheck,
  VisualVocabularyItem,
} from "./types";

type Module5ActivityDraft = Omit<LessonActivity, "stage" | "progressiveSupports" | "readingChecks"> & {
  stage: LessonProgressionStage | LessonExperienceStage;
  progressiveSupports: Array<ProgressiveSupport | "accessible-tip">;
  readingChecks?: ReadingCheck[];
};

const activityStageMap: Record<LessonExperienceStage, LessonProgressionStage> = {
  orientation: "introduction",
  encounter: "introduction",
  notice: "explanation",
  "supported-practice": "guided-practice",
  "meaningful-use": "real-context",
  retrieval: "review",
  evidence: "assessment",
  "next-bridge": "review",
};

function toLessonActivity(activity: Module5ActivityDraft): LessonActivity {
  const stage: LessonProgressionStage = activity.stage in activityStageMap
    ? activityStageMap[activity.stage as LessonExperienceStage]
    : activity.stage as LessonProgressionStage;

  return {
    ...activity,
    stage,
    progressiveSupports: activity.progressiveSupports.map((support) => support === "accessible-tip" ? "tip" : support),
  };
}

const townPlaceVisuals: VisualVocabularyItem[] = [
  { id: "a1-m5-l61-school", word: "school", arabic: "مدرسة", pronunciation: "/skuːl/", exampleEN: "The school is near the park.", exampleAR: "المدرسة قريبة من الحديقة.", altText: "A small school building with a book sign", category: "Place in town", interactionHint: "Hear school, find the book sign, then repeat the long /uː/ sound." },
  { id: "a1-m5-l61-shop", word: "shop", arabic: "متجر", pronunciation: "/ʃɒp/", exampleEN: "The shop sells bread.", exampleAR: "المتجر يبيع الخبز.", altText: "A small shop with bread in the window", category: "Place in town", interactionHint: "Hear shop, then connect it to familiar food from the market module." },
  { id: "a1-m5-l61-park", word: "park", arabic: "حديقة", pronunciation: "/pɑːk/", exampleEN: "We walk in the park.", exampleAR: "نحن نمشي في الحديقة.", altText: "A green park with a walking path", category: "Place in town", interactionHint: "Hear park, find the green space, then say the word once." },
  { id: "a1-m5-l61-hospital", word: "hospital", arabic: "مستشفى", pronunciation: "/ˈhɒspɪtl/", exampleEN: "The hospital is on this street.", exampleAR: "المستشفى في هذا الشارع.", altText: "A hospital building with a clear medical cross", category: "Place in town", interactionHint: "Listen in three calm beats: hos-pi-tal. You only need to say it once today." },
];

const transportVisuals: VisualVocabularyItem[] = [
  { id: "a1-m5-l64-bus", word: "bus", arabic: "حافلة", pronunciation: "/bʌs/", exampleEN: "The bus goes to the station.", exampleAR: "الحافلة تذهب إلى المحطة.", altText: "A city bus beside a bus-stop sign", category: "Transport", interactionHint: "Hear bus and point to the vehicle that carries several people." },
  { id: "a1-m5-l64-car", word: "car", arabic: "سيارة", pronunciation: "/kɑː/", exampleEN: "The car is next to the shop.", exampleAR: "السيارة بجانب المتجر.", altText: "A small car parked beside a shop", category: "Transport", interactionHint: "Say car with one long open vowel, then find the vehicle with four wheels." },
  { id: "a1-m5-l64-train", word: "train", arabic: "قطار", pronunciation: "/treɪn/", exampleEN: "The train is far from my home.", exampleAR: "القطار بعيد عن منزلي.", altText: "A train arriving at a simple platform", category: "Transport", interactionHint: "Hear train, notice the /eɪ/ sound, and trace the tracks with your finger." },
  { id: "a1-m5-l64-street", word: "street", arabic: "شارع", pronunciation: "/striːt/", exampleEN: "This street is busy today.", exampleAR: "هذا الشارع مزدحم اليوم.", altText: "A street with a bus, car, and a safe pavement", category: "Town space", interactionHint: "Street has a long /iː/ sound at the end. Say it slowly once." },
];

const authoredActivities: Record<number, Module5ActivityDraft[]> = {
  61: [
    { id: "a1-m5-l61-town-picture-find", kind: "visual-vocabulary", title: "Find four useful places", titleArabic: "ابحث عن أربعة أماكن مفيدة", objective: "Connect four common town places to clear visual clues before being asked to use location grammar.", objectiveArabic: "اربط أربعة أماكن شائعة في المدينة بإشارات بصرية واضحة قبل استخدام قواعد المكان.", stage: "encounter", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], visualItems: townPlaceVisuals },
    { id: "a1-m5-l61-place-echo", kind: "speaking", title: "Say a place with a clue", titleArabic: "قل مكاناً مع إشارة", objective: "Say two place words in short useful phrases rather than as a detached word list.", objectiveArabic: "قل كلمتين لمكانين في عبارات قصيرة مفيدة بدلاً من قائمة كلمات منفصلة.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help"], speakingLines: [
      { id: "a1-m5-l61-line-1", speaker: "Model", text: "The shop is here.", textArabic: "المتجر هنا.", pronunciationHint: "Keep the whole line short and point to the shop picture as you speak.", audioText: "The shop is here." },
      { id: "a1-m5-l61-line-2", speaker: "Your turn", text: "The park is near.", textArabic: "الحديقة قريبة.", pronunciationHint: "Near has one clear long vowel; say it once without rushing.", audioText: "The park is near." },
    ] },
    { id: "a1-m5-l61-place-recall", kind: "review", title: "Name one place from its sign", titleArabic: "سمِّ مكاناً من علامته", objective: "Retrieve a place word from one sign cue before seeing the English label again.", objectiveArabic: "استدعِ كلمة مكان من إشارة واحدة قبل رؤية الاسم الإنجليزي مرة أخرى.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["the ___", "a ___ near the park"] },
  ],
  62: [
    { id: "a1-m5-l62-where-model", kind: "interaction", title: "Ask where one place is", titleArabic: "اسأل أين يوجد مكان", objective: "Use Where is ...? as a complete helpful question through a short model exchange.", objectiveArabic: "استخدم Where is ...? كسؤال كامل ومفيد من خلال تبادل نموذجي قصير.", stage: "orientation", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript"], interactionTurns: [
      { id: "a1-m5-l62-turn-1", speaker: "Visitor", text: "Where is the bank?", textArabic: "أين البنك؟", purpose: "Ask about one place; keep where at the beginning." },
      { id: "a1-m5-l62-turn-2", speaker: "Helper", text: "It is near the shop.", textArabic: "إنه قريب من المتجر.", purpose: "Give one short location answer." },
      { id: "a1-m5-l62-turn-3", speaker: "Visitor", text: "Thank you.", textArabic: "شكراً لك.", purpose: "Close the exchange politely." },
    ] },
    { id: "a1-m5-l62-question-notice", kind: "standard", title: "Keep where at the front", titleArabic: "ضع where في البداية", objective: "Notice the shape Where is + place? without introducing a long grammar label or a list of exceptions.", objectiveArabic: "لاحظ شكل Where is + place? من دون تقديم اسم نحوي طويل أو قائمة استثناءات.", stage: "notice", estimatedMinutes: 6, semantic: "grammar", progressiveSupports: ["worked-example", "arabic-help", "accessible-tip"], writingPrompt: "Read the model question. Replace only bank with school or hospital: Where is the ___?", writingPromptArabic: "اقرأ السؤال النموذجي. استبدل bank فقط بـ school أو hospital: Where is the ___?", sentencePatterns: ["Where is the bank?", "Where is the school?", "It is near the shop."] },
    { id: "a1-m5-l62-location-choice", kind: "speaking", title: "Choose a place question", titleArabic: "اختر سؤالاً عن مكان", objective: "Choose and say one location question from a picture card, with no need to describe a real neighbourhood.", objectiveArabic: "اختر وقل سؤالاً واحداً عن مكان من بطاقة صورة دون حاجة لوصف حي حقيقي.", stage: "meaningful-use", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], speakingLines: [
      { id: "a1-m5-l62-line-1", speaker: "Picture card", text: "Where is the hospital?", textArabic: "أين المستشفى؟", pronunciationHint: "Let your voice rise a little at the end of the question.", audioText: "Where is the hospital?" },
      { id: "a1-m5-l62-line-2", speaker: "Answer", text: "It is on this street.", textArabic: "إنه في هذا الشارع.", pronunciationHint: "This is a short answer; pause after is if it helps.", audioText: "It is on this street." },
    ] },
  ],
  63: [
    { id: "a1-m5-l63-direction-echo", kind: "speaking", title: "Hear three direction words", titleArabic: "اسمع ثلاث كلمات للاتجاه", objective: "Build a spoken feel for left, right, and straight before following a full route.", objectiveArabic: "ابنِ إحساساً منطوقاً بـ left وright وstraight قبل اتباع طريق كامل.", stage: "encounter", estimatedMinutes: 6, semantic: "vocabulary", progressiveSupports: ["arabic-help", "transcript", "tip"], speakingLines: [
      { id: "a1-m5-l63-line-1", speaker: "Model", text: "Left.", textArabic: "يسار.", pronunciationHint: "The final sound is soft; say the whole word once.", audioText: "Left." },
      { id: "a1-m5-l63-line-2", speaker: "Model", text: "Right.", textArabic: "يمين.", pronunciationHint: "The spelling is unusual, so copy the sound from the audio instead of guessing.", audioText: "Right." },
      { id: "a1-m5-l63-line-3", speaker: "Model", text: "Go straight.", textArabic: "اذهب مستقيماً.", pronunciationHint: "Straight is one useful chunk after go.", audioText: "Go straight." },
    ] },
    { id: "a1-m5-l63-arrow-route", kind: "interaction", title: "Follow two map arrows", titleArabic: "اتبع سهمين على الخريطة", objective: "Respond to two visual arrows with one direction phrase at a time instead of memorising a long fixed dialogue.", objectiveArabic: "استجب لسهمين بصريين بعبارة اتجاه واحدة كل مرة بدلاً من حفظ حوار طويل ثابت.", stage: "supported-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "arabic-help"], interactionTurns: [
      { id: "a1-m5-l63-arrow-1", speaker: "Arrow one", text: "Go straight.", textArabic: "اذهب مستقيماً.", purpose: "Follow the first arrow from the park." },
      { id: "a1-m5-l63-arrow-2", speaker: "Arrow two", text: "Turn left.", textArabic: "انعطف يساراً.", purpose: "Use left at the second arrow." },
      { id: "a1-m5-l63-arrow-3", speaker: "Destination", text: "The shop is here.", textArabic: "المتجر هنا.", purpose: "Identify the place at the end of the two-step route." },
    ] },
  ],
  64: [
    { id: "a1-m5-l64-transport-picture-map", kind: "visual-vocabulary", title: "Match transport to the town map", titleArabic: "طابق وسائل النقل مع خريطة المدينة", objective: "See bus, car, train, and street as parts of one small map rather than unrelated transport words.", objectiveArabic: "شاهد bus وcar وtrain وstreet كأجزاء من خريطة صغيرة واحدة بدلاً من كلمات نقل غير مترابطة.", stage: "encounter", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], visualItems: transportVisuals },
    { id: "a1-m5-l64-map-place-link", kind: "interaction", title: "Put a place by the route", titleArabic: "ضع مكاناً بجانب الطريق", objective: "Use familiar home, food, and town vocabulary to add one place next to a bus or street clue.", objectiveArabic: "استخدم مفردات المنزل والطعام والمدينة المألوفة لإضافة مكان واحد بجانب إشارة حافلة أو شارع.", stage: "supported-practice", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m5-l64-link-1", speaker: "Map clue", text: "The bus stops here.", textArabic: "تتوقف الحافلة هنا.", purpose: "Look for the bus-stop sign." },
      { id: "a1-m5-l64-link-2", speaker: "Your map", text: "The shop is next to the bus stop.", textArabic: "المتجر بجانب موقف الحافلة.", purpose: "Place shop beside the bus stop." },
      { id: "a1-m5-l64-link-3", speaker: "Extra clue", text: "The park is near the street.", textArabic: "الحديقة قريبة من الشارع.", purpose: "Use near as a general closeness clue, not an exact measurement." },
    ] },
    { id: "a1-m5-l64-transport-recall", kind: "review", title: "Say the vehicle before the label", titleArabic: "قل اسم المركبة قبل ظهور الاسم", objective: "Retrieve one transport word from its map icon before reopening its bilingual label.", objectiveArabic: "استدعِ كلمة وسيلة نقل من رمزها على الخريطة قبل فتح الاسم الثنائي اللغة.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["the bus", "a car near the shop", "the train"] },
  ],
  65: [
    { id: "a1-m5-l65-help-exchange", kind: "interaction", title: "Ask for help politely", titleArabic: "اطلب المساعدة بأدب", objective: "Use Can you help me? as a safe, useful request before adding a destination question.", objectiveArabic: "استخدم Can you help me? كطلب آمن ومفيد قبل إضافة سؤال عن وجهة.", stage: "orientation", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript"], interactionTurns: [
      { id: "a1-m5-l65-turn-1", speaker: "Visitor", text: "Can you help me?", textArabic: "هل يمكنك مساعدتي؟", purpose: "Ask politely; this question is useful before you know every direction word." },
      { id: "a1-m5-l65-turn-2", speaker: "Helper", text: "Yes, I can.", textArabic: "نعم، أستطيع.", purpose: "Use a short kind answer." },
      { id: "a1-m5-l65-turn-3", speaker: "Visitor", text: "Where is the park?", textArabic: "أين الحديقة؟", purpose: "Ask one clear follow-up question." },
    ] },
    { id: "a1-m5-l65-can-response", kind: "speaking", title: "Practise a helpful reply", titleArabic: "تدرّب على رد مساعد", objective: "Speak one offer and one thanks so the request feels like a complete human exchange.", objectiveArabic: "انطق عرضاً واحداً وشكراً واحداً حتى يبدو الطلب تبادلاً إنسانياً كاملاً.", stage: "meaningful-use", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "transcript"], speakingLines: [
      { id: "a1-m5-l65-line-1", speaker: "Helper", text: "Yes, I can help.", textArabic: "نعم، أستطيع المساعدة.", pronunciationHint: "Keep can short and clear; do not stress it too heavily.", audioText: "Yes, I can help." },
      { id: "a1-m5-l65-line-2", speaker: "Visitor", text: "Thank you very much.", textArabic: "شكراً جزيلاً.", pronunciationHint: "Speak it as one friendly chunk.", audioText: "Thank you very much." },
    ] },
  ],
  66: [
    { id: "a1-m5-l66-direction-notice", kind: "standard", title: "Use a direction action", titleArabic: "استخدم فعل الاتجاه", objective: "Notice that Go straight and Turn left begin with an action word when giving a simple direction.", objectiveArabic: "لاحظ أن Go straight وTurn left تبدأان بفعل عند إعطاء اتجاه بسيط.", stage: "notice", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "accessible-tip"], writingPrompt: "Read the two map instructions. Underline the first action word: Go straight. / Turn right.", writingPromptArabic: "اقرأ تعليمتي الخريطة. ضع خطاً تحت فعل البداية: Go straight. / Turn right.", sentencePatterns: ["Go straight.", "Turn left.", "Turn right at the shop."] },
    { id: "a1-m5-l66-three-step-route", kind: "interaction", title: "Build a three-step route", titleArabic: "ابنِ طريقاً من ثلاث خطوات", objective: "Arrange three short direction cards into a route with a visible destination and no pressure to navigate a real street.", objectiveArabic: "رتّب ثلاث بطاقات اتجاه قصيرة في طريق ذي وجهة ظاهرة دون ضغط للتنقل في شارع حقيقي.", stage: "supported-practice", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "arabic-help"], interactionTurns: [
      { id: "a1-m5-l66-route-1", speaker: "Step 1", text: "Go straight.", textArabic: "اذهب مستقيماً.", purpose: "Begin at the bus stop." },
      { id: "a1-m5-l66-route-2", speaker: "Step 2", text: "Turn right at the park.", textArabic: "انعطف يميناً عند الحديقة.", purpose: "Use the park as the easy landmark." },
      { id: "a1-m5-l66-route-3", speaker: "Step 3", text: "The shop is next to the bank.", textArabic: "المتجر بجانب البنك.", purpose: "Find the destination from its final location clue." },
    ] },
    { id: "a1-m5-l66-route-say", kind: "speaking", title: "Give one direction calmly", titleArabic: "أعطِ اتجاهاً بهدوء", objective: "Say one route instruction at a natural pace after building it from map cards.", objectiveArabic: "قل تعليمة طريق واحدة بسرعة طبيعية بعد بنائها من بطاقات الخريطة.", stage: "meaningful-use", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["worked-example"], speakingLines: [
      { id: "a1-m5-l66-line-1", speaker: "Your turn", text: "Turn left at the school.", textArabic: "انعطف يساراً عند المدرسة.", pronunciationHint: "Say turn left together, then pause before at the school.", audioText: "Turn left at the school." },
    ] },
  ],
  67: [
    { id: "a1-m5-l67-near-far-line", kind: "standard", title: "Put places on a near–far line", titleArabic: "ضع الأماكن على خط قريب–بعيد", objective: "Use near and far as broad meaning choices by placing picture cards on a simple line.", objectiveArabic: "استخدم near وfar كاختيارات معنى واسعة بوضع بطاقات صور على خط بسيط.", stage: "notice", estimatedMinutes: 6, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Look at the map. Complete one idea: The park is near the ___. / The train station is far from the ___.", writingPromptArabic: "انظر إلى الخريطة. أكمل فكرة واحدة: The park is near the ___. / The train station is far from the ___.", sentencePatterns: ["The shop is near the park.", "The hospital is far from the school."] },
    { id: "a1-m5-l67-place-contrast", kind: "writing", title: "Write two map facts", titleArabic: "اكتب حقيقتين من الخريطة", objective: "Create two short map facts from a fictional town, so learners can practise distance words without revealing where they live.", objectiveArabic: "أنشئ حقيقتين قصيرتين من مدينة خيالية ليتمرن المتعلم على كلمات المسافة دون كشف مكان سكنه.", stage: "meaningful-use", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Use the practice map, not your own area. Write: The ___ is near the ___. The ___ is far from the ___.", writingPromptArabic: "استخدم خريطة التدريب لا منطقتك. اكتب: The ___ is near the ___. The ___ is far from the ___.", suggestedVocabulary: ["shop", "park", "school", "hospital", "near", "far"], sentencePatterns: ["The ___ is near the ___.", "The ___ is far from the ___."] },
  ],
  68: [
    { id: "a1-m5-l68-bus-journey-read", kind: "reading", title: "Read one short bus journey", titleArabic: "اقرأ رحلة قصيرة بالحافلة", objective: "Follow a brief bus journey by locating the starting place, one direction, and the destination.", objectiveArabic: "اتبع رحلة حافلة قصيرة بتحديد مكان البداية واتجاه واحد والوجهة.", stage: "meaningful-use", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "transcript", "tip"], readingText: "Mona is at the school. She takes the bus. The bus goes straight on King Street. It stops near the park. Mona gets off and walks to the shop next to the park.", readingTextArabic: "منى عند المدرسة. تركب الحافلة. تسير الحافلة مباشرة في شارع كينغ. تتوقف قرب الحديقة. تنزل منى وتمشي إلى المتجر بجانب الحديقة.", readingChecks: [
      { id: "a1-m5-l68-check-1", type: "detail", prompt: "Where is Mona at the beginning?", promptArabic: "أين تكون منى في البداية؟", answer: "At the school.", explanation: "The first sentence gives the starting place." },
      { id: "a1-m5-l68-check-2", type: "vocabulary", prompt: "Which word tells you the bus does not turn?", promptArabic: "أي كلمة تدل على أن الحافلة لا تنعطف؟", answer: "straight", explanation: "Go straight means continue forward." },
      { id: "a1-m5-l68-check-3", type: "detail", prompt: "What is next to the park?", promptArabic: "ما الذي بجانب الحديقة؟", answer: "The shop.", explanation: "The final sentence names the shop next to the park." },
    ] },
    { id: "a1-m5-l68-journey-strip", kind: "interaction", title: "Put the journey in order", titleArabic: "رتّب الرحلة", objective: "Turn the reading into four visual route steps instead of answering only isolated comprehension questions.", objectiveArabic: "حوّل القراءة إلى أربع خطوات طريق بصرية بدلاً من إجابة أسئلة فهم منفصلة فقط.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m5-l68-step-1", speaker: "Start", text: "School", textArabic: "مدرسة", purpose: "Place this at the beginning." },
      { id: "a1-m5-l68-step-2", speaker: "Travel", text: "Bus", textArabic: "حافلة", purpose: "Choose the transport from the text." },
      { id: "a1-m5-l68-step-3", speaker: "Landmark", text: "Park", textArabic: "حديقة", purpose: "Use the place near the bus stop." },
      { id: "a1-m5-l68-step-4", speaker: "Finish", text: "Shop", textArabic: "متجر", purpose: "Place the destination at the end." },
    ] },
  ],
  69: [
    { id: "a1-m5-l69-city-message-read", kind: "reading", title: "Read a city message", titleArabic: "اقرأ رسالة عن المدينة", objective: "Read a short friendly message for what is happening in a place, using familiar town words as anchors.", objectiveArabic: "اقرأ رسالة ودية قصيرة لمعرفة ما يحدث في مكان باستخدام كلمات المدينة المألوفة كمرتكزات.", stage: "meaningful-use", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "transcript"], readingText: "Hi Sara, I am at the park with my brother. He is playing football and I am reading. The shop is near us, but the bank is far away. We are waiting for the bus now.", readingTextArabic: "مرحباً سارة، أنا في الحديقة مع أخي. هو يلعب كرة القدم وأنا أقرأ. المتجر قريب منا، لكن البنك بعيد. نحن ننتظر الحافلة الآن.", readingChecks: [
      { id: "a1-m5-l69-check-1", type: "detail", prompt: "Where are the writer and her brother?", promptArabic: "أين توجد الكاتبة وأخوها؟", answer: "At the park.", explanation: "The first sentence gives their place." },
      { id: "a1-m5-l69-check-2", type: "detail", prompt: "What is the brother doing?", promptArabic: "ماذا يفعل الأخ؟", answer: "He is playing football.", explanation: "Look for the line after He is." },
      { id: "a1-m5-l69-check-3", type: "true-false", prompt: "The bank is near the park.", promptArabic: "البنك قريب من الحديقة.", choices: ["True", "False"], answer: "False", explanation: "The message says the bank is far away." },
    ] },
    { id: "a1-m5-l69-now-notice", kind: "standard", title: "Notice is + action now", titleArabic: "لاحظ is + فعل الآن", objective: "Notice a simple is + action pattern in a meaningful message without treating present continuous as a large new grammar system.", objectiveArabic: "لاحظ نمط is + فعل بسيط في رسالة ذات معنى دون التعامل مع المضارع المستمر كنظام قواعد كبير جديد.", stage: "notice", estimatedMinutes: 6, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "accessible-tip"], writingPrompt: "Find two lines with is: He is playing. / I am reading. They show an action happening now in the message.", writingPromptArabic: "ابحث عن جملتين فيهما is: He is playing. / I am reading. هما تدلان على فعل يحدث الآن في الرسالة.", sentencePatterns: ["He is playing football.", "I am reading.", "We are waiting for the bus."] },
  ],
  70: [
    { id: "a1-m5-l70-direction-context-check", kind: "assessment", title: "Choose the route that fits", titleArabic: "اختر الطريق المناسب", objective: "Show direction and location understanding through short map contexts, not spelling tricks or one-word memorisation.", objectiveArabic: "أظهر فهم الاتجاه والمكان من خلال سياقات خريطة قصيرة لا من خلال حيل إملائية أو حفظ كلمة واحدة.", stage: "evidence", estimatedMinutes: 8, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "tip"], writingPrompt: "For each map clue, choose the useful line: Go straight. / Turn left. / It is next to the park. Then repair one model answer with the word bank.", writingPromptArabic: "لكل إشارة خريطة اختر الجملة المفيدة: Go straight. / Turn left. / It is next to the park. ثم أصلح إجابة نموذجية واحدة باستخدام بنك الكلمات.", suggestedVocabulary: ["left", "right", "straight", "near", "next to"], sentencePatterns: ["Where is the ___?", "Go straight.", "It is next to the ___."] },
    { id: "a1-m5-l70-route-retrieve", kind: "review", title: "Keep one route tool", titleArabic: "احتفظ بأداة طريق واحدة", objective: "Retrieve the route phrase that would be most useful before moving into personal or fictional route writing.", objectiveArabic: "استدعِ عبارة الطريق الأكثر فائدة قبل الانتقال إلى كتابة طريق شخصي أو خيالي.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip", "word-support"], sentencePatterns: ["Where is the ___?", "Go straight.", "Turn ___."] },
  ],
  71: [
    { id: "a1-m5-l71-route-model", kind: "writing", title: "Read a model route", titleArabic: "اقرأ نموذج طريق", objective: "See how three clear route sentences connect from start to destination before drafting a practice route.", objectiveArabic: "شاهد كيف ترتبط ثلاث جمل طريق واضحة من البداية إلى الوجهة قبل كتابة طريق للتدريب.", stage: "orientation", estimatedMinutes: 5, semantic: "example", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Model: Start at the park. Go straight. Turn left at the shop. The school is next to the bank.", writingPromptArabic: "النموذج: ابدأ من الحديقة. اذهب مستقيماً. انعطف يساراً عند المتجر. المدرسة بجانب البنك.", sentencePatterns: ["Start at the ___.", "Go straight.", "Turn left at the ___.", "The ___ is next to the ___."] },
    { id: "a1-m5-l71-fictional-route", kind: "writing", title: "Write a route on a practice map", titleArabic: "اكتب طريقاً على خريطة تدريب", objective: "Write three or four guided route lines on a fictional map; learners never need to reveal their real address or neighbourhood.", objectiveArabic: "اكتب ثلاث أو أربع جمل طريق موجهة على خريطة خيالية؛ لا يحتاج المتعلم أبداً إلى كشف عنوانه أو حيه الحقيقي.", stage: "meaningful-use", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Use the practice map only. Choose a start and destination. Write: Start at the ___. Go straight. Turn __ at the ___. The ___ is next to the ___.", writingPromptArabic: "استخدم خريطة التدريب فقط. اختر بداية ووجهة. اكتب: Start at the ___. Go straight. Turn __ at the ___. The ___ is next to the ___.", suggestedVocabulary: ["park", "shop", "school", "hospital", "left", "right", "next to"], sentencePatterns: ["Start at the ___.", "Go straight.", "Turn ___ at the ___.", "The ___ is next to the ___."] },
  ],
  72: [
    { id: "a1-m5-l72-lost-help-roleplay", kind: "interaction", title: "Practise lost-and-found help", titleArabic: "تدرّب على مساعدة الضائع", objective: "Use a flexible help exchange with a choice of destination, rather than performing one long fixed dialogue.", objectiveArabic: "استخدم تبادل مساعدة مرناً مع اختيار وجهة بدلاً من أداء حوار طويل ثابت واحد.", stage: "meaningful-use", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"], interactionTurns: [
      { id: "a1-m5-l72-turn-1", speaker: "Visitor", text: "Excuse me. Can you help me?", textArabic: "عفواً. هل يمكنك مساعدتي؟", purpose: "Begin politely when you need help." },
      { id: "a1-m5-l72-turn-2", speaker: "Helper", text: "Yes. Where do you want to go?", textArabic: "نعم. إلى أين تريد أن تذهب؟", purpose: "Ask for the destination without adding a long explanation." },
      { id: "a1-m5-l72-turn-3", speaker: "Visitor", text: "I want to go to the hospital.", textArabic: "أريد أن أذهب إلى المستشفى.", purpose: "Choose hospital, shop, park, or school; a fictional destination is fine." },
      { id: "a1-m5-l72-turn-4", speaker: "Helper", text: "Go straight. It is near the park.", textArabic: "اذهب مستقيماً. إنه قريب من الحديقة.", purpose: "Give one manageable direction and landmark." },
    ] },
    { id: "a1-m5-l72-kind-close", kind: "speaking", title: "Close the exchange kindly", titleArabic: "أنه التبادل بلطف", objective: "Say one thanks-and-response pair so navigation language remains social as well as practical.", objectiveArabic: "قل زوجاً واحداً للشكر والرد حتى تبقى لغة التنقل اجتماعية وعملية معاً.", stage: "supported-practice", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["worked-example", "transcript"], speakingLines: [
      { id: "a1-m5-l72-line-1", speaker: "Visitor", text: "Thank you for your help.", textArabic: "شكراً على مساعدتك.", pronunciationHint: "Say thank you as one quick friendly unit, then finish the line slowly.", audioText: "Thank you for your help." },
      { id: "a1-m5-l72-line-2", speaker: "Helper", text: "You are welcome.", textArabic: "على الرحب والسعة.", pronunciationHint: "This is a complete polite reply; speak it naturally once.", audioText: "You are welcome." },
    ] },
  ],
  73: [
    { id: "a1-m5-l73-listen-route", kind: "speaking", title: "Listen to a two-step route", titleArabic: "استمع إلى طريق من خطوتين", objective: "Hear two short route instructions before opening the transcript, then repeat one useful chunk.", objectiveArabic: "اسمع تعليمتي طريق قصيرتين قبل فتح النص ثم كرر عبارة مفيدة واحدة.", stage: "encounter", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"], speakingLines: [
      { id: "a1-m5-l73-line-1", speaker: "Route audio", text: "Go straight to the park.", textArabic: "اذهب مستقيماً إلى الحديقة.", pronunciationHint: "Listen once without reading. Then open the transcript if needed.", audioText: "Go straight to the park." },
      { id: "a1-m5-l73-line-2", speaker: "Route audio", text: "Turn right at the park.", textArabic: "انعطف يميناً عند الحديقة.", pronunciationHint: "Notice the landmark park in both instructions.", audioText: "Turn right at the park." },
    ] },
    { id: "a1-m5-l73-route-response", kind: "interaction", title: "Choose the next landmark", titleArabic: "اختر المعلم التالي", objective: "Respond to a heard route by selecting the next landmark, keeping listening focused on meaning rather than perfect recall.", objectiveArabic: "استجب لطريق مسموع باختيار المعلم التالي مع إبقاء الاستماع مركزاً على المعنى لا الاستدعاء المثالي.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "transcript", "word-support"], interactionTurns: [
      { id: "a1-m5-l73-turn-1", speaker: "Heard", text: "Go straight to the park.", textArabic: "اذهب مستقيماً إلى الحديقة.", purpose: "Choose park as the first landmark." },
      { id: "a1-m5-l73-turn-2", speaker: "Heard", text: "Turn right at the park.", textArabic: "انعطف يميناً عند الحديقة.", purpose: "Choose right as the next action." },
      { id: "a1-m5-l73-turn-3", speaker: "Finish", text: "The shop is next to the bank.", textArabic: "المتجر بجانب البنك.", purpose: "Find shop from the last location clue." },
    ] },
  ],
  74: [
    { id: "a1-m5-l74-town-tools-review", kind: "review", title: "Collect four town tools", titleArabic: "اجمع أربع أدوات للمدينة", objective: "Retrieve one place, question, direction, and location phrase from the module without adding new vocabulary before the checkpoint.", objectiveArabic: "استدعِ مكاناً وسؤالاً واتجاهاً وعبارة مكان من الوحدة دون إضافة مفردات جديدة قبل الاختبار.", stage: "retrieval", estimatedMinutes: 7, semantic: "retrieval", progressiveSupports: ["worked-example", "word-support", "tip"], sentencePatterns: ["Where is the ___?", "Go straight.", "Turn ___.", "It is next to the ___."] },
    { id: "a1-m5-l74-map-repair", kind: "interaction", title: "Repair a tiny map dialogue", titleArabic: "أصلح حوار خريطة صغير", objective: "Choose missing route words in a short meaningful exchange, using context instead of look-alike spelling distractors.", objectiveArabic: "اختر كلمات طريق مفقودة في تبادل قصير ذي معنى مستخدماً السياق بدلاً من مشتتات إملائية متشابهة.", stage: "meaningful-use", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m5-l74-turn-1", speaker: "Visitor", text: "Where is the shop?", textArabic: "أين المتجر؟", purpose: "Start with the location question." },
      { id: "a1-m5-l74-turn-2", speaker: "Helper", text: "Go straight and turn left at the park.", textArabic: "اذهب مستقيماً وانعطف يساراً عند الحديقة.", purpose: "Choose straight and left from the route context." },
      { id: "a1-m5-l74-turn-3", speaker: "Helper", text: "It is next to the bank.", textArabic: "إنه بجانب البنك.", purpose: "Finish with the relationship between two places." },
    ] },
  ],
  75: [
    { id: "a1-m5-l75-town-checkpoint", kind: "assessment", title: "Show your getting-around tools", titleArabic: "أظهر أدواتك للتنقل", objective: "Use place, question, direction, reading, and route language in several small contexts that show a next practice step rather than a judgement.", objectiveArabic: "استخدم لغة المكان والسؤال والاتجاه والقراءة والطريق في سياقات صغيرة متعددة تظهر خطوة التدريب التالية لا حكماً على المتعلم.", stage: "evidence", estimatedMinutes: 12, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"], writingPrompt: "Complete four small tasks: choose a place from a sign, ask Where is ...?, follow two route steps, and write one line about a fictional map. Use the word bank when needed.", writingPromptArabic: "أكمل أربع مهام صغيرة: اختر مكاناً من علامة، واسأل Where is ...?، واتبع خطوتي طريق، واكتب سطراً واحداً عن خريطة خيالية. استخدم بنك الكلمات عند الحاجة.", suggestedVocabulary: ["shop", "park", "hospital", "left", "right", "straight", "near", "next to"], sentencePatterns: ["Where is the ___?", "Go straight.", "Turn ___.", "The ___ is next to the ___."] },
    { id: "a1-m5-l75-next-bridge", kind: "review", title: "Carry one useful exchange forward", titleArabic: "خذ تبادلاً مفيداً إلى الأمام", objective: "Keep one polite help-and-direction exchange ready as the course moves into work, hobbies, and fuller everyday conversations.", objectiveArabic: "احتفظ بتبادل واحد مهذب للمساعدة والاتجاه جاهزاً مع انتقال الدورة إلى العمل والهوايات والمحادثات اليومية الأكمل.", stage: "next-bridge", estimatedMinutes: 4, semantic: "retrieval", progressiveSupports: ["worked-example", "tip"], writingPrompt: "Choose one line to keep: Can you help me? / Where is the ___? / Go straight. Say it once, then take it with you to the final A1 module.", writingPromptArabic: "اختر جملة واحدة للاحتفاظ بها: Can you help me? / Where is the ___? / Go straight. قلها مرة ثم خذها معك إلى الوحدة الأخيرة من A1.", sentencePatterns: ["Can you help me?", "Where is the ___?", "Go straight."] },
  ],
};

export const A1_MODULE_5_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = Object.fromEntries(
  Object.entries(authoredActivities).map(([lessonNumber, activities]) => [Number(lessonNumber), activities.map(toLessonActivity)]),
);
