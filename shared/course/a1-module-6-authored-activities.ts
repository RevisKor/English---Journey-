import type {
  LessonActivity,
  LessonExperienceStage,
  LessonProgressionStage,
  ProgressiveSupport,
  ReadingCheck,
  VisualVocabularyItem,
} from "./types";

type Module6ActivityDraft = Omit<LessonActivity, "stage" | "progressiveSupports" | "readingChecks"> & {
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

function toLessonActivity(activity: Module6ActivityDraft): LessonActivity {
  const stage: LessonProgressionStage = activity.stage in activityStageMap
    ? activityStageMap[activity.stage as LessonExperienceStage]
    : activity.stage as LessonProgressionStage;

  return {
    ...activity,
    stage,
    progressiveSupports: activity.progressiveSupports.map((support) => support === "accessible-tip" ? "tip" : support),
  };
}

function jobImage(label: string, colour: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${label}"><rect width="320" height="180" fill="${colour}"/><circle cx="160" cy="64" r="28" fill="#fff7ed"/><path d="M105 154c8-38 30-57 55-57s47 19 55 57" fill="#fff7ed"/><text x="160" y="169" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1f2937">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const jobVisuals: VisualVocabularyItem[] = [
  { id: "a1-m6-l76-teacher", word: "teacher", arabic: "معلّم / معلّمة", pronunciation: "/ˈtiːtʃə/", exampleEN: "The teacher works at a school.", exampleAR: "يعمل المعلّم في مدرسة.", altText: "A teacher beside a board in a classroom", category: "Jobs", interactionHint: "Hear teach-er in two calm parts, then point to the classroom.", imageUrl: jobImage("Teacher", "#dbeafe") },
  { id: "a1-m6-l76-doctor", word: "doctor", arabic: "طبيب / طبيبة", pronunciation: "/ˈdɒktə/", exampleEN: "The doctor helps people.", exampleAR: "يساعد الطبيب الناس.", altText: "A doctor with a stethoscope at a clinic", category: "Jobs", interactionHint: "Say doctor once, then connect it to the hospital from the town module.", imageUrl: jobImage("Doctor", "#dcfce7") },
  { id: "a1-m6-l76-engineer", word: "engineer", arabic: "مهندس / مهندسة", pronunciation: "/ˌendʒɪˈnɪə/", exampleEN: "The engineer works with plans.", exampleAR: "يعمل المهندس مع المخططات.", altText: "An engineer looking at a simple building plan", category: "Jobs", interactionHint: "Listen to the middle sound: en-gi-neer. You do not need to say it quickly.", imageUrl: jobImage("Engineer", "#fef3c7") },
  { id: "a1-m6-l76-student", word: "student", arabic: "طالب / طالبة", pronunciation: "/ˈstjuːdnt/", exampleEN: "The student studies English.", exampleAR: "يدرس الطالب الإنجليزية.", altText: "A student with an English book at a desk", category: "People", interactionHint: "Notice the long /uː/ in student, then connect it to study from your routine lessons.", imageUrl: jobImage("Student", "#f3e8ff") },
];

const authoredActivities: Record<number, Module6ActivityDraft[]> = {
  76: [
    { id: "a1-m6-l76-job-picture-sort", kind: "visual-vocabulary", title: "Meet four people and jobs", titleArabic: "تعرّف إلى أربعة أشخاص ومهن", objective: "Connect four familiar people to work or study pictures before using them in personal-information questions.", objectiveArabic: "اربط أربعة أشخاص بصور عمل أو دراسة مألوفة قبل استخدامها في أسئلة المعلومات الشخصية.", stage: "encounter", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], visualItems: jobVisuals },
    { id: "a1-m6-l76-job-context-say", kind: "speaking", title: "Say one person and place", titleArabic: "قل شخصاً ومكانه", objective: "Say two short job-and-place phrases so the new words carry a real setting, not only a label.", objectiveArabic: "قل عبارتين قصيرتين للمهنة والمكان حتى تحمل الكلمات الجديدة سياقاً حقيقياً لا اسماً فقط.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "arabic-help"], speakingLines: [
      { id: "a1-m6-l76-line-1", speaker: "Model", text: "A teacher works at a school.", textArabic: "يعمل المعلّم في مدرسة.", pronunciationHint: "Pause after teacher, then keep works at together.", audioText: "A teacher works at a school." },
      { id: "a1-m6-l76-line-2", speaker: "Your turn", text: "A doctor works at a hospital.", textArabic: "يعمل الطبيب في مستشفى.", pronunciationHint: "Use the familiar town word hospital as your anchor.", audioText: "A doctor works at a hospital." },
    ] },
    { id: "a1-m6-l76-job-recall", kind: "review", title: "Name one person from a clue", titleArabic: "سمِّ شخصاً من إشارة", objective: "Retrieve one job word from its tool or place clue before reopening the bilingual card.", objectiveArabic: "استدعِ كلمة مهنة واحدة من أداة أو إشارة مكان قبل فتح البطاقة الثنائية اللغة.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip"], sentencePatterns: ["a teacher", "a doctor", "a student"] },
  ],
  77: [
    { id: "a1-m6-l77-work-question-exchange", kind: "interaction", title: "Ask about work or study", titleArabic: "اسأل عن العمل أو الدراسة", objective: "Use What do you do? in a short respectful exchange with a choice of job or study answer.", objectiveArabic: "استخدم What do you do? في تبادل قصير ومحترم مع اختيار إجابة عن العمل أو الدراسة.", stage: "orientation", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript"], interactionTurns: [
      { id: "a1-m6-l77-turn-1", speaker: "New friend", text: "What do you do?", textArabic: "ماذا تعمل؟", purpose: "Ask about a person's usual work or study." },
      { id: "a1-m6-l77-turn-2", speaker: "Sam", text: "I am a student. I study English.", textArabic: "أنا طالب. أدرس الإنجليزية.", purpose: "Give a simple study answer with a familiar action." },
      { id: "a1-m6-l77-turn-3", speaker: "New friend", text: "That is great.", textArabic: "هذا رائع.", purpose: "Respond warmly without needing a longer conversation." },
    ] },
    { id: "a1-m6-l77-question-shape", kind: "standard", title: "Keep do in the question", titleArabic: "ضع do في السؤال", objective: "Notice What do you do? as a useful whole question before comparing it with a short answer.", objectiveArabic: "لاحظ What do you do? كسؤال كامل مفيد قبل مقارنته بإجابة قصيرة.", stage: "notice", estimatedMinutes: 5, semantic: "grammar", progressiveSupports: ["worked-example", "arabic-help", "accessible-tip"], writingPrompt: "Read the exchange. Circle do in the question and am in the answer. Then choose one answer card: I am a teacher. / I am a student.", writingPromptArabic: "اقرأ التبادل. ضع دائرة حول do في السؤال وam في الإجابة. ثم اختر بطاقة إجابة واحدة: I am a teacher. / I am a student.", sentencePatterns: ["What do you do?", "I am a student.", "I am a teacher."] },
  ],
  78: [
    { id: "a1-m6-l78-hobby-choice-board", kind: "standard", title: "Choose a hobby from a calm board", titleArabic: "اختر هواية من لوحة بسيطة", objective: "Meet read, watch, play, music, football, and sport through meaningful leisure choices rather than a long word list.", objectiveArabic: "تعرّف إلى read وwatch وplay وmusic وfootball وsport من خلال اختيارات وقت فراغ ذات معنى بدلاً من قائمة كلمات طويلة.", stage: "encounter", estimatedMinutes: 7, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "tip"], writingPrompt: "Look at the hobby board. Point to one activity you know: read a book / watch a film / play football / listen to music.", writingPromptArabic: "انظر إلى لوحة الهوايات. أشر إلى نشاط واحد تعرفه: read a book / watch a film / play football / listen to music.", suggestedVocabulary: ["read", "watch", "play", "music", "football", "sport"] },
    { id: "a1-m6-l78-hobby-echo", kind: "speaking", title: "Try two hobby chunks", titleArabic: "جرّب عبارتين عن الهواية", objective: "Speak two hobby chunks with natural word partners instead of treating every new word separately.", objectiveArabic: "انطق عبارتين عن الهواية مع الكلمات التي ترافقها طبيعياً بدلاً من التعامل مع كل كلمة منفصلة.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "transcript"], speakingLines: [
      { id: "a1-m6-l78-line-1", speaker: "Model", text: "I read books.", textArabic: "أنا أقرأ الكتب.", pronunciationHint: "Read books is a short useful pair; keep the final /s/ soft.", audioText: "I read books." },
      { id: "a1-m6-l78-line-2", speaker: "Model", text: "I play football.", textArabic: "أنا ألعب كرة القدم.", pronunciationHint: "Say play football as one activity chunk.", audioText: "I play football." },
    ] },
  ],
  79: [
    { id: "a1-m6-l79-can-notice", kind: "standard", title: "Notice can and cannot", titleArabic: "لاحظ can وcannot", objective: "See can as an ability tool in short pairs before a learner tries one meaningful statement.", objectiveArabic: "شاهد can كأداة للقدرة في أزواج قصيرة قبل أن يجرب المتعلم جملة ذات معنى.", stage: "notice", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "accessible-tip"], writingPrompt: "Compare: I can play football. / I cannot play football. The action stays the same; can changes the meaning.", writingPromptArabic: "قارن: I can play football. / I cannot play football. يبقى الفعل نفسه؛ وتغيّر can المعنى.", sentencePatterns: ["I can ___.", "I cannot ___.", "Can you ___?"] },
    { id: "a1-m6-l79-ability-card", kind: "speaking", title: "Choose one ability card", titleArabic: "اختر بطاقة قدرة واحدة", objective: "Say one supported ability or not-yet ability from a fictional card, without pressure to disclose a personal skill.", objectiveArabic: "قل قدرة واحدة مدعومة أو قدرة لم تتعلمها بعد من بطاقة خيالية دون ضغط لكشف مهارة شخصية.", stage: "meaningful-use", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], speakingLines: [
      { id: "a1-m6-l79-line-1", speaker: "Character card", text: "I can play football.", textArabic: "أستطيع لعب كرة القدم.", pronunciationHint: "Can is usually light; make football the clear idea word.", audioText: "I can play football." },
      { id: "a1-m6-l79-line-2", speaker: "Character card", text: "I cannot swim.", textArabic: "لا أستطيع السباحة.", pronunciationHint: "Cannot is one word in careful speech. Say it slowly once.", audioText: "I cannot swim." },
    ] },
    { id: "a1-m6-l79-ability-retrieve", kind: "review", title: "Keep one can sentence", titleArabic: "احتفظ بجملة can واحدة", objective: "Retrieve one ability pattern before preferences and reasons add more connected ideas.", objectiveArabic: "استدعِ نمط قدرة واحد قبل أن تضيف التفضيلات والأسباب أفكاراً مترابطة أكثر.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip", "word-support"], sentencePatterns: ["I can ___.", "I cannot ___."] },
  ],
  80: [
    { id: "a1-m6-l80-like-reason-ladder", kind: "standard", title: "Build a like-and-reason ladder", titleArabic: "ابنِ سلّم إعجاب وسبب", objective: "Join I like ... with because ... through a visible two-part ladder rather than a dense explanation of connectors.", objectiveArabic: "اربط I like ... بـ because ... عبر سلّم واضح من جزأين بدلاً من شرح كثيف لأدوات الربط.", stage: "notice", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Put the cards together: I like music + because it is calm. Read the two parts as one idea.", writingPromptArabic: "ضع البطاقات معاً: I like music + because it is calm. اقرأ الجزأين كفكرة واحدة.", sentencePatterns: ["I like music because it is calm.", "I like football because it is fun."] },
    { id: "a1-m6-l80-character-preference", kind: "writing", title: "Write a preference for a character", titleArabic: "اكتب تفضيلاً لشخصية", objective: "Write one guided preference and reason for a fictional character before choosing whether to adapt it for yourself.", objectiveArabic: "اكتب تفضيلاً وسبباً موجهاً لشخصية خيالية قبل اختيار تعديله لنفسك إن رغبت.", stage: "meaningful-use", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Use the character card, not private information: Omar likes football because it is fun. Write one new line for a character who likes music or reading.", writingPromptArabic: "استخدم بطاقة الشخصية لا معلومات خاصة: Omar likes football because it is fun. اكتب سطراً جديداً لشخصية تحب الموسيقى أو القراءة.", suggestedVocabulary: ["music", "football", "reading", "calm", "fun", "because"], sentencePatterns: ["___ likes ___ because it is ___."] },
  ],
  81: [
    { id: "a1-m6-l81-weekend-invitation", kind: "interaction", title: "Read a weekend invitation", titleArabic: "اقرأ دعوة لعطلة نهاية الأسبوع", objective: "Follow a small invitation exchange with an invitation, an accepting answer, and a practical plan.", objectiveArabic: "اتبع تبادل دعوة صغيراً يحوي دعوة وإجابة قبول وخطة عملية.", stage: "orientation", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript"], interactionTurns: [
      { id: "a1-m6-l81-turn-1", speaker: "Lina", text: "Do you want to watch a film this weekend?", textArabic: "هل تريد مشاهدة فيلم في عطلة نهاية الأسبوع؟", purpose: "Make one friendly invitation." },
      { id: "a1-m6-l81-turn-2", speaker: "Hadi", text: "Yes, I do. That sounds good.", textArabic: "نعم، أريد. يبدو ذلك جيداً.", purpose: "Accept warmly without a long answer." },
      { id: "a1-m6-l81-turn-3", speaker: "Lina", text: "Great. Let us go together.", textArabic: "رائع. لنذهب معاً.", purpose: "Turn acceptance into a simple plan." },
    ] },
    { id: "a1-m6-l81-invitation-choice", kind: "speaking", title: "Choose a kind answer", titleArabic: "اختر إجابة لطيفة", objective: "Practise one acceptance or gentle refusal so a real invitation has more than one honest possible response.", objectiveArabic: "تدرّب على قبول واحد أو رفض لطيف حتى يكون للدعوة الحقيقية أكثر من رد صادق ممكن.", stage: "meaningful-use", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "transcript", "tip"], speakingLines: [
      { id: "a1-m6-l81-line-1", speaker: "Accept", text: "Yes, I would like to.", textArabic: "نعم، أود ذلك.", pronunciationHint: "Keep would like together as one polite answer.", audioText: "Yes, I would like to." },
      { id: "a1-m6-l81-line-2", speaker: "Refuse kindly", text: "Sorry, I cannot. Maybe tomorrow.", textArabic: "آسف، لا أستطيع. ربما غداً.", pronunciationHint: "A short sorry keeps the answer kind; pause before maybe tomorrow.", audioText: "Sorry, I cannot. Maybe tomorrow." },
    ] },
  ],
  82: [
    { id: "a1-m6-l82-tomorrow-plan-model", kind: "writing", title: "Read a small tomorrow plan", titleArabic: "اقرأ خطة صغيرة للغد", objective: "See going to as a simple plan pattern in three connected model lines before writing.", objectiveArabic: "شاهد going to كنمط خطة بسيط في ثلاثة أسطر نموذجية مترابطة قبل الكتابة.", stage: "orientation", estimatedMinutes: 5, semantic: "example", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Model plan: Tomorrow, I am going to study. Then I am going to watch a film. I am going to call my friend.", writingPromptArabic: "نموذج خطة: Tomorrow, I am going to study. Then I am going to watch a film. I am going to call my friend.", sentencePatterns: ["Tomorrow, I am going to ___.", "Then I am going to ___."] },
    { id: "a1-m6-l82-plan-card-write", kind: "writing", title: "Make a two-line plan card", titleArabic: "أنشئ بطاقة خطة من سطرين", objective: "Write two supported plan lines for a fictional or chosen safe activity, without requiring a learner to reveal their schedule.", objectiveArabic: "اكتب سطرين مدعومين للخطة لنشاط خيالي أو آمن مختار دون إلزام المتعلم بكشف جدوله.", stage: "meaningful-use", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Use a plan card or your own safe choice. Write two lines: Tomorrow, I am going to ___. Then I am going to ___.", writingPromptArabic: "استخدم بطاقة خطة أو اختياراً آمناً خاصاً بك. اكتب سطرين: Tomorrow, I am going to ___. Then I am going to ___.", suggestedVocabulary: ["study", "read", "watch", "play", "tomorrow", "together"], sentencePatterns: ["Tomorrow, I am going to ___.", "Then I am going to ___."] },
  ],
  83: [
    { id: "a1-m6-l83-busy-week-read", kind: "reading", title: "Read a busy but happy week", titleArabic: "اقرأ أسبوعاً مزدحماً لكنه سعيد", objective: "Read for work, a hobby, a reason, and a plan in one short connected text.", objectiveArabic: "اقرأ بحثاً عن العمل وهواية وسبب وخطة في نص قصير مترابط واحد.", stage: "meaningful-use", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "transcript", "tip"], readingText: "Maya is a teacher. She works at a school from Monday to Friday. After work, she reads or listens to music because it helps her relax. On Saturday, Maya is going to watch a football match with her brother. She is busy, but she is happy.", readingTextArabic: "مايا معلّمة. تعمل في مدرسة من الاثنين إلى الجمعة. بعد العمل تقرأ أو تستمع إلى الموسيقى لأنها تساعدها على الاسترخاء. يوم السبت ستشاهد مايا مباراة كرة قدم مع أخيها. هي مشغولة لكنها سعيدة.", readingChecks: [
      { id: "a1-m6-l83-check-1", type: "detail", prompt: "What does Maya do?", promptArabic: "ماذا تعمل مايا؟", answer: "She is a teacher.", explanation: "The first sentence names Maya's job." },
      { id: "a1-m6-l83-check-2", type: "detail", prompt: "Why does Maya listen to music?", promptArabic: "لماذا تستمع مايا إلى الموسيقى؟", answer: "Because it helps her relax.", explanation: "Because introduces the reason." },
      { id: "a1-m6-l83-check-3", type: "detail", prompt: "What is Maya going to do on Saturday?", promptArabic: "ماذا ستفعل مايا يوم السبت؟", answer: "Watch a football match with her brother.", explanation: "Look for is going to in the Saturday sentence." },
    ] },
    { id: "a1-m6-l83-reading-thread", kind: "interaction", title: "Collect four story threads", titleArabic: "اجمع أربعة خيوط من القصة", objective: "Turn the reading into four linked ideas—person, routine, reason, and plan—rather than treating it as isolated answers.", objectiveArabic: "حوّل القراءة إلى أربع أفكار مترابطة—شخص وروتين وسبب وخطة—بدلاً من التعامل معها كإجابات معزولة.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m6-l83-thread-1", speaker: "Person", text: "Maya is a teacher.", textArabic: "مايا معلّمة.", purpose: "Find who the story is about." },
      { id: "a1-m6-l83-thread-2", speaker: "Routine", text: "She works at a school.", textArabic: "تعمل في مدرسة.", purpose: "Find the usual weekday action." },
      { id: "a1-m6-l83-thread-3", speaker: "Reason", text: "Music helps her relax.", textArabic: "الموسيقى تساعدها على الاسترخاء.", purpose: "Find the reason clue." },
      { id: "a1-m6-l83-thread-4", speaker: "Plan", text: "She is going to watch a match.", textArabic: "هي ستشاهد مباراة.", purpose: "Find the weekend plan." },
    ] },
  ],
  84: [
    { id: "a1-m6-l84-work-people-read", kind: "reading", title: "Read about people at work", titleArabic: "اقرأ عن أشخاص في العمل", objective: "Use names and familiar jobs to follow who helps whom in a short workplace text.", objectiveArabic: "استخدم الأسماء والمهن المألوفة لتتبع من يساعد من في نص قصير عن مكان العمل.", stage: "meaningful-use", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "transcript"], readingText: "At the clinic, Dr Noor talks to a family. The nurse helps her. At the school, Mr Ali talks to his students. They ask him questions. Noor and Ali like their jobs because they help people every day.", readingTextArabic: "في العيادة تتحدث الدكتورة نور مع عائلة. تساعدها الممرضة. في المدرسة يتحدث الأستاذ علي مع طلابه. يسألونه أسئلة. تحب نور وعلي وظيفتيهما لأنهما يساعدان الناس كل يوم.", readingChecks: [
      { id: "a1-m6-l84-check-1", type: "detail", prompt: "Who helps Dr Noor?", promptArabic: "من يساعد الدكتورة نور؟", answer: "The nurse.", explanation: "The second sentence gives the helper." },
      { id: "a1-m6-l84-check-2", type: "detail", prompt: "Who asks Mr Ali questions?", promptArabic: "من يسأل الأستاذ علي أسئلة؟", answer: "His students.", explanation: "They refers to Mr Ali's students." },
      { id: "a1-m6-l84-check-3", type: "vocabulary", prompt: "What does they refer to in They ask him questions?", promptArabic: "إلى من تشير they في جملة They ask him questions؟", answer: "Mr Ali's students.", explanation: "The sentence before names the students." },
    ] },
    { id: "a1-m6-l84-pronoun-spot", kind: "standard", title: "Follow her, him, and them", titleArabic: "اتبع her وhim وthem", objective: "Notice three object pronouns as reading shortcuts connected to known people, not as a long pronoun table.", objectiveArabic: "لاحظ ثلاثة ضمائر مفعول كاختصارات للقراءة مرتبطة بأشخاص معروفين لا كجدول ضمائر طويل.", stage: "notice", estimatedMinutes: 6, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "accessible-tip"], writingPrompt: "Match each small word to the person or people in the text: her = Dr Noor; him = Mr Ali; them = the students.", writingPromptArabic: "طابق كل كلمة صغيرة مع الشخص أو الأشخاص في النص: her = Dr Noor؛ him = Mr Ali؛ them = the students.", sentencePatterns: ["The nurse helps her.", "They ask him questions.", "He helps them."] },
  ],
  85: [
    { id: "a1-m6-l85-interaction-context-check", kind: "assessment", title: "Choose the line that helps", titleArabic: "اختر الجملة المفيدة", objective: "Show understanding of job, hobby, ability, and plan language through short conversational situations rather than spelling traps.", objectiveArabic: "أظهر فهم لغة العمل والهواية والقدرة والخطة من خلال مواقف محادثة قصيرة لا من خلال فخاخ إملائية.", stage: "evidence", estimatedMinutes: 8, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"], writingPrompt: "For each short situation, choose a useful line: What do you do? / I can help. / I like music because it is calm. / I am going to study tomorrow.", writingPromptArabic: "لكل موقف قصير اختر جملة مفيدة: What do you do? / I can help. / I like music because it is calm. / I am going to study tomorrow.", suggestedVocabulary: ["job", "music", "can", "tomorrow", "because"], sentencePatterns: ["What do you do?", "I can ___.", "I like ___ because ___.", "I am going to ___."] },
    { id: "a1-m6-l85-tool-retrieve", kind: "review", title: "Keep one conversation tool", titleArabic: "احتفظ بأداة محادثة واحدة", objective: "Retrieve the phrase that would most help in a new conversation before drafting a short connected day.", objectiveArabic: "استدعِ العبارة التي ستساعد أكثر في محادثة جديدة قبل كتابة يوم قصير مترابط.", stage: "retrieval", estimatedMinutes: 3, semantic: "retrieval", progressiveSupports: ["tip", "word-support"], sentencePatterns: ["What do you do?", "I can help.", "I like ___ because ___."] },
  ],
  86: [
    { id: "a1-m6-l86-day-model", kind: "writing", title: "Read a connected day model", titleArabic: "اقرأ نموذج يوم مترابط", objective: "See how work or study, a hobby, and one reason can form a small connected paragraph.", objectiveArabic: "شاهد كيف يمكن للعمل أو الدراسة والهواية وسبب واحد أن تشكل فقرة صغيرة مترابطة.", stage: "orientation", estimatedMinutes: 6, semantic: "example", progressiveSupports: ["arabic-help", "worked-example", "word-support"], writingPrompt: "Model: Rami is a student. He studies in the morning. After class, he reads because he likes stories. Tomorrow, he is going to play football.", writingPromptArabic: "النموذج: رامي طالب. يدرس في الصباح. بعد الدرس يقرأ لأنه يحب القصص. غداً سيلعب كرة القدم.", sentencePatterns: ["___ is a ___.", "After ___, ___ ___.", "___ likes ___ because ___.", "Tomorrow, ___ is going to ___."] },
    { id: "a1-m6-l86-character-day-write", kind: "writing", title: "Write a small day for a character", titleArabic: "اكتب يوماً صغيراً لشخصية", objective: "Draft three or four guided lines about a fictional work-or-study day, with a clear option not to share personal details.", objectiveArabic: "اكتب ثلاثاً أو أربع جمل موجهة عن يوم عمل أو دراسة خيالي مع خيار واضح لعدم مشاركة تفاصيل شخصية.", stage: "meaningful-use", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Use the character card if you prefer privacy. Write: ___ is a ___. ___ works/studies in the ___. After ___, ___ likes ___. Tomorrow, ___ is going to ___.", writingPromptArabic: "استخدم بطاقة الشخصية إذا فضّلت الخصوصية. اكتب: ___ is a ___. ___ works/studies in the ___. After ___, ___ likes ___. Tomorrow, ___ is going to ___.", suggestedVocabulary: ["teacher", "student", "doctor", "read", "music", "football", "tomorrow"], sentencePatterns: ["___ is a ___.", "After ___, ___ likes ___.", "Tomorrow, ___ is going to ___."] },
  ],
  87: [
    { id: "a1-m6-l87-invite-accept-refuse", kind: "speaking", title: "Invite, accept, or refuse kindly", titleArabic: "ادعُ أو اقبل أو ارفض بلطف", objective: "Rehearse three social moves—invite, accept, and refuse—through short lines a learner can choose between.", objectiveArabic: "تدرّب على ثلاث حركات اجتماعية—الدعوة والقبول والرفض—من خلال أسطر قصيرة يمكن للمتعلم الاختيار بينها.", stage: "encounter", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"], speakingLines: [
      { id: "a1-m6-l87-line-1", speaker: "Invite", text: "Do you want to play football?", textArabic: "هل تريد لعب كرة القدم؟", pronunciationHint: "Let your voice rise gently at the end of the invitation.", audioText: "Do you want to play football?" },
      { id: "a1-m6-l87-line-2", speaker: "Accept", text: "Yes, I would like to.", textArabic: "نعم، أود ذلك.", pronunciationHint: "This is a polite whole phrase; do not separate would and like too much.", audioText: "Yes, I would like to." },
      { id: "a1-m6-l87-line-3", speaker: "Refuse", text: "Sorry, I cannot today.", textArabic: "آسف، لا أستطيع اليوم.", pronunciationHint: "Say sorry softly, then make today clear.", audioText: "Sorry, I cannot today." },
    ] },
    { id: "a1-m6-l87-response-sort", kind: "interaction", title: "Match a response to the moment", titleArabic: "طابق الرد مع الموقف", objective: "Choose which short reply fits an invitation without treating acceptance as the only correct social outcome.", objectiveArabic: "اختر الرد القصير الذي يناسب دعوة دون اعتبار القبول النتيجة الاجتماعية الصحيحة الوحيدة.", stage: "supported-practice", estimatedMinutes: 5, semantic: "activity", progressiveSupports: ["worked-example", "word-support", "tip"], interactionTurns: [
      { id: "a1-m6-l87-turn-1", speaker: "Invitation", text: "Do you want to watch a film?", textArabic: "هل تريد مشاهدة فيلم؟", purpose: "Read the kind invitation." },
      { id: "a1-m6-l87-turn-2", speaker: "Choice A", text: "Yes, I would like to.", textArabic: "نعم، أود ذلك.", purpose: "Use when the person wants to accept." },
      { id: "a1-m6-l87-turn-3", speaker: "Choice B", text: "Sorry, I cannot today.", textArabic: "آسف، لا أستطيع اليوم.", purpose: "Use when the person needs to decline politely." },
    ] },
  ],
  88: [
    { id: "a1-m6-l88-complete-conversation", kind: "interaction", title: "Build a complete conversation", titleArabic: "ابنِ محادثة كاملة", objective: "Connect greeting, work or study, hobby, invitation, and close in one flexible everyday exchange.", objectiveArabic: "اربط التحية والعمل أو الدراسة والهواية والدعوة والختام في تبادل يومي مرن واحد.", stage: "meaningful-use", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "transcript", "word-support"], interactionTurns: [
      { id: "a1-m6-l88-turn-1", speaker: "A", text: "Hi. What do you do?", textArabic: "مرحباً. ماذا تعمل؟", purpose: "Open with a greeting and one question." },
      { id: "a1-m6-l88-turn-2", speaker: "B", text: "I am a student. I like music.", textArabic: "أنا طالب. أحب الموسيقى.", purpose: "Give two small connected ideas." },
      { id: "a1-m6-l88-turn-3", speaker: "A", text: "I like music too. Do you want to listen together tomorrow?", textArabic: "أنا أحب الموسيقى أيضاً. هل تريد أن نستمع معاً غداً؟", purpose: "Use too and a simple invitation." },
      { id: "a1-m6-l88-turn-4", speaker: "B", text: "Yes, I would like to. See you tomorrow.", textArabic: "نعم، أود ذلك. أراك غداً.", purpose: "Accept and close the conversation." },
    ] },
    { id: "a1-m6-l88-conversation-rehearsal", kind: "speaking", title: "Rehearse one chosen turn", titleArabic: "تدرّب على دور واحد مختار", objective: "Say one selected conversation turn with support rather than requiring the learner to perform the whole exchange at once.", objectiveArabic: "انطق دوراً واحداً مختاراً مع دعم بدلاً من مطالبة المتعلم بأداء التبادل كاملاً دفعة واحدة.", stage: "supported-practice", estimatedMinutes: 4, semantic: "activity", progressiveSupports: ["worked-example", "transcript", "tip"], speakingLines: [
      { id: "a1-m6-l88-line-1", speaker: "Your turn", text: "I like music too.", textArabic: "أنا أحب الموسيقى أيضاً.", pronunciationHint: "Keep like music together, then add too at the end.", audioText: "I like music too." },
      { id: "a1-m6-l88-line-2", speaker: "Your turn", text: "See you tomorrow.", textArabic: "أراك غداً.", pronunciationHint: "This is a short friendly closing; say it as one piece.", audioText: "See you tomorrow." },
    ] },
  ],
  89: [
    { id: "a1-m6-l89-a1-toolbox-recall", kind: "review", title: "Collect your A1 conversation toolbox", titleArabic: "اجمع صندوق أدوات محادثة A1", objective: "Retrieve a small useful set of A1 tools—greeting, personal fact, question, preference, plan, and close—without adding new language.", objectiveArabic: "استدعِ مجموعة صغيرة مفيدة من أدوات A1—تحية وحقيقة شخصية وسؤال وتفضيل وخطة وختام—دون إضافة لغة جديدة.", stage: "retrieval", estimatedMinutes: 8, semantic: "retrieval", progressiveSupports: ["worked-example", "word-support", "tip"], writingPrompt: "Choose one tool for each card: Hello. / I am a student. / What do you do? / I like music. / I am going to study. / See you tomorrow.", writingPromptArabic: "اختر أداة واحدة لكل بطاقة: Hello. / I am a student. / What do you do? / I like music. / I am going to study. / See you tomorrow.", sentencePatterns: ["Hello.", "I am a ___.", "What do you do?", "I like ___.", "I am going to ___.", "See you tomorrow."] },
    { id: "a1-m6-l89-mini-dialogue-repair", kind: "interaction", title: "Repair a small A1 dialogue", titleArabic: "أصلح حوار A1 صغيراً", objective: "Use retrieved tools to complete a short familiar dialogue instead of facing a long cumulative test before the checkpoint.", objectiveArabic: "استخدم الأدوات المستدعاة لإكمال حوار قصير مألوف بدلاً من مواجهة اختبار تراكمي طويل قبل نقطة التحقق.", stage: "meaningful-use", estimatedMinutes: 6, semantic: "activity", progressiveSupports: ["worked-example", "word-support"], interactionTurns: [
      { id: "a1-m6-l89-turn-1", speaker: "A", text: "Hello. What do you do?", textArabic: "مرحباً. ماذا تعمل؟", purpose: "Start with a familiar greeting and question." },
      { id: "a1-m6-l89-turn-2", speaker: "B", text: "I am a student. I like reading.", textArabic: "أنا طالب. أحب القراءة.", purpose: "Choose the right personal-information and hobby tools." },
      { id: "a1-m6-l89-turn-3", speaker: "A", text: "Great. See you tomorrow.", textArabic: "رائع. أراك غداً.", purpose: "Choose a kind close." },
    ] },
  ],
  90: [
    { id: "a1-m6-l90-a1-real-world-checkpoint", kind: "assessment", title: "Show your A1 real-world tools", titleArabic: "أظهر أدواتك الواقعية في A1", objective: "Demonstrate understandable A1 communication across small picture, dialogue, reading, and writing choices with supportive scaffolds.", objectiveArabic: "أظهر تواصلاً مفهوماً في A1 عبر اختيارات صغيرة للصورة والحوار والقراءة والكتابة مع دعائم مساندة.", stage: "evidence", estimatedMinutes: 12, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "word-support", "tip"], writingPrompt: "Complete four small choices: name a job from a picture; choose a helpful reply; find one fact in a short message; write one plan line with going to. Use the word bank whenever it helps.", writingPromptArabic: "أكمل أربعة اختيارات صغيرة: سمِّ مهنة من صورة؛ اختر رداً مساعداً؛ اعثر على حقيقة في رسالة قصيرة؛ اكتب سطر خطة واحداً مع going to. استخدم بنك الكلمات كلما ساعدك.", suggestedVocabulary: ["teacher", "student", "music", "can", "because", "tomorrow", "together"], sentencePatterns: ["I am a ___.", "I can ___.", "I like ___ because ___.", "I am going to ___."] },
    { id: "a1-m6-l90-a1-next-bridge", kind: "review", title: "Carry one A1 strength forward", titleArabic: "خذ قوة واحدة من A1 معك", objective: "Choose one communicative strength and one next practice focus so the A1 checkpoint becomes a bridge into A2, not an ending label.", objectiveArabic: "اختر قوة تواصلية واحدة ومحور تدريب تالٍ حتى تصبح نقطة تحقق A1 جسراً إلى A2 لا ملصق نهاية.", stage: "next-bridge", estimatedMinutes: 4, semantic: "retrieval", progressiveSupports: ["tip", "worked-example"], writingPrompt: "Choose one sentence you can now use: I can introduce myself. / I can ask a question. / I can talk about my day. Then choose one A2 goal: longer conversations or more detailed reading.", writingPromptArabic: "اختر جملة واحدة يمكنك استخدامها الآن: I can introduce myself. / I can ask a question. / I can talk about my day. ثم اختر هدف A2: محادثات أطول أو قراءة أكثر تفصيلاً.", sentencePatterns: ["I can ___.", "In A2, I want to ___."] },
  ],
};

export const A1_MODULE_6_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = Object.fromEntries(
  Object.entries(authoredActivities).map(([lessonNumber, activities]) => [
    Number(lessonNumber),
    activities.map(toLessonActivity),
  ]),
);
