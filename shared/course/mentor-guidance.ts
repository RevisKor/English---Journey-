import type { LessonDefinition, LessonMentorGuide, MentorMoment } from "./types";

type SupportedLevel = LessonDefinition["level"];

const levelVoice: Record<SupportedLevel, { opening: string; openingArabic: string; grammar: string; grammarArabic: string; check: string; checkArabic: string }> = {
  A1: {
    opening: "Welcome to your first English steps. We will move slowly and kindly: meet a few useful words, notice one small pattern, and use it before we add something new.",
    openingArabic: "مرحباً بك في خطواتك الأولى في الإنجليزية. سنتقدم بهدوء وبطريقة لطيفة: نتعرّف على كلمات مفيدة، ونلاحظ قاعدة صغيرة، ثم نستخدمها قبل أن نضيف شيئاً جديداً.",
    grammar: "Grammar is a small frame that helps your new words stand together. Look at the example, say it aloud, and then change one part to make it yours.",
    grammarArabic: "القواعد إطار صغير يساعد كلماتك الجديدة على الوقوف معاً. انظر إلى المثال، وانطقه بصوت عالٍ، ثم غيّر جزءاً واحداً ليصبح التعبير خاصاً بك.",
    check: "This check is a friendly practice, not a judgement. Choose what fits the sentence, and use any mistake as a sign showing you what to practise next.",
    checkArabic: "هذا الاختبار تدريب ودّي وليس حكماً عليك. اختر ما يناسب الجملة، واعتبر الخطأ إشارة توضّح لك ما الذي تتدرّب عليه بعد ذلك.",
  },
  A2: {
    opening: "At A2, small choices begin to make your English sound connected and useful. We are not rushing through a list; we are building language you can recognise and use again.",
    openingArabic: "في مستوى A2، تبدأ الخيارات الصغيرة في جعل لغتك الإنجليزية مترابطة ومفيدة. نحن لا نمر سريعاً على قائمة، بل نبني لغة تتعرّف عليها وتستخدمها من جديد.",
    grammar: "Grammar is the frame that lets today’s words carry your meaning clearly. Notice the pattern, then use it for something you genuinely want to say.",
    grammarArabic: "القواعد هي الإطار الذي يجعل كلمات اليوم تنقل معناها بوضوح. لاحظ النمط، ثم استخدمه لقول شيء تريد التعبير عنه فعلاً.",
    check: "Treat the check as a quiet rehearsal, not a judgement. Each choice tells you what is already becoming automatic and what deserves another look.",
    checkArabic: "تعامل مع الاختبار كتدريب هادئ لا كحكم. كل اختيار يبيّن لك ما بدأ يصبح تلقائياً وما يحتاج إلى نظرة أخرى.",
  },
  B1: {
    opening: "At B1, you are moving beyond getting the words right. Today you will shape a point, support it, and make the reader or listener follow your thinking.",
    openingArabic: "في مستوى B1، أنت تتجاوز مجرد اختيار الكلمات الصحيحة. اليوم ستبني فكرة وتدعمها وتجعل القارئ أو المستمع يتابع تفكيرك.",
    grammar: "Grammar now gives your ideas structure: it lets you qualify, connect, and make a reason clear instead of leaving the listener to guess.",
    grammarArabic: "القواعد الآن تمنح أفكارك بنية: فهي تساعدك على التوضيح والربط وشرح السبب بجلاء بدلاً من أن تترك المستمع يخمّن.",
    check: "Use the check to notice precision. The strongest answer is not the fanciest one; it is the one that fits the situation and makes your meaning easy to trust.",
    checkArabic: "استخدم الاختبار لملاحظة الدقة. الإجابة الأقوى ليست الأكثر تعقيداً، بل التي تناسب الموقف وتجعل معناها واضحاً ويمكن الوثوق به.",
  },
  B2: {
    opening: "At B2, language is a way to manage nuance. Today you will decide what to emphasise, what to qualify, and how to guide another person through a more demanding idea.",
    openingArabic: "في مستوى B2، اللغة وسيلة للتعامل مع الدقة والظلال. اليوم ستقرر ما الذي تبرزه وما الذي تقيّده وكيف تقود شخصاً آخر عبر فكرة أكثر تعقيداً.",
    grammar: "Grammar is part of your judgement now. It helps you control emphasis, distance, and relationships between ideas so your argument has shape and tone.",
    grammarArabic: "القواعد أصبحت جزءاً من حكمك اللغوي. فهي تساعدك على التحكم في التركيز والمسافة والعلاقات بين الأفكار حتى يكون لحجتك شكل ونبرة.",
    check: "The check is a final edit of attention. Choose the language that is accurate, natural for the context, and strong enough to carry the meaning you intend.",
    checkArabic: "الاختبار مراجعة أخيرة للانتباه. اختر اللغة الدقيقة والطبيعية في السياق والقوية بما يكفي لحمل المعنى الذي تقصده.",
  },
  C1: {
    opening: "At C1, you are learning to read and write with intellectual control: tracing a source, judging a claim, and choosing language that reflects the exact weight of an idea.",
    openingArabic: "في مستوى C1، تتعلم القراءة والكتابة بضبط فكري: تتبع المصدر وتقيّم الادعاء وتختار لغة تعكس وزن الفكرة بدقة.",
    grammar: "Grammar gives advanced thought its architecture. Use it to signal degrees of certainty, organise evidence, and make relationships between ideas visible.",
    grammarArabic: "القواعد تمنح التفكير المتقدم هندسته. استخدمها للدلالة على درجات اليقين وتنظيم الدليل وجعل العلاقات بين الأفكار واضحة.",
    check: "The check asks for deliberate control. Prefer the option that says exactly what the context permits—no weaker, no stronger.",
    checkArabic: "يطلب الاختبار تحكماً واعياً. اختر الخيار الذي يقول بالضبط ما يسمح به السياق، لا أضعف ولا أقوى.",
  },
  C2: {
    opening: "At C2, you are refining judgement, not collecting rules. The work is to select language with sensitivity to audience, implication, tone, and the wider conversation.",
    openingArabic: "في مستوى C2، أنت تصقل الحكم اللغوي لا تجمع القواعد. المهمة هي اختيار اللغة بحساسية تجاه الجمهور والإيحاء والنبرة والحوار الأوسع.",
    grammar: "Grammar is one of the tools you use to direct attention and create subtle effects. Notice not only what is correct, but what the choice makes possible.",
    grammarArabic: "القواعد إحدى الأدوات التي تستخدمها لتوجيه الانتباه وصنع تأثيرات دقيقة. لاحظ ليس فقط ما هو صحيح، بل ما الذي يتيحه الاختيار.",
    check: "The check is a question of fit. Ask which option best serves this precise purpose, this audience, and this moment in the argument.",
    checkArabic: "الاختبار سؤال عن الملاءمة. اسأل أي خيار يخدم هذا الهدف الدقيق وهذا الجمهور وهذه اللحظة في الحجة بأفضل شكل.",
  },
};

