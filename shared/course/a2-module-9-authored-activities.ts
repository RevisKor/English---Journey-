import type { LessonActivity, VisualVocabularyItem } from "./types";

function celebrationCard(label: string, colour: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${label}"><rect width="320" height="180" fill="${colour}"/><path d="M48 132h224" stroke="#253b58" stroke-width="8" stroke-linecap="round"/><path d="M74 132V76h74v56M172 132V54h74v78" fill="#fffdf8" stroke="#456957" stroke-width="6" stroke-linejoin="round"/><circle cx="111" cy="56" r="14" fill="#d49b3f"/><circle cx="209" cy="34" r="14" fill="#d49b3f"/><path d="M98 99h26M196 79h26" stroke="#c88e3c" stroke-width="7" stroke-linecap="round"/><rect x="63" y="18" width="194" height="34" rx="12" fill="#253b58"/><text x="160" y="41" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fffdf8">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const traditionVisuals: VisualVocabularyItem[] = [
  { id: "a2-m9-tradition", word: "tradition", arabic: "تقليد", pronunciation: "/trəˈdɪʃən/", exampleEN: "Sharing a meal is a tradition in this fictional celebration.", exampleAR: "مشاركة وجبة تقليد في هذا الاحتفال الخيالي.", altText: "Illustrated celebration card labelled Tradition", category: "Celebrations and culture", interactionHint: "Name one fictional tradition without assuming everyone follows it.", imageUrl: celebrationCard("Tradition", "#eef5e9") },
  { id: "a2-m9-celebrate", word: "celebrate", arabic: "يحتفل", pronunciation: "/ˈselɪbreɪt/", exampleEN: "The neighbours celebrate the opening of their new garden.", exampleAR: "يحتفل الجيران بافتتاح حديقتهم الجديدة.", altText: "Illustrated celebration card labelled Celebrate", category: "Celebrations and culture", interactionHint: "Describe one fictional reason to celebrate.", imageUrl: celebrationCard("Celebrate", "#f8f0e5") },
  { id: "a2-m9-special", word: "special", arabic: "مميز", pronunciation: "/ˈspeʃəl/", exampleEN: "It is a special day for the community group.", exampleAR: "إنه يوم مميز لمجموعة المجتمع.", altText: "Illustrated celebration card labelled Special", category: "Celebrations and culture", interactionHint: "Use special with one concrete fictional event.", imageUrl: celebrationCard("Special", "#eaf1fb") },
];

