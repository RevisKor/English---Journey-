import type {
  LessonActivity,
  LessonExperienceStage,
  LessonProgressionStage,
  ProgressiveSupport,
  ReadingCheck,
  VisualVocabularyItem,
} from "./types";

type LegacyBilingualReadingCheck = {
  id: string;
  question: string;
  questionArabic: string;
  answer: string;
  answerArabic?: string;
};

type Module4ActivityDraft = Omit<LessonActivity, "stage" | "progressiveSupports" | "readingChecks"> & {
  stage: LessonProgressionStage | LessonExperienceStage;
  progressiveSupports: Array<ProgressiveSupport | "accessible-tip">;
  readingChecks?: Array<ReadingCheck | LegacyBilingualReadingCheck>;
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

function toLessonActivity(activity: Module4ActivityDraft): LessonActivity {
  const stage: LessonProgressionStage = activity.stage in activityStageMap
    ? activityStageMap[activity.stage as LessonExperienceStage]
    : activity.stage as LessonProgressionStage;
  const readingChecks = activity.readingChecks?.map((check) => {
    if ("prompt" in check) return check;
    return {
      id: check.id,
      type: "detail" as const,
      prompt: check.question,
      promptArabic: check.questionArabic,
      answer: check.answer,
      explanation: check.answerArabic,
    };
  });

  return {
    ...activity,
    stage,
    progressiveSupports: activity.progressiveSupports.map((support) => support === "accessible-tip" ? "tip" : support),
    readingChecks,
  };
}

const partsOfDayVisuals: VisualVocabularyItem[] = [
  { id: "a1-m4-l46-morning", word: "morning", arabic: "صباح", pronunciation: "/ˈmɔːnɪŋ/", exampleEN: "I study in the morning.", exampleAR: "أدرس في الصباح.", altText: "A pale sun above a person with a book in the morning", category: "Time of day", interactionHint: "Hear morning, find the early sun, then say the word once." },
  { id: "a1-m4-l46-afternoon", word: "afternoon", arabic: "بعد الظهر", pronunciation: "/ˌɑːftəˈnuːn/", exampleEN: "We eat in the afternoon.", exampleAR: "نأكل بعد الظهر.", altText: "A bright afternoon sun above a meal", category: "Time of day", interactionHint: "Hear afternoon slowly. It is a longer word; clap its two strong parts if useful." },
  { id: "a1-m4-l46-evening", word: "evening", arabic: "مساء", pronunciation: "/ˈiːvnɪŋ/", exampleEN: "She comes home in the evening.", exampleAR: "تعود إلى المنزل في المساء.", altText: "An orange evening sky over a small home", category: "Time of day", interactionHint: "Hear evening, find the orange sky, then repeat only the first part: eve-." },
  { id: "a1-m4-l46-night", word: "night", arabic: "ليل", pronunciation: "/naɪt/", exampleEN: "I sleep at night.", exampleAR: "أنام في الليل.", altText: "A moon and stars over a bed at night", category: "Time of day", interactionHint: "Hear night, find the moon, and notice the long /aɪ/ sound." },
];

const routineActionVisuals: VisualVocabularyItem[] = [
  { id: "a1-m4-l48-wake", word: "wake up", arabic: "يستيقظ", pronunciation: "/weɪk ʌp/", exampleEN: "I wake up early.", exampleAR: "أستيقظ مبكراً.", altText: "An alarm clock beside a person waking up", category: "Routine action", interactionHint: "Hear wake up as one small phrase, then point to the alarm." },
  { id: "a1-m4-l48-eat", word: "eat", arabic: "يأكل", pronunciation: "/iːt/", exampleEN: "I eat breakfast.", exampleAR: "أتناول الفطور.", altText: "A person eating breakfast at a table", category: "Routine action", interactionHint: "Hear eat, make the long /iː/ sound, then say the whole word." },
  { id: "a1-m4-l48-go", word: "go", arabic: "يذهب", pronunciation: "/ɡəʊ/", exampleEN: "They go to school.", exampleAR: "يذهبون إلى المدرسة.", altText: "A person walking towards a school", category: "Routine action", interactionHint: "Hear go, trace the walking arrow, then repeat the long ending sound." },
  { id: "a1-m4-l48-come-home", word: "come home", arabic: "يعود إلى المنزل", pronunciation: "/kʌm həʊm/", exampleEN: "I come home at five.", exampleAR: "أعود إلى المنزل عند الخامسة.", altText: "A person arriving at a house in the evening", category: "Routine action", interactionHint: "Hear come home together. It is a useful two-word action." },
];

const authoredActivities: Record<number, Module4ActivityDraft[]> = {
  46: [
    { id: "a1-m4-l46-day-picture-sort", kind: "visual-vocabulary", title: "Put four pictures in one day", titleArabic: "رتّب أربع صور في يوم واحد", objective: "Connect morning, afternoon, evening, and night to simple light-and-place clues before using them in a sentence.", objectiveArabic: "اربط كلمات morning وafternoon وevening وnight بإشارات بسيطة للضوء والمكان قبل استعمالها في جملة.", stage: "encounter", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], visualItems: partsOfDayVisuals },
    { id: "a1-m4-l46-day-one-line", kind: "speaking", title: "Say one part of your day", titleArabic: "قل جزءاً واحداً من يومك", objective: "Use one choice frame without needing to describe a full personal routine.", objectiveArabic: "استخدم قالب اختيار واحد من دون الحاجة إلى وصف روتينك الشخصي كاملاً.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help"], speakingLines: [
      { id: "a1-m4-l46-line-1", speaker: "Model", text: "In the morning, I study.", textArabic: "في الصباح، أدرس.", pronunciationHint: "Pause briefly after morning; the comma shows the two parts of the idea.", audioText: "In the morning, I study." },
      { id: "a1-m4-l46-line-2", speaker: "Your turn", text: "At night, I sleep.", textArabic: "في الليل، أنام.", pronunciationHint: "Choose the time word that feels useful, then keep the sentence short.", audioText: "At night, I sleep." },
    ] },
    { id: "a1-m4-l46-day-recall", kind: "review", title: "Point before you look", titleArabic: "أشر قبل أن تنظر", objective: "Retrieve one time-of-day word from its picture cue instead of rereading all four words.", objectiveArabic: "استدعِ كلمة واحدة لوقت من اليوم من إشارتها البصرية بدلاً من إعادة قراءة الكلمات الأربع.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["in the morning", "in the evening", "at night"] },
  ],
  47: [
    { id: "a1-m4-l47-morning-strip", kind: "interaction", title: "Build a calm morning strip", titleArabic: "ابنِ شريط صباح هادئ", objective: "Place three ready-made actions in a sensible order and notice that a routine is a sequence, not a grammar test.", objectiveArabic: "ضع ثلاثة أفعال جاهزة بترتيب منطقي ولاحظ أن الروتين تسلسل وليس اختباراً في القواعد.", stage: "orientation", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help", "tip"], interactionTurns: [
      { id: "a1-m4-l47-turn-1", speaker: "First", text: "I wake up.", textArabic: "أستيقظ.", purpose: "Choose this as the first morning action." },
      { id: "a1-m4-l47-turn-2", speaker: "Then", text: "I eat breakfast.", textArabic: "أتناول الفطور.", purpose: "Put this after waking up." },
      { id: "a1-m4-l47-turn-3", speaker: "After that", text: "I go to school.", textArabic: "أذهب إلى المدرسة.", purpose: "Use this as the final action in the practice strip." },
    ] },
    { id: "a1-m4-l47-first-person-notice", kind: "standard", title: "Keep I with the verb", titleArabic: "استخدم I مع الفعل", objective: "Notice that I wake, I eat, and I go use the verb directly; do not add an unnecessary ending today.", objectiveArabic: "لاحظ أن I wake وI eat وI go تستخدم الفعل مباشرة؛ لا تضف نهاية غير ضرورية اليوم.", stage: "notice", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "accessible-tip"], writingPrompt: "Read the three model lines. Circle I, then say the action word after it: I wake / I eat / I go.", writingPromptArabic: "اقرأ الجمل النموذجية الثلاث. ضع دائرة حول I ثم قل الفعل بعدها: I wake / I eat / I go.", sentencePatterns: ["I wake up.", "I eat breakfast.", "I go to school."] },
    { id: "a1-m4-l47-morning-choice", kind: "writing", title: "Choose a practice morning", titleArabic: "اختر صباحاً للتدريب", objective: "Write two guided lines about a fictional or typical morning, so no learner must share personal details.", objectiveArabic: "اكتب سطرين موجّهين عن صباح خيالي أو نموذجي، لذلك لا يضطر أي متعلم لمشاركة تفاصيل شخصية.", stage: "meaningful-use", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], writingPrompt: "Choose a person called Sam or Lina. Complete: In the morning, ___. Then, ___.", writingPromptArabic: "اختر شخصاً اسمه Sam أو Lina. أكمل: In the morning, ___. Then, ___.", suggestedVocabulary: ["wake up", "eat", "go", "study"], sentencePatterns: ["In the morning, I ___.", "Then, I ___."] },
  ],
  48: [
    { id: "a1-m4-l48-action-picture-listen", kind: "visual-vocabulary", title: "Hear the action, find the picture", titleArabic: "اسمع الفعل ثم ابحث عن الصورة", objective: "Build sound-to-action recognition for four common routine phrases without adding a grammar explanation.", objectiveArabic: "ابنِ تعرّفاً من الصوت إلى الفعل لأربع عبارات روتينية شائعة من دون إضافة شرح قواعد.", stage: "encounter", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], visualItems: routineActionVisuals },
    { id: "a1-m4-l48-action-chain", kind: "interaction", title: "Pass the action along", titleArabic: "مرّر الفعل في السلسلة", objective: "Respond to a short routine chain with one new action, using familiar food and home vocabulary naturally.", objectiveArabic: "استجب لسلسلة روتين قصيرة بفعل جديد مستخدماً مفردات الطعام والمنزل المألوفة بشكل طبيعي.", stage: "supported-practice", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m4-l48-chain-1", speaker: "Starter", text: "I wake up early.", textArabic: "أستيقظ مبكراً.", purpose: "Repeat it once; early describes when, not what you do." },
      { id: "a1-m4-l48-chain-2", speaker: "Next", text: "I eat bread and tea.", textArabic: "أتناول خبزاً وشايًا.", purpose: "Notice that food from Module 3 returns in a routine." },
      { id: "a1-m4-l48-chain-3", speaker: "Your link", text: "I go to work.", textArabic: "أذهب إلى العمل.", purpose: "Say this, or choose school instead of work." },
    ] },
  ],
  49: [
    { id: "a1-m4-l49-two-people-notice", kind: "standard", title: "See the small change for he and she", titleArabic: "شاهد التغيير الصغير مع he وshe", objective: "Compare I work with he works and I study with she studies through two people, not a long grammar label.", objectiveArabic: "قارن بين I work وhe works وبين I study وshe studies من خلال شخصين لا من خلال اسم نحوي طويل.", stage: "notice", estimatedMinutes: 9, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"], writingPrompt: "Look at the pair: I work. / He works. The action is the same; he and she usually need a small -s ending in this lesson.", writingPromptArabic: "انظر إلى الزوج: I work. / He works. الفعل نفسه؛ يحتاج he وshe عادةً إلى نهاية صغيرة -s في هذا الدرس.", sentencePatterns: ["I work. / He works.", "I study. / She studies.", "I go. / He goes."] },
    { id: "a1-m4-l49-person-card", kind: "interaction", title: "Give each person one routine", titleArabic: "امنح كل شخص روتيناً واحداً", objective: "Choose the correct verb shape for a picture-card person, with a clear contrast between I and he/she.", objectiveArabic: "اختر شكل الفعل الصحيح لشخص في بطاقة صورة مع مقارنة واضحة بين I وhe/she.", stage: "supported-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help", "word-support"], interactionTurns: [
      { id: "a1-m4-l49-card-1", speaker: "Lina", text: "She studies in the morning.", textArabic: "هي تدرس في الصباح.", purpose: "Study becomes studies with she." },
      { id: "a1-m4-l49-card-2", speaker: "Omar", text: "He goes to work early.", textArabic: "هو يذهب إلى العمل مبكراً.", purpose: "Go changes to goes with he." },
      { id: "a1-m4-l49-card-3", speaker: "You", text: "I go to school.", textArabic: "أنا أذهب إلى المدرسة.", purpose: "Keep go without -s after I." },
    ] },
    { id: "a1-m4-l49-two-line-speaking", kind: "speaking", title: "Say the pair aloud", titleArabic: "قل الزوج بصوت عالٍ", objective: "Hear and produce the contrast once so the written -s does not remain only on the screen.", objectiveArabic: "اسمع وأنتج الفرق مرة واحدة حتى لا تبقى -s المكتوبة على الشاشة فقط.", stage: "meaningful-use", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["worked-example"], speakingLines: [
      { id: "a1-m4-l49-line-1", speaker: "Me", text: "I work on Monday.", textArabic: "أنا أعمل يوم الاثنين.", pronunciationHint: "Say I clearly, then work as one strong beat.", audioText: "I work on Monday." },
      { id: "a1-m4-l49-line-2", speaker: "My friend", text: "She works on Monday.", textArabic: "هي تعمل يوم الاثنين.", pronunciationHint: "Let the final /s/ in works be small but audible.", audioText: "She works on Monday." },
    ] },
  ],
  50: [
    { id: "a1-m4-l50-clock-choice", kind: "interaction", title: "Match a clock to a simple line", titleArabic: "طابق الساعة مع جملة بسيطة", objective: "Use only o'clock times first, matching an analogue clock picture to a ready-made routine sentence.", objectiveArabic: "استخدم أوقات o'clock فقط أولاً وطابق صورة ساعة بعقارب مع جملة روتين جاهزة.", stage: "encounter", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"], interactionTurns: [
      { id: "a1-m4-l50-clock-1", speaker: "Clock", text: "7:00", textArabic: "الساعة السابعة", purpose: "Say: It is seven o'clock." },
      { id: "a1-m4-l50-clock-2", speaker: "Routine", text: "I eat at seven o'clock.", textArabic: "أتناول الطعام عند الساعة السابعة.", purpose: "Use at before the time." },
      { id: "a1-m4-l50-clock-3", speaker: "Clock", text: "9:00", textArabic: "الساعة التاسعة", purpose: "Choose the matching school or work action." },
    ] },
    { id: "a1-m4-l50-time-question", kind: "speaking", title: "Ask and answer one time question", titleArabic: "اسأل وأجب عن سؤال وقت واحد", objective: "Practise a short exchange where the learner can use a model instead of inventing a schedule.", objectiveArabic: "تدرّب على حوار قصير يمكن فيه للمتعلم استخدام نموذج بدلاً من اختراع جدول.", stage: "supported-practice", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["transcript", "worked-example", "arabic-help"], speakingLines: [
      { id: "a1-m4-l50-line-1", speaker: "A", text: "What time is it?", textArabic: "كم الساعة؟", pronunciationHint: "Join what time smoothly; the question rises at the end.", audioText: "What time is it?" },
      { id: "a1-m4-l50-line-2", speaker: "B", text: "It is seven o'clock.", textArabic: "إنها الساعة السابعة.", pronunciationHint: "Keep seven and o'clock clear; no need to speak quickly.", audioText: "It is seven o'clock." },
      { id: "a1-m4-l50-line-3", speaker: "A", text: "I go to school at seven.", textArabic: "أذهب إلى المدرسة عند السابعة.", pronunciationHint: "Stress school lightly; at links the action to the time.", audioText: "I go to school at seven." },
    ] },
  ],
  51: [
    { id: "a1-m4-l51-school-day-read", kind: "reading", title: "Read a small school-day postcard", titleArabic: "اقرأ بطاقة قصيرة عن يوم دراسي", objective: "Read for the order of a familiar day, using headings and known action words as support.", objectiveArabic: "اقرأ لمعرفة ترتيب يوم مألوف مستخدماً العناوين وأفعال الحركة المعروفة للدعم.", stage: "meaningful-use", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "tip"], readingText: "Maya is a student. She wakes up at seven. She eats breakfast with her family. At eight, she goes to school. She studies English in the afternoon. In the evening, Maya comes home and reads a short book. At night, she sleeps early.", readingTextArabic: "Maya طالبة. تستيقظ عند السابعة. تتناول الفطور مع عائلتها. عند الثامنة تذهب إلى المدرسة. تدرس الإنجليزية بعد الظهر. في المساء تعود Maya إلى المنزل وتقرأ كتاباً قصيراً. في الليل تنام مبكراً.", readingChecks: [
      { id: "a1-m4-l51-check-1", question: "What does Maya do at eight?", questionArabic: "ماذا تفعل Maya عند الثامنة؟", answer: "She goes to school.", answerArabic: "تذهب إلى المدرسة." },
      { id: "a1-m4-l51-check-2", question: "When does Maya read?", questionArabic: "متى تقرأ Maya؟", answer: "In the evening.", answerArabic: "في المساء." },
    ] },
    { id: "a1-m4-l51-reading-echo", kind: "speaking", title: "Echo one useful sentence", titleArabic: "كرر جملة مفيدة واحدة", objective: "Choose one line from the text to repeat, turning reading comprehension into low-pressure spoken practice.", objectiveArabic: "اختر جملة واحدة من النص لتكرارها وحوّل فهم القراءة إلى تدريب شفهي بلا ضغط.", stage: "supported-practice", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["transcript", "worked-example"], speakingLines: [
      { id: "a1-m4-l51-echo-1", speaker: "From the text", text: "She goes to school at eight.", textArabic: "هي تذهب إلى المدرسة عند الثامنة.", pronunciationHint: "Keep goes together and pause before at eight.", audioText: "She goes to school at eight." },
      { id: "a1-m4-l51-echo-2", speaker: "From the text", text: "At night, she sleeps early.", textArabic: "في الليل، تنام مبكراً.", pronunciationHint: "Try one short pause after night.", audioText: "At night, she sleeps early." },
    ] },
  ],
  52: [
    { id: "a1-m4-l52-frequency-line", kind: "standard", title: "Put routine words on a gentle line", titleArabic: "ضع كلمات الروتين على خط بسيط", objective: "Feel the meaning of always, sometimes, and never as frequency choices before memorising their position in a sentence.", objectiveArabic: "اشعر بمعنى always وsometimes وnever كخيارات للتكرار قبل حفظ موقعها في الجملة.", stage: "notice", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"], writingPrompt: "Imagine a line from every day to no days. always is near every day; sometimes is in the middle; never is at no days.", writingPromptArabic: "تخيل خطاً من كل الأيام إلى لا أيام. always قريبة من كل يوم؛ sometimes في الوسط؛ never عند لا أيام.", sentencePatterns: ["I always eat breakfast.", "I sometimes read at night.", "I never drink coffee."] },
    { id: "a1-m4-l52-honest-or-imagined", kind: "writing", title: "Choose a routine card", titleArabic: "اختر بطاقة روتين", objective: "Complete two model sentences about a fictional character or an optional personal habit, with no pressure to disclose.", objectiveArabic: "أكمل جملتين نموذجيتين عن شخصية خيالية أو عادة شخصية اختيارية دون ضغط للكشف عن معلومات.", stage: "meaningful-use", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "arabic-help"], writingPrompt: "Choose Sam, Lina, or yourself. Write: ___ always ___. ___ sometimes ___.", writingPromptArabic: "اختر Sam أو Lina أو نفسك. اكتب: ___ always ___. ___ sometimes ___.", suggestedVocabulary: ["always", "sometimes", "never", "eat", "study", "sleep"], sentencePatterns: ["Sam always ___.", "Lina sometimes ___."] },
    { id: "a1-m4-l52-frequency-recall", kind: "review", title: "Say one frequency word without looking", titleArabic: "قل كلمة تكرار واحدة دون نظر", objective: "Retrieve one meaningful frequency word and attach it to a familiar action.", objectiveArabic: "استدعِ كلمة تكرار ذات معنى واحدة واربطها بفعل مألوف.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["always eat", "sometimes study", "never sleep late"] },
  ],
  53: [
    { id: "a1-m4-l53-routine-interview", kind: "speaking", title: "Ask about a ready-made routine", titleArabic: "اسأل عن روتين جاهز", objective: "Use do in a supportive mini-interview about a fictional routine before asking a real person anything.", objectiveArabic: "استخدم do في مقابلة صغيرة داعمة عن روتين خيالي قبل سؤال شخص حقيقي عن أي شيء.", stage: "supported-practice", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["transcript", "worked-example", "arabic-help"], speakingLines: [
      { id: "a1-m4-l53-line-1", speaker: "A", text: "Do you study in the morning?", textArabic: "هل تدرس في الصباح؟", pronunciationHint: "Do begins the question; let your voice rise slightly at morning.", audioText: "Do you study in the morning?" },
      { id: "a1-m4-l53-line-2", speaker: "B", text: "Yes, I do.", textArabic: "نعم، أفعل.", pronunciationHint: "Keep the short answer together: Yes, I do.", audioText: "Yes, I do." },
      { id: "a1-m4-l53-line-3", speaker: "A", text: "Do you sleep early?", textArabic: "هل تنام مبكراً؟", pronunciationHint: "Early has two small beats: EAR-ly.", audioText: "Do you sleep early?" },
      { id: "a1-m4-l53-line-4", speaker: "B", text: "No, I do not.", textArabic: "لا، لا أفعل.", pronunciationHint: "Use the full form slowly today; it is clear and polite.", audioText: "No, I do not." },
    ] },
    { id: "a1-m4-l53-question-build", kind: "interaction", title: "Choose the question for the answer", titleArabic: "اختر السؤال المناسب للإجابة", objective: "Match a short answer to a routine question so do is learned through meaning, not a blank-only exercise.", objectiveArabic: "طابق إجابة قصيرة مع سؤال عن روتين حتى تتعلم do من خلال المعنى لا من خلال تمرين فراغات فقط.", stage: "meaningful-use", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m4-l53-match-1", speaker: "Answer", text: "Yes, I do.", textArabic: "نعم، أفعل.", purpose: "Choose: Do you work on Monday?" },
      { id: "a1-m4-l53-match-2", speaker: "Answer", text: "No, I do not.", textArabic: "لا، لا أفعل.", purpose: "Choose: Do you drink coffee at night?" },
    ] },
  ],
  54: [
    { id: "a1-m4-l54-two-lives-read", kind: "reading", title: "Read two small daily lives", titleArabic: "اقرأ حياتين يوميتين قصيرتين", objective: "Compare two simple routines for one useful difference instead of trying to understand every word at once.", objectiveArabic: "قارن روتينين بسيطين لمعرفة فرق واحد مفيد بدلاً من محاولة فهم كل كلمة دفعة واحدة.", stage: "meaningful-use", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "tip"], readingText: "Kareem works in a shop. He wakes up early and goes to work at eight. He comes home in the afternoon. Sara is a student. She goes to school at eight too, but she studies in the afternoon. In the evening, Kareem reads and Sara watches a film.", readingTextArabic: "Kareem يعمل في متجر. يستيقظ مبكراً ويذهب إلى العمل عند الثامنة. يعود إلى المنزل بعد الظهر. Sara طالبة. تذهب إلى المدرسة عند الثامنة أيضاً، لكنها تدرس بعد الظهر. في المساء يقرأ Kareem وتشاهد Sara فيلماً.", readingChecks: [
      { id: "a1-m4-l54-check-1", question: "Who works in a shop?", questionArabic: "من يعمل في متجر؟", answer: "Kareem.", answerArabic: "Kareem." },
      { id: "a1-m4-l54-check-2", question: "What does Sara do in the afternoon?", questionArabic: "ماذا تفعل Sara بعد الظهر؟", answer: "She studies.", answerArabic: "تدرس." },
      { id: "a1-m4-l54-check-3", question: "What is one difference in the evening?", questionArabic: "ما فرق واحد في المساء؟", answer: "Kareem reads and Sara watches a film.", answerArabic: "يقرأ Kareem وتشاهد Sara فيلماً." },
    ] },
    { id: "a1-m4-l54-compare-line", kind: "interaction", title: "Choose one true comparison", titleArabic: "اختر مقارنة صحيحة واحدة", objective: "Use but to connect a real difference from the two texts with the sentence already scaffolded.", objectiveArabic: "استخدم but لربط فرق حقيقي من النصين والجملة مجهّزة بالدعم.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help"], interactionTurns: [
      { id: "a1-m4-l54-compare-1", speaker: "Model", text: "Kareem works, but Sara studies.", textArabic: "يعمل Kareem، لكن Sara تدرس.", purpose: "This is true because the two people have different daytime roles." },
      { id: "a1-m4-l54-compare-2", speaker: "Try", text: "Kareem reads, but Sara watches a film.", textArabic: "يقرأ Kareem، لكن Sara تشاهد فيلماً.", purpose: "Use the evening detail from the text." },
    ] },
  ],
  55: [
    { id: "a1-m4-l55-routine-context-check", kind: "assessment", title: "Choose the line that fits the day", titleArabic: "اختر الجملة التي تناسب اليوم", objective: "Show understanding through four short routine situations that mix time, action, and he/she forms in context.", objectiveArabic: "أظهر الفهم من خلال أربع مواقف روتينية قصيرة تجمع الوقت والفعل وصيغ he/she في السياق.", stage: "evidence", estimatedMinutes: 8, semantic: "assessment", progressiveSupports: ["arabic-help", "accessible-tip"], interactionTurns: [
      { id: "a1-m4-l55-task-1", speaker: "Picture", text: "Mona + books + 4 pm", textArabic: "Mona + كتب + 4 مساءً", purpose: "Choose: She studies in the afternoon." },
      { id: "a1-m4-l55-task-2", speaker: "Clock", text: "7:00 + breakfast", textArabic: "7:00 + فطور", purpose: "Choose: I eat breakfast at seven." },
      { id: "a1-m4-l55-task-3", speaker: "Question", text: "Do you work on Monday?", textArabic: "هل تعمل يوم الاثنين؟", purpose: "Choose a short Yes or No answer that matches the response cue." },
    ] },
    { id: "a1-m4-l55-kind-retry", kind: "review", title: "Repair one line kindly", titleArabic: "أصلح جملة واحدة بلطف", objective: "Correct one small routine error by comparing it with a model, treating an error as information rather than failure.", objectiveArabic: "صحح خطأً صغيراً واحداً في الروتين بمقارنته مع نموذج وتعامل مع الخطأ كمعلومة لا كفشل.", stage: "retrieval", estimatedMinutes: 4, semantic: "retrieval", progressiveSupports: ["worked-example", "tip"], writingPrompt: "Look at: She study in the morning. Compare it with the model and make one calm repair.", writingPromptArabic: "انظر إلى: She study in the morning. قارنها بالنموذج ثم أصلحها بهدوء مرة واحدة.", sentencePatterns: ["She studies in the morning."] },
  ],
  56: [
    { id: "a1-m4-l56-weekday-plan", kind: "writing", title: "Write a gentle weekday postcard", titleArabic: "اكتب بطاقة هادئة عن يوم أسبوعي", objective: "Create a four-line weekday postcard about an invented person, a typical day, or yourself, with choices rather than compulsory disclosure.", objectiveArabic: "أنشئ بطاقة من أربعة أسطر عن يوم أسبوعي لشخص خيالي أو يوم نموذجي أو نفسك مع خيارات بدلاً من الإفصاح الإلزامي.", stage: "orientation", estimatedMinutes: 5, semantic: "objective", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Choose a name and a weekday. Write four short lines: morning action; time; afternoon action; evening action. A fictional routine is welcome.", writingPromptArabic: "اختر اسماً ويوماً من الأسبوع. اكتب أربعة أسطر قصيرة: فعل صباحي؛ وقت؛ فعل بعد الظهر؛ فعل مسائي. الروتين الخيالي مرحّب به.", suggestedVocabulary: ["Monday", "morning", "afternoon", "evening", "wake up", "go", "study", "come home"], sentencePatterns: ["On Monday, ___.", "At ___, ___.", "In the afternoon, ___.", "In the evening, ___."] },
    { id: "a1-m4-l56-postcard-model", kind: "writing", title: "Borrow a clear model, then change it", titleArabic: "استفد من نموذج واضح ثم غيّره", objective: "Use a short model for structure, then replace at least two details to create an original but accessible text.", objectiveArabic: "استخدم نموذجاً قصيراً للبنية ثم غيّر تفصيلين على الأقل لإنشاء نص أصلي وسهل.", stage: "meaningful-use", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Model: On Monday, Sam wakes up at seven. He goes to school at eight. In the afternoon, he studies English. In the evening, he comes home. Keep the shape, then change the person, day, time, or action.", writingPromptArabic: "النموذج: On Monday, Sam wakes up at seven. He goes to school at eight. In the afternoon, he studies English. In the evening, he comes home. احتفظ بالشكل ثم غيّر الشخص أو اليوم أو الوقت أو الفعل.", sentencePatterns: ["On ___, ___.", "He/She ___ at ___.", "In the afternoon, ___.", "In the evening, ___."] },
  ],
  57: [
    { id: "a1-m4-l57-tomorrow-board", kind: "interaction", title: "Plan one possible tomorrow", titleArabic: "خطط لغد محتمل واحد", objective: "Choose a light fictional or real plan using at and on, so time language is used for a purpose instead of recited.", objectiveArabic: "اختر خطة خفيفة خيالية أو حقيقية باستخدام at وon حتى تُستخدم لغة الوقت لغرض لا لترديدها.", stage: "meaningful-use", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"], interactionTurns: [
      { id: "a1-m4-l57-plan-1", speaker: "Day card", text: "On Tuesday", textArabic: "يوم الثلاثاء", purpose: "Use on before a named day." },
      { id: "a1-m4-l57-plan-2", speaker: "Time card", text: "at nine", textArabic: "عند التاسعة", purpose: "Use at before a clock time." },
      { id: "a1-m4-l57-plan-3", speaker: "Action card", text: "I study English.", textArabic: "أدرس الإنجليزية.", purpose: "Put the cards together: On Tuesday, I study English at nine." },
    ] },
    { id: "a1-m4-l57-plan-message", kind: "writing", title: "Send a tiny planning message", titleArabic: "أرسل رسالة تخطيط صغيرة", objective: "Write one practical sentence that could help a classmate understand a simple schedule.", objectiveArabic: "اكتب جملة عملية واحدة قد تساعد زميلاً على فهم جدول بسيط.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help"], writingPrompt: "Complete one message: On ___, I ___. / I ___ at ___.", writingPromptArabic: "أكمل رسالة واحدة: On ___, I ___. / I ___ at ___.", sentencePatterns: ["On Tuesday, I study.", "I study at nine."] },
  ],
  58: [
    { id: "a1-m4-l58-routine-rhythm", kind: "speaking", title: "Repeat a routine with rhythm", titleArabic: "كرر روتيناً بإيقاع", objective: "Listen to short, connected routine chunks and repeat them with a natural pause rather than word-by-word pronunciation.", objectiveArabic: "استمع إلى مقاطع روتين قصيرة ومتصلة وكررها مع توقف طبيعي لا كلمة كلمة.", stage: "encounter", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["transcript", "arabic-help", "tip"], speakingLines: [
      { id: "a1-m4-l58-line-1", speaker: "Rhythm", text: "I wake up at seven.", textArabic: "أستيقظ عند السابعة.", pronunciationHint: "Keep wake up joined; give seven one clear beat.", audioText: "I wake up at seven." },
      { id: "a1-m4-l58-line-2", speaker: "Rhythm", text: "Then I go to school.", textArabic: "ثم أذهب إلى المدرسة.", pronunciationHint: "Then begins the next step in the story; pause before it if you need to.", audioText: "Then I go to school." },
      { id: "a1-m4-l58-line-3", speaker: "Rhythm", text: "In the evening, I come home.", textArabic: "في المساء، أعود إلى المنزل.", pronunciationHint: "The phrase in the evening is one useful time chunk.", audioText: "In the evening, I come home." },
    ] },
    { id: "a1-m4-l58-listen-order", kind: "interaction", title: "Hear it once, choose the next step", titleArabic: "اسمعه مرة ثم اختر الخطوة التالية", objective: "Show listening by selecting the next action in a routine after hearing a line, with a transcript available after the first attempt.", objectiveArabic: "أظهر الاستماع باختيار الفعل التالي في روتين بعد سماع جملة مع نص متاح بعد المحاولة الأولى.", stage: "supported-practice", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["transcript", "worked-example"], interactionTurns: [
      { id: "a1-m4-l58-order-1", speaker: "Heard", text: "I wake up at seven.", textArabic: "أستيقظ عند السابعة.", purpose: "Choose breakfast, not sleep, as the likely next practice step." },
      { id: "a1-m4-l58-order-2", speaker: "Heard", text: "I come home in the evening.", textArabic: "أعود إلى المنزل في المساء.", purpose: "Choose an evening action such as reading or eating." },
    ] },
  ],
  59: [
    { id: "a1-m4-l59-routine-path-review", kind: "review", title: "Collect four useful routine tools", titleArabic: "اجمع أربع أدوات مفيدة للروتين", objective: "Reconnect a time word, an action, a frequency word, and a short question through a small choice board.", objectiveArabic: "أعد ربط كلمة وقت وفعل وكلمة تكرار وسؤال قصير من خلال لوحة خيارات صغيرة.", stage: "retrieval", estimatedMinutes: 8, semantic: "retrieval", progressiveSupports: ["arabic-help", "worked-example", "tip"], interactionTurns: [
      { id: "a1-m4-l59-tool-1", speaker: "Time", text: "in the morning", textArabic: "في الصباح", purpose: "Attach it to wake up, eat, or study." },
      { id: "a1-m4-l59-tool-2", speaker: "Action", text: "go to school", textArabic: "يذهب إلى المدرسة", purpose: "Use I go or she goes depending on the person." },
      { id: "a1-m4-l59-tool-3", speaker: "Frequency", text: "sometimes", textArabic: "أحياناً", purpose: "Use it to make one flexible routine statement." },
      { id: "a1-m4-l59-tool-4", speaker: "Question", text: "Do you study at night?", textArabic: "هل تدرس في الليل؟", purpose: "Answer with a short Yes or No phrase." },
    ] },
    { id: "a1-m4-l59-review-dialogue", kind: "interaction", title: "Repair a mixed-up mini-dialogue", titleArabic: "أصلح حواراً صغيراً مختلطاً", objective: "Put three familiar lines in a useful order and retrieve the course language as communication.", objectiveArabic: "ضع ثلاث جمل مألوفة بترتيب مفيد واستدعِ لغة المقرر كتواصل.", stage: "meaningful-use", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "transcript"], interactionTurns: [
      { id: "a1-m4-l59-dialogue-1", speaker: "A", text: "Do you study in the evening?", textArabic: "هل تدرس في المساء؟", purpose: "Put this first as the question." },
      { id: "a1-m4-l59-dialogue-2", speaker: "B", text: "Yes, I do.", textArabic: "نعم، أفعل.", purpose: "Put this after the question." },
      { id: "a1-m4-l59-dialogue-3", speaker: "B", text: "I sometimes study English at night.", textArabic: "أحياناً أدرس الإنجليزية في الليل.", purpose: "Use this as the extra meaningful detail." },
    ] },
  ],
  60: [
    { id: "a1-m4-l60-day-checkpoint", kind: "assessment", title: "Daily-life checkpoint: choose, read, and use", titleArabic: "اختبار الحياة اليومية: اختر واقرأ واستخدم", objective: "Show one small piece of evidence for time, routine verbs, he/she, questions, and a short practical message without repeating every activity from the module.", objectiveArabic: "أظهر دليلاً صغيراً واحداً للوقت وأفعال الروتين وhe/she والأسئلة ورسالة عملية قصيرة من دون تكرار كل نشاط من الوحدة.", stage: "evidence", estimatedMinutes: 12, semantic: "assessment", progressiveSupports: ["arabic-help", "accessible-tip"], interactionTurns: [
      { id: "a1-m4-l60-check-1", speaker: "Clock task", text: "7:00", textArabic: "7:00", purpose: "Choose the sentence that uses at seven correctly." },
      { id: "a1-m4-l60-check-2", speaker: "Person task", text: "Lina + study", textArabic: "Lina + تدرس", purpose: "Choose: She studies, not She study." },
      { id: "a1-m4-l60-check-3", speaker: "Reading task", text: "Maya comes home in the evening.", textArabic: "تعود Maya إلى المنزل في المساء.", purpose: "Answer one detail question from a two-line routine note." },
      { id: "a1-m4-l60-check-4", speaker: "Use task", text: "Tomorrow: Tuesday, 9:00, English", textArabic: "غداً: الثلاثاء، 9:00، الإنجليزية", purpose: "Write one planning line with on or at; a model is available." },
    ] },
    { id: "a1-m4-l60-next-bridge", kind: "review", title: "Carry one routine sentence outside", titleArabic: "خذ جملة روتين واحدة إلى الخارج", objective: "Choose a useful daily-life sentence to take into the next module, where English starts helping the learner move around town.", objectiveArabic: "اختر جملة مفيدة للحياة اليومية لتأخذها إلى الوحدة التالية حيث تبدأ الإنجليزية بمساعدة المتعلم على التنقل في المدينة.", stage: "next-bridge", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["I go to ___ at ___.", "Do you ___?", "She goes to ___."] },
  ],
};

export const A1_MODULE_4_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = Object.fromEntries(
  Object.entries(authoredActivities).map(([lessonNumber, activities]) => [Number(lessonNumber), activities.map(toLessonActivity)]),
);
