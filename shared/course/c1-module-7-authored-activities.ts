import type { LessonActivity, ProgressiveSupport } from "./types";

type Spec = Omit<LessonActivity, "id" | "estimatedMinutes" | "retrievalCheck" | "progressiveSupports" | "writingPrompt" | "writingPromptArabic"> & {
  minutes: number;
  prompt?: string;
  promptArabic?: string;
  retrieval: { prompt: string; promptArabic: string; expectedEvidence: string; expectedEvidenceArabic: string };
  supports?: ProgressiveSupport[];
};

const specs: Record<number, Spec> = {
  97: {
    kind: "interaction", title: "Test the proposal under pressure", titleArabic: "اختبر المقترح تحت الضغط",
    objective: "Defend a conditional public proposal while responding diplomatically to a credible objection.", objectiveArabic: "دافع عن مقترح عام مشروط مع الرد دبلوماسياً على اعتراض موثوق.", stage: "real-context", semantic: "activity", minutes: 24,
    interactionTurns: [
      { id: "reviewer", speaker: "Reviewer", text: "Your proposal sounds careful, but the safeguards could delay a benefit that residents need now.", textArabic: "يبدو مقترحك حذراً، لكن الضمانات قد تؤخر فائدة يحتاج إليها السكان الآن.", purpose: "State the strongest objection." },
      { id: "you", speaker: "You", text: "That concern is understandable. I would keep the pilot on schedule, but make continuation conditional on a public review of the first results.", textArabic: "هذا القلق مفهوم. سأبقي التجربة في موعدها، لكنني سأجعل استمرارها مشروطاً بمراجعة عامة للنتائج الأولى.", purpose: "Concede, qualify, and preserve a review condition." },
    ],
    sentencePatterns: ["That concern is understandable; nevertheless, …", "I would make continuation conditional on …", "The proposal is proportionate because …"],
    retrieval: { prompt: "Retrieve one B2 counterargument and answer it with a concession plus a safeguard.", promptArabic: "استرجع اعتراضاً واحداً من مستوى B2 وأجب عنه بتنازل وضمانة.", expectedEvidence: "A concession, a contrast marker, and a reviewable safeguard.", expectedEvidenceArabic: "تنازل، وأداة ربط للمقابلة، وضمانة قابلة للمراجعة." },
  },
  98: {
    kind: "standard", title: "Question certainty", titleArabic: "ساءل اليقين",
    objective: "Use hedging and modal strength to distinguish what evidence establishes from what it merely suggests.", objectiveArabic: "استخدم التحفظ ودرجة الأفعال الناقصة للتمييز بين ما يثبته الدليل وما يوحي به فقط.", stage: "explanation", semantic: "grammar", minutes: 20,
    sentencePatterns: ["The findings may indicate …, but they do not establish …", "It would be premature to conclude that …", "The claim is best treated as …"],
    retrieval: { prompt: "Rewrite a strong claim from an earlier lesson so its certainty matches the evidence.", promptArabic: "أعد صياغة ادعاء قوي من درس سابق بحيث تتناسب درجة يقينه مع الدليل.", expectedEvidence: "A calibrated modal or stance phrase and a stated limitation.", expectedEvidenceArabic: "فعل ناقص أو عبارة موقف معايرة، مع ذكر قيد واضح." },
  },
  99: {
    kind: "listening", title: "Follow a crowded debate", titleArabic: "تابع نقاشاً مزدحماً",
    objective: "Track a speaker's position, concession, and implied priority in a fast policy exchange.", objectiveArabic: "تتبّع موقف المتحدث وتنازله وأولويته الضمنية في نقاش سياسات سريع.", stage: "guided-practice", semantic: "activity", minutes: 23,
    speakingLines: [{ id: "chair", speaker: "Chair", text: "The pilot has produced encouraging figures, although the distribution of benefits remains uneven. We should neither dismiss the result nor treat it as a mandate for expansion.", textArabic: "أنتجت التجربة أرقاماً مشجعة، رغم أن توزيع المنافع لا يزال غير متساوٍ. لا ينبغي أن نرفض النتيجة ولا أن نعاملها كأنها تفويض للتوسع." }],
    sentencePatterns: ["The speaker concedes … while prioritising …", "The phrase neither … nor … prevents …", "The implied condition is …"], supports: ["transcript"],
    retrieval: { prompt: "Without replaying the whole exchange, state the difference between a positive result and a mandate to expand.", promptArabic: "من دون إعادة الاستماع إلى النقاش كله، اذكر الفرق بين نتيجة إيجابية وتفويض بالتوسع.", expectedEvidence: "A distinction between evidence and policy permission.", expectedEvidenceArabic: "تمييز بين الدليل والسماح باتخاذ سياسة." },
  },
  100: {
    kind: "standard", title: "Synthesize with integrity", titleArabic: "ركّب الأفكار بنزاهة",
    objective: "Combine two perspectives into a concise synthesis that preserves attribution, uncertainty, and consequence.", objectiveArabic: "اجمع بين وجهتي نظر في تركيب موجز يحافظ على نسب الأفكار وعدم اليقين والنتائج.", stage: "independent-practice", semantic: "assessment", minutes: 30,
    readingText: "A transport brief reports a modest reduction in delays after a pilot. A residents' statement accepts the improvement but documents longer journeys for people whose shifts begin before public transport runs. The sources are not interchangeable: one measures a system outcome, while the other records an access cost.",
    readingTextArabic: "يسجل موجز النقل انخفاضاً متواضعاً في التأخيرات بعد تجربة. ويقبل بيان السكان التحسن لكنه يوثق رحلات أطول لمن تبدأ نوبات عملهم قبل تشغيل النقل العام. لا يمكن استبدال المصدرين: يقيس أحدهما نتيجة للنظام، بينما يسجل الآخر تكلفة في الوصول.",
    readingChecks: [{ id: "main", type: "main-idea", prompt: "What must a responsible synthesis preserve?", promptArabic: "ما الذي يجب أن يحافظ عليه التركيب المسؤول؟", answer: "The measured benefit and the unequal access cost.", explanation: "A synthesis must not erase a relevant limitation." }],
    prompt: "Write 220–280 words synthesising the two sources for a council briefing. Attribute each perspective, state one uncertainty, and recommend one proportionate next step.", promptArabic: "اكتب 220–280 كلمة تركّب فيها المصدرين لموجز مجلس. انسب كل وجهة نظر، واذكر حالة عدم يقين واحدة، وأوصِ بخطوة تالية متناسبة.", sentencePatterns: ["Source A reports …, whereas Source B records …", "Taken together, the evidence suggests …", "A proportionate next step would be …"],
    retrieval: { prompt: "Name one difference between summarising a source and synthesising two sources.", promptArabic: "اذكر فرقاً واحداً بين تلخيص مصدر وتركيب مصدرين.", expectedEvidence: "Synthesis must connect, compare, and attribute perspectives.", expectedEvidenceArabic: "يجب أن يربط التركيب بين وجهات النظر ويقارنها وينسبها." }, supports: ["external-ai-prompt", "worked-example"],
  },
  101: {
    kind: "reading", title: "Read between the lines", titleArabic: "اقرأ بين السطور",
    objective: "Infer how framing and omission shape the interpretation of a contested public claim.", objectiveArabic: "استنتج كيف يؤثر التأطير والحذف في تفسير ادعاء عام متنازع عليه.", stage: "introduction", semantic: "example", minutes: 25,
    readingText: "A feature describes a redevelopment plan as a long-delayed promise finally delivered. A residents' letter calls it a transfer of public space to private operators. The feature foregrounds completion and investment; the letter foregrounds control and access. Neither wording alone settles the policy question, but each makes some consequences easier to notice than others.",
    readingTextArabic: "يصف مقال خطة إعادة تطوير بأنها وعد تأخر طويلاً ثم تحقق أخيراً. وتسميها رسالة من السكان نقلاً للمساحة العامة إلى مشغلين خاصين. يبرز المقال الإنجاز والاستثمار؛ بينما تبرز الرسالة السيطرة والوصول. لا تحسم أي صياغة وحدها سؤال السياسة، لكن كل واحدة تجعل بعض النتائج أسهل ملاحظة من غيرها.",
    readingChecks: [{ id: "inference", type: "inference", prompt: "What does the contrast in foregrounding imply about each source's concern?", promptArabic: "ماذا يوحي الاختلاف في إبراز العناصر بشأن اهتمام كل مصدر؟", answer: "The feature stresses delivery; the letter stresses public control and access.", explanation: "The inference follows from repeated framing choices." }],
    sentencePatterns: ["The wording foregrounds … while leaving … implicit.", "This framing may lead readers to …", "A cautious inference is …"],
    retrieval: { prompt: "Use one earlier source-evaluation move to identify an omitted stakeholder or consequence.", promptArabic: "استخدم حركة واحدة من تقييم المصادر لتحديد صاحب مصلحة أو نتيجة محذوفة.", expectedEvidence: "A named omission linked to a specific framing choice.", expectedEvidenceArabic: "حذف مسمى مرتبط باختيار تأطير محدد." },
  },
  102: {
    kind: "reading", title: "Put a claim under scrutiny", titleArabic: "أخضع الادعاء للتدقيق",
    objective: "Compare research methods and qualify a claim according to the strength and limits of its evidence.", objectiveArabic: "قارن بين أساليب البحث وعاير الادعاء وفق قوة دليله وحدوده.", stage: "guided-practice", semantic: "example", minutes: 26,
    readingText: "One report compares pilot districts with a national average; a second follows matched districts across three years. The headline conclusion is similar, but the second design better addresses local change. It still cannot show what would have happened without the intervention with complete certainty. Method changes the confidence a claim deserves.",
    readingTextArabic: "يقارن تقرير مناطق التجربة بمتوسط وطني؛ بينما يتابع تقرير ثانٍ مناطق مماثلة على مدى ثلاث سنوات. تبدو الخلاصة الرئيسية متشابهة، لكن التصميم الثاني يعالج التغير المحلي بصورة أفضل. ومع ذلك لا يستطيع أن يبين بيقين كامل ما كان سيحدث من دون التدخل. يغير الأسلوب مقدار الثقة التي يستحقها الادعاء.",
    readingChecks: [{ id: "method", type: "multiple-choice", prompt: "Why does the second design support a more confident local claim?", promptArabic: "لماذا يدعم التصميم الثاني ادعاءً محلياً أكثر ثقة؟", choices: ["It follows matched places over time.", "It uses a louder headline.", "It removes every uncertainty."], answer: "It follows matched places over time.", explanation: "The design addresses local change more directly, but does not remove every uncertainty." }],
    sentencePatterns: ["The design supports …, although it cannot establish …", "Compared with …, this method better addresses …", "The claim should therefore be qualified as …"],
    retrieval: { prompt: "Retrieve the difference between correlation, comparison, and causal certainty from a previous evidence lesson.", promptArabic: "استرجع الفرق بين الارتباط والمقارنة واليقين السببي من درس سابق عن الأدلة.", expectedEvidence: "A clear statement that a stronger comparison does not automatically prove causation.", expectedEvidenceArabic: "ذكر واضح بأن المقارنة الأقوى لا تثبت السببية تلقائياً." },
  },
  103: {
    kind: "standard", title: "Make uncertainty audible", titleArabic: "اجعل عدم اليقين مسموعاً",
    objective: "Use stance adverbials and reporting verbs to signal evidence strength without sounding evasive.", objectiveArabic: "استخدم ظروف الموقف وأفعال الإسناد للإشارة إلى قوة الدليل دون أن تبدو مراوغاً.", stage: "explanation", semantic: "grammar", minutes: 20,
    sentencePatterns: ["The report appears to suggest …", "On the available evidence, …", "The authors cautiously attribute … to …"],
    retrieval: { prompt: "Turn one overconfident sentence from a prior lesson into a precise, useful uncertainty statement.", promptArabic: "حوّل جملة واثقة أكثر من اللازم من درس سابق إلى عبارة دقيقة ومفيدة عن عدم اليقين.", expectedEvidence: "A reporting verb or stance adverbial plus a specific claim.", expectedEvidenceArabic: "فعل إسناد أو ظرف موقف مع ادعاء محدد." },
  },
  104: {
    kind: "listening", title: "When sources disagree", titleArabic: "عندما تختلف المصادر",
    objective: "Extract each speaker's evidence, reservation, and proposed basis for resolving disagreement.", objectiveArabic: "استخرج دليل كل متحدث وتحفظه والأساس المقترح لحل الاختلاف.", stage: "guided-practice", semantic: "activity", minutes: 24,
    speakingLines: [{ id: "researcher", speaker: "Researcher", text: "The survey records satisfaction, but the interviews reveal who was never reached. We should treat the figures as useful evidence, not as a complete account.", textArabic: "يسجل الاستبيان الرضا، لكن المقابلات تكشف من لم نصل إليهم أصلاً. ينبغي أن نتعامل مع الأرقام كدليل مفيد لا كحساب كامل.", pronunciationHint: "useful evidence /ˈjuːsfəl ˈevɪdəns/" }, { id: "official", speaker: "Official", text: "Then the review should publish both the headline result and the sampling limitation.", textArabic: "إذن ينبغي أن تنشر المراجعة النتيجة الرئيسية وقيد أخذ العينة معاً." }],
    sentencePatterns: ["Speaker A accepts … but qualifies it by …", "The disagreement concerns the completeness of …", "A transparent review would publish …"], supports: ["transcript"],
    retrieval: { prompt: "State one way a sampling limitation can change the interpretation of a positive result.", promptArabic: "اذكر طريقة واحدة يمكن أن يغير بها قيد أخذ العينة تفسير نتيجة إيجابية.", expectedEvidence: "It may exclude people whose experience differs from the respondents'.", expectedEvidenceArabic: "قد يستبعد أشخاصاً تختلف تجربتهم عن تجربة المشاركين." },
  },
  105: {
    kind: "writing", title: "Reach a conclusion, not a slogan", titleArabic: "توصل إلى خلاصة لا شعار",
    objective: "Write a proportionate conclusion that concedes an objection and recommends one reviewable action.", objectiveArabic: "اكتب خلاصة متناسبة تعترف باعتراض وتوصي بإجراء واحد قابل للمراجعة.", stage: "guided-practice", semantic: "grammar", minutes: 30,
    prompt: "Write 240–300 words advising a council on a proposed congestion charge. State what the evidence supports, concede one reasonable objection, and recommend one action with a review date.", promptArabic: "اكتب 240–300 كلمة تنصح فيها مجلساً بشأن رسوم ازدحام مقترحة. اذكر ما يدعمه الدليل، واعترف باعتراض معقول، وأوصِ بإجراء مع تاريخ للمراجعة.", sentencePatterns: ["On balance, the evidence suggests …", "A reasonable objection is …", "I nevertheless recommend … subject to review in …"], supports: ["external-ai-prompt", "worked-example"],
    retrieval: { prompt: "Retrieve a conclusion structure that separates evidence, judgement, and action.", promptArabic: "استرجع بنية خلاصة تفصل بين الدليل والحكم والإجراء.", expectedEvidence: "A three-part sequence: evidence, qualified judgement, reviewable action.", expectedEvidenceArabic: "تسلسل من ثلاثة أجزاء: دليل، وحكم معاير، وإجراء قابل للمراجعة." },
  },
  106: {
    kind: "reading", title: "Hear the public issue", titleArabic: "استمع إلى القضية العامة",
    objective: "Combine technical evidence with first-hand testimony without collapsing one kind of knowledge into the other.", objectiveArabic: "اجمع بين الدليل التقني والشهادة المباشرة دون اختزال نوع من المعرفة في الآخر.", stage: "real-context", semantic: "example", minutes: 25,
    readingText: "The technical note reports fewer delays after a route change. Residents describe longer journeys for people whose shifts begin before the first service. The accounts answer different questions: one measures a system outcome, while the other records an unequal adjustment cost. A fair proposal keeps both visible.",
    readingTextArabic: "تسجل المذكرة الفنية تأخيرات أقل بعد تغيير المسار. ويصف السكان رحلات أطول لمن تبدأ نوبات عملهم قبل أول خدمة. تجيب الروايتان عن سؤالين مختلفين: تقيس إحداهما نتيجة للنظام، بينما تسجل الأخرى تكلفة تكيف غير متساوية. ويحافظ المقترح العادل على ظهورهما معاً.",
    readingChecks: [{ id: "detail", type: "detail", prompt: "What does the testimony add to the technical note?", promptArabic: "ماذا تضيف الشهادة إلى المذكرة الفنية؟", answer: "It shows who bears the adjustment cost.", explanation: "First-hand testimony makes distributional effects visible." }],
    sentencePatterns: ["The testimony adds … to the technical finding.", "The unequal burden falls on …", "A balanced response would preserve … while asking …"],
    retrieval: { prompt: "Name one reason lived experience should not be treated as a replacement for technical evidence.", promptArabic: "اذكر سبباً واحداً لعدم التعامل مع التجربة المعاشة بوصفها بديلاً عن الدليل التقني.", expectedEvidence: "The two forms answer different questions and should be interpreted together.", expectedEvidenceArabic: "يجيب النوعان عن سؤالين مختلفين وينبغي تفسيرهما معاً." },
  },
  107: {
    kind: "interaction", title: "Question convenience", titleArabic: "ساءل الراحة",
    objective: "Use counterfactual and conditional language to evaluate consent, responsibility, and convenience.", objectiveArabic: "استخدم لغة الشرط والافتراض لتقييم الموافقة والمسؤولية والسهولة.", stage: "real-context", semantic: "activity", minutes: 23,
    interactionTurns: [{ id: "designer", speaker: "Service designer", text: "The app collects extra location data because it makes the service smoother.", textArabic: "يجمع التطبيق بيانات موقع إضافية لأن ذلك يجعل الخدمة أسهل.", purpose: "Offer a convenience justification." }, { id: "you", speaker: "You", text: "If the data were not necessary for the stated purpose, the service should not collect it without a separate, informed choice.", textArabic: "لو لم تكن البيانات ضرورية للغرض المعلن، فلا ينبغي للخدمة أن تجمعها دون اختيار منفصل ومستنير.", purpose: "Answer with conditional ethical reasoning." }],
    sentencePatterns: ["If the data were necessary, …", "Had the service disclosed …, users might have …", "Convenience would not justify … unless …"],
    retrieval: { prompt: "Retrieve the difference between a possible benefit and a sufficient justification.", promptArabic: "استرجع الفرق بين فائدة محتملة وتبرير كافٍ.", expectedEvidence: "A benefit may be real without justifying an avoidable privacy cost.", expectedEvidenceArabic: "قد تكون الفائدة حقيقية دون أن تبرر تكلفة خصوصية يمكن تجنبها." },
  },
  108: {
    kind: "reading", title: "Challenge the single story", titleArabic: "تحدَّ السردية الواحدة",
    objective: "Synthesize conflicting accounts of representation and propose a respectful programme change.", objectiveArabic: "ركّب روايات متعارضة عن التمثيل واقترح تغييراً محترماً في البرنامج.", stage: "independent-practice", semantic: "example", minutes: 27,
    readingText: "A museum statement celebrates inclusion through one headline exhibition. A community statement notes that the artists were invited only after the programme was fixed. The disagreement is not solved by choosing a side; it requires examining who had decision-making power and when.",
    readingTextArabic: "يحتفي بيان المتحف بالشمول عبر معرض رئيسي واحد. ويشير بيان مجتمعي إلى أن الفنانين دُعوا فقط بعد تثبيت البرنامج. لا يُحل الاختلاف باختيار طرف؛ بل يتطلب فحص من امتلك سلطة اتخاذ القرار ومتى.",
    readingChecks: [{ id: "inference", type: "inference", prompt: "What is the deeper question beneath the disagreement?", promptArabic: "ما السؤال الأعمق الكامن وراء الاختلاف؟", answer: "Who had decision-making power and when participation became possible.", explanation: "The issue is institutional timing and power, not only the final display." }],
    sentencePatterns: ["The central representational gap is …", "The sources converge on … but differ about …", "A respectful reform would …"],
    retrieval: { prompt: "Use a prior lesson's source-aware move to distinguish inclusion in the final product from influence over the process.", promptArabic: "استخدم حركة واعية بالمصادر من درس سابق للتمييز بين الشمول في المنتج النهائي والتأثير في العملية.", expectedEvidence: "A clear contrast between visibility and decision-making power.", expectedEvidenceArabic: "مقابلة واضحة بين الظهور وسلطة اتخاذ القرار." },
  },
  109: {
    kind: "listening", title: "What counts as progress?", titleArabic: "ما الذي يُعدّ تقدماً؟",
    objective: "Distinguish competing indicators and infer the trade-off a speaker is making.", objectiveArabic: "ميّز بين مؤشرات متنافسة واستنتج المفاضلة التي يجريها المتحدث.", stage: "guided-practice", semantic: "activity", minutes: 24,
    speakingLines: [{ id: "director", speaker: "Development director", text: "A single growth figure is easy to communicate, but a composite measure may reveal whether the gains are shared. We need a headline that remains accountable to distribution.", textArabic: "يسهل إيصال رقم نمو واحد، لكن المقياس المركب قد يكشف ما إذا كانت المكاسب مشتركة. نحتاج إلى عنوان يبقى خاضعاً للمساءلة بشأن التوزيع." }],
    sentencePatterns: ["The speaker values … but recognises …", "The indicator would conceal …", "A defensible strategy would combine …"], supports: ["transcript"],
    retrieval: { prompt: "State one trade-off between communicative simplicity and a fair account of distribution.", promptArabic: "اذكر مفاضلة واحدة بين بساطة التواصل والحساب العادل للتوزيع.", expectedEvidence: "A simple headline may be clearer but can hide unequal gains.", expectedEvidenceArabic: "قد يكون العنوان البسيط أوضح لكنه قد يخفي مكاسب غير متساوية." },
  },
  110: {
    kind: "review", title: "Count the cost of a decision", titleArabic: "احسب تكلفة القرار",
    objective: "Retrieve source comparison, unintended-effect, and mitigation language in a new resource-allocation scenario.", objectiveArabic: "استرجع لغة مقارنة المصادر والأثر غير المقصود والتخفيف في سيناريو جديد لتخصيص الموارد.", stage: "review", semantic: "retrieval", minutes: 20,
    prompt: "Write 180–220 words advising a council on moving resources from acute care to early intervention. Weigh two sources, predict one knock-on effect, and specify one mitigation measure.", promptArabic: "اكتب 180–220 كلمة تنصح فيها مجلساً بنقل الموارد من الرعاية الحادة إلى التدخل المبكر. وازن بين مصدرين، وتوقع أثراً متتابعاً واحداً، وحدد إجراء تخفيف واحداً.", sentencePatterns: ["The reallocation could yield …, although …", "The principal unintended effect may be …", "This could be mitigated by …"], supports: ["external-ai-prompt", "worked-example"],
    retrieval: { prompt: "Retrieve three moves: compare the sources, forecast a cost, and attach a mitigation.", promptArabic: "استرجع ثلاث حركات: قارن المصدرين، وتوقع تكلفة، واربط بها إجراء تخفيف.", expectedEvidence: "Comparison, consequence, and mitigation appear in one connected response.", expectedEvidenceArabic: "تظهر المقارنة والنتيجة والتخفيف في استجابة مترابطة واحدة." },
  },
  111: {
    kind: "speaking", title: "Design for disagreement", titleArabic: "صمّم مساحة للخلاف",
    objective: "Deliver a diplomatic two-minute proposal for a deliberative forum that protects participation and evidence quality.", objectiveArabic: "قدّم مقترحاً دبلوماسياً مدته دقيقتان لمنتدى تداولي يحمي المشاركة وجودة الدليل.", stage: "independent-practice", semantic: "activity", minutes: 25,
    speakingLines: [{ id: "stakeholder", speaker: "Stakeholder", text: "A forum may give opponents another stage without changing the plan.", textArabic: "قد يمنح المنتدى المعارضين منصة أخرى دون أن يغير الخطة." }, { id: "you", speaker: "You", text: "That risk is real unless the process publishes its decision points, invites affected groups early, and explains how evidence changed the proposal.", textArabic: "هذا الخطر حقيقي ما لم تنشر العملية نقاط قرارها، وتدعُ المجموعات المتأثرة مبكراً، وتشرح كيف غيّر الدليل المقترح." }],
    sentencePatterns: ["That risk is real unless …", "The forum would be credible if …", "I would revise the design when …"],
    retrieval: { prompt: "Retrieve one diplomatic rebuttal pattern and use it to answer a concern about public participation.", promptArabic: "استرجع نمطاً واحداً للرد الدبلوماسي واستخدمه للإجابة عن قلق بشأن المشاركة العامة.", expectedEvidence: "Acknowledge the concern, then specify a design safeguard.", expectedEvidenceArabic: "اعترف بالقلق، ثم حدد ضمانة في التصميم." },
  },
  112: {
    kind: "assessment", title: "An argument with a memory", titleArabic: "حجة لها سياق",
    objective: "Evaluate historical claims, attribute archival evidence precisely, and recommend a proportionate response to a contested monument.", objectiveArabic: "قيّم ادعاءات تاريخية، وانسب الدليل الأرشيفي بدقة، وأوصِ باستجابة متناسبة لنصب متنازع عليه.", stage: "assessment", semantic: "assessment", minutes: 38,
    readingText: "An archival minute records the council's stated purpose for a monument in 1952. A private memorandum from the same period reveals a narrower political concern, while a recent scholarly article disputes how representative either document is. A public petition asks for removal; another asks for contextualisation. The committee must decide not only what happened, but what responsible remembrance requires now.",
    readingTextArabic: "يسجل محضر أرشيفي غرض المجلس المعلن من نصب عام في عام 1952. وتكشف مذكرة خاصة من الفترة نفسها عن قلق سياسي أضيق، بينما يجادل مقال علمي حديث في مدى تمثيل أي من الوثيقتين. وتطالب عريضة عامة بالإزالة؛ وتطالب أخرى بوضع سياق تفسيري. على اللجنة أن تقرر ليس فقط ما حدث، بل ما تتطلبه الذاكرة المسؤولة الآن.",
    readingChecks: [{ id: "source", type: "detail", prompt: "Which source exposes a private political concern?", promptArabic: "أي مصدر يكشف عن قلق سياسي خاص؟", answer: "The private memorandum.", explanation: "Its provenance and purpose differ from the public council minute." }, { id: "inference", type: "inference", prompt: "Why should the committee avoid treating one document as the whole history?", promptArabic: "لماذا ينبغي للجنة ألا تتعامل مع وثيقة واحدة بوصفها التاريخ كله؟", answer: "The documents have different purposes and contested representativeness.", explanation: "Responsible interpretation compares provenance, purpose, and later scholarship." }],
    prompt: "Prepare a 340–420 word formal recommendation to the City Heritage Committee. Choose removal, reinterpretation in situ, or retention with conditions. Attribute at least two sources, acknowledge one uncertainty, explain likely consequences, and propose one concrete next step.", promptArabic: "حضّر توصية رسمية من 340–420 كلمة إلى لجنة التراث في المدينة. اختر الإزالة أو إعادة التفسير في الموقع أو الإبقاء بشروط. انسب مصدرين على الأقل، واعترف بحالة عدم يقين، واشرح النتائج المحتملة، واقترح خطوة تالية ملموسة.", sentencePatterns: ["The 1952 minute records …, whereas the memorandum suggests …", "The later scholarship cautions that …", "I therefore recommend … subject to …"], supports: ["external-ai-prompt", "extended-rationale", "worked-example"],
    retrieval: { prompt: "Before beginning the assessment, state the four evidence moves this module has trained: frame, qualify, compare, and propose.", promptArabic: "قبل بدء التقييم، اذكر حركات الدليل الأربع التي درب عليها هذا النموذج: أطر، وعاير، وقارن، واقترح.", expectedEvidence: "The learner names all four moves and connects each to a sentence action.", expectedEvidenceArabic: "يسمي المتعلم الحركات الأربع ويربط كل واحدة بفعل لغوي في الجملة." },
  },
};

function buildActivity(lessonNumber: number, spec: Spec): LessonActivity {
  const { minutes, retrieval, supports, prompt, promptArabic, ...activity } = spec;
  return {
    ...activity,
    id: `c1-module-7-${lessonNumber}`,
    estimatedMinutes: minutes,
    ...(prompt ? { writingPrompt: prompt, writingPromptArabic: promptArabic } : {}),
    retrievalCheck: retrieval,
    progressiveSupports: supports ?? ["arabic-help", "word-support"],
  };
}

export const C1_MODULE_7_ACTIVITIES: Record<number, LessonActivity[]> = Object.fromEntries(
  Object.entries(specs).map(([lessonNumber, spec]) => [Number(lessonNumber), [buildActivity(Number(lessonNumber), spec)]]),
);

export default C1_MODULE_7_ACTIVITIES;
