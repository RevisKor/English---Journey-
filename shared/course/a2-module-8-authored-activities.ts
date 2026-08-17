import type { LessonActivity, VisualVocabularyItem } from "./types";

function marketCard(label: string, colour: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${label}"><rect width="320" height="180" fill="${colour}"/><rect x="48" y="44" width="224" height="94" rx="12" fill="#fffdf8" stroke="#c88e3c" stroke-width="5"/><path d="M72 78h176M72 105h132" stroke="#456957" stroke-width="9" stroke-linecap="round"/><circle cx="230" cy="104" r="16" fill="#d49b3f"/><rect x="52" y="18" width="142" height="34" rx="12" fill="#253b58"/><text x="123" y="41" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fffdf8">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const menuVisuals: VisualVocabularyItem[] = [
  { id: "a2-m8-ingredient", word: "ingredient", arabic: "مكوّن", pronunciation: "/ɪnˈɡriːdiənt/", exampleEN: "This soup has fresh ingredients.", exampleAR: "يحتوي هذا الحساء على مكونات طازجة.", altText: "Illustrated market card labelled Ingredient", category: "Food and menus", interactionHint: "Name one ingredient in a fictional dish.", imageUrl: marketCard("Ingredient", "#eef5e9") },
  { id: "a2-m8-menu", word: "menu", arabic: "قائمة طعام", pronunciation: "/ˈmenjuː/", exampleEN: "Let us read the menu before we order.", exampleAR: "لنقرأ قائمة الطعام قبل أن نطلب.", altText: "Illustrated market card labelled Menu", category: "Food and menus", interactionHint: "Choose one fictional item from a menu.", imageUrl: marketCard("Menu", "#f8f0e5") },
  { id: "a2-m8-dish", word: "dish", arabic: "طبق", pronunciation: "/dɪʃ/", exampleEN: "The rice dish is popular at this café.", exampleAR: "طبق الأرز مشهور في هذا المقهى.", altText: "Illustrated market card labelled Dish", category: "Food and menus", interactionHint: "Describe a fictional dish with one adjective.", imageUrl: marketCard("Dish", "#eaf1fb") },
];

