import type { LessonActivity, VisualVocabularyItem } from "./types";

function choiceCard(label: string, colour: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${label}"><rect width="320" height="180" fill="${colour}"/><path d="M160 42v94M160 42l-62 36M160 42l62 36" stroke="#314765" stroke-width="10" stroke-linecap="round"/><path d="M89 79h27v52H73zM204 79h27v52h-43z" fill="#d49b3f"/><rect x="23" y="20" width="150" height="34" rx="12" fill="#fffdf7"/><text x="98" y="43" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#253453">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const valueVisuals: VisualVocabularyItem[] = [
  { id: "a2-m6-price", word: "price", arabic: "السعر", pronunciation: "/praɪs/", exampleEN: "The price is too high for the plan.", exampleAR: "السعر مرتفع جداً بالنسبة للخطة.", altText: "Illustrated choice sign with a card labelled Price", category: "Choices and value", interactionHint: "Compare two fictional prices with too or enough.", imageUrl: choiceCard("Price", "#eaf2fb") },
  { id: "a2-m6-value", word: "value", arabic: "القيمة", pronunciation: "/ˈvæl.juː/", exampleEN: "This course offers good value for its time.", exampleAR: "تقدم هذه الدورة قيمة جيدة مقابل وقتها.", altText: "Illustrated choice sign with a card labelled Value", category: "Choices and value", interactionHint: "Say whether an option has good value and give a reason.", imageUrl: choiceCard("Value", "#f8f0df") },
  { id: "a2-m6-afford", word: "afford", arabic: "يستطيع تحمّل التكلفة", pronunciation: "/əˈfɔːd/", exampleEN: "Mina cannot afford the more expensive option.", exampleAR: "لا تستطيع مينا تحمّل تكلفة الخيار الأغلى.", altText: "Illustrated choice sign with a card labelled Afford", category: "Choices and value", interactionHint: "Complete: I can afford ___, but I cannot afford ___.", imageUrl: choiceCard("Afford", "#eaf5e7") },
];

