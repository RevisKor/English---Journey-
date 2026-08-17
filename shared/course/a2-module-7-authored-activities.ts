import type { LessonActivity, VisualVocabularyItem } from "./types";

function techCard(label: string, colour: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${label}"><rect width="320" height="180" fill="${colour}"/><rect x="100" y="25" width="120" height="130" rx="18" fill="#273a59"/><rect x="111" y="42" width="98" height="81" rx="7" fill="#fdfbf5"/><circle cx="160" cy="140" r="7" fill="#d49b3f"/><path d="M126 69h68M126 88h50M126 107h37" stroke="#55779b" stroke-width="7" stroke-linecap="round"/><rect x="21" y="20" width="148" height="34" rx="12" fill="#fffdf7"/><text x="95" y="43" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#253453">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const deviceVisuals: VisualVocabularyItem[] = [
  { id: "a2-m7-switch-on", word: "switch on", arabic: "يشغّل", pronunciation: "/swɪtʃ ɒn/", exampleEN: "Switch on the device and wait for the screen.", exampleAR: "شغّل الجهاز وانتظر الشاشة.", altText: "Illustrated device screen card labelled Switch on", category: "Devices and actions", interactionHint: "Give one calm instruction with switch on.", imageUrl: techCard("Switch on", "#eaf2fb") },
  { id: "a2-m7-download", word: "download", arabic: "يحمّل", pronunciation: "/ˌdaʊnˈləʊd/", exampleEN: "Download the file before the meeting.", exampleAR: "حمّل الملف قبل الاجتماع.", altText: "Illustrated device screen card labelled Download", category: "Devices and actions", interactionHint: "Say what a fictional learner should download.", imageUrl: techCard("Download", "#f7efe1") },
  { id: "a2-m7-screen", word: "screen", arabic: "شاشة", pronunciation: "/skriːn/", exampleEN: "The message is clear on the screen.", exampleAR: "الرسالة واضحة على الشاشة.", altText: "Illustrated device screen card labelled Screen", category: "Devices and actions", interactionHint: "Describe one useful thing you can see on a fictional screen.", imageUrl: techCard("Screen", "#e9f5eb") },
];

