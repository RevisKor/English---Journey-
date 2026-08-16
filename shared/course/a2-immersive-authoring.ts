import type { LessonType } from "./types";

export type A2LessonArc = {
  title: string;
  titleArabic: string;
  type: LessonType;
  grammar: string;
  grammarArabic: string;
  anchors: string[];
};

export type A2ModuleArc = {
  title: string;
  titleArabic: string;
  focus: string;
  focusArabic: string;
  lessons: A2LessonArc[];
};

const arc = (title: string, titleArabic: string, type: LessonType, grammar: string, grammarArabic: string, anchors: string[]): A2LessonArc => ({ title, titleArabic, type, grammar, grammarArabic, anchors });

export const A2_MODULE_ARCS: A2ModuleArc[] = [
  {
    title: "Health and Habits", titleArabic: "الصحة والعادات", focus: "describe routines, symptoms, and sensible changes", focusArabic: "وصف العادات والأعراض والتغييرات المفيدة",
    lessons: [
      arc("A healthier morning", "صباح أكثر صحة", "standard", "present simple review with routine adverbs", "مراجعة المضارع البسيط مع ظروف التكرار", ["routine", "healthy", "usually"]),
      arc("Small habits, real results", "عادات صغيرة ونتائج حقيقية", "reading", "because and so for simple reasons and results", "because وso للأسباب والنتائج البسيطة", ["habit", "result", "because"]),
      arc("Food that gives you energy", "طعام يمنحك الطاقة", "visual-vocabulary", "countable and uncountable nouns with some and any", "الأسماء المعدودة وغير المعدودة مع some وany", ["energy", "meal", "vegetable"]),
      arc("How often do you exercise?", "كم مرة تمارس الرياضة؟", "interaction", "how often questions and frequency expressions", "أسئلة how often وعبارات التكرار", ["exercise", "often", "week"]),
      arc("Giving gentle health advice", "تقديم نصيحة صحية بلطف", "speaking", "should and should not for advice", "should وshould not للنصيحة", ["advice", "rest", "should"]),
      arc("A visit to the pharmacy", "زيارة إلى الصيدلية", "interaction", "can, could, and polite requests", "can وcould والطلبات المهذبة", ["medicine", "symptom", "request"]),
      arc("Describing a simple symptom", "وصف عرض بسيط", "standard", "have, feel, look, and sound in descriptions", "استخدام have وfeel وlook وsound في الوصف", ["pain", "feel", "doctor"]),
      arc("What happened yesterday?", "ماذا حدث أمس؟", "standard", "past simple of be and common regular verbs", "الماضي البسيط من be والأفعال المنتظمة الشائعة", ["yesterday", "tired", "walk"]),
      arc("Read: A week of changes", "اقرأ: أسبوع من التغييرات", "reading", "past time markers and sequence words", "علامات زمن الماضي وكلمات الترتيب", ["change", "before", "after"]),
      arc("My healthy choice", "اختياري الصحي", "writing", "linking a short paragraph with first, then, and finally", "ربط فقرة قصيرة بـ first وthen وfinally", ["choice", "plan", "finally"]),
      arc("Health language in context", "لغة الصحة في السياق", "standard", "question formation in present and past", "تكوين الأسئلة في الحاضر والماضي", ["question", "answer", "context"]),
      arc("Listen, clarify, and respond", "استمع ووضح ورد", "speaking", "Could you repeat? and clarification phrases", "عبارات Could you repeat? وطلب التوضيح", ["repeat", "clear", "understand"]),
      arc("Health and habits retrieval", "استرجاع الصحة والعادات", "review", "mixed review of advice, reasons, and past events", "مراجعة مختلطة للنصيحة والأسباب وأحداث الماضي", ["review", "advice", "reason"]),
      arc("Write a practical health message", "اكتب رسالة صحية عملية", "writing", "polite imperatives and short message punctuation", "الأوامر المهذبة وترقيم الرسائل القصيرة", ["message", "appointment", "period"]),
      arc("Health and habits checkpoint", "اختبار الصحة والعادات", "assessment", "integrated present, past, advice, and reason clauses", "دمج الحاضر والماضي والنصيحة وجمل السبب", ["health", "habit", "checkpoint"]),
    ],
  },
  {
    title: "Learning and Work", titleArabic: "التعلم والعمل", focus: "talk about experience, responsibilities, and goals", focusArabic: "الحديث عن الخبرة والمسؤوليات والأهداف",
    lessons: [
      arc("My learning routine", "روتين تعلمي", "standard", "present simple and present continuous contrast", "المقارنة بين المضارع البسيط والمستمر", ["learn", "routine", "now"]),
      arc("Skills I already have", "المهارات التي أملكها", "visual-vocabulary", "can, cannot, be good at, and be able to", "can وcannot وbe good at وbe able to", ["skill", "practice", "good at"]),
      arc("A busy workday", "يوم عمل مزدحم", "reading", "time clauses with when and while", "جمل الزمن مع when وwhile", ["workday", "while", "busy"]),
      arc("Talking about responsibilities", "الحديث عن المسؤوليات", "interaction", "have to, do not have to, and must", "have to وdo not have to وmust", ["responsibility", "rule", "must"]),
      arc("Making a study plan", "وضع خطة دراسية", "writing", "be going to for intentions and plans", "be going to للنوايا والخطط", ["plan", "goal", "intention"]),
      arc("A helpful colleague", "زميل عمل متعاون", "interaction", "object pronouns and polite offers", "ضمائر المفعول والعروض المهذبة", ["colleague", "help", "offer"]),
      arc("What have you done this week?", "ماذا أنجزت هذا الأسبوع؟", "standard", "present perfect for recent experience", "المضارع التام للتجربة الحديثة", ["finish", "already", "this week"]),
      arc("Work experience in a profile", "الخبرة العملية في ملف شخصي", "reading", "ever, never, and before with present perfect", "ever وnever وbefore مع المضارع التام", ["experience", "profile", "before"]),
      arc("Comparing ways to learn", "مقارنة طرق التعلم", "standard", "comparatives with than and as...as", "صيغ المقارنة مع than وas...as", ["compare", "online", "useful"]),
      arc("Ask for feedback", "اطلب ملاحظات", "speaking", "Could you tell me how...? and indirect questions", "Could you tell me how...? والأسئلة غير المباشرة", ["feedback", "improve", "question"]),
      arc("Read: A second chance", "اقرأ: فرصة ثانية", "reading", "past simple and present perfect in a connected story", "الماضي البسيط والمضارع التام في قصة مترابطة", ["chance", "experience", "change"]),
      arc("Explain a problem at work", "اشرح مشكلة في العمل", "interaction", "because, so, and but for problem-solving", "because وso وbut لحل المشكلات", ["problem", "solution", "explain"]),
      arc("Learning and work review", "مراجعة التعلم والعمل", "review", "review of ability, obligation, experience, and comparison", "مراجعة القدرة والالتزام والتجربة والمقارنة", ["review", "skill", "goal"]),
      arc("Write a short progress report", "اكتب تقرير تقدم قصيراً", "writing", "paragraph structure, capitals, commas, and a clear closing", "بنية الفقرة والحروف الكبيرة والفواصل والخاتمة الواضحة", ["progress", "paragraph", "comma"]),
      arc("Learning and work checkpoint", "اختبار التعلم والعمل", "assessment", "integrated experience, plans, comparison, and problem-solving", "دمج التجربة والخطط والمقارنة وحل المشكلات", ["work", "learning", "checkpoint"]),
    ],
  },
  {
    title: "Travel and Services", titleArabic: "السفر والخدمات", focus: "solve practical problems and make polite requests", focusArabic: "حل المشكلات العملية وتقديم الطلبات المهذبة",
    lessons: [
      arc("Planning a short trip", "التخطيط لرحلة قصيرة", "standard", "future arrangements with present continuous", "ترتيبات المستقبل بالمضارع المستمر", ["trip", "book", "arrange"]),
      arc("At the station", "في المحطة", "visual-vocabulary", "platform, ticket, and travel compound nouns", "مفردات المحطة والتذاكر والمركبات المركبة", ["station", "ticket", "platform"]),
      arc("Checking into a hotel", "تسجيل الوصول إلى الفندق", "interaction", "polite questions with can, could, and would", "الأسئلة المهذبة مع can وcould وwould", ["hotel", "room", "reservation"]),
      arc("A delayed journey", "رحلة متأخرة", "reading", "past continuous for background situations", "الماضي المستمر لوصف الموقف الخلفي", ["delay", "wait", "journey"]),
      arc("Ask for what you need", "اطلب ما تحتاج إليه", "speaking", "would like and polite service language", "would like ولغة الخدمات المهذبة", ["need", "service", "would like"]),
      arc("Directions with landmarks", "الاتجاهات مع المعالم", "standard", "prepositions and movement verbs in connected directions", "حروف الجر وأفعال الحركة في اتجاهات مترابطة", ["landmark", "across", "towards"]),
      arc("When plans change", "عندما تتغير الخطط", "interaction", "if and when for practical conditions", "if وwhen للشروط العملية", ["change", "if", "alternative"]),
      arc("Read: A travel message", "اقرأ: رسالة سفر", "reading", "abbreviations, punctuation, and key information", "الاختصارات وعلامات الترقيم والمعلومات الأساسية", ["message", "confirm", "departure"]),
      arc("Solving a booking problem", "حل مشكلة حجز", "interaction", "explaining a problem and asking for a solution", "شرح المشكلة وطلب الحل", ["booking", "wrong", "solution"]),
      arc("Compare travel choices", "قارن خيارات السفر", "standard", "comparatives and superlatives for options", "صيغ المقارنة والتفضيل للخيارات", ["cheap", "comfortable", "best"]),
      arc("Write a useful travel note", "اكتب ملاحظة سفر مفيدة", "writing", "imperatives, sequencing, and clear bullet-like sentences", "الأوامر والترتيب والجمل الواضحة القصيرة", ["note", "route", "first"]),
      arc("Listen for the important detail", "استمع إلى التفصيل المهم", "speaking", "numbers, dates, times, and confirmation checks", "الأرقام والتواريخ والأوقات وعبارات التأكيد", ["date", "time", "confirm"]),
      arc("Travel and services review", "مراجعة السفر والخدمات", "review", "review of requests, conditions, directions, and comparisons", "مراجعة الطلبات والشروط والاتجاهات والمقارنات", ["review", "travel", "service"]),
      arc("A complete service conversation", "محادثة خدمات كاملة", "interaction", "opening, explaining, requesting, and closing politely", "الافتتاح والشرح والطلب والختام بأدب", ["conversation", "polite", "close"]),
      arc("Travel and services checkpoint", "اختبار السفر والخدمات", "assessment", "integrated travel planning, problem-solving, and service language", "دمج التخطيط للسفر وحل المشكلات ولغة الخدمات", ["travel", "request", "checkpoint"]),
    ],
  },
  {
    title: "Stories and Memories", titleArabic: "القصص والذكريات", focus: "narrate past events and describe reactions", focusArabic: "سرد أحداث الماضي ووصف ردود الفعل",
    lessons: [
      arc("A memorable day", "يوم لا يُنسى", "standard", "past simple affirmative and negative forms", "إثبات ونفي الماضي البسيط", ["memory", "day", "remember"]),
      arc("Setting the scene", "وصف بداية المشهد", "reading", "there was, there were, and descriptive adjectives", "there was وthere were والصفات الوصفية", ["scene", "quiet", "place"]),
      arc("What were you doing?", "ماذا كنت تفعل؟", "standard", "past continuous questions and answers", "أسئلة وأجوبة الماضي المستمر", ["doing", "moment", "while"]),
      arc("A story in pictures", "قصة في صور", "visual-vocabulary", "sequence markers and picture-based narration", "كلمات الترتيب والسرد اعتماداً على الصور", ["first", "next", "finally"]),
      arc("An unexpected surprise", "مفاجأة غير متوقعة", "interaction", "when and while with past simple and past continuous", "when وwhile مع الماضي البسيط والمستمر", ["surprise", "suddenly", "happen"]),
      arc("How did you feel?", "كيف شعرت؟", "speaking", "adjectives ending in -ed and -ing", "الصفات المنتهية بـ -ed و-ing", ["excited", "interesting", "feel"]),
      arc("Read: A small act of kindness", "اقرأ: موقف صغير من اللطف", "reading", "pronoun reference and story cohesion", "الإحالة بالضمائر وترابط القصة", ["kindness", "help", "because"]),
      arc("Tell the story clearly", "اسرد القصة بوضوح", "speaking", "pronunciation of regular past endings", "نطق نهايات الماضي المنتظم", ["story", "ended", "asked"]),
      arc("A memory from childhood", "ذكرى من الطفولة", "writing", "used to for past habits and states", "used to للعادات والحالات الماضية", ["childhood", "used to", "once"]),
      arc("Before and after", "قبل وبعد", "standard", "past perfect awareness for earlier events", "التعرف إلى الماضي التام للأحداث الأسبق", ["before", "already", "earlier"]),
      arc("A message about yesterday", "رسالة عن الأمس", "interaction", "informal message openings, contractions, and punctuation", "بدايات الرسائل غير الرسمية والاختصارات والترقيم", ["yesterday", "message", "comma"]),
      arc("Story and memory review", "مراجعة القصص والذكريات", "review", "review of narrative tense, sequence, feeling, and cohesion", "مراجعة زمن السرد والترتيب والمشاعر والترابط", ["review", "story", "memory"]),
      arc("Write a connected memory", "اكتب ذكرى مترابطة", "writing", "topic sentence, supporting details, and final reflection", "الجملة الموضوعية والتفاصيل الداعمة والتأمل الختامي", ["paragraph", "detail", "reflection"]),
      arc("Retell and improve", "أعد السرد وحسّن", "speaking", "self-correction and replacing repeated words", "التصحيح الذاتي واستبدال الكلمات المتكررة", ["retell", "improve", "different"]),
      arc("Stories and memories checkpoint", "اختبار القصص والذكريات", "assessment", "integrated narrative control, reaction, and paragraph writing", "دمج التحكم بالسرد ورد الفعل وكتابة الفقرة", ["story", "past", "checkpoint"]),
    ],
  },
  {
    title: "Nature and Community", titleArabic: "الطبيعة والمجتمع", focus: "describe places, rules, and simple change", focusArabic: "وصف الأماكن والقواعد والتغيير البسيط",
    lessons: [
      arc("A place worth visiting", "مكان يستحق الزيارة", "visual-vocabulary", "adjectives and relative place phrases", "الصفات وعبارات وصف المكان", ["place", "beautiful", "visit"]),
      arc("Rules in shared spaces", "قواعد الأماكن المشتركة", "standard", "must, must not, and have to", "must وmust not وhave to", ["rule", "allowed", "safe"]),
      arc("A cleaner neighbourhood", "حي أنظف", "reading", "comparatives and too/enough", "المقارنة مع too وenough", ["clean", "waste", "enough"]),
      arc("Give directions in a park", "أعطِ اتجاهات في حديقة", "interaction", "imperatives, prepositions, and sequencing", "الأمر وحروف الجر والترتيب", ["park", "path", "turn"]),
      arc("Weather and plans", "الطقس والخطط", "speaking", "first conditional for likely results", "الشرط الأول للنتائج المحتملة", ["weather", "rain", "plan"]),
      arc("Animals and habitats", "الحيوانات وموائلها", "visual-vocabulary", "can, cannot, and simple relative clauses", "can وcannot والجمل الموصولة البسيطة", ["animal", "habitat", "live"]),
      arc("Read: A community project", "اقرأ: مشروع مجتمعي", "reading", "purpose, sequence, and cause in an informational text", "الغرض والترتيب والسبب في نص معلوماتي", ["project", "community", "purpose"]),
      arc("Suggest a useful change", "اقترح تغييراً مفيداً", "interaction", "should, could, and why not for suggestions", "should وcould وwhy not للاقتراحات", ["suggest", "change", "could"]),
      arc("Nature words in context", "كلمات الطبيعة في السياق", "standard", "word families and common collocations", "عائلات الكلمات والتلازم اللفظي الشائع", ["natural", "protect", "environment"]),
      arc("Describe a local problem", "صف مشكلة محلية", "writing", "there is/are, quantifiers, and clear punctuation", "there is/are ومحددات الكمية والترقيم الواضح", ["problem", "street", "many"]),
      arc("A respectful disagreement", "اختلاف باحترام", "speaking", "I think, I agree, and I am not sure that", "I think وI agree وI am not sure that", ["opinion", "agree", "respect"]),
      arc("Nature and community review", "مراجعة الطبيعة والمجتمع", "review", "review of rules, conditions, suggestions, and descriptions", "مراجعة القواعد والشروط والاقتراحات والأوصاف", ["review", "nature", "community"]),
      arc("Write a community proposal", "اكتب اقتراحاً مجتمعياً", "writing", "problem-solution paragraph with a recommendation", "فقرة مشكلة وحل مع توصية", ["proposal", "solution", "recommend"]),
      arc("Explain a map and a rule", "اشرح خريطة وقاعدة", "speaking", "clarifying sequence and checking understanding", "توضيح الترتيب والتأكد من الفهم", ["map", "rule", "check"]),
      arc("Nature and community checkpoint", "اختبار الطبيعة والمجتمع", "assessment", "integrated description, rules, condition, and proposal writing", "دمج الوصف والقواعد والشرط وكتابة الاقتراح", ["nature", "community", "checkpoint"]),
    ],
  },
  {
    title: "Choices and Plans", titleArabic: "الاختيارات والخطط", focus: "compare options and make supported plans", focusArabic: "مقارنة الاختيارات ووضع خطط مدعومة",
    lessons: [
      arc("What makes a good choice?", "ما الذي يصنع اختياراً جيداً؟", "standard", "adjectives, intensifiers, and opinion phrases", "الصفات ومقويات المعنى وعبارات الرأي", ["choice", "important", "prefer"]),
      arc("Compare two opportunities", "قارن فرصتين", "reading", "comparatives with much, a little, and far", "المقارنة مع much وa little وfar", ["opportunity", "better", "different"]),
      arc("Plans for next month", "خطط الشهر القادم", "writing", "will and going to for predictions and intentions", "will وgoing to للتوقعات والنوايا", ["future", "plan", "intend"]),
      arc("Agree on a weekend plan", "اتفق على خطة لعطلة الأسبوع", "interaction", "suggestions with shall, let us, and how about", "الاقتراحات مع shall وlet us وhow about", ["weekend", "suggest", "agree"]),
      arc("Pros and cons", "الإيجابيات والسلبيات", "standard", "because, although, and however for contrast", "because وalthough وhowever للتباين", ["advantage", "disadvantage", "however"]),
      arc("Ask for someone’s preference", "اسأل عن تفضيل شخص", "speaking", "would rather and prefer", "would rather وprefer", ["prefer", "rather", "choice"]),
      arc("Read: A difficult decision", "اقرأ: قرار صعب", "reading", "identifying reasons, results, and the writer's choice", "تحديد الأسباب والنتائج واختيار الكاتب", ["decision", "reason", "result"]),
      arc("Plan around a problem", "خطط حول مشكلة", "interaction", "first conditional and practical alternatives", "الشرط الأول والبدائل العملية", ["alternative", "problem", "unless"]),
      arc("Money and value", "المال والقيمة", "visual-vocabulary", "too, enough, and value comparisons", "too وenough ومقارنة القيمة", ["price", "value", "afford"]),
      arc("Write advice for a friend", "اكتب نصيحة لصديق", "writing", "modal verbs for advice and paragraph linking", "الأفعال الناقصة للنصيحة وربط الفقرة", ["advice", "should", "therefore"]),
      arc("Explain your reasons", "اشرح أسبابك", "speaking", "giving examples with for example and such as", "إعطاء أمثلة مع for example وsuch as", ["reason", "example", "explain"]),
      arc("Choices and plans review", "مراجعة الاختيارات والخطط", "review", "review of comparison, contrast, future, and advice", "مراجعة المقارنة والتباين والمستقبل والنصيحة", ["review", "choice", "plan"]),
      arc("A balanced recommendation", "توصية متوازنة", "writing", "balanced paragraph with a recommendation and reason", "فقرة متوازنة مع توصية وسبب", ["recommend", "balance", "reason"]),
      arc("Negotiate a shared plan", "تفاوض على خطة مشتركة", "interaction", "softening disagreement and reaching agreement", "تلطيف الاختلاف والوصول إلى اتفاق", ["negotiate", "maybe", "deal"]),
      arc("Choices and plans checkpoint", "اختبار الاختيارات والخطط", "assessment", "integrated comparison, future planning, and recommendation", "دمج المقارنة والتخطيط للمستقبل والتوصية", ["choice", "plan", "checkpoint"]),
    ],
  },
  {
    title: "Communication and Technology", titleArabic: "التواصل والتقنية", focus: "exchange messages, solve digital problems, and clarify meaning", focusArabic: "تبادل الرسائل وحل المشكلات الرقمية وتوضيح المعنى",
    lessons: [
      arc("Messages that are easy to follow", "رسائل يسهل فهمها", "standard", "sentence boundaries, capital letters, and full stops", "حدود الجمل والحروف الكبيرة والنقاط", ["message", "clear", "punctuation"]),
      arc("Devices and everyday actions", "الأجهزة والأفعال اليومية", "visual-vocabulary", "phrasal verbs for common device actions", "الأفعال المركبة لأفعال الأجهزة الشائعة", ["switch on", "download", "screen"]),
      arc("A useful email", "بريد إلكتروني مفيد", "writing", "email openings, requests, and closings", "بدايات البريد والطلبات والخواتيم", ["email", "request", "regards"]),
      arc("Can you hear me?", "هل تسمعني؟", "interaction", "telephone phrases and present continuous", "عبارات الهاتف والمضارع المستمر", ["call", "signal", "hear"]),
      arc("Solve a login problem", "حل مشكلة تسجيل الدخول", "speaking", "sequencing instructions with first, next, and then", "ترتيب التعليمات مع first وnext وthen", ["password", "account", "reset"]),
      arc("Read: A short online notice", "اقرأ: إشعار قصير على الإنترنت", "reading", "scanning for dates, conditions, and action words", "البحث عن التواريخ والشروط وأفعال الإجراء", ["notice", "deadline", "click"]),
      arc("Say it another way", "قلها بطريقة أخرى", "standard", "synonyms, paraphrase, and checking meaning", "المترادفات وإعادة الصياغة والتأكد من المعنى", ["meaning", "similar", "explain"]),
      arc("A polite correction", "تصحيح مهذب", "interaction", "I mean, actually, and sorry, I meant", "عبارات I mean وactually وsorry, I meant", ["correct", "mean", "actually"]),
      arc("Digital safety basics", "أساسيات الأمان الرقمي", "reading", "must, should, and conditional warnings", "must وshould والتحذيرات الشرطية", ["safe", "private", "warning"]),
      arc("Write instructions for a friend", "اكتب تعليمات لصديق", "writing", "imperatives, numbered sequence, and concise style", "الأمر والتسلسل المرقم والأسلوب الموجز", ["instruction", "step", "carefully"]),
      arc("Connected speech in common phrases", "الكلام المتصل في العبارات الشائعة", "speaking", "weak forms and linking in short chunks", "الصيغ الضعيفة والربط في العبارات القصيرة", ["could you", "want to", "going to"]),
      arc("Communication and technology review", "مراجعة التواصل والتقنية", "review", "review of messages, clarification, instructions, and safety", "مراجعة الرسائل والتوضيح والتعليمات والأمان", ["review", "message", "safe"]),
      arc("A complete digital support chat", "محادثة دعم رقمي كاملة", "interaction", "opening, diagnosing, clarifying, and closing a chat", "افتتاح محادثة الدعم وتشخيصها وتوضيحها وختامها", ["support", "problem", "close"]),
      arc("Rewrite for clarity", "أعد الكتابة بوضوح", "writing", "combine short sentences and remove unnecessary repetition", "دمج الجمل القصيرة وإزالة التكرار غير الضروري", ["rewrite", "clear", "combine"]),
      arc("Communication and technology checkpoint", "اختبار التواصل والتقنية", "assessment", "integrated digital problem-solving, clarification, and practical writing", "دمج حل المشكلات الرقمية والتوضيح والكتابة العملية", ["technology", "communication", "checkpoint"]),
    ],
  },
  {
    title: "Food, Shopping, and Services", titleArabic: "الطعام والتسوق والخدمات", focus: "make practical choices, compare products, and handle service conversations", focusArabic: "اتخاذ اختيارات عملية ومقارنة المنتجات والتعامل مع محادثات الخدمات",
    lessons: [
      arc("A wider menu", "قائمة طعام أوسع", "visual-vocabulary", "food categories, ingredients, and compound nouns", "فئات الطعام والمكونات والأسماء المركبة", ["ingredient", "menu", "dish"]),
      arc("Ordering with confidence", "الطلب بثقة", "interaction", "would like, please, and quantity phrases", "would like وplease وعبارات الكمية", ["order", "quantity", "please"]),
      arc("Compare products", "قارن المنتجات", "standard", "comparatives, superlatives, and product adjectives", "المقارنة والتفضيل وصفات المنتجات", ["product", "cheap", "expensive"]),
      arc("Read: A shop review", "اقرأ: مراجعة متجر", "reading", "fact, opinion, and evidence in a short review", "الحقيقة والرأي والدليل في مراجعة قصيرة", ["review", "quality", "opinion"]),
      arc("Ask about a return", "اسأل عن إرجاع منتج", "speaking", "have you got...? and explaining a reason", "have you got...? وشرح السبب", ["return", "receipt", "reason"]),
      arc("At the customer desk", "عند مكتب خدمة العملاء", "interaction", "past simple for a service problem", "الماضي البسيط لمشكلة في الخدمة", ["customer", "problem", "yesterday"]),
      arc("Packaging and amounts", "التغليف والكميات", "standard", "containers, measures, and how much/how many", "العبوات والمقاييس وhow much/how many", ["packet", "bottle", "amount"]),
      arc("A recipe in order", "وصفة مرتبة", "reading", "imperatives, sequence markers, and cooking verbs", "الأمر وكلمات الترتيب وأفعال الطبخ", ["recipe", "mix", "until"]),
      arc("Choose for a guest", "اختر لضيف", "writing", "suggestions and reasons in a short recommendation", "الاقتراحات والأسباب في توصية قصيرة", ["guest", "recommend", "taste"]),
      arc("Handle a misunderstanding", "تعامل مع سوء فهم", "interaction", "apologies, clarification, and repair phrases", "الاعتذار والتوضيح وعبارات إصلاح الحوار", ["sorry", "misunderstand", "again"]),
      arc("Shopping and service phrases", "عبارات التسوق والخدمات", "speaking", "intonation for polite requests and questions", "التنغيم في الطلبات والأسئلة المهذبة", ["intonation", "request", "question"]),
      arc("Food, shopping, and services review", "مراجعة الطعام والتسوق والخدمات", "review", "review of quantities, comparisons, requests, and repair", "مراجعة الكميات والمقارنات والطلبات وإصلاح الحوار", ["review", "shopping", "service"]),
      arc("Write a complaint politely", "اكتب شكوى بأدب", "writing", "formal greeting, problem, request, and closing", "التحية الرسمية والمشكلة والطلب والخاتمة", ["complaint", "formal", "request"]),
      arc("A complete market exchange", "تبادل كامل في السوق", "interaction", "open, compare, choose, pay, and close an exchange", "افتتاح الحوار والمقارنة والاختيار والدفع والختام", ["market", "choose", "pay"]),
      arc("Food, shopping, and services checkpoint", "اختبار الطعام والتسوق والخدمات", "assessment", "integrated service interaction, comparison, and practical message writing", "دمج تفاعل الخدمة والمقارنة وكتابة رسالة عملية", ["food", "service", "checkpoint"]),
    ],
  },
  {
    title: "Celebrations and Culture", titleArabic: "الاحتفالات والثقافة", focus: "describe traditions, invitations, feelings, and respectful cultural differences", focusArabic: "وصف التقاليد والدعوات والمشاعر والاختلافات الثقافية باحترام",
    lessons: [
      arc("Special days and traditions", "الأيام الخاصة والتقاليد", "visual-vocabulary", "adjectives, nouns, and cultural event collocations", "الصفات والأسماء والتلازم اللفظي للمناسبات", ["tradition", "celebrate", "special"]),
      arc("Invite someone warmly", "ادعُ شخصاً بحرارة", "interaction", "would you like to...? and invitation responses", "would you like to...? وردود الدعوة", ["invite", "join", "welcome"]),
      arc("Accept, refuse, and explain", "اقبل وارفض واشرح", "speaking", "polite refusals with because and maybe next time", "الرفض المهذب مع because وmaybe next time", ["accept", "refuse", "reason"]),
      arc("Read: A celebration in two places", "اقرأ: احتفال في مكانين", "reading", "comparison, similarity, and respectful contrast", "المقارنة والتشابه والتباين باحترام", ["similar", "different", "culture"]),
      arc("Feelings at an important moment", "المشاعر في لحظة مهمة", "standard", "feel, seem, look, and sound for reactions", "feel وseem وlook وsound للتعبير عن ردود الفعل", ["feel", "proud", "nervous"]),
      arc("What people usually do", "ما يفعله الناس عادة", "standard", "habitual present and general statements", "المضارع للعادات والعبارات العامة", ["usually", "custom", "people"]),
      arc("A celebration photo story", "قصة صورة احتفال", "visual-vocabulary", "past continuous and descriptive detail", "الماضي المستمر والتفاصيل الوصفية", ["photo", "crowd", "smile"]),
      arc("Explain a tradition", "اشرح تقليداً", "speaking", "first, then, after that, and finally", "first وthen وafter that وfinally", ["explain", "step", "tradition"]),
      arc("Write a cultural invitation", "اكتب دعوة ثقافية", "writing", "friendly tone, date/time punctuation, and useful detail", "النبرة الودية وترقيم التاريخ والوقت والتفصيل المفيد", ["invitation", "date", "time"]),
      arc("Respectful questions", "أسئلة باحترام", "interaction", "Could you tell me...? and avoiding direct assumptions", "Could you tell me...? وتجنب الافتراضات المباشرة", ["question", "respect", "understand"]),
      arc("Read: A short cultural guide", "اقرأ: دليل ثقافي قصير", "reading", "headings, examples, and advice in an informative text", "العناوين والأمثلة والنصيحة في نص معلوماتي", ["guide", "custom", "advice"]),
      arc("Celebrations and culture review", "مراجعة الاحتفالات والثقافة", "review", "review of invitations, reactions, sequence, and comparison", "مراجعة الدعوات وردود الفعل والترتيب والمقارنة", ["review", "culture", "celebrate"]),
      arc("Write about a meaningful event", "اكتب عن حدث مهم", "writing", "connected paragraph with a topic, details, and reflection", "فقرة مترابطة بموضوع وتفاصيل وتأمل", ["event", "meaningful", "reflect"]),
      arc("A1 to A2 bridge conversation", "محادثة جسر من A1 إلى A2", "interaction", "repair, follow-up questions, and longer connected turns", "الإصلاح وأسئلة المتابعة والأدوار الأطول المترابطة", ["follow-up", "conversation", "connect"]),
      arc("Celebrations and culture checkpoint", "اختبار الاحتفالات والثقافة", "assessment", "integrated invitation, cultural comparison, narrative, and reflection", "دمج الدعوة والمقارنة الثقافية والسرد والتأمل", ["culture", "event", "checkpoint"]),
    ],
  },
];

export const A2_AUTHORED_LESSON_COUNT = A2_MODULE_ARCS.reduce((total, module) => total + module.lessons.length, 0);