export const A2_MODULE_6_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = {
  76: [{
    id: "a2-m6-l76-choice-lens", kind: "standard", title: "Use a choice lens", titleArabic: "استخدم منظور الاختيار",
    objective: "State a supported opinion about two fictional options using an adjective and an intensifier.", objectiveArabic: "عبّر عن رأي مدعوم حول خيارين خياليين باستخدام صفة ومقوٍ للمعنى.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Choose between a fictional evening class and a fictional sports club. Write: I think ___ is really/more ___ because ___.", writingPromptArabic: "اختر بين دورة مسائية خيالية ونادٍ رياضي خيالي. اكتب: I think ___ is really/more ___ because ___.",
    sentencePatterns: ["I think ___ is really useful because ___.", "For me, ___ is more important than ___."],
  }],
  77: [{
    id: "a2-m6-l77-opportunity-reading", kind: "reading", title: "Read two opportunities", titleArabic: "اقرأ عن فرصتين",
    objective: "Compare two fictional opportunities and identify one stronger comparison.", objectiveArabic: "قارن بين فرصتين خياليتين وحدد مقارنة واحدة أقوى.",
    stage: "introduction", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "The library course is a little shorter than the college course, but it is much closer to Noor's home. The college course has far more practice time, however, so Noor needs to decide which advantage matters most.",
    readingTextArabic: "دورة المكتبة أقصر قليلاً من دورة الكلية، لكنها أقرب كثيراً إلى منزل نور. دورة الكلية تحتوي على وقت تدريب أكثر بكثير، لذلك تحتاج نور إلى تحديد الميزة الأهم.",
    readingChecks: [
      { id: "a2-m6-l77-close", type: "detail", prompt: "Which course is much closer to Noor's home?", promptArabic: "أي دورة أقرب كثيراً إلى منزل نور؟", choices: ["The library course", "The college course", "Both courses"], answer: "The library course", explanation: "The text says that the library course is much closer." },
      { id: "a2-m6-l77-advantage", type: "main-idea", prompt: "What advantage does the college course have?", promptArabic: "ما ميزة دورة الكلية؟", choices: ["More practice time", "A shorter journey", "A lower price"], answer: "More practice time", explanation: "The second sentence gives this comparison." },
    ],
  }],
  78: [{
    id: "a2-m6-l78-next-month-plan", kind: "writing", title: "Plan next month", titleArabic: "خطط للشهر القادم",
    objective: "Write a short fictional next-month plan using will and going to for different purposes.", objectiveArabic: "اكتب خطة خيالية قصيرة للشهر القادم باستخدام will وgoing to لغرضين مختلفين.",
    stage: "assessment", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 45–60 words about a fictional learner's next month. Include one intention with going to, one prediction with will, one time phrase, and one reason. Do not use private plans or real names.",
    writingPromptArabic: "اكتب 45–60 كلمة عن الشهر القادم لمتعلم خيالي. أدرج نية واحدة مع going to وتوقعاً واحداً مع will وعبارة زمنية وسبباً واحداً. لا تستخدم خططاً خاصة أو أسماء حقيقية.",
    sentencePatterns: ["Next month, the learner is going to ___.", "I think they will ___ because ___."],
  }],
  79: [{
    id: "a2-m6-l79-weekend-negotiation", kind: "interaction", title: "Agree on a weekend plan", titleArabic: "اتفق على خطة لعطلة الأسبوع",
    objective: "Make a suggestion, respond politely, and reach a simple shared fictional plan.", objectiveArabic: "قدّم اقتراحاً وردّ بأدب وتوصل إلى خطة خيالية مشتركة بسيطة.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m6-l79-a", speaker: "Omar", text: "Shall we meet at the museum on Saturday?", textArabic: "هل نلتقي في المتحف يوم السبت؟", purpose: "Make a clear suggestion." },
      { id: "a2-m6-l79-b", speaker: "Lina", text: "How about Sunday instead? I am going to visit my aunt on Saturday.", textArabic: "ما رأيك في يوم الأحد بدلاً من ذلك؟ سأزور عمتي يوم السبت.", purpose: "Offer an alternative with a reason." },
      { id: "a2-m6-l79-c", speaker: "Omar", text: "That works for me. Let's meet at eleven.", textArabic: "هذا مناسب لي. لنلتقِ في الحادية عشرة.", purpose: "Reach agreement." },
    ],
  }],
  80: [{
    id: "a2-m6-l80-pros-cons", kind: "standard", title: "Balance pros and cons", titleArabic: "وازن بين الإيجابيات والسلبيات",
    objective: "Connect one advantage and one disadvantage using because, although, and however.", objectiveArabic: "اربط ميزة واحدة وعيباً واحداً باستخدام because وalthough وhowever.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete a balanced comparison about two fictional clubs: ___ is useful because ___. Although ___, ___. However, ___.", writingPromptArabic: "أكمل مقارنة متوازنة حول ناديين خياليين: ___ is useful because ___. Although ___, ___. However, ___.",
    sentencePatterns: ["___ is useful because ___.", "Although ___, ___.", "However, ___."],
  }],
  81: [{
    id: "a2-m6-l81-preference-rehearsal", kind: "speaking", title: "Ask about preference", titleArabic: "اسأل عن التفضيل",
    objective: "Ask for and state a preference using would rather and prefer.", objectiveArabic: "اسأل عن تفضيل وعبّر عنه باستخدام would rather وprefer.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m6-l81-a", speaker: "Model", text: "Would you rather study in the morning or the evening?", textArabic: "هل تفضل الدراسة في الصباح أم في المساء؟", pronunciationHint: "Keep would you rather as one calm question chunk.", audioText: "Would you rather study in the morning or the evening?" },
      { id: "a2-m6-l81-b", speaker: "Model", text: "I prefer the morning because I can concentrate more easily.", textArabic: "أفضل الصباح لأنني أستطيع التركيز بسهولة أكبر.", pronunciationHint: "Stress prefer and morning, then make because softer.", audioText: "I prefer the morning because I can concentrate more easily." },
    ],
  }],
  82: [{
    id: "a2-m6-l82-difficult-decision", kind: "reading", title: "Read a difficult decision", titleArabic: "اقرأ قراراً صعباً",
    objective: "Identify a reason, a result, and the writer's final choice in a connected decision text.", objectiveArabic: "حدّد سبباً ونتيجة واختيار الكاتب النهائي في نص مترابط عن قرار.",
    stage: "introduction", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    readingText: "Rami received two part-time job offers. He chose the smaller shop because it was nearer to his course and the manager offered flexible hours. As a result, he could keep studying in the evening, although the pay was slightly lower.",
    readingTextArabic: "تلقى رامي عرضي عمل بدوام جزئي. اختار المتجر الأصغر لأنه أقرب إلى دورته ولأن المدير عرض ساعات مرنة. ونتيجة لذلك، استطاع مواصلة الدراسة في المساء، على الرغم من أن الأجر كان أقل قليلاً.",
    readingChecks: [
      { id: "a2-m6-l82-choice", type: "detail", prompt: "Which offer did Rami choose?", promptArabic: "أي عرض اختار رامي؟", choices: ["The smaller shop", "The higher-paid job", "Neither offer"], answer: "The smaller shop", explanation: "The second sentence states his choice." },
      { id: "a2-m6-l82-result", type: "inference", prompt: "What did flexible hours allow Rami to do?", promptArabic: "ماذا سمحت الساعات المرنة لرامي أن يفعل؟", choices: ["Keep studying in the evening", "Earn a higher salary", "Travel further"], answer: "Keep studying in the evening", explanation: "The final sentence explains the result." },
    ],
  }],
  83: [{
    id: "a2-m6-l83-plan-b", kind: "interaction", title: "Plan around a problem", titleArabic: "خطط حول مشكلة",
    objective: "Use a first-conditional sentence and one practical alternative for a fictional problem.", objectiveArabic: "استخدم جملة بالشرط الأول وبديلاً عملياً واحداً لمشكلة خيالية.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m6-l83-a", speaker: "Coordinator", text: "If the room is not free, we will use the library table instead.", textArabic: "إذا لم تكن الغرفة متاحة، فسنستخدم طاولة المكتبة بدلاً من ذلك.", purpose: "Plan for a likely problem." },
      { id: "a2-m6-l83-b", speaker: "Learner", text: "Unless the library is busy, that will be a good alternative.", textArabic: "ما لم تكن المكتبة مزدحمة، فسيكون ذلك بديلاً جيداً.", purpose: "Add one condition to the alternative." },
    ],
  }],
  84: [{
    id: "a2-m6-l84-value-cards", kind: "visual-vocabulary", title: "Compare money and value", titleArabic: "قارن المال والقيمة",
    objective: "Use price, value, and afford to make a careful fictional comparison.", objectiveArabic: "استخدم price وvalue وafford لإجراء مقارنة خيالية مدروسة.",
    stage: "introduction", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "worked-example"], visualItems: valueVisuals,
  }],
  85: [{
    id: "a2-m6-l85-advice-note", kind: "writing", title: "Write advice for a friend", titleArabic: "اكتب نصيحة لصديق",
    objective: "Write a supportive fictional advice note using modal verbs and a clear linking word.", objectiveArabic: "اكتب ملاحظة نصيحة داعمة وخيالية باستخدام الأفعال الناقصة وكلمة ربط واضحة.",
    stage: "assessment", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 45–60 words to a fictional friend choosing between two safe study options. Include should or could, one reason, therefore or however, and a kind closing. Do not give medical, legal, or financial advice.",
    writingPromptArabic: "اكتب 45–60 كلمة لصديق خيالي يختار بين خيارين آمنين للدراسة. أدرج should أو could وسبباً واحداً وtherefore أو however وختاماً لطيفاً. لا تقدّم نصيحة طبية أو قانونية أو مالية.",
    sentencePatterns: ["You could ___ because ___.", "However, ___.", "Therefore, I think ___."],
  }],
  86: [{
    id: "a2-m6-l86-reasons-rehearsal", kind: "speaking", title: "Explain your reasons", titleArabic: "اشرح أسبابك",
    objective: "Give a short supported choice using for example and such as.", objectiveArabic: "قدّم اختياراً قصيراً مدعوماً باستخدام for example وsuch as.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [{ id: "a2-m6-l86-model", speaker: "Model", text: "I would choose the local course because it fits my week. For example, I can attend after work. It also has useful projects, such as short presentations.", textArabic: "سأختار الدورة المحلية لأنها تناسب أسبوعي. على سبيل المثال، أستطيع الحضور بعد العمل. ولديها أيضاً مشاريع مفيدة، مثل العروض القصيرة.", pronunciationHint: "Pause after because it fits my week and before for example.", audioText: "I would choose the local course because it fits my week. For example, I can attend after work." }],
  }],
  87: [{
    id: "a2-m6-l87-choice-retrieval", kind: "review", title: "Retrieve the choice toolkit", titleArabic: "استرجع أدوات الاختيار",
    objective: "Choose the useful comparison, contrast, future, advice, or condition pattern for five short prompts.", objectiveArabic: "اختر نمط المقارنة أو التباين أو المستقبل أو النصيحة أو الشرط المناسب لخمسة مواقف قصيرة.",
    stage: "review", estimatedMinutes: 8, semantic: "retrieval", progressiveSupports: ["word-support", "tip"],
    writingPrompt: "Choose one tool for each prompt: much better, going to, although, should, or if ____, we will ____. Then write one complete choice sentence.", writingPromptArabic: "اختر أداة واحدة لكل موقف: much better أو going to أو although أو should أو if ____, we will ____. ثم اكتب جملة اختيار مكتملة.",
    sentencePatterns: ["___ is much better because ___.", "If ___, we will ___."],
  }],
  88: [{
    id: "a2-m6-l88-balanced-recommendation", kind: "writing", title: "Make a balanced recommendation", titleArabic: "قدّم توصية متوازنة",
    objective: "Write a balanced fictional recommendation with a clear choice and two linked reasons.", objectiveArabic: "اكتب توصية خيالية متوازنة مع اختيار واضح وسببين مترابطين.",
    stage: "assessment", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 55–70 words recommending one of two fictional weekend workshops. Include one comparison, although or however, a final recommendation, and punctuation that separates your ideas clearly.", writingPromptArabic: "اكتب 55–70 كلمة توصي فيها بإحدى ورشتي عمل خياليتين لعطلة الأسبوع. أدرج مقارنة واحدة وalthough أو however وتوصية نهائية وترقيماً يفصل أفكارك بوضوح.",
    sentencePatterns: ["I recommend ___ because ___.", "Although ___, ___.", "Overall, ___ is the better choice for ___."],
  }],
  89: [{
    id: "a2-m6-l89-shared-plan", kind: "interaction", title: "Negotiate a shared plan", titleArabic: "تفاوض على خطة مشتركة",
    objective: "Soften a disagreement, offer an alternative, and reach a clear shared fictional plan.", objectiveArabic: "لطّف اختلافاً وقدّم بديلاً وتوصل إلى خطة خيالية مشتركة وواضحة.",
    stage: "real-context", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m6-l89-a", speaker: "Hana", text: "I see your point, but I would rather start later because I finish work at five.", textArabic: "أفهم وجهة نظرك، لكنني أفضل أن نبدأ لاحقاً لأنني أنهي العمل عند الخامسة.", purpose: "Disagree softly and give a reason." },
      { id: "a2-m6-l89-b", speaker: "Yousef", text: "Maybe we could begin at six and keep the first task short?", textArabic: "ربما يمكننا البدء في السادسة وجعل المهمة الأولى قصيرة؟", purpose: "Offer a flexible alternative." },
      { id: "a2-m6-l89-c", speaker: "Hana", text: "That sounds fair. Let's do that.", textArabic: "هذا يبدو منصفاً. لنفعل ذلك.", purpose: "Reach agreement." },
    ],
  }],
  90: [{
    id: "a2-m6-l90-choice-checkpoint", kind: "assessment", title: "Choices and plans checkpoint", titleArabic: "اختبار الاختيارات والخطط",
    objective: "Show connected evidence by comparing options, planning ahead, and giving one balanced recommendation.", objectiveArabic: "أظهر دليلاً مترابطاً عبر مقارنة الخيارات والتخطيط للمستقبل وتقديم توصية متوازنة واحدة.",
    stage: "assessment", estimatedMinutes: 12, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete three short fictional tasks: compare two options, write one next-month plan, and recommend one option with a reason and a contrast word. Keep the response about fictional situations.", writingPromptArabic: "أكمل ثلاث مهام خيالية قصيرة: قارن بين خيارين واكتب خطة للشهر القادم وأوصِ بخيار واحد مع سبب وكلمة تباين. اجعل الإجابة عن مواقف خيالية.",
    sentencePatterns: ["___ is more suitable than ___ because ___.", "Next month, I am going to ___.", "However, ___."],
  }],
};
