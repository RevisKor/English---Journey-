import type { LessonActivity, VisualVocabularyItem } from "./types";

const scene = (label: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420"><rect width="720" height="420" rx="28" fill="#eef2f7"/><rect x="56" y="58" width="608" height="304" rx="24" fill="#dbe6f3"/><text x="360" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#17345e">${label}</text></svg>`)}`;

const visualWords = (lesson: number, items: Array<[string, string, string, string]>): VisualVocabularyItem[] => items.map(([word, arabic, pronunciation, example], index) => ({
  id: `b1-${lesson}-visual-${index + 1}`,
  word,
  arabic,
  pronunciation,
  exampleEN: example,
  exampleAR: "استخدم الكلمة لتوضيح المعنى في سياق حقيقي.",
  imageUrl: scene(word),
  altText: `Illustrated concept card for ${word}`,
  category: "B1 ideas and contexts",
}));

/** Purpose-led B1 journeys: no lesson is required to use every activity mode. */
export const B1_MODULE_1_AUTHORED_ACTIVITIES: Record<number, readonly LessonActivity[]> = {
  1: [
    {
      id: "b1-1-story-timeline", kind: "speaking", title: "Rehearse a turning-point story", titleArabic: "تدرّب على قصة نقطة تحول",
      objective: "Shape a beginning, disruption, and consequence with clear time signals.", objectiveArabic: "شكّل بداية وتحولاً ونتيجة مع إشارات زمنية واضحة.",
      stage: "guided-practice", estimatedMinutes: 12, vocabularyIds: ["b1-1-1", "b1-1-7", "b1-1-11"], grammarIds: ["b1-grammar-1"], semantic: "activity", progressiveSupports: ["worked-example", "word-support"],
      speakingLines: [
        { id: "b1-1-s1", speaker: "Mentor", text: "Set the scene first. What had happened before the turning point?", textArabic: "ابدأ بالمشهد. ماذا كان قد حدث قبل نقطة التحول؟" },
        { id: "b1-1-s2", speaker: "Learner", text: "By the time I arrived, I had already decided to leave the course.", textArabic: "بحلول وقت وصولي، كنت قد قررت بالفعل ترك الدورة." },
        { id: "b1-1-s3", speaker: "Mentor", text: "Now add the moment that changed your direction and one feeling.", textArabic: "أضف الآن اللحظة التي غيّرت اتجاهك وشعوراً واحداً." },
      ],
    },
    {
      id: "b1-1-reflective-email", kind: "writing", title: "Write to a trusted friend", titleArabic: "اكتب لصديق تثق به",
      objective: "Tell a reflective 140–180-word story with narrative tenses instead of a list of events.", objectiveArabic: "احكِ قصة تأملية من 140–180 كلمة بأزمنة السرد، لا مجرد قائمة أحداث.",
      stage: "independent-practice", estimatedMinutes: 18, semantic: "activity", progressiveSupports: ["tip", "external-ai-prompt"],
      writingPrompt: "Write a reflective email about a turning point. Include one earlier event, the moment itself, and what changed afterwards. Use at least four sequencing markers.", writingPromptArabic: "اكتب رسالة تأملية عن نقطة تحول. ضمّن حدثاً أسبق واللحظة نفسها وما تغيّر بعدها. استخدم أربع أدوات ترتيب على الأقل.",
      suggestedVocabulary: ["turning point", "vivid memory", "relief", "eventually"], sentencePatterns: ["By the time ___, I had ___.", "While I was ___, ___.", "Looking back, I realise that ___."],
    },
  ],
  2: [
    {
      id: "b1-2-library-options", kind: "interaction", title: "Decide the library’s future", titleArabic: "قرّر مستقبل المكتبة",
      objective: "Compare realistic and imagined consequences before recommending a responsible option.", objectiveArabic: "قارن بين نتائج واقعية ومتخيلة قبل التوصية بخيار مسؤول.",
      stage: "real-context", estimatedMinutes: 14, vocabularyIds: ["b1-2-1", "b1-2-6"], grammarIds: ["b1-grammar-2"], semantic: "activity", progressiveSupports: ["worked-example", "extended-rationale"],
      interactionTurns: [
        { id: "b1-2-t1", speaker: "Chair", text: "If we reduce the library hours, what will happen to students?", textArabic: "إذا خفّضنا ساعات المكتبة، ماذا سيحدث للطلاب؟", purpose: "predict a likely result" },
        { id: "b1-2-t2", speaker: "Community member", text: "They may lose a quiet place to study. If funding were available, I would keep evening hours.", textArabic: "قد يفقدون مكاناً هادئاً للدراسة. لو توفّر التمويل، لأبقيت ساعات المساء.", purpose: "contrast real and imagined outcomes" },
        { id: "b1-2-t3", speaker: "You", text: "I recommend that we ___ because ___.", textArabic: "أوصي بأننا ___ لأن ___.", purpose: "give a justified recommendation", alternatives: ["run a volunteer rota", "protect the study space", "collect local evidence"] },
      ],
    },
  ],
  3: [
    {
      id: "b1-3-boundary-language", kind: "standard", title: "Notice respectful boundaries", titleArabic: "لاحظ الحدود باحترام",
      objective: "Distinguish a personal boundary from a personal attack in a short disagreement.", objectiveArabic: "ميّز بين حد شخصي وهجوم شخصي في خلاف قصير.",
      stage: "explanation", estimatedMinutes: 10, grammarIds: ["b1-grammar-3"], semantic: "common-mistake", progressiveSupports: ["arabic-help", "extended-rationale"],
      readingText: "Mina told Omar: ‘I value our friendship, but I need you to ask before sharing my news. The message that you posted made me uncomfortable.’ Omar replied: ‘I did not realise that. I will remove it and check with you next time.’", readingTextArabic: "قالت مينا لعمر: «أقدّر صداقتنا، لكنني أحتاج أن تسأل قبل مشاركة أخباري. الرسالة التي نشرتها جعلتني غير مرتاحة». أجاب عمر: «لم أدرك ذلك. سأحذفها وأتأكد منك في المرة القادمة».",
      readingChecks: [
        { id: "b1-3-c1", type: "inference", prompt: "Why is Mina’s wording likely to keep the conversation calm?", promptArabic: "لماذا يُحتمل أن يحافظ كلام مينا على هدوء الحوار؟", answer: "She names the effect on her and asks for a specific future action rather than blaming Omar.", explanation: "A boundary describes a need and a next step." },
      ],
    },
    {
      id: "b1-3-repair-dialogue", kind: "speaking", title: "Practise a repair conversation", titleArabic: "تدرّب على حوار إصلاحي",
      objective: "Use a relative clause and polite disagreement to propose a workable repair.", objectiveArabic: "استخدم جملة موصولة وخلافاً مهذباً لاقتراح إصلاح عملي.",
      stage: "guided-practice", estimatedMinutes: 11, semantic: "activity", progressiveSupports: ["transcript", "tip"],
      speakingLines: [
        { id: "b1-3-s1", speaker: "You", text: "The message that you sent upset me because it included private details.", textArabic: "الرسالة التي أرسلتها أزعجتني لأنها تضمنت تفاصيل خاصة." },
        { id: "b1-3-s2", speaker: "Partner", text: "I see your point, although that was not my intention. What would help now?", textArabic: "أفهم وجهة نظرك، مع أن ذلك لم يكن قصدي. ما الذي سيساعد الآن؟" },
      ],
    },
  ],
  4: [
    {
      id: "b1-4-habit-evidence", kind: "reading", title: "Read a habit-change diary", titleArabic: "اقرأ يوميات تغيير عادة",
      objective: "Trace setbacks, support, and gradual progress without treating a habit as instantly fixed.", objectiveArabic: "تتبّع الانتكاسات والدعم والتقدم التدريجي دون اعتبار العادة منتهية فوراً.",
      stage: "introduction", estimatedMinutes: 13, grammarIds: ["b1-grammar-4"], semantic: "activity", progressiveSupports: ["word-support"],
      readingText: "For years, I used to check my phone before breakfast. Last month I started leaving it in another room. I have been trying this for three weeks, and I still slip sometimes. However, my sister has been reminding me to take a walk first, which has made the change easier.", readingTextArabic: "لسنوات، كنت أتفقد هاتفي قبل الإفطار. الشهر الماضي بدأت أتركه في غرفة أخرى. أحاول ذلك منذ ثلاثة أسابيع وما زلت أتعثر أحياناً. لكن أختي تذكرني بالمشي أولاً، وهذا جعل التغيير أسهل.",
      readingChecks: [
        { id: "b1-4-c1", type: "detail", prompt: "Which support is helping the writer?", promptArabic: "أي دعم يساعد الكاتب؟", answer: "A sister reminds the writer to walk first." },
        { id: "b1-4-c2", type: "inference", prompt: "Why does the writer say ‘I still slip sometimes’?", promptArabic: "لماذا يقول الكاتب «ما زلت أتعثر أحياناً»؟", answer: "To present change as gradual and realistic." },
      ],
    },
  ],
  5: [
    {
      id: "b1-5-balanced-view", kind: "writing", title: "Write a qualified local opinion", titleArabic: "اكتب رأياً محلياً متوازناً",
      objective: "Present a fair view, acknowledge a limit, and make a proportionate recommendation.", objectiveArabic: "قدّم رأياً عادلاً، واعترف بقيد، وقدّم توصية متوازنة.",
      stage: "independent-practice", estimatedMinutes: 16, grammarIds: ["b1-grammar-5"], semantic: "activity", progressiveSupports: ["worked-example", "external-ai-prompt"],
      writingPrompt: "Write 130–160 words on whether your area needs more car-free streets. Include one benefit, one concern, and a qualified conclusion; do not present either side as completely right.", writingPromptArabic: "اكتب 130–160 كلمة حول ما إذا كانت منطقتك تحتاج شوارع أكثر بلا سيارات. ضمّن فائدة وقلقاً وخلاصة متحفظة؛ لا تقدّم أي جانب كأنه صحيح تماماً.",
      suggestedVocabulary: ["to some extent", "however", "may lead to", "a balanced approach"], sentencePatterns: ["Although ___, it is still worth ___.", "This may be true; however, ___.", "On balance, I would ___."],
    },
  ],
  6: [
    {
      id: "b1-6-tone-sort", kind: "interaction", title: "Choose the right email tone", titleArabic: "اختر نبرة البريد الصحيحة",
      objective: "Make a clear request while matching the relationship and purpose.", objectiveArabic: "قدّم طلباً واضحاً مع ملاءمة العلاقة والغرض.",
      stage: "guided-practice", estimatedMinutes: 12, vocabularyIds: ["b1-6-1", "b1-6-5"], grammarIds: ["b1-grammar-6"], semantic: "activity", progressiveSupports: ["worked-example"],
      interactionTurns: [
        { id: "b1-6-t1", speaker: "Situation", text: "Ask a course coordinator for a two-day extension.", textArabic: "اطلب من منسق الدورة تمديداً ليومين.", purpose: "select formal request language" },
        { id: "b1-6-t2", speaker: "Draft A", text: "Hey, give me more time please.", textArabic: "مرحباً، أعطني وقتاً أكثر من فضلك.", purpose: "notice why tone is too casual" },
        { id: "b1-6-t3", speaker: "Draft B", text: "Could I please request a two-day extension? I would be grateful if this were possible.", textArabic: "هل يمكنني طلب تمديد ليومين؟ سأكون ممتناً إذا كان ذلك ممكناً.", purpose: "model a formal, actionable request" },
      ],
    },
    {
      id: "b1-6-action-email", kind: "writing", title: "Send an actionable email", titleArabic: "أرسل بريداً قابلاً للتنفيذ",
      objective: "Organise context, request, deadline, and respectful closing in a short email.", objectiveArabic: "نظّم السياق والطلب والموعد والختام المهذب في بريد قصير.",
      stage: "real-context", estimatedMinutes: 14, semantic: "activity", progressiveSupports: ["tip", "external-ai-prompt"],
      writingPrompt: "Write 120–150 words to a coordinator requesting help with a schedule conflict. Make the requested action and timing unmistakable.", writingPromptArabic: "اكتب 120–150 كلمة إلى منسق تطلب فيها المساعدة في تعارض بالجدول. اجعل الإجراء المطلوب وتوقيته واضحين تماماً.",
      suggestedVocabulary: ["I am writing to request", "would it be possible", "by Friday", "Kind regards"], sentencePatterns: ["I am writing regarding ___.", "Could you please ___ by ___?", "Thank you for considering my request."],
    },
  ],
  7: [
    {
      id: "b1-7-priority-map", kind: "visual-vocabulary", title: "Map neighbourhood priorities", titleArabic: "ارسم أولويات الحي",
      objective: "Use modal verbs to rank what a neighbourhood needs, could try, and must protect.", objectiveArabic: "استخدم الأفعال الناقصة لترتيب ما يحتاجه الحي وما يمكنه تجربته وما يجب حمايته.",
      stage: "introduction", estimatedMinutes: 10, vocabularyIds: ["b1-7-1", "b1-7-4", "b1-7-8"], grammarIds: ["b1-grammar-7"], semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support"],
      visualItems: visualWords(7, [["priority", "أولوية", "pry-OR-i-tee", "Safety is our first priority."], ["accessible", "متاح للجميع", "ak-SES-uh-bul", "The park should be accessible."], ["funding", "تمويل", "FUN-ding", "The plan needs reliable funding."]]),
    },
    {
      id: "b1-7-community-pitch", kind: "speaking", title: "Give a one-minute community pitch", titleArabic: "قدّم عرضاً مجتمعياً لدقيقة",
      objective: "Argue for one local change with obligation, advice, and possibility language.", objectiveArabic: "دافع عن تغيير محلي واحد بلغة الوجوب والنصيحة والإمكان.",
      stage: "assessment", estimatedMinutes: 9, semantic: "assessment", progressiveSupports: ["tip"],
      speakingLines: [
        { id: "b1-7-s1", speaker: "Frame", text: "Our neighbourhood must address ___ because ___.", textArabic: "يجب أن يعالج حيّنا ___ لأن ___." },
        { id: "b1-7-s2", speaker: "Option", text: "We could ___, and residents should ___.", textArabic: "يمكننا أن ___، وينبغي للسكان أن ___." },
      ],
    },
  ],
  8: [
    {
      id: "b1-8-meeting-report", kind: "interaction", title: "Report the team meeting", titleArabic: "انقل اجتماع الفريق",
      objective: "Report different views accurately before proposing a fair next step.", objectiveArabic: "انقل آراء مختلفة بدقة قبل اقتراح خطوة تالية عادلة.",
      stage: "guided-practice", estimatedMinutes: 13, grammarIds: ["b1-grammar-8"], semantic: "activity", progressiveSupports: ["transcript", "worked-example"],
      interactionTurns: [
        { id: "b1-8-t1", speaker: "Huda", text: "I can cover the morning shift, but not every day.", textArabic: "يمكنني تغطية وردية الصباح، لكن ليس كل يوم.", purpose: "listen for a limit" },
        { id: "b1-8-t2", speaker: "You", text: "Huda said that she could cover mornings, although she could not do it every day.", textArabic: "قالت هدى إنها تستطيع تغطية الصباح، مع أنها لا تستطيع ذلك كل يوم.", purpose: "report accurately" },
        { id: "b1-8-t3", speaker: "You", text: "A fair solution would be to ___ so that ___.", textArabic: "سيكون الحل العادل هو ___ حتى ___.", purpose: "propose a shared action" },
      ],
    },
  ],
  9: [
    {
      id: "b1-9-complaint-sequence", kind: "reading", title: "Follow a service-problem sequence", titleArabic: "اتبع تسلسل مشكلة خدمة",
      objective: "Separate facts, consequences, and requested solutions in a formal complaint.", objectiveArabic: "افصل بين الحقائق والنتائج والحلول المطلوبة في شكوى رسمية.",
      stage: "explanation", estimatedMinutes: 12, grammarIds: ["b1-grammar-9"], semantic: "activity", progressiveSupports: ["word-support", "extended-rationale"],
      readingText: "On Monday, my delivery was marked as complete although no package was received. The address had been checked twice before the order was sent. As a result, the gift was not available for the event. I would appreciate it if the matter could be investigated and a replacement arranged by Thursday.", readingTextArabic: "يوم الاثنين، وُضع على طلبي أنه اكتمل رغم عدم استلام أي طرد. كان العنوان قد تم التحقق منه مرتين قبل إرسال الطلب. ونتيجة لذلك، لم تكن الهدية متاحة للفعالية. سأقدّر التحقيق في الأمر وترتيب بديل قبل الخميس.",
      readingChecks: [
        { id: "b1-9-c1", type: "detail", prompt: "What had been checked before the order was sent?", promptArabic: "ما الذي تم التحقق منه قبل إرسال الطلب؟", answer: "The address." },
        { id: "b1-9-c2", type: "main-idea", prompt: "What is the writer asking the service to do?", promptArabic: "ماذا يطلب الكاتب من الخدمة؟", answer: "Investigate and arrange a replacement." },
      ],
    },
  ],
  10: [
    {
      id: "b1-10-fit-profile", kind: "standard", title: "Match strengths to work", titleArabic: "طابق نقاط القوة مع العمل",
      objective: "Explain which work settings suit you and why, using gerunds and infinitives accurately.", objectiveArabic: "اشرح أي بيئات عمل تناسبك ولماذا، باستخدام المصدر واسم الفعل بدقة.",
      stage: "real-context", estimatedMinutes: 14, vocabularyIds: ["b1-10-1", "b1-10-5"], grammarIds: ["b1-grammar-10"], semantic: "activity", progressiveSupports: ["worked-example", "word-support"],
      writingPrompt: "Create a 100–130-word work-fit profile. Explain what you enjoy doing, what you would like to learn, and one role that seems suitable at this stage.", writingPromptArabic: "أنشئ ملفاً من 100–130 كلمة عن ملاءمتك للعمل. اشرح ما تستمتع بفعله وما ترغب في تعلمه ودوراً واحداً يبدو مناسباً في هذه المرحلة.",
      suggestedVocabulary: ["be suited to", "enjoy working with", "aim to develop", "would prefer to"], sentencePatterns: ["I enjoy ___ing because ___.", "I would like to ___ in order to ___.", "This role would suit me because ___."],
    },
  ],
  11: [
    {
      id: "b1-11-proposal-structure", kind: "writing", title: "Draft a concise proposal", titleArabic: "اكتب مقترحاً موجزاً",
      objective: "Link a practical purpose to expected benefits, cost, and one manageable risk.", objectiveArabic: "اربط غرضاً عملياً بفوائد متوقعة وتكلفة وخطر يمكن التعامل معه.",
      stage: "independent-practice", estimatedMinutes: 17, grammarIds: ["b1-grammar-11"], semantic: "activity", progressiveSupports: ["worked-example", "external-ai-prompt"],
      writingPrompt: "Write a 150-word proposal for one improvement in your school, course, or workplace. State the purpose, expected benefit, a likely risk, and how you would reduce it.", writingPromptArabic: "اكتب مقترحاً من 150 كلمة لتحسين واحد في مدرستك أو دورتك أو عملك. اذكر الغرض والفائدة المتوقعة وخطراً محتملاً وكيف تقلله.",
      suggestedVocabulary: ["The purpose of this proposal is", "is expected to", "a potential risk", "can be reduced by"], sentencePatterns: ["This proposal aims to ___.", "As a result, ___.", "One risk is ___; however, ___."],
    },
  ],
  12: [
    {
      id: "b1-12-volunteer-case", kind: "reading", title: "Evaluate a volunteer project", titleArabic: "قيّم مشروع تطوعي",
      objective: "Evaluate impact with reasons rather than assuming every community action succeeds.", objectiveArabic: "قيّم الأثر بالأسباب بدلاً من افتراض نجاح كل عمل مجتمعي.",
      stage: "introduction", estimatedMinutes: 13, grammarIds: ["b1-grammar-12"], semantic: "activity", progressiveSupports: ["tip", "word-support"],
      readingText: "The project, which was started by local nurses, delivers food to older residents after hospital visits. Volunteers who receive a short training course make the deliveries. The scheme has reduced missed meals, but it depends on donations that are not always predictable. The organisers are therefore looking for a longer-term partner.", readingTextArabic: "المشروع، الذي بدأه ممرضون محليون، يوصل الطعام إلى كبار السن بعد زيارات المستشفى. المتطوعون الذين يتلقون تدريباً قصيراً يقومون بالتوصيل. قلّل البرنامج من الوجبات الفائتة، لكنه يعتمد على تبرعات ليست متوقعة دائماً. لذلك يبحث المنظمون عن شريك طويل الأمد.",
      readingChecks: [
        { id: "b1-12-c1", type: "inference", prompt: "Why are organisers seeking a longer-term partner?", promptArabic: "لماذا يبحث المنظمون عن شريك طويل الأمد؟", answer: "Because donations alone are not predictable enough to sustain the project." },
      ],
    },
  ],
  13: [
    {
      id: "b1-13-source-check", kind: "reading", title: "Trace a story to its source", titleArabic: "تتبّع القصة إلى مصدرها",
      objective: "Compare a claim, a direct source, and a reported account before writing a balanced summary.", objectiveArabic: "قارن بين ادعاء ومصدر مباشر وحساب منقول قبل كتابة ملخص متوازن.",
      stage: "explanation", estimatedMinutes: 15, vocabularyIds: ["b1-13-1", "b1-13-4"], grammarIds: ["b1-grammar-13"], semantic: "retrieval", progressiveSupports: ["extended-rationale", "tip"],
      readingText: "A post claimed that the town museum was closing immediately. However, the museum’s official statement said that only one gallery would close for repairs. A local reporter wrote that visitors had been worried by the original post, but added that the director had confirmed the main building would remain open.", readingTextArabic: "ادعى منشور أن متحف المدينة سيغلق فوراً. لكن بيان المتحف الرسمي قال إن قاعة واحدة فقط ستغلق للإصلاحات. كتب صحفي محلي أن الزوار قلقوا بسبب المنشور الأصلي، وأضاف أن المدير أكد بقاء المبنى الرئيسي مفتوحاً.",
      readingChecks: [
        { id: "b1-13-c1", type: "inference", prompt: "Which source should carry the most weight for the closure claim, and why?", promptArabic: "أي مصدر ينبغي أن تكون له الثقة الأكبر في ادعاء الإغلاق ولماذا؟", answer: "The official museum statement, because it is a direct source for the museum’s plans." },
      ],
    },
  ],
  14: [
    {
      id: "b1-14-design-loop", kind: "visual-vocabulary", title: "See an attention loop", titleArabic: "شاهد حلقة الانتباه",
      objective: "Explain how a design feature can trigger a habit and suggest a proportionate change.", objectiveArabic: "اشرح كيف يمكن لميزة تصميم أن تثير عادة واقترح تغييراً متناسباً.",
      stage: "introduction", estimatedMinutes: 11, grammarIds: ["b1-grammar-14"], semantic: "vocabulary", progressiveSupports: ["arabic-help", "worked-example"],
      visualItems: visualWords(14, [["notification", "إشعار", "noh-ti-fi-KAY-shun", "A notification can interrupt concentration."], ["trigger", "مُحفّز", "TRIG-er", "A bright badge acts as a trigger."], ["scroll", "تمرير", "skrohl", "Endless scroll keeps the next item ready."]]),
    },
    {
      id: "b1-14-design-argument", kind: "speaking", title: "Argue for one design change", titleArabic: "دافع عن تغيير تصميم واحد",
      objective: "Connect a feature to an effect, then propose a user-respecting alternative.", objectiveArabic: "اربط ميزة بأثر، ثم اقترح بديلاً يحترم المستخدم.",
      stage: "assessment", estimatedMinutes: 9, semantic: "assessment", progressiveSupports: ["tip"],
      speakingLines: [
        { id: "b1-14-s1", speaker: "Claim", text: "Because the app sends repeated alerts, users may check it without intending to.", textArabic: "لأن التطبيق يرسل تنبيهات متكررة، قد يتفقده المستخدمون دون قصد." },
        { id: "b1-14-s2", speaker: "Proposal", text: "A quieter default could reduce interruptions while still allowing important updates.", textArabic: "يمكن أن يقلل الإعداد الافتراضي الأهدأ المقاطعات مع السماح بالتحديثات المهمة." },
      ],
    },
  ],
  15: [
    {
      id: "b1-15-pitch-review", kind: "assessment", title: "Present an honest campaign idea", titleArabic: "قدّم فكرة حملة صادقة",
      objective: "Defend a persuasive idea while distinguishing evidence, comparison, and exaggeration.", objectiveArabic: "دافع عن فكرة مقنعة مع التمييز بين الدليل والمقارنة والمبالغة.",
      stage: "assessment", estimatedMinutes: 18, grammarIds: ["b1-grammar-15"], semantic: "assessment", progressiveSupports: ["tip", "external-ai-prompt"],
      writingPrompt: "Create a short campaign pitch for a useful local product or service. Include an honest comparison, one qualifying phrase, and a sentence explaining what evidence supports your claim. Avoid promises you cannot justify.", writingPromptArabic: "أنشئ عرض حملة قصيراً لمنتج أو خدمة محلية مفيدة. ضمّن مقارنة صادقة وعبارة تحفظ وجملة تشرح الدليل الذي يدعم ادعاءك. تجنب الوعود التي لا تستطيع تبريرها.",
      suggestedVocabulary: ["more practical than", "one of the most useful", "based on feedback", "may be especially helpful"], sentencePatterns: ["Compared with ___, this ___.", "It may be a better option for ___ because ___.", "This claim is supported by ___."],
    },
  ],
} as const satisfies Record<number, readonly LessonActivity[]>;