export const A2_MODULE_9_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = {
  121: [{
    id: "a2-m9-l121-tradition-map", kind: "visual-vocabulary", title: "Explore special days with care", titleArabic: "استكشف الأيام الخاصة بعناية",
    objective: "Recognise tradition, celebrate, and special, then use them for a fictional community event without making assumptions about real people.", objectiveArabic: "تعرّف على tradition وcelebrate وspecial ثم استخدمها لحدث مجتمعي خيالي دون افتراضات عن أشخاص حقيقيين.",
    stage: "introduction", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "worked-example"], visualItems: traditionVisuals,
  }],
  122: [{
    id: "a2-m9-l122-warm-invitation", kind: "interaction", title: "Invite someone warmly", titleArabic: "ادعُ شخصاً بحرارة",
    objective: "Make a warm fictional invitation with would you like to and respond in a way that leaves the other person free to choose.", objectiveArabic: "قدّم دعوة خيالية ودودة باستخدام would you like to وردّ بطريقة تترك للشخص الآخر حرية الاختيار.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m9-l122-a", speaker: "Maya", text: "We are having a small garden celebration on Saturday. Would you like to join us?", textArabic: "سنقيم احتفالاً صغيراً في الحديقة يوم السبت. هل تود الانضمام إلينا؟", purpose: "Offer an invitation with a clear event and time." },
      { id: "a2-m9-l122-b", speaker: "Omar", text: "Thank you. I would like to come. What time does it start?", textArabic: "شكراً. أود أن آتي. في أي وقت يبدأ؟", purpose: "Accept warmly and ask a useful follow-up question." },
      { id: "a2-m9-l122-c", speaker: "Maya", text: "It starts at four, but please come when you can.", textArabic: "يبدأ الساعة الرابعة، لكن تعال عندما تستطيع.", purpose: "Share detail without pressure." },
    ],
  }],
  123: [{
    id: "a2-m9-l123-kind-refusal", kind: "speaking", title: "Accept or refuse kindly", titleArabic: "اقبل أو ارفض بلطف",
    objective: "Rehearse a polite fictional refusal with a reason and maybe next time, while keeping the invitation valued.", objectiveArabic: "تدرّب على رفض خيالي مهذب مع سبب وmaybe next time مع إظهار تقدير الدعوة.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m9-l123-a", speaker: "Model", text: "Thank you for inviting me. I cannot come on Saturday because I am visiting my aunt. Maybe next time?", textArabic: "شكراً لدعوتي. لا أستطيع المجيء يوم السبت لأنني سأزور عمتي. ربما في المرة القادمة؟", pronunciationHint: "Keep thank you warm; stress cannot, Saturday, and next time.", audioText: "Thank you for inviting me. I cannot come on Saturday because I am visiting my aunt. Maybe next time?" },
      { id: "a2-m9-l123-b", speaker: "Reply model", text: "Of course. Thank you for telling me, and I hope you have a lovely visit.", textArabic: "بالطبع. شكراً لإخباري، وآمل أن تكون زيارتك جميلة.", pronunciationHint: "Let of course sound relaxed, then make lovely clear.", audioText: "Of course. Thank you for telling me, and I hope you have a lovely visit." },
    ],
  }],
  124: [{
    id: "a2-m9-l124-two-celebrations", kind: "reading", title: "Read two celebrations respectfully", titleArabic: "اقرأ عن احتفالين باحترام",
    objective: "Identify a similarity and a difference in two fictional celebrations without deciding that one is better.", objectiveArabic: "حدّد تشابهاً واختلافاً في احتفالين خياليين دون الحكم بأن أحدهما أفضل.",
    stage: "introduction", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "In the fictional town of Luma, neighbours celebrate the first day of spring with a shared breakfast in the park. In nearby Riva, families usually mark the same season by making paper lanterns at home before meeting friends later. Both celebrations bring people together and include food, but the first begins outdoors while the second begins at home. People choose the parts that matter to them.",
    readingTextArabic: "في بلدة لوما الخيالية، يحتفل الجيران بأول يوم من الربيع بإفطار مشترك في الحديقة. وفي ريفا القريبة، تميّز العائلات الموسم نفسه عادةً بصنع فوانيس ورقية في المنزل قبل لقاء الأصدقاء لاحقاً. يجمع الاحتفالان الناس ويتضمنان الطعام، لكن الأول يبدأ في الخارج والثاني يبدأ في المنزل. يختار الناس الأجزاء المهمة لهم.",
    readingChecks: [
      { id: "a2-m9-l124-similarity", type: "detail", prompt: "What do both fictional celebrations include?", promptArabic: "ماذا يتضمن الاحتفالان الخياليان؟", choices: ["Food and bringing people together", "Paper lanterns in the park", "A rule that everyone must attend"], answer: "Food and bringing people together", explanation: "The text names food and connection as shared features." },
      { id: "a2-m9-l124-inference", type: "inference", prompt: "Why does the text say people choose the parts that matter to them?", promptArabic: "لماذا يقول النص إن الناس يختارون الأجزاء المهمة لهم؟", choices: ["Participation can be personal and flexible", "One celebration is more correct", "Nobody enjoys either celebration"], answer: "Participation can be personal and flexible", explanation: "The final sentence avoids assuming that everyone celebrates in exactly the same way." },
    ],
  }],
  125: [{
    id: "a2-m9-l125-reactions", kind: "standard", title: "Describe a reaction precisely", titleArabic: "صِف رد فعل بدقة",
    objective: "Use feel, seem, look, and sound to describe a fictional reaction without claiming to know another person’s feelings.", objectiveArabic: "استخدم feel وseem وlook وsound لوصف رد فعل خيالي دون ادعاء معرفة مشاعر شخص آخر.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Choose the best verb for each fictional scene: ‘I ___ proud of my team.’ ‘The room ___ busy.’ ‘That music ___ exciting.’ Then write one careful sentence with seems: ‘She seems ___ because ___.’", writingPromptArabic: "اختر الفعل الأنسب لكل مشهد خيالي: ‘I ___ proud of my team.’ و‘The room ___ busy.’ و‘That music ___ exciting.’ ثم اكتب جملة حذرة واحدة مع seems: ‘She seems ___ because ___.’",
    sentencePatterns: ["I feel ___ when ___.", "It looks/seems/sounds ___ because ___."],
  }],
  126: [{
    id: "a2-m9-l126-usually", kind: "standard", title: "Talk about what people usually do", titleArabic: "تحدث عما يفعله الناس عادة",
    objective: "Use usually and general present statements with qualifiers such as some people to avoid over-generalising about traditions.", objectiveArabic: "استخدم usually والعبارات العامة في المضارع مع محددات مثل some people لتجنب التعميم المفرط عن التقاليد.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Rewrite each fictional note carefully: ‘Everyone wears blue’ → ‘Some people usually wear blue.’ ‘My neighbours share food on this day’ → add a time phrase. Then make one general statement about the fictional town of Luma, not about a real culture.", writingPromptArabic: "أعد كتابة كل ملاحظة خيالية بعناية: ‘Everyone wears blue’ ← ‘Some people usually wear blue.’ و‘My neighbours share food on this day’ ← أضف عبارة زمنية. ثم اكتب عبارة عامة واحدة عن بلدة لوما الخيالية، لا عن ثقافة حقيقية.",
    sentencePatterns: ["Some people usually ___.", "In this fictional town, people often ___."],
  }],
  127: [{
    id: "a2-m9-l127-photo-story", kind: "visual-vocabulary", title: "Build a celebration photo story", titleArabic: "ابنِ قصة صورة احتفال",
    objective: "Use past continuous with photo, crowd, and smile to describe what was happening in a fictional celebration image.", objectiveArabic: "استخدم الماضي المستمر مع photo وcrowd وsmile لوصف ما كان يحدث في صورة احتفال خيالية.",
    stage: "guided-practice", estimatedMinutes: 9, semantic: "vocabulary", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    visualItems: [
      { id: "a2-m9-photo", word: "photo", arabic: "صورة", pronunciation: "/ˈfəʊtəʊ/", exampleEN: "The photo was showing a bright street scene.", exampleAR: "كانت الصورة تُظهر مشهداً مضيئاً في الشارع.", altText: "Illustrated celebration card labelled Photo", category: "Photo story", interactionHint: "Describe one thing that was happening in a fictional photo.", imageUrl: celebrationCard("Photo", "#f6edf8") },
      { id: "a2-m9-crowd", word: "crowd", arabic: "حشد", pronunciation: "/kraʊd/", exampleEN: "A small crowd was waiting near the stage.", exampleAR: "كان حشد صغير ينتظر قرب المنصة.", altText: "Illustrated celebration card labelled Crowd", category: "Photo story", interactionHint: "Use a small crowd in a past-continuous sentence.", imageUrl: celebrationCard("Crowd", "#eaf1fb") },
      { id: "a2-m9-smile", word: "smile", arabic: "ابتسامة", pronunciation: "/smaɪl/", exampleEN: "Two friends were smiling for the camera.", exampleAR: "كان صديقان يبتسمان للكاميرا.", altText: "Illustrated celebration card labelled Smile", category: "Photo story", interactionHint: "Add one smile to a fictional picture description.", imageUrl: celebrationCard("Smile", "#f8f0e5") },
    ],
  }],
  128: [{
    id: "a2-m9-l128-tradition-explanation", kind: "speaking", title: "Explain a tradition step by step", titleArabic: "اشرح تقليداً خطوة بخطوة",
    objective: "Use first, then, after that, and finally to explain a simple fictional tradition in a clear sequence.", objectiveArabic: "استخدم first وthen وafter that وfinally لشرح تقليد خيالي بسيط بتسلسل واضح.",
    stage: "guided-practice", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    speakingLines: [
      { id: "a2-m9-l128-a", speaker: "Guide model", text: "First, we write kind messages for our neighbours. Then, we put them in a shared box. After that, we read them together. Finally, we have tea and talk.", textArabic: "أولاً، نكتب رسائل لطيفة لجيراننا. ثم نضعها في صندوق مشترك. بعد ذلك، نقرأها معاً. وأخيراً، نشرب الشاي ونتحدث.", pronunciationHint: "Pause gently after each sequence marker; stress write, shared, read, and finally.", audioText: "First, we write kind messages for our neighbours. Then, we put them in a shared box. After that, we read them together. Finally, we have tea and talk." },
    ],
  }],
  129: [{
    id: "a2-m9-l129-invitation-writing", kind: "writing", title: "Write a friendly invitation", titleArabic: "اكتب دعوة ودودة",
    objective: "Write a concise fictional invitation with a friendly opening, useful date and time punctuation, and an easy response option.", objectiveArabic: "اكتب دعوة خيالية موجزة بافتتاح ودود وترقيم مفيد للتاريخ والوقت وخيار رد سهل.",
    stage: "assessment", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 45–60 words inviting a fictional classmate to a small community event. Include a greeting, the day and time, two details, and ‘Please let me know if you can come.’ Use friendly punctuation. Do not present a real event as fact.", writingPromptArabic: "اكتب 45–60 كلمة تدعو فيها زميلاً خيالياً إلى حدث مجتمعي صغير. ضمّن تحية واليوم والوقت وتفصيلين و‘Please let me know if you can come.’ استخدم ترقيمًا ودودًا. لا تقدّم حدثاً حقيقياً كحقيقة.",
    sentencePatterns: ["Would you like to join us on ___ at ___?", "Please let me know if you can come."],
  }],
  130: [{
    id: "a2-m9-l130-respectful-questions", kind: "interaction", title: "Ask with respect", titleArabic: "اسأل باحترام",
    objective: "Use Could you tell me and a follow-up question to learn about a fictional custom without making direct assumptions.", objectiveArabic: "استخدم Could you tell me وسؤال متابعة للتعرف على عادة خيالية دون افتراضات مباشرة.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    interactionTurns: [
      { id: "a2-m9-l130-a", speaker: "Visitor", text: "Could you tell me what this shared table is for?", textArabic: "هل يمكنك أن تخبرني ما الغرض من هذه المائدة المشتركة؟", purpose: "Ask an open, respectful question." },
      { id: "a2-m9-l130-b", speaker: "Host", text: "Of course. People can leave a small note or a snack for someone else.", textArabic: "بالطبع. يمكن للناس ترك ملاحظة صغيرة أو وجبة خفيفة لشخص آخر.", purpose: "Offer an explanation without claiming it is universal." },
      { id: "a2-m9-l130-c", speaker: "Visitor", text: "That sounds thoughtful. Is there anything visitors should know before they join?", textArabic: "هذا يبدو لطيفاً. هل هناك شيء يجب أن يعرفه الزوار قبل أن يشاركوا؟", purpose: "Ask a careful follow-up question." },
    ],
  }],
  131: [{
    id: "a2-m9-l131-cultural-guide", kind: "reading", title: "Read a short cultural guide", titleArabic: "اقرأ دليلاً ثقافياً قصيراً",
    objective: "Use headings and examples to find practical advice in a fictional cultural guide.", objectiveArabic: "استخدم العناوين والأمثلة لإيجاد نصيحة عملية في دليل ثقافي خيالي.",
    stage: "introduction", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "Welcome to Luma’s Community Day\n\nJoining in: You can watch first or take part when you feel ready.\n\nSharing food: Ask before you take food from a shared table, especially if you have dietary needs.\n\nQuestions: ‘Could you tell me about this activity?’ is a useful way to ask.\n\nRemember: People take part in different ways, so listen to the answer rather than guessing.",
    readingTextArabic: "مرحباً بكم في يوم مجتمع لوما\n\nالمشاركة: يمكنك المشاهدة أولاً أو المشاركة عندما تشعر بالاستعداد.\n\nمشاركة الطعام: اسأل قبل أن تأخذ طعاماً من مائدة مشتركة، خاصة إذا كانت لديك احتياجات غذائية.\n\nالأسئلة: ‘Could you tell me about this activity?’ طريقة مفيدة للسؤال.\n\nتذكّر: يشارك الناس بطرق مختلفة، لذا استمع إلى الإجابة بدلاً من التخمين.",
    readingChecks: [
      { id: "a2-m9-l131-heading", type: "detail", prompt: "Which heading tells the reader how to ask about an activity?", promptArabic: "أي عنوان يخبر القارئ كيف يسأل عن نشاط؟", choices: ["Questions", "Joining in", "Sharing food"], answer: "Questions", explanation: "The Questions section gives the exact useful question." },
      { id: "a2-m9-l131-inference", type: "inference", prompt: "Why does the guide say to listen rather than guess?", promptArabic: "لماذا يقول الدليل أن تستمع بدلاً من التخمين؟", choices: ["People may take part in different ways", "There is only one correct answer", "The guide has no examples"], answer: "People may take part in different ways", explanation: "The guide directly links listening to respecting different ways of taking part." },
    ],
  }],
  132: [{
    id: "a2-m9-l132-culture-retrieval", kind: "review", title: "Bring celebrations together", titleArabic: "اجمع ما تعلمته عن الاحتفالات",
    objective: "Retrieve invitation, reaction, sequence, comparison, and respectful-question language in five short fictional choices.", objectiveArabic: "استرجع لغة الدعوة ورد الفعل والترتيب والمقارنة والأسئلة المحترمة في خمسة اختيارات خيالية قصيرة.",
    stage: "guided-practice", estimatedMinutes: 9, semantic: "retrieval", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete five short fictional prompts: invite someone; accept or refuse kindly; compare two celebration details; describe a reaction; and ask one respectful question. Choose only language that fits each purpose.", writingPromptArabic: "أكمل خمسة مطالبات خيالية قصيرة: ادعُ شخصاً؛ اقبل أو ارفض بلطف؛ قارن تفصيلين من احتفال؛ صف رد فعل؛ واسأل سؤالاً محترماً. اختر فقط اللغة التي تناسب كل غرض.",
    sentencePatterns: ["Would you like to ___?", "Both ___, but ___.", "Could you tell me ___?"],
  }],
  133: [{
    id: "a2-m9-l133-meaningful-event", kind: "writing", title: "Write about a meaningful fictional event", titleArabic: "اكتب عن حدث خيالي مهم",
    objective: "Write a connected fictional paragraph with a clear topic, selected details, sequence, feeling, and short reflection.", objectiveArabic: "اكتب فقرة خيالية مترابطة بموضوع واضح وتفاصيل مختارة وتسلسل وشعور وتأمل قصير.",
    stage: "assessment", estimatedMinutes: 12, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 70–90 words about a fictional meaningful event. Begin with what the event was. Add two details using first/then/after that/finally, one feeling sentence, and one reflection. Keep the people and event fictional or clearly personal; avoid speaking for a whole culture.", writingPromptArabic: "اكتب 70–90 كلمة عن حدث خيالي مهم. ابدأ بماهية الحدث. أضف تفصيلين باستخدام first/then/after that/finally وجملة شعور وتأملاً واحداً. اجعل الأشخاص والحدث خياليين أو شخصيين بوضوح؛ وتجنب التحدث نيابة عن ثقافة كاملة.",
    suggestedVocabulary: ["meaningful", "event", "first", "after that", "reflection"],
    sentencePatterns: ["The event was meaningful because ___.", "After that, I felt ___.", "I learned that ___."],
  }],
  134: [{
    id: "a2-m9-l134-bridge-conversation", kind: "interaction", title: "Connect a longer conversation", titleArabic: "اربط محادثة أطول",
    objective: "Use repair, a follow-up question, and a connected response to bridge familiar A1 language into a longer A2 conversation.", objectiveArabic: "استخدم الإصلاح وسؤال متابعة ورداً مترابطاً لربط لغة A1 المألوفة بمحادثة A2 أطول.",
    stage: "real-context", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m9-l134-a", speaker: "Sam", text: "I am sorry, I did not catch the name of the event. Could you say it again?", textArabic: "عذراً، لم ألتقط اسم الحدث. هل يمكنك قوله مرة أخرى؟", purpose: "Repair a communication gap politely." },
      { id: "a2-m9-l134-b", speaker: "Nadia", text: "It is called Neighbour Notes. People write kind messages and share tea together.", textArabic: "يُسمى Neighbour Notes. يكتب الناس رسائل لطيفة ويشربون الشاي معاً.", purpose: "Give a clear connected explanation." },
      { id: "a2-m9-l134-c", speaker: "Sam", text: "Thank you. That sounds welcoming. Would you like me to bring something, or is there another way I can help?", textArabic: "شكراً. يبدو ذلك مرحّباً. هل تود أن أحضر شيئاً، أم هناك طريقة أخرى يمكنني المساعدة بها؟", purpose: "Ask a follow-up and offer practical help." },
    ],
  }],
  135: [{
    id: "a2-m9-l135-culture-checkpoint", kind: "assessment", title: "Show your culture and celebration toolkit", titleArabic: "أظهر أدواتك للاحتفالات والثقافة",
    objective: "Choose and produce respectful language for an invitation, response, comparison, short narrative, and reflection in a fictional community scenario.", objectiveArabic: "اختر وأنتج لغة محترمة لدعوة ورد ومقارنة وسرد قصير وتأمل في سيناريو مجتمعي خيالي.",
    stage: "assessment", estimatedMinutes: 14, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete a fictional Community Day checkpoint: write one invitation and one response, compare two event details fairly, then write 55–70 words explaining one moment and what you learned. Use an invitation phrase, a sequence marker, a comparison, and a reflection. Do not claim one way of celebrating is better.", writingPromptArabic: "أكمل اختبار يوم المجتمع الخيالي: اكتب دعوة ورداً واحداً، وقارن تفصيلين من الحدث بعدل، ثم اكتب 55–70 كلمة تشرح لحظة واحدة وما تعلمته. استخدم عبارة دعوة وكلمة ترتيب ومقارنة وتأملاً. لا تدّعِ أن طريقة احتفال أفضل من أخرى.",
    sentencePatterns: ["Would you like to ___?", "Both events ___, but ___.", "I learned that ___."],
  }],
};