export const A2_MODULE_8_AUTHORED_ACTIVITIES: Record<number, LessonActivity[]> = {
  106: [{
    id: "a2-m8-l106-menu-map", kind: "visual-vocabulary", title: "Explore a wider menu", titleArabic: "استكشف قائمة طعام أوسع",
    objective: "Recognise ingredient, menu, and dish, then connect each word to a practical food choice.", objectiveArabic: "تعرّف على ingredient وmenu وdish ثم اربط كل كلمة باختيار طعام عملي.",
    stage: "introduction", estimatedMinutes: 8, semantic: "vocabulary", progressiveSupports: ["arabic-help", "word-support", "worked-example"], visualItems: menuVisuals,
  }],
  107: [{
    id: "a2-m8-l107-order-kindly", kind: "interaction", title: "Order with confidence", titleArabic: "اطلب بثقة",
    objective: "Make a polite fictional order with would like, please, and a clear quantity phrase.", objectiveArabic: "قدّم طلباً خيالياً مهذباً باستخدام would like وplease وعبارة كمية واضحة.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m8-l107-a", speaker: "Server", text: "Hello. Are you ready to order?", textArabic: "مرحباً. هل أنت مستعد للطلب؟", purpose: "Open a service exchange." },
      { id: "a2-m8-l107-b", speaker: "Customer", text: "Yes, please. I would like two small salads and a bottle of water.", textArabic: "نعم، من فضلك. أود طبقين صغيرين من السلطة وزجاجة ماء.", purpose: "Give a polite order and quantity." },
      { id: "a2-m8-l107-c", speaker: "Server", text: "Certainly. Would you like anything else?", textArabic: "بالتأكيد. هل ترغب في شيء آخر؟", purpose: "Invite a final choice." },
    ],
  }],
  108: [{
    id: "a2-m8-l108-product-comparisons", kind: "standard", title: "Compare products fairly", titleArabic: "قارن المنتجات بعدل",
    objective: "Use comparative and superlative forms to compare three fictional products without treating cheap as the only value.", objectiveArabic: "استخدم صيغ المقارنة والتفضيل لمقارنة ثلاثة منتجات خيالية دون اعتبار الرخيص القيمة الوحيدة.",
    stage: "explanation", estimatedMinutes: 9, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "Complete a balanced fictional comparison: The green bag is ___ (cheap) than the blue bag, but the blue bag is ___ (strong). Of all three, the black bag is the ___ (light).", writingPromptArabic: "أكمل مقارنة خيالية متوازنة: The green bag is ___ (cheap) than the blue bag, but the blue bag is ___ (strong). Of all three, the black bag is the ___ (light).",
    sentencePatterns: ["This one is cheaper than ___.", "It is the most useful option for ___."],
  }],
  109: [{
    id: "a2-m8-l109-shop-review", kind: "reading", title: "Read a shop review", titleArabic: "اقرأ مراجعة متجر",
    objective: "Separate a fact, an opinion, and supporting evidence in a short fictional shop review.", objectiveArabic: "ميّز بين حقيقة ورأي ودليل داعم في مراجعة متجر خيالية قصيرة.",
    stage: "introduction", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "Review: Cedar Corner sells local food, kitchen items, and simple gifts. It opens at 9 a.m. every day except Friday. In my opinion, its fruit is better than the supermarket fruit because it is fresher and the staff explain where it comes from. Prices are not always the lowest, so compare before you choose.",
    readingTextArabic: "مراجعة: يبيع Cedar Corner طعاماً محلياً وأدوات مطبخ وهدايا بسيطة. يفتح الساعة 9 صباحاً كل يوم ما عدا الجمعة. في رأيي، فاكهته أفضل من فاكهة السوبرماركت لأنها أطزج والموظفون يشرحون مصدرها. الأسعار ليست دائماً الأقل، لذا قارن قبل الاختيار.",
    readingChecks: [
      { id: "a2-m8-l109-fact", type: "detail", prompt: "Which statement is a fact from the review?", promptArabic: "أي جملة تُعد حقيقة من المراجعة؟", choices: ["The shop opens at 9 a.m. except Friday.", "The fruit is the best in the city.", "The staff are more interesting than everyone else."], answer: "The shop opens at 9 a.m. except Friday.", explanation: "This is a checkable opening-time detail." },
      { id: "a2-m8-l109-evidence", type: "inference", prompt: "What evidence supports the writer’s positive opinion of the fruit?", promptArabic: "ما الدليل الذي يدعم رأي الكاتب الإيجابي في الفاكهة؟", choices: ["It is fresher and staff explain its source.", "It is always the cheapest.", "It is only sold on Friday."], answer: "It is fresher and staff explain its source.", explanation: "The writer gives freshness and staff information as reasons." },
    ],
  }],
  110: [{
    id: "a2-m8-l110-return-question", kind: "speaking", title: "Ask about a return", titleArabic: "اسأل عن إرجاع منتج",
    objective: "Rehearse a calm return question using have you got, receipt, and a simple reason.", objectiveArabic: "تدرّب على سؤال هادئ عن الإرجاع باستخدام have you got وreceipt وسبب بسيط.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m8-l110-a", speaker: "Customer model", text: "Hello. Have you got a returns desk? I bought this yesterday, but it is too small.", textArabic: "مرحباً. هل لديكم مكتب إرجاع؟ اشتريت هذا أمس، لكنه صغير جداً.", pronunciationHint: "Keep have you got as one gentle question; stress returns and small.", audioText: "Hello. Have you got a returns desk? I bought this yesterday, but it is too small." },
      { id: "a2-m8-l110-b", speaker: "Service model", text: "Yes. Do you have the receipt with you?", textArabic: "نعم. هل لديك الإيصال معك؟", pronunciationHint: "Let do you have flow together, but make receipt clear.", audioText: "Yes. Do you have the receipt with you?" },
    ],
  }],
  111: [{
    id: "a2-m8-l111-customer-desk", kind: "interaction", title: "Explain a service problem", titleArabic: "اشرح مشكلة خدمة",
    objective: "Use past simple to explain when a fictional service problem happened and what you need now.", objectiveArabic: "استخدم الماضي البسيط لشرح متى حدثت مشكلة خدمة خيالية وما تحتاجه الآن.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m8-l111-a", speaker: "Customer", text: "I paid for delivery yesterday, but the package did not arrive.", textArabic: "دفعت للتوصيل أمس، لكن الطرد لم يصل.", purpose: "State a past service problem." },
      { id: "a2-m8-l111-b", speaker: "Customer adviser", text: "I am sorry about that. Did you receive a delivery message?", textArabic: "أنا آسف لذلك. هل تلقيت رسالة توصيل؟", purpose: "Ask for a relevant detail." },
      { id: "a2-m8-l111-c", speaker: "Customer", text: "No, I did not. Could you check the order, please?", textArabic: "لا، لم أتلقها. هل يمكنك التحقق من الطلب من فضلك؟", purpose: "Use a past negative and a present request." },
    ],
  }],
  112: [{
    id: "a2-m8-l112-packaging-amounts", kind: "standard", title: "Choose the right amount", titleArabic: "اختر الكمية المناسبة",
    objective: "Use containers and how much or how many to make practical fictional shopping choices.", objectiveArabic: "استخدم العبوات وhow much أو how many لاتخاذ اختيارات تسوق خيالية عملية.",
    stage: "explanation", estimatedMinutes: 8, semantic: "grammar", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Complete the shopping note: How ___ bottles of water do we need? We need three. How ___ rice is in this packet? There is one kilogram. Add one carton of milk and two packets of pasta.", writingPromptArabic: "أكمل ملاحظة التسوق: How ___ bottles of water do we need? We need three. How ___ rice is in this packet? There is one kilogram. أضف علبة حليب كرتونية واحدة وعبوتين من المعكرونة.",
    sentencePatterns: ["How many ___ do we need?", "How much ___ is there?", "A packet of ___"],
  }],
  113: [{
    id: "a2-m8-l113-recipe-order", kind: "reading", title: "Follow a recipe in order", titleArabic: "اتبع وصفة بالترتيب",
    objective: "Follow imperatives, sequence markers, and cooking verbs in a short fictional recipe.", objectiveArabic: "اتبع أفعال الأمر وكلمات الترتيب وأفعال الطهي في وصفة خيالية قصيرة.",
    stage: "guided-practice", estimatedMinutes: 9, semantic: "activity", progressiveSupports: ["arabic-help", "word-support", "worked-example"],
    readingText: "Quick vegetable couscous: First, chop one tomato and one cucumber. Next, put the couscous in a bowl and add hot water. Wait five minutes until it is soft. Then mix in the vegetables, lemon juice, and a little salt. Finally, taste it before you serve it.",
    readingTextArabic: "كسكسي خضروات سريع: أولاً، اقطع طماطم واحدة وخيارة واحدة. بعد ذلك، ضع الكسكسي في وعاء وأضف ماءً ساخناً. انتظر خمس دقائق حتى يصبح طرياً. ثم اخلط الخضروات وعصير الليمون وقليلاً من الملح. وأخيراً، تذوقه قبل تقديمه.",
    readingChecks: [
      { id: "a2-m8-l113-order", type: "detail", prompt: "What happens immediately after the couscous goes in the bowl?", promptArabic: "ماذا يحدث مباشرة بعد وضع الكسكسي في الوعاء؟", choices: ["Add hot water", "Serve it", "Chop the lemon"], answer: "Add hot water", explanation: "The second instruction pairs the couscous with hot water." },
      { id: "a2-m8-l113-until", type: "inference", prompt: "Why does the recipe say to wait until the couscous is soft?", promptArabic: "لماذا تقول الوصفة أن تنتظر حتى يصبح الكسكسي طرياً؟", choices: ["So it is ready to mix", "So it becomes colder", "So the vegetables disappear"], answer: "So it is ready to mix", explanation: "Mixing happens after the waiting step." },
    ],
  }],
  114: [{
    id: "a2-m8-l114-guest-choice", kind: "writing", title: "Choose for a guest", titleArabic: "اختر لضيف",
    objective: "Write a short fictional recommendation with a suggestion, two reasons, and a respectful awareness of a guest’s taste.", objectiveArabic: "اكتب توصية خيالية قصيرة تتضمن اقتراحاً وسببين واهتماماً محترماً بذوق الضيف.",
    stage: "assessment", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "A fictional guest prefers mild food and does not eat meat. Write 45–60 words recommending one menu choice. Use I recommend..., because..., and one comparison. Do not make claims about real restaurants or people.", writingPromptArabic: "ضيف خيالي يفضّل الطعام الخفيف ولا يأكل اللحم. اكتب 45–60 كلمة توصي بخيار واحد من القائمة. استخدم I recommend... وbecause... ومقارنة واحدة. لا تقدّم ادعاءات عن مطاعم أو أشخاص حقيقيين.",
    sentencePatterns: ["I recommend the ___ because ___.", "It is lighter than ___."],
  }],
  115: [{
    id: "a2-m8-l115-repair-misunderstanding", kind: "interaction", title: "Handle a misunderstanding", titleArabic: "تعامل مع سوء فهم",
    objective: "Use an apology, clarification question, and repair phrase when a fictional order is misunderstood.", objectiveArabic: "استخدم اعتذاراً وسؤال توضيح وعبارة إصلاح عندما يُفهم طلب خيالي بشكل خاطئ.",
    stage: "real-context", estimatedMinutes: 8, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "worked-example"],
    interactionTurns: [
      { id: "a2-m8-l115-a", speaker: "Server", text: "Here is your chicken sandwich.", textArabic: "هذا شطيرتك بالدجاج.", purpose: "Present the misunderstood order." },
      { id: "a2-m8-l115-b", speaker: "Customer", text: "Sorry, I think there is a misunderstanding. I ordered the vegetable sandwich.", textArabic: "عذراً، أعتقد أن هناك سوء فهم. طلبت شطيرة الخضروات.", purpose: "Apologise and clarify calmly." },
      { id: "a2-m8-l115-c", speaker: "Server", text: "I am sorry. Would you like me to change it now?", textArabic: "أنا آسف. هل ترغب أن أبدلها الآن؟", purpose: "Offer a repair." },
    ],
  }],
  116: [{
    id: "a2-m8-l116-polite-tunes", kind: "speaking", title: "Shape a polite request", titleArabic: "شكّل طلباً مهذباً",
    objective: "Use calm intonation to make a polite request and a respectful service question sound clear.", objectiveArabic: "استخدم تنغيماً هادئاً لجعل الطلب المهذب وسؤال الخدمة المحترم واضحين.",
    stage: "guided-practice", estimatedMinutes: 7, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    speakingLines: [
      { id: "a2-m8-l116-a", speaker: "Model", text: "Could I have a receipt, please?", textArabic: "هل يمكنني الحصول على إيصال، من فضلك؟", pronunciationHint: "Let your voice rise gently at the question, then soften please.", audioText: "Could I have a receipt, please?" },
      { id: "a2-m8-l116-b", speaker: "Model", text: "Would it be possible to change this size?", textArabic: "هل سيكون من الممكن تغيير هذا المقاس؟", pronunciationHint: "Stress possible and change; keep the final question calm.", audioText: "Would it be possible to change this size?" },
    ],
  }],
  117: [{
    id: "a2-m8-l117-service-review", kind: "review", title: "Rebuild a helpful exchange", titleArabic: "أعد بناء حوار مفيد",
    objective: "Retrieve quantities, comparisons, polite requests, and repair language by rebuilding a fictional service exchange.", objectiveArabic: "استدعِ الكميات والمقارنات والطلبات المهذبة ولغة الإصلاح بإعادة بناء حوار خدمة خيالي.",
    stage: "review", estimatedMinutes: 8, semantic: "retrieval", progressiveSupports: ["arabic-help", "word-support", "tip"],
    writingPrompt: "Put these fictional exchange moves in a useful order, then add one missing polite line: compare two options → make a quantity request → clarify a problem → close the exchange. Use cheaper, would like, sorry, and thank you.", writingPromptArabic: "ضع حركات الحوار الخيالية هذه بترتيب مفيد، ثم أضف سطراً مهذباً مفقوداً: قارن خيارين ← قدّم طلب كمية ← وضّح مشكلة ← اختم الحوار. استخدم cheaper وwould like وsorry وthank you.",
    sentencePatterns: ["I would like ___.", "This one is cheaper, but ___.", "Sorry, could you ___?"],
  }],
  118: [{
    id: "a2-m8-l118-polite-complaint", kind: "writing", title: "Write a complaint politely", titleArabic: "اكتب شكوى بأدب",
    objective: "Write a structured fictional complaint with a formal greeting, clear past problem, practical request, and closing.", objectiveArabic: "اكتب شكوى خيالية منظمة تتضمن تحية رسمية ومشكلة ماضية واضحة وطلباً عملياً وخاتمة.",
    stage: "assessment", estimatedMinutes: 11, semantic: "activity", progressiveSupports: ["arabic-help", "worked-example", "word-support"],
    writingPrompt: "Write 60–75 words to a fictional shop. A delivery arrived late and one item was missing. Include Dear Customer Service, what happened, a polite request for help, and Yours faithfully. Do not include a real order number, address, or company.", writingPromptArabic: "اكتب 60–75 كلمة إلى متجر خيالي. وصل توصيل متأخراً وكان عنصر واحد مفقوداً. أدرج Dear Customer Service وما حدث وطلباً مهذباً للمساعدة وYours faithfully. لا تضع رقم طلب أو عنواناً أو شركة حقيقية.",
    sentencePatterns: ["Dear Customer Service,", "The delivery arrived ___, and ___.", "I would be grateful if you could ___.", "Yours faithfully,"],
  }],
  119: [{
    id: "a2-m8-l119-market-exchange", kind: "interaction", title: "Complete a market exchange", titleArabic: "أكمل حواراً في السوق",
    objective: "Open, compare, choose, pay for, and close a short fictional market exchange naturally.", objectiveArabic: "ابدأ وقارن واختر وادفع واختم حوار سوق خيالي قصيراً بشكل طبيعي.",
    stage: "real-context", estimatedMinutes: 10, semantic: "activity", progressiveSupports: ["arabic-help", "transcript", "tip"],
    interactionTurns: [
      { id: "a2-m8-l119-a", speaker: "Seller", text: "Good morning. Can I help you?", textArabic: "صباح الخير. هل يمكنني مساعدتك؟", purpose: "Open the exchange." },
      { id: "a2-m8-l119-b", speaker: "Customer", text: "Yes, please. Which tomatoes are better for a salad?", textArabic: "نعم، من فضلك. أي الطماطم أفضل للسلطة؟", purpose: "Ask for a comparison." },
      { id: "a2-m8-l119-c", speaker: "Seller", text: "These are sweeter, but those are cheaper today.", textArabic: "هذه أحلى، لكن تلك أرخص اليوم.", purpose: "Offer a balanced comparison." },
      { id: "a2-m8-l119-d", speaker: "Customer", text: "I will take one kilo of the sweeter ones, please. Can I pay by card?", textArabic: "سآخذ كيلو واحد من الأحلى، من فضلك. هل يمكنني الدفع بالبطاقة؟", purpose: "Choose, state a quantity, and pay." },
    ],
  }],
  120: [{
    id: "a2-m8-l120-service-checkpoint", kind: "assessment", title: "Solve a service situation", titleArabic: "حل موقف خدمة",
    objective: "Show practical control of food and service language by comparing options, repairing a problem, and writing a short fictional follow-up.", objectiveArabic: "أظهر تحكماً عملياً بلغة الطعام والخدمة بمقارنة الخيارات وإصلاح مشكلة وكتابة متابعة خيالية قصيرة.",
    stage: "assessment", estimatedMinutes: 13, semantic: "assessment", progressiveSupports: ["arabic-help", "worked-example", "tip"],
    writingPrompt: "A fictional market gave you the wrong bag. Write 55–70 words: greet the seller, explain what you ordered and what you received, compare the two items once, ask for a fair solution, and close politely. Use a made-up name only.", writingPromptArabic: "أعطاك سوق خيالي الحقيبة الخطأ. اكتب 55–70 كلمة: حيِّ البائع، واشرح ما طلبته وما تلقيته، وقارن بين المنتجين مرة واحدة، واطلب حلاً عادلاً، واختم بأدب. استخدم اسماً مختلقاً فقط.",
    sentencePatterns: ["I ordered ___, but I received ___.", "The ___ is ___ than ___.", "Could you please ___?"],
  }],
};