export const A2_MODULE_7_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = {
  91: [{
    id: "a2-m7-l91-clear-message", kind: "standard", title: "Repair a clear message", titleArabic: "أصلح رسالة واضحة",
    objective: "Use capital letters and full stops to make a short practical message easy to follow.", objectiveArabic: "استخدم الحروف الكبيرة والنقاط لجعل رسالة عملية قصيرة سهلة المتابعة.",
    stage: "explanation", estimatedMinutes: 7, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Rewrite this fictional message with sentence boundaries: hi farah the meeting is on monday please bring the notes thanks", writingPromptArabic: "أعد كتابة هذه الرسالة الخيالية مع حدود الجمل: hi farah the meeting is on monday please bring the notes thanks",
    sentencePatterns: ["Hi ___. The meeting is on ___.", "Please bring ___. Thanks."],
  }],
  92: [{
    id: "a2-m7-l92-device-actions", kind: "visual-vocabulary", title: "Name a device action", titleArabic: "سمِّ فعلاً على جهاز",
    objective: "Recognise and use switch on, download, and screen in simple device instructions.", objectiveArabic: "تعرّف على switch on وdownload وscreen واستخدمها في تعليمات أجهزة بسيطة.",
    stage: "introduction", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "worked-example"], visualItems: deviceVisuals,
  }],
  93: [{
    id: "a2-m7-l93-useful-email", kind: "writing", title: "Write a useful email", titleArabic: "اكتب بريداً إلكترونياً مفيداً",
    objective: "Write a concise fictional email with a clear opening, one request, and an appropriate closing.", objectiveArabic: "اكتب بريداً إلكترونياً خيالياً موجزاً ببداية واضحة وطلب واحد وخاتمة مناسبة.",
    stage: "assessment", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 45–60 words to a fictional course organiser. Ask for a missing schedule, include a clear subject-style opening, use Could you...?, and close with Kind regards. Do not use a real email address.", writingPromptArabic: "اكتب 45–60 كلمة إلى منظم دورة خيالي. اطلب جدولاً مفقوداً، وأدرج بداية واضحة تشبه الموضوع، واستخدم Could you...؟ واختتم بـ Kind regards. لا تستخدم عنوان بريد حقيقياً.",
    sentencePatterns: ["Hello ___,", "Could you send me ___, please?", "Kind regards, ___"],
  }],
  94: [{
    id: "a2-m7-l94-phone-check", kind: "interaction", title: "Keep a call clear", titleArabic: "حافظ على وضوح المكالمة",
    objective: "Use a telephone phrase and present continuous form to identify a simple call problem.", objectiveArabic: "استخدم عبارة هاتف وصيغة المضارع المستمر لتحديد مشكلة اتصال بسيطة.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m7-l94-a", speaker: "Hadi", text: "Can you hear me? The signal is cutting out.", textArabic: "هل تسمعني؟ الإشارة تتقطع.", purpose: "Identify a call problem politely." },
      { id: "a2-m7-l94-b", speaker: "Maya", text: "I can hear you now. Are you standing near a window?", textArabic: "أستطيع سماعك الآن. هل تقف قرب نافذة؟", purpose: "Check the current situation." },
      { id: "a2-m7-l94-c", speaker: "Hadi", text: "Yes, I am. I am moving to a quieter place.", textArabic: "نعم، أفعل ذلك. أنا أنتقل إلى مكان أكثر هدوءاً.", purpose: "State an action in progress." },
    ],
  }],
  95: [{
    id: "a2-m7-l95-reset-steps", kind: "speaking", title: "Say reset steps", titleArabic: "قل خطوات إعادة الضبط",
    objective: "Rehearse a short sequence of clear instructions for a fictional login problem.", objectiveArabic: "تدرّب على تسلسل قصير من التعليمات الواضحة لمشكلة تسجيل دخول خيالية.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m7-l95-a", speaker: "Support model", text: "First, choose reset password. Next, check your email. Then, create a new password.", textArabic: "أولاً، اختر إعادة تعيين كلمة المرور. بعد ذلك، افحص بريدك. ثم أنشئ كلمة مرور جديدة.", pronunciationHint: "Pause after first, next, and then so each step is easy to hear.", audioText: "First, choose reset password. Next, check your email. Then, create a new password." },
      { id: "a2-m7-l95-b", speaker: "Learner", text: "I will try those steps now. Thank you for explaining them clearly.", textArabic: "سأجرب هذه الخطوات الآن. شكراً لشرحها بوضوح.", pronunciationHint: "Link try those, then stress now and clearly.", audioText: "I will try those steps now. Thank you for explaining them clearly." },
    ],
  }],
  96: [{
    id: "a2-m7-l96-online-notice", kind: "reading", title: "Scan an online notice", titleArabic: "ابحث في إشعار إلكتروني",
    objective: "Scan a short online notice for a date, a condition, and the action the reader should take.", objectiveArabic: "ابحث في إشعار إلكتروني قصير عن تاريخ وشرط والإجراء الذي ينبغي للقارئ اتخاذه.",
    stage: "introduction", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "Course notice: The speaking room will be unavailable on Tuesday 14 May from 3.00 to 5.00 p.m. If you have booked that room, click Change booking before Monday evening. The online practice group will continue as usual.",
    readingTextArabic: "إشعار الدورة: ستكون غرفة التحدث غير متاحة يوم الثلاثاء 14 مايو من الساعة 3:00 إلى 5:00 مساءً. إذا كنت قد حجزت تلك الغرفة، فانقر Change booking قبل مساء الاثنين. ستستمر مجموعة التدريب عبر الإنترنت كالمعتاد.",
    readingChecks: [
      { id: "a2-m7-l96-date", type: "detail", prompt: "When will the speaking room be unavailable?", promptArabic: "متى ستكون غرفة التحدث غير متاحة؟", choices: ["Tuesday 14 May", "Monday evening", "Every Tuesday"], answer: "Tuesday 14 May", explanation: "The date appears in the first sentence." },
      { id: "a2-m7-l96-action", type: "inference", prompt: "What should a learner do if they booked the room?", promptArabic: "ماذا ينبغي للمتعلم أن يفعل إذا حجز الغرفة؟", choices: ["Change the booking", "Stop the course", "Email the whole group"], answer: "Change the booking", explanation: "The notice gives this action after the condition." },
    ],
  }],
  97: [{
    id: "a2-m7-l97-paraphrase", kind: "standard", title: "Say it another way", titleArabic: "قلها بطريقة أخرى",
    objective: "Replace one repeated word with a suitable synonym and check that the meaning stays the same.", objectiveArabic: "استبدل كلمة مكررة بمرادف مناسب وتحقق من بقاء المعنى كما هو.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Improve this fictional support sentence without changing its meaning: The instructions are clear, but the clear message is too long. Choose helpful, easy to follow, or simple where it fits.", writingPromptArabic: "حسّن جملة الدعم الخيالية هذه دون تغيير معناها: The instructions are clear, but the clear message is too long. اختر helpful أو easy to follow أو simple حيث يناسب.",
    sentencePatterns: ["The instructions are easy to follow.", "Do you mean that ___?"],
  }],
  98: [{
    id: "a2-m7-l98-polite-correction", kind: "interaction", title: "Make a polite correction", titleArabic: "أجرِ تصحيحاً مهذباً",
    objective: "Correct one small misunderstanding using I mean, actually, or sorry, I meant.", objectiveArabic: "صحّح سوء فهم صغيراً باستخدام I mean أو actually أو sorry, I meant.",
    stage: "real-context", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m7-l98-a", speaker: "Samir", text: "Please send the report on Friday.", textArabic: "من فضلك أرسل التقرير يوم الجمعة.", purpose: "State a simple request." },
      { id: "a2-m7-l98-b", speaker: "Nour", text: "Friday morning?", textArabic: "صباح الجمعة؟", purpose: "Check a detail without assuming." },
      { id: "a2-m7-l98-c", speaker: "Samir", text: "Sorry, I meant Thursday morning. Thank you for checking.", textArabic: "عذراً، كنت أقصد صباح الخميس. شكراً لأنك تحققت.", purpose: "Correct the detail politely." },
    ],
  }],
  99: [{
    id: "a2-m7-l99-safety-guide", kind: "reading", title: "Read a safety guide", titleArabic: "اقرأ دليلاً للأمان",
    objective: "Identify a digital-safety rule, advice, and warning condition in a short guide.", objectiveArabic: "حدّد قاعدة أمان رقمي ونصيحة وشرط تحذير في دليل قصير.",
    stage: "introduction", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    readingText: "Keep your account safe. You must not share a password, even with a friend. You should use a different password for important accounts. If a message asks for private information, do not click its link; check the sender first.",
    readingTextArabic: "حافظ على أمان حسابك. يجب ألا تشارك كلمة المرور، حتى مع صديق. ينبغي أن تستخدم كلمة مرور مختلفة للحسابات المهمة. إذا طلبت رسالة معلومات خاصة، فلا تنقر رابطها؛ تحقق من المرسل أولاً.",
    readingChecks: [
      { id: "a2-m7-l99-rule", type: "detail", prompt: "What must a learner not share?", promptArabic: "ما الذي يجب ألا يشاركه المتعلم؟", choices: ["A password", "A course note", "A meeting time"], answer: "A password", explanation: "The first rule names the password." },
      { id: "a2-m7-l99-warning", type: "inference", prompt: "What should happen before clicking a suspicious link?", promptArabic: "ماذا ينبغي أن يحدث قبل النقر على رابط مشبوه؟", choices: ["Check the sender", "Reply with private information", "Share it quickly"], answer: "Check the sender", explanation: "The final clause gives this safe action." },
    ],
  }],
  100: [{
    id: "a2-m7-l100-friend-instructions", kind: "writing", title: "Write concise instructions", titleArabic: "اكتب تعليمات موجزة",
    objective: "Write a numbered fictional instruction sequence using clear imperative verbs.", objectiveArabic: "اكتب تسلسلاً خيالياً مرقماً من التعليمات باستخدام أفعال أمر واضحة.",
    stage: "assessment", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write four numbered steps to help a fictional friend join an online class. Start each step with a verb, include one safety reminder, and keep every sentence short. Do not include a real link, password, or account.", writingPromptArabic: "اكتب أربع خطوات مرقمة لمساعدة صديق خيالي على الانضمام إلى درس عبر الإنترنت. ابدأ كل خطوة بفعل، وأدرج تذكيراً واحداً بالأمان، واجعل كل جملة قصيرة. لا تضع رابطاً أو كلمة مرور أو حساباً حقيقياً.",
    sentencePatterns: ["1. Open ___.", "2. Choose ___.", "3. Do not share ___."],
  }],
  101: [{
    id: "a2-m7-l101-connected-chunks", kind: "speaking", title: "Link common phrases", titleArabic: "اربط العبارات الشائعة",
    objective: "Notice and rehearse linked speech in short, useful request and plan phrases.", objectiveArabic: "لاحظ وتدرّب على الكلام المتصل في عبارات قصيرة مفيدة للطلب والتخطيط.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m7-l101-a", speaker: "Model", text: "Could you send it to me when you have time?", textArabic: "هل يمكنك إرساله لي عندما يكون لديك وقت؟", pronunciationHint: "Let could you and send it connect gently; keep the main stress on send and time.", audioText: "Could you send it to me when you have time?" },
      { id: "a2-m7-l101-b", speaker: "Model", text: "I am going to check it after lunch.", textArabic: "سأتحقق منه بعد الغداء.", pronunciationHint: "Join going to naturally, but keep check clear.", audioText: "I am going to check it after lunch." },
    ],
  }],
  102: [{
    id: "a2-m7-l102-tech-toolkit", kind: "review", title: "Retrieve the message toolkit", titleArabic: "استرجع أدوات الرسائل",
    objective: "Choose the appropriate clarity, device, request, correction, instruction, or safety tool for a short fictional prompt.", objectiveArabic: "اختر أداة الوضوح أو الجهاز أو الطلب أو التصحيح أو التعليمات أو الأمان المناسبة لموقف خيالي قصير.",
    stage: "review", estimatedMinutes: 8, semantic: "retrieval", progressiveSupports: ["word-support", "tip"],
    writingPrompt: "For each fictional situation, choose one tool: capital letter, Could you...?, first/next/then, sorry, I meant, or do not click. Then write one complete example sentence for the situation you find most useful.", writingPromptArabic: "لكل موقف خيالي، اختر أداة واحدة: حرف كبير أو Could you...? أو first/next/then أو sorry, I meant أو do not click. ثم اكتب جملة مثال كاملة للموقف الذي تجده أكثر فائدة.",
    sentencePatterns: ["Could you ___, please?", "Sorry, I meant ___.", "First, ___. Then, ___."],
  }],
  103: [{
    id: "a2-m7-l103-support-chat", kind: "interaction", title: "Complete a support chat", titleArabic: "أكمل محادثة دعم",
    objective: "Follow a complete fictional support chat from opening through diagnosis, clarification, and closing.", objectiveArabic: "اتبع محادثة دعم خيالية كاملة من الافتتاح حتى التشخيص والتوضيح والختام.",
    stage: "real-context", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m7-l103-a", speaker: "Learner", text: "Hello. I cannot open the course page on my tablet.", textArabic: "مرحباً. لا أستطيع فتح صفحة الدورة على جهازي اللوحي.", purpose: "Open the chat and state the problem." },
      { id: "a2-m7-l103-b", speaker: "Support", text: "I can help. What message can you see on the screen?", textArabic: "يمكنني المساعدة. ما الرسالة التي تراها على الشاشة؟", purpose: "Ask a diagnostic question." },
      { id: "a2-m7-l103-c", speaker: "Learner", text: "It says the page is not available. I mean, the internet is working for other pages.", textArabic: "تقول إن الصفحة غير متاحة. أقصد أن الإنترنت يعمل مع صفحات أخرى.", purpose: "Clarify a useful detail." },
      { id: "a2-m7-l103-d", speaker: "Support", text: "Thank you. First, close the page. Then open it again after one minute. Please tell me if that works.", textArabic: "شكراً. أولاً، أغلق الصفحة. ثم افتحها من جديد بعد دقيقة واحدة. أخبرني من فضلك إن كان ذلك ينفع.", purpose: "Give sequenced support and invite a follow-up." },
    ],
  }],
  104: [{
    id: "a2-m7-l104-clarity-rewrite", kind: "writing", title: "Rewrite for clarity", titleArabic: "أعد الكتابة بوضوح",
    objective: "Rewrite a short fictional message by combining useful sentences and removing unnecessary repetition.", objectiveArabic: "أعد كتابة رسالة خيالية قصيرة بدمج الجمل المفيدة وإزالة التكرار غير الضروري.",
    stage: "assessment", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Rewrite this fictional note in 35–50 words: The class starts at six. The class is online. Please join the class at six. The link is in the message. The message has the link. Keep the important information and remove repetition.", writingPromptArabic: "أعد كتابة هذه الملاحظة الخيالية في 35–50 كلمة: The class starts at six. The class is online. Please join the class at six. The link is in the message. The message has the link. احتفظ بالمعلومات المهمة وأزل التكرار.",
    sentencePatterns: ["The online class starts at six.", "Please use the link in this message."],
  }],
  105: [{
    id: "a2-m7-l105-tech-checkpoint", kind: "assessment", title: "Communication and technology checkpoint", titleArabic: "اختبار التواصل والتقنية",
    objective: "Demonstrate clear messaging, digital problem-solving, clarification, and practical safe instructions in connected fictional tasks.", objectiveArabic: "أظهر كتابة رسائل واضحة وحل مشكلات رقمية وتوضيحاً وتعليمات عملية آمنة في مهام خيالية مترابطة.",
    stage: "assessment", estimatedMinutes: 13, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete three fictional parts: repair a two-sentence course message, write a polite clarification for a mixed-up date, and give three safe steps for a login problem. Use no real names, links, passwords, or private information.", writingPromptArabic: "أكمل ثلاثة أجزاء خيالية: أصلح رسالة دورة من جملتين، واكتب توضيحاً مهذباً لتاريخ مختلط، وقدّم ثلاث خطوات آمنة لمشكلة تسجيل دخول. لا تستخدم أسماء أو روابط أو كلمات مرور أو معلومات خاصة حقيقية.",
    sentencePatterns: ["Sorry, I meant ___.", "First, ___. Then, ___.", "Do not share ___."],
  }],
};