function guideForLevel(lesson: LessonDefinition) {
  return levelVoice[lesson.level];
}

export function buildMentorGuide(lesson: LessonDefinition): LessonMentorGuide | null {
  const voice = guideForLevel(lesson);
  if (!voice) return null;
  const outcome = lesson.learningPlan?.outcome.canDo ?? "use today’s language in a connected response";
  const outcomeArabic = lesson.learningPlan?.outcome.canDoArabic ?? "استخدم لغة اليوم في استجابة مترابطة";
  const network = lesson.lexicalNetworks?.[0];
  const theme = network?.theme ?? lesson.title;
  const chunks = network?.chunks.slice(0, 2).join(" · ") ?? lesson.words.slice(0, 2).map((word) => word.word).join(" · ");
  const moments: MentorMoment[] = [
    {
      id: "welcome",
      title: "Your mentor is here",
      titleArabic: "مرشدك معك",
      message: `${voice.opening} Today’s focus is ${lesson.title}. By the end, you can ${outcome}.`,
      messageArabic: `${voice.openingArabic} تركيز اليوم هو «${lesson.titleArabic}». في النهاية ستتمكن من: ${outcomeArabic}.`,
    },
    {
      id: "vocabulary",
      title: "First, make the language familiar",
      titleArabic: "أولاً، اجعل اللغة مألوفة",
      message: `Begin with ${theme}. Say the new words aloud, notice the useful pairings, and keep ${chunks} together as language you can use—not labels to memorise alone.`,
      messageArabic: `ابدأ بموضوع «${network?.themeArabic ?? lesson.titleArabic}». انطق الكلمات الجديدة ولاحظ التراكيب المفيدة، واحتفظ بالتعبيرات معاً كلغة قابلة للاستخدام لا كمسميات منفصلة فقط.`,
    },
    {
      id: "grammar",
      title: "Now give the idea its shape",
      titleArabic: "الآن امنح الفكرة شكلها",
      message: `${voice.grammar} Today’s pattern is ${lesson.grammar.topic}.`,
      messageArabic: `${voice.grammarArabic} نمط اليوم هو «${lesson.grammar.arabicName}».`,
    },
    {
      id: "practice",
      title: "Try one small decision",
      titleArabic: "جرّب قراراً صغيراً",
      message: `Before you move on, make one sentence of your own. Use one expression from today and the grammar pattern to say something true, useful, or interesting to you.`,
      messageArabic: "قبل أن تنتقل، اكتب جملة من عندك. استخدم تعبيراً من اليوم ونمط القاعدة لقول شيء حقيقي أو مفيد أو مثير للاهتمام بالنسبة لك.",
    },
    {
      id: "reading",
      title: "See it working in a real text",
      titleArabic: "شاهده يعمل في نص حقيقي",
      message: `Now the language leaves the list. Read for the message first, then return to notice how the writer uses today’s choices to make that message clear.`,
      messageArabic: "الآن تخرج اللغة من القائمة. اقرأ الرسالة أولاً، ثم ارجع ولاحظ كيف يستخدم الكاتب اختيارات اليوم لجعل الرسالة واضحة.",
    },
    {
      id: "writing",
      title: "Make the language yours",
      titleArabic: "اجعل اللغة لغتك",
      message: `Your response does not need to be perfect before it is useful. Write with a real purpose, then use the feedback prompt to notice one strength and one next improvement.`,
      messageArabic: "لا تحتاج إجابتك إلى أن تكون مثالية حتى تكون مفيدة. اكتب لهدف حقيقي، ثم استخدم طلب التغذية الراجعة لملاحظة نقطة قوة وخطوة تحسين تالية.",
    },
    {
      id: "check",
      title: "Finish by noticing what you own",
      titleArabic: "اختم بملاحظة ما أصبح لديك",
      message: voice.check,
      messageArabic: voice.checkArabic,
    },
  ];
  return { level: lesson.level, lessonTitle: lesson.title, moments };
}

export function buildCourseMapMentorPreview(lesson: LessonDefinition) {
  const guide = buildMentorGuide(lesson);
  const welcome = guide?.moments.find((moment) => moment.id === "welcome");
  if (!welcome) return null;
  return {
    level: lesson.level,
    lessonNumber: lesson.lessonNumber,
    lessonTitle: lesson.title,
    lessonTitleArabic: lesson.titleArabic,
    title: welcome.title,
    titleArabic: welcome.titleArabic,
    message: welcome.message,
    messageArabic: welcome.messageArabic,
    ctaLabel: "Open lesson",
    ctaLabelArabic: "افتح الدرس",
  };
}
