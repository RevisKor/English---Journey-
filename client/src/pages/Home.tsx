import { useAuth } from "@/_core/hooks/useAuth";
import { POST_LOGIN_RETURN_KEY, resolvePostLoginReturnPath, startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { A1_COURSE, A1_LESSONS, A2_COURSE, A2_LESSONS, B1_COURSE, B1_LESSONS, B2_COURSE, B2_LESSONS, C1_COURSE, C1_LESSONS, C2_COURSE, C2_LESSONS, type CourseDefinition, type LessonDefinition } from "@shared/course";
import { courseRoutePath, resolveCourseRoute } from "@shared/course-route";
import { buildCourseMapMentorPreview } from "@shared/course/mentor-guidance";
import { buildModuleWordBank, summarizeWordBank } from "@shared/course/word-bank";
import { LearnerCourseMap } from "@/components/LearnerCourseMap";
import { ContentReview, type ReviewLevel } from "@/components/ContentReview";
import { ExternalLessonWorkspace } from "@/components/ExternalLessonWorkspace";
import { StructuredLessonWorkspace } from "@/components/A2LessonWorkspace";
import { WarmupReview } from "@/components/WarmupReview";
import {
  BookOpen, CheckCircle2, ChevronRight, FileSearch, Flame, Headphones, HelpCircle, LockKeyhole, LogOut,
  Brain, Menu, PanelLeftClose, PanelLeftOpen, Play, Trophy, Volume2, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useEffect, useMemo, useState } from "react";

type Accent = "british" | "american";
type ActiveLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ShellView = "course" | "review" | "daily-review";

export const LEARNER_LEVELS = [
  { level: "A1", label: "Starter", arabic: "مبتدئ", detail: "90 lessons · foundation" },
  { level: "A2", label: "Elementary", arabic: "أساسي", detail: "135 lessons · independence" },
  { level: "B1", label: "Intermediate", arabic: "متوسط", detail: "150 lessons · real fluency" },
  { level: "B2", label: "Upper intermediate", arabic: "فوق المتوسط", detail: "150 lessons · complex ideas" },
  { level: "C1", label: "Advanced", arabic: "متقدم", detail: "160 lessons · nuance & evidence" },
  { level: "C2", label: "Mastery", arabic: "إتقان", detail: "180 lessons · independent judgement" },
] as const;

function currentSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

export function courseLessonsForLevel(level: ActiveLevel): LessonDefinition[] {
  return level === "C2" ? C2_LESSONS : level === "C1" ? C1_LESSONS : level === "B2" ? B2_LESSONS : level === "B1" ? B1_LESSONS : level === "A2" ? A2_LESSONS : A1_LESSONS;
}

export function courseDefinitionForLevel(level: ActiveLevel): CourseDefinition {
  return level === "C2" ? C2_COURSE : level === "C1" ? C1_COURSE : level === "B2" ? B2_COURSE : level === "B1" ? B1_COURSE : level === "A2" ? A2_COURSE : A1_COURSE;
}

export function resolveLearnerEntry(search: string) {
  const route = resolveCourseRoute(search);
  const lesson = route.lessonNumber ? courseLessonsForLevel(route.level).find((item) => item.lessonNumber === route.lessonNumber) : undefined;
  return { ...route, lesson, mentorPreview: lesson ? buildCourseMapMentorPreview(lesson) : undefined };
}

export function resolveDirectLesson(search: string, isAdmin: boolean, completedLessons: Set<number>) {
  const entry = resolveLearnerEntry(search);
  if (!entry.lesson || (!isAdmin && entry.lesson.lessonNumber > 1 && !completedLessons.has(entry.lesson.lessonNumber - 1))) return undefined;
  return entry.lesson;
}

function speak(text: string, accent: Accent) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === "british" ? "en-GB" : "en-US";
  window.speechSynthesis.speak(utterance);
}

function Brand({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return <div className={cn("flex items-center gap-3", !dark && "text-white")}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e7b84a] text-sm font-black text-[#253453] shadow-sm">EJ</div>{!compact && <div className="min-w-0"><p className="truncate text-base font-bold tracking-[-.03em]">English Journey</p><p className={cn("arabic text-xs", dark ? "text-[#71809b]" : "text-[#c0cce2]")}>رحلتك لإتقان الإنجليزية</p></div>}</div>;
}

function PublicHome() {
  return <main className="min-h-screen overflow-x-hidden bg-[#f7f3e9] text-[#253453]"><section className="course-grid mx-auto min-h-screen max-w-[1480px] px-5 py-6 sm:px-10 lg:px-16"><nav className="flex items-center justify-between"><Brand dark /><Button onClick={startLogin} className="rounded-full bg-[#253453] px-5 text-[#fff8e8] hover:bg-[#35476d]">Start learning</Button></nav><div className="grid min-h-[82vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]"><div className="max-w-2xl"><p className="inline-flex rounded-full border border-[#e7b84a]/55 bg-[#fff9e9] px-4 py-2 text-sm font-semibold text-[#7b5b12]">Built for Arabic speakers</p><h1 className="mt-6 text-5xl font-bold tracking-[-.055em] sm:text-6xl lg:text-7xl">Every English step, made <span className="text-[#bf7f2f]">clear.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#4d5a72]">A guided English course with vocabulary, grammar, pronunciation, reading, writing, and transparent prompts you can take to the AI tool of your choice.</p><Button onClick={startLogin} size="lg" className="mt-8 rounded-full bg-[#253453] px-7 text-[#fff8e8] hover:bg-[#35476d]">Begin A1 <ChevronRight className="ml-1 h-4 w-4" /></Button></div><div className="rounded-[2rem] border border-[#e6dcc9] bg-[#fffdf7] p-6 shadow-[0_28px_80px_rgba(37,52,83,.18)]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#bf7f2f]">Your next lesson</p><h2 className="mt-2 text-2xl font-bold">A1 · Lesson 01</h2><div className="mt-6 rounded-2xl bg-[#253453] p-5 text-white"><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#aebbd6]">Learn a new word</p><div className="mt-5 flex items-center justify-between"><div><p className="text-3xl font-bold">hello</p><p className="mt-1 text-sm text-[#e7b84a]">/həˈləʊ/ · huh-LOH</p></div><button onClick={() => speak("hello", "british")} className="grid h-11 w-11 place-items-center rounded-full bg-[#e7b84a] text-[#253453]"><Volume2 className="h-5 w-5" /></button></div><p dir="rtl" className="arabic mt-4 text-right text-lg text-[#fdf4d4]">مرحباً</p></div></div></div></section></main>;
}

export const tutorialCopy: Record<ActiveLevel, { title: string; titleArabic: string; intro: string; introArabic: string; steps: Array<{ title: string; arabic: string; body: string; bodyArabic?: string }> }> = {
  A1: { title: "Your first English route", titleArabic: "طريقك الأول في الإنجليزية", intro: "English Journey keeps the next step visible. Each lesson tells you what it is for, what to do now, and what will come next.", introArabic: "تُبقي رحلة الإنجليزية خطوتك التالية واضحة. يوضّح لك كل درس هدفه، وما الذي تفعله الآن، وما الذي سيأتي بعد ذلك.", steps: [{ title: "See the lesson shape", arabic: "تعرّف على شكل الدرس", body: "Some lessons bring new words, some help you notice a grammar pattern, and some ask you to use what you already know. The opening tells you which journey you are taking.", bodyArabic: "تقدّم بعض الدروس كلمات جديدة، وتساعدك دروس أخرى على ملاحظة قاعدة، بينما تطلب منك دروس أخرى استخدام ما تعرفه بالفعل. تخبرك البداية بالرحلة التي ستسير فيها." }, { title: "Use sound and Arabic wisely", arabic: "استخدم الصوت والعربية بذكاء", body: "Play examples aloud, read the Arabic support when you need it, then return your attention to the English.", bodyArabic: "استمع إلى الأمثلة، واقرأ الشرح العربي عندما تحتاج إليه، ثم أعد انتباهك إلى الإنجليزية." }, { title: "Check what matters", arabic: "تحقّق مما يهم", body: "Some lessons finish with a short check; others prepare you for a later task. When there is a quiz, it checks language in context and you can review before trying again.", bodyArabic: "ينتهي بعض الدروس بتحقّق قصير، بينما تجهّزك دروس أخرى لمهمة لاحقة. وعندما يوجد اختبار، فهو يفحص اللغة داخل السياق ويمكنك المراجعة قبل المحاولة من جديد." }] },
  A2: { title: "Build independence", titleArabic: "ابنِ استقلالك", intro: "At A2, the mentor connects everyday language to your own life so each lesson becomes something you can use.", introArabic: "في A2، يربط المرشد اللغة اليومية بحياتك حتى يصبح كل درس شيئاً يمكنك استخدامه.", steps: [{ title: "Read the mentor first", arabic: "اقرأ كلام المرشد أولاً", body: "The opening explains why the lesson matters and tells you what you will be able to do.", bodyArabic: "تشرح المقدمة لماذا يهمّك الدرس وما الذي ستستطيع فعله بعده." }, { title: "Follow this lesson’s route", arabic: "اتبع مسار هذا الدرس", body: "The studio shows the language and activities needed for this objective. A lesson may focus on interaction, reading, writing, grammar, review, or a thoughtful combination—not a fixed checklist.", bodyArabic: "يعرض الاستوديو اللغة والأنشطة اللازمة لهدف هذا الدرس. قد يركّز الدرس على التفاعل أو القراءة أو الكتابة أو القواعد أو المراجعة أو مزيج مدروس منها، وليس قائمة ثابتة." }, { title: "Use prompts for extra help", arabic: "استخدم الطلبات للمساعدة", body: "Copy a lesson-aware prompt into the external AI tool you choose when you want another explanation or feedback.", bodyArabic: "انسخ الطلب المرتبط بالدرس إلى أداة الذكاء الاصطناعي التي تختارها عندما تريد شرحاً أو ملاحظات إضافية." }] },
  B1: { title: "Make your thinking visible", titleArabic: "اجعل تفكيرك واضحاً", intro: "B1 asks you to connect ideas, support opinions, and use English for real decisions rather than isolated answers.", introArabic: "يطلب منك B1 ربط الأفكار ودعم الآراء واستخدام الإنجليزية في قرارات حقيقية بدلاً من إجابات منفصلة.", steps: [{ title: "Notice the purpose", arabic: "لاحظ الهدف", body: "Each lesson begins with a communicative outcome and a situation where the language belongs." }, { title: "Practise precision", arabic: "تدرّب على الدقة", body: "Choose the expression that fits the context, then write a sentence that says something true about your experience." }, { title: "Review before you retry", arabic: "راجع قبل أن تعيد المحاولة", body: "The quiz review shows your choices and the correct answers so your next attempt is informed." }] },
  B2: { title: "Control nuance", titleArabic: "تحكّم في الدقة", intro: "B2 is where register, emphasis, and qualification help you make complex ideas clear and convincing.", introArabic: "في B2 تساعدك النبرة والتأكيد والتقييد على جعل الأفكار المعقدة واضحة ومقنعة.", steps: [{ title: "Follow the argument", arabic: "تابع الحجة", body: "Read for the main claim first, then return to the language choices that shape emphasis and tone." }, { title: "Make deliberate choices", arabic: "اتخذ اختيارات واعية", body: "Your practice sentence should use the lesson language for a real point, not simply repeat an example." }, { title: "Treat tests as edits", arabic: "اعتبر الاختبارات مراجعة", body: "A contextual answer is the one that fits the audience, purpose, and relationship between ideas." }] },
  C1: { title: "Read with intellectual control", titleArabic: "اقرأ بضبط فكري", intro: "C1 develops the judgement needed to trace evidence, qualify claims, and write with a precise sense of audience.", introArabic: "يطوّر C1 الحكم اللازم لتتبع الدليل وتقييد الادعاءات والكتابة بإحساس دقيق بالجمهور.", steps: [{ title: "Start with the claim", arabic: "ابدأ بالادعاء", body: "Before you study details, identify what the text is saying and what kind of support it offers." }, { title: "Notice what language does", arabic: "لاحظ وظيفة اللغة", body: "Grammar and vocabulary signal certainty, distance, emphasis, and relationships between ideas." }, { title: "Use external feedback deliberately", arabic: "استخدم التغذية الراجعة بوعي", body: "Copy the provided prompt, then revise for one clear strength and one specific next improvement." }] },
  C2: { title: "Make language answerable to ideas", titleArabic: "اجعل اللغة خادمة للأفكار", intro: "C2 is a studio for independent judgement: you will compare sources, mediate complexity, and make precise stylistic choices for a real audience.", introArabic: "C2 مساحة للحكم المستقل: ستقارن بين المصادر، وتبسط التعقيد، وتتخذ اختيارات أسلوبية دقيقة لجمهور حقيقي.", steps: [{ title: "Enter the problem", arabic: "ادخل إلى المشكلة", body: "Each lesson begins with a difficult question rather than a list of words. Use the vocabulary to think, not merely to display it." }, { title: "Make nuance visible", arabic: "أظهر الفروق الدقيقة", body: "Track implication, register, rhythm, and the strength of evidence. When a distinction matters, say exactly what it is." }, { title: "Mediate and create", arabic: "بسّط وأنشئ", body: "Move between expert and public language, then write a defensible position that acknowledges uncertainty and competing views." }] },
};

export function tutorialStorageKey(level: ActiveLevel) {
  return `english-journey:tutorial:${level}:seen`;
}

export function shouldOpenTutorial(level: ActiveLevel, storage: Pick<Storage, "getItem">, manualOpen = false) {
  return manualOpen || storage.getItem(tutorialStorageKey(level)) !== "1";
}

export function markTutorialSeen(level: ActiveLevel, storage: Pick<Storage, "setItem">) {
  storage.setItem(tutorialStorageKey(level), "1");
}

const onboardingSteps = [
  { title: "Understand the route", arabic: "افهم مسار التعلّم", body: "Levels move from A1 foundations to C2 independent judgement. Each level is divided into named modules, and each module connects a group of lessons around a meaningful theme.", bodyArabic: "تنتقل المستويات من أساسيات A1 إلى الحكم المستقل في C2. وينقسم كل مستوى إلى وحدات ذات أسماء، وتربط كل وحدة مجموعة دروس حول موضوع ذي معنى." },
  { title: "Choose the lesson family", arabic: "اختر نوع الدرس", body: "A lesson may introduce language, show vocabulary visually, rehearse a real interaction, build speaking fluency, develop reading, support writing, or bring earlier language back for review. The lesson studio shows the exact sequence.", bodyArabic: "قد يقدّم الدرس لغة جديدة، أو يعرض المفردات بصرياً، أو يتدرّب على موقف حقيقي، أو يبني الطلاقة الشفهية، أو يطوّر القراءة والكتابة، أو يعيد لغة سابقة للمراجعة. ويعرض استوديو الدرس التسلسل بوضوح." },
  { title: "Use progress and review", arabic: "استخدم التقدّم والمراجعة", body: "Your course map shows what is complete and what is next. Keep a module word bank for retrieval, return to difficult lessons, and use the review route before a milestone or cumulative test.", bodyArabic: "توضح خريطة الدورة ما أنجزته وما يأتي بعده. احتفظ ببنك كلمات للوحدة للاسترجاع، وعد إلى الدروس الصعبة، واستخدم مسار المراجعة قبل اختبار الوحدة أو الاختبار التراكمي." },
  { title: "Finish with evidence", arabic: "اختم بدليل على تقدّمك", body: "Quizzes use contextual questions, grammar practice, and varied snapshots. Reading and writing prompts can be copied to an external AI for optional feedback; the next lesson remains gated by your course assessment.", bodyArabic: "تستخدم الاختبارات أسئلة سياقية وتدريبات قواعد ومحاولات متنوعة. ويمكن نسخ طلبات القراءة والكتابة إلى ذكاء اصطناعي خارجي للحصول على ملاحظات اختيارية، بينما يبقى الدرس التالي مرتبطاً باختبار الدورة." },
];

function FirstUseTutorial({ level, open, onOpenChange }: { level: ActiveLevel; open: boolean; onOpenChange: (open: boolean) => void }) {
  const copy = tutorialCopy[level];
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#e5ddcf] bg-[#fffdf7] text-[#253453]"><DialogHeader><DialogTitle className="text-2xl font-bold">{copy.title}</DialogTitle><DialogDescription className="leading-7 text-[#627087]">{copy.intro}</DialogDescription><p dir="rtl" className="arabic text-right text-sm leading-7 text-[#718098]">{copy.titleArabic} · {copy.introArabic}</p></DialogHeader><div className="mt-2 space-y-3">{[...copy.steps, ...onboardingSteps].map((step, index) => <div key={step.title} className="rounded-2xl border border-[#e5ddcf] bg-white p-4"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fff0bd] text-sm font-black text-[#765618]">{index + 1}</span><div><h3 className="font-bold">{step.title}</h3><p dir="rtl" className="arabic mt-1 text-right text-xs text-[#8390a4]">{step.arabic}</p><p className="mt-2 text-sm leading-7 text-[#5c6b81]">{step.body}</p>{step.bodyArabic && <p dir="rtl" className="arabic mt-2 text-right text-xs leading-6 text-[#8390a4]">{step.bodyArabic}</p>}</div></div></div>)}</div><Button onClick={() => onOpenChange(false)} className="mt-2 rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">Start this route</Button></DialogContent></Dialog>;
}

export function AppShell({ initialSearch }: { initialSearch?: string } = {}) {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const routeSearch = initialSearch ?? currentSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<ShellView>(() => new URLSearchParams(routeSearch).get("dailyReview") === "1" ? "daily-review" : new URLSearchParams(routeSearch).get("review") === "1" ? "review" : "course");
  const [activeLevel, setActiveLevel] = useState<ActiveLevel>(() => resolveLearnerEntry(routeSearch).level);
  const [activeLesson, setActiveLesson] = useState<LessonDefinition | null>(() => isAdmin ? resolveDirectLesson(routeSearch, true, new Set()) ?? null : null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const dashboardQuery = trpc.course.dashboard.useQuery({ level: activeLevel }, { enabled: isAuthenticated });
  const a1ProgressQuery = trpc.course.progress.useQuery({ level: "A1" }, { enabled: isAuthenticated });
  const a2ProgressQuery = trpc.course.progress.useQuery({ level: "A2" }, { enabled: isAuthenticated });
  const b1ProgressQuery = trpc.course.progress.useQuery({ level: "B1" }, { enabled: isAuthenticated });
  const b2ProgressQuery = trpc.course.progress.useQuery({ level: "B2" }, { enabled: isAuthenticated });
  const c1ProgressQuery = trpc.course.progress.useQuery({ level: "C1" }, { enabled: isAuthenticated });
  const activityMutation = trpc.course.recordActivity.useMutation({ onSuccess: () => dashboardQuery.refetch() });
  const updateAccent = trpc.course.updateAccent.useMutation({ onSuccess: () => dashboardQuery.refetch() });
  const profile = dashboardQuery.data?.profile;
  const accent = (profile?.preferredAccent ?? "british") as Accent;
  const completedLessons = useMemo(() => new Set((dashboardQuery.data?.progress.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lessonNumber)), [dashboardQuery.data]);
  const a1Complete = (a1ProgressQuery.data?.lessons ?? []).filter((item) => item.status === "completed").length === A1_LESSONS.length;
  const a2Complete = (a2ProgressQuery.data?.lessons ?? []).filter((item) => item.status === "completed").length === A2_LESSONS.length;
  const b1Complete = (b1ProgressQuery.data?.lessons ?? []).filter((item) => item.status === "completed").length === B1_LESSONS.length;
  const b2Complete = (b2ProgressQuery.data?.lessons ?? []).filter((item) => item.status === "completed").length === B2_LESSONS.length;
  const c1Complete = (c1ProgressQuery.data?.lessons ?? []).filter((item) => item.status === "completed").length === C1_LESSONS.length;
  const activeCourse = courseDefinitionForLevel(activeLevel);
  const lessons = activeCourse.lessons;
  const levelUnlocked = (level: ActiveLevel) => isAdmin || level === "A1" || (level === "A2" && a1Complete) || (level === "B1" && a2Complete) || (level === "B2" && b1Complete) || (level === "C1" && b2Complete) || (level === "C2" && c1Complete);
  useEffect(() => {
    try {
      setTutorialOpen(shouldOpenTutorial(activeLevel, window.localStorage));
    } catch { setTutorialOpen(false); }
  }, [activeLevel]);
  const closeTutorial = (open: boolean) => {
    setTutorialOpen(open);
    if (!open) {
      try { markTutorialSeen(activeLevel, window.localStorage); } catch {}
    }
  };
  useEffect(() => {
    if (!isAuthenticated || view !== "course" || activeLesson) return;
    const entry = resolveLearnerEntry(routeSearch);
    if (entry.level !== activeLevel || !entry.lessonNumber || !levelUnlocked(entry.level)) return;
    const requestedLesson = resolveDirectLesson(routeSearch, isAdmin, completedLessons);
    if (requestedLesson) setActiveLesson(requestedLesson);
  }, [activeLesson, activeLevel, completedLessons, isAdmin, isAuthenticated, view, routeSearch, a1Complete, a2Complete, b1Complete, b2Complete, c1Complete]);

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const returnPath = sessionStorage.getItem(POST_LOGIN_RETURN_KEY);
      const currentPath = `${window.location.pathname}${window.location.search}`;
      sessionStorage.removeItem(POST_LOGIN_RETURN_KEY);
      const safeReturnPath = resolvePostLoginReturnPath(returnPath, currentPath);
      if (safeReturnPath) window.location.replace(safeReturnPath);
    } catch {}
  }, [isAuthenticated]);

  if (!isAuthenticated) return <PublicHome />;
  const openLesson = (lesson: LessonDefinition) => { window.history.replaceState(null, "", courseRoutePath(lesson.level as ActiveLevel, lesson.lessonNumber)); setActiveLesson(lesson); setMenuOpen(false); activityMutation.mutate(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const selectLevel = (level: ActiveLevel) => { if (!levelUnlocked(level)) return; window.history.replaceState(null, "", courseRoutePath(level)); setView("course"); setActiveLevel(level); setActiveLesson(null); setMenuOpen(false); };
  const returnToCourseMap = () => { window.history.replaceState(null, "", courseRoutePath(activeLevel)); setActiveLesson(null); };
  const openDailyReview = () => { window.history.replaceState(null, "", `/?level=${activeLevel}&dailyReview=1`); setView("daily-review"); setActiveLesson(null); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openReviewLesson = (level: ReviewLevel, lessonNumber: number) => { selectLevel(level as ActiveLevel); const reviewLessons = level === "C2" ? C2_LESSONS : level === "C1" ? C1_LESSONS : level === "A1" ? A1_LESSONS : level === "A2" ? A2_LESSONS : level === "B1" ? B1_LESSONS : B2_LESSONS; const lesson = reviewLessons.find((item) => item.lessonNumber === lessonNumber); if (lesson) openLesson(lesson); };
  const canEnter = (number: number) => isAdmin || (levelUnlocked(activeLevel) && (number === 1 || completedLessons.has(number - 1)));

  return <div className="min-h-screen overflow-x-hidden bg-[#f7f3e9] text-[#253453]"><aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col bg-[#253453] text-white transition-[width,transform] duration-200", sidebarCollapsed ? "w-[286px] lg:w-[88px]" : "w-[286px]", menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}><div className={cn("flex items-center justify-between p-5", sidebarCollapsed && "lg:p-3 lg:pt-5")}><Brand compact={sidebarCollapsed} /><div className="flex items-center gap-1"><button onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-pressed={sidebarCollapsed} className="hidden rounded-lg p-2 text-[#c5d0e3] hover:bg-white/10 hover:text-white lg:inline-flex">{sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</button><button className="rounded-lg p-2 text-[#c5d0e3] hover:bg-white/10 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div></div><div className={cn("min-h-0 flex-1 overflow-y-auto px-5 pb-5 [scrollbar-color:#7886a0_transparent] [scrollbar-width:thin]", sidebarCollapsed && "lg:px-3")}><div className="space-y-2"><SidebarItem onClick={() => { setView("course"); returnToCourseMap(); setMenuOpen(false); }} active={view === "course"} icon={<BookOpen />} label="My course" arabic="دورتي" compact={sidebarCollapsed} /><SidebarItem onClick={openDailyReview} active={view === "daily-review"} icon={<Brain />} label="Daily review" arabic="مراجعة اليوم" compact={sidebarCollapsed} />{isAdmin && <SidebarItem onClick={() => { setView("review"); setActiveLesson(null); setMenuOpen(false); }} active={view === "review"} icon={<FileSearch />} label="Content review" arabic="مراجعة المحتوى" compact={sidebarCollapsed} />}</div><div className="mt-8 border-t border-white/10 pt-6"><div className={cn("flex items-center justify-between px-3", sidebarCollapsed && "lg:hidden")}><p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#aebbd6]">{isAdmin ? "Course preview" : "Your levels"}</p>{isAdmin && <span className="rounded-full bg-[#e7b84a]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#f5d678]">review access</span>}</div><div className="mt-3 space-y-1">{LEARNER_LEVELS.map((item) => { const selectable = item.level === "A1" || item.level === "A2" || item.level === "B1" || item.level === "B2" || item.level === "C1" || item.level === "C2"; const unlocked = selectable && levelUnlocked(item.level as ActiveLevel); return <button key={item.level} disabled={!unlocked} onClick={() => selectable && selectLevel(item.level as ActiveLevel)} title={`${item.level} · ${item.label} · ${item.detail}`} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition", unlocked ? view === "course" && activeLevel === item.level ? "bg-white/15 ring-1 ring-white/10" : "hover:bg-white/10" : "cursor-not-allowed opacity-45", sidebarCollapsed && "lg:justify-center lg:px-2")}><span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold", unlocked ? "bg-[#e7b84a] text-[#253453]" : "bg-white/10 text-[#c3cee0]")}>{unlocked ? item.level : <LockKeyhole className="h-3.5 w-3.5" />}</span><span className={cn("min-w-0 flex-1", sidebarCollapsed && "lg:hidden")}><span className="block text-sm font-semibold">{item.level} · {item.label}</span><span dir="rtl" className="arabic block text-xs text-[#b9c6dd]">{item.arabic}</span></span></button>; })}</div></div></div><div className={cn("m-5 mt-0 rounded-2xl bg-white/8 p-3", sidebarCollapsed && "lg:mx-3 lg:flex lg:justify-center lg:p-2")}><div className="flex items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e7b84a] text-sm font-black text-[#253453]">{user?.name?.slice(0, 1).toUpperCase() ?? "L"}</div><div className={cn("min-w-0 flex-1", sidebarCollapsed && "lg:hidden")}><p className="truncate text-sm font-semibold">{user?.name ?? "Learner"}</p><p className="text-xs text-[#b9c6dd]">{isAdmin ? "Administrator" : `${activeLevel} learner`}</p></div><button onClick={() => logout()} aria-label="Sign out" className={cn("text-[#b9c6dd] hover:text-white", sidebarCollapsed && "lg:hidden")}><LogOut className="h-4 w-4" /></button></div></div></aside>{menuOpen && <button aria-label="Close menu overlay" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-[#16213a]/35 lg:hidden" />}<main className={cn("min-h-screen transition-[margin] duration-200", sidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[286px]")}><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b border-[#e6ddcc] bg-[#f7f3e9]/92 px-5 backdrop-blur lg:px-9"><div className="flex min-w-0 items-center gap-4"><button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e5dac7] bg-[#fffdf7] lg:hidden"><Menu className="h-5 w-5" /></button><div className="min-w-0"><p className="truncate text-[11px] font-bold uppercase tracking-[.18em] text-[#a2732c]">{activeLesson ? `${activeLesson.level} · Lesson ${String(activeLesson.lessonNumber).padStart(2, "0")}` : view === "daily-review" ? `${activeLevel} · daily review` : `${activeLevel} learning space`}</p><h1 className="truncate text-base font-bold">{activeLesson ? activeLesson.title : view === "daily-review" ? "Remember and retrieve" : "Good to see you again"}</h1></div></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => setTutorialOpen(true)} aria-label="Open course guide" className="flex items-center gap-1.5 rounded-full border border-[#e5dac7] bg-[#fffdf7] px-2.5 py-2 text-xs font-semibold sm:gap-2 sm:px-3"><HelpCircle className="h-3.5 w-3.5 text-[#bf7f2f]" /><span className="hidden sm:inline">Guide</span><span className="sr-only sm:hidden">Guide</span></button><button onClick={() => updateAccent.mutate({ preferredAccent: accent === "british" ? "american" : "british" })} className="hidden items-center gap-2 rounded-full border border-[#e5dac7] bg-[#fffdf7] px-3 py-2 text-xs font-semibold sm:flex"><Headphones className="h-3.5 w-3.5 text-[#bf7f2f]" /> {accent === "british" ? "British" : "American"}</button><div className="flex items-center gap-1.5 rounded-full bg-[#fff0bd] px-3 py-2 text-xs font-bold text-[#765618]"><Flame className="h-3.5 w-3.5 fill-[#d87629] text-[#d87629]" /> {profile?.currentStreak ?? 0}</div></div></header><FirstUseTutorial level={activeLevel} open={tutorialOpen} onOpenChange={closeTutorial} />{view === "review" && isAdmin ? <ContentReview onOpenCourse={openReviewLesson} /> : view === "daily-review" ? <WarmupReview level={activeLevel} accent={accent} onContinue={() => { setView("course"); returnToCourseMap(); }} /> : activeLesson ? <StructuredLessonWorkspace lesson={activeLesson} accent={accent} onBack={returnToCourseMap} /> : <CourseDashboard level={activeLevel} lessons={lessons} modules={activeCourse.modules} completedLessons={completedLessons} profile={profile} openLesson={openLesson} canEnter={canEnter} unlocked={levelUnlocked(activeLevel)} />}</main></div>;
}

function SidebarItem({ icon, label, arabic, active, onClick, compact }: { icon: React.ReactNode; label: string; arabic: string; active?: boolean; onClick?: () => void; compact: boolean }) { return <button onClick={onClick} title={label} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition", active ? "bg-[#e7b84a] text-[#253453]" : "text-[#d9e1ef] hover:bg-white/8", compact && "lg:justify-center lg:px-2")}><span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span><span className={cn("flex-1", compact && "lg:hidden")}><span className="block text-sm font-semibold">{label}</span><span dir="rtl" className={cn("arabic block text-xs", active ? "text-[#534016]" : "text-[#9fafc8]")}>{arabic}</span></span></button>; }

export function CourseDashboard({ level, lessons, modules, completedLessons, profile, openLesson, canEnter, unlocked }: { level: ActiveLevel; lessons: LessonDefinition[]; modules?: CourseDefinition["modules"]; completedLessons: Set<number>; profile?: { totalXp: number; currentStreak: number; longestStreak: number } | null; openLesson: (lesson: LessonDefinition) => void; canEnter: (number: number) => boolean; unlocked: boolean }) {
  const percent = Math.round((completedLessons.size / lessons.length) * 100);
  const currentLesson = lessons.find((lesson) => !completedLessons.has(lesson.lessonNumber)) ?? lessons[0];
  const mentorPreview = buildCourseMapMentorPreview(currentLesson);
  const moduleWordBank = buildModuleWordBank({ level, title: "", titleArabic: "", totalLessons: lessons.length, lessonsPerModule: 1, estimatedMinutes: 0, lessons, modules }, currentLesson.moduleNumber, completedLessons);
  const wordBank = summarizeWordBank(moduleWordBank);
  const wordBankKey = `english-journey:word-bank:${level}:module:${currentLesson.moduleNumber}`;
  const [reviewedWordIds, setReviewedWordIds] = useState<Set<string>>(new Set());
  const [wordBankOpen, setWordBankOpen] = useState(false);
  useEffect(() => {
    try { setReviewedWordIds(new Set(JSON.parse(window.localStorage.getItem(wordBankKey) ?? "[]"))); } catch { setReviewedWordIds(new Set()); }
  }, [wordBankKey]);
  const toggleWordReview = (wordId: string, exampleEN: string) => {
    const next = new Set(reviewedWordIds);
    if (next.has(wordId)) next.delete(wordId); else { next.add(wordId); speak(exampleEN, "british"); }
    setReviewedWordIds(next);
    window.localStorage.setItem(wordBankKey, JSON.stringify(Array.from(next)));
  };
  const courseTitle = level === "A1" ? "Build a strong English foundation." : level === "A2" ? "Use English for everyday independence." : level === "B1" ? "Express ideas with more confidence." : level === "B2" ? "Make complex ideas clear and convincing." : "Handle nuance, evidence, and ideas with precision.";
  return <div className="course-grid mx-auto max-w-[1420px] px-5 py-7 lg:px-9 lg:py-10"><section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"><div><div className="rounded-[1.6rem] bg-[#253453] px-6 py-7 text-white shadow-[0_18px_45px_rgba(37,52,83,.14)] sm:px-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d9e4f5]">{level} · Guided learning route</p><h2 className="mt-5 max-w-xl text-3xl font-bold tracking-[-.045em] sm:text-4xl">{courseTitle}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#cbd6eb]">Each lesson has a clear purpose and a route chosen for it: you may discover language, notice a pattern, interact, read, write, review, or show what you can do.</p></div><div className="grid h-16 w-16 place-items-center rounded-full border-4 border-[#e7b84a] text-sm font-bold">{percent}%</div></div>{unlocked ? <div className="mt-7 rounded-2xl bg-white/7 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#b9c6dd]">Your next lesson</p><p className="mt-1 text-lg font-bold">Lesson {String(currentLesson.lessonNumber).padStart(2, "0")} · {currentLesson.title}</p></div><Button onClick={() => openLesson(currentLesson)} className="rounded-xl bg-[#e7b84a] text-[#253453] hover:bg-[#f2ca68]">{mentorPreview?.ctaLabel ?? "Open lesson"} <Play className="ml-1.5 h-4 w-4 fill-current" /></Button></div>{mentorPreview && <div className="mt-4 border-t border-white/10 pt-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#e7b84a]">Before you begin · {mentorPreview.title}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-[#e6edf8]">{mentorPreview.message}</p><p dir="rtl" className="arabic-support mt-2 text-right text-sm leading-6 text-[#f4d38c]">{mentorPreview.messageArabic}</p></div>}</div> : <div className="mt-7 rounded-2xl border border-white/10 bg-white/7 p-4"><div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-[#e7b84a]" /><p className="font-bold">Complete the previous level to unlock {level}.</p></div></div>}</div><div className="mt-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#a2732c]">{level} course map</p><h2 className="mt-1 text-2xl font-bold tracking-[-.04em]">{lessons.length} connected lessons</h2><p dir="rtl" className="arabic-support mt-1 text-right text-sm">لكل درس هدف ومسار مناسب: قد تكتشف اللغة، أو تلاحظ نمطاً، أو تتفاعل، أو تقرأ، أو تكتب، أو تراجع، أو تُظهر ما تستطيع فعله.</p></div><div className="flex flex-wrap items-center justify-end gap-3"><Button variant="outline" onClick={() => setWordBankOpen(true)} className="rounded-xl border-[#d8c49a] bg-[#fffdf7] text-[#293751] hover:bg-[#fff7dc]"><BookOpen className="mr-2 h-4 w-4 text-[#a2732c]" />Open word bank</Button><p className="text-sm font-bold">{completedLessons.size} <span className="font-normal text-[#76839a]">of {lessons.length} complete</span></p></div></div><LearnerCourseMap level={level} lessons={lessons} modules={modules} completedLessons={completedLessons} canEnter={canEnter} openLesson={openLesson} /></div><aside className="h-fit space-y-5 xl:sticky xl:top-24"><div className="rounded-[1.5rem] border border-[#e2d8c5] bg-[#fffdf7] p-5"><p className="text-xs font-bold uppercase tracking-[.17em] text-[#a2732c]">Your momentum</p><div className="mt-5 grid grid-cols-3 gap-2"><Stat value={profile?.totalXp ?? 0} label="XP" /><Stat value={profile?.currentStreak ?? 0} label="day streak" /><Stat value={completedLessons.size} label="lessons" /></div></div><div className="rounded-[1.5rem] bg-[#eef4eb] p-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#38755b]">Prompt-first practice</p><p className="mt-3 text-sm leading-7 text-[#4c6b58]">When you want extra help, copy a lesson-aware prompt and use the AI tool you prefer. The course keeps its quizzes and progress checks inside English Journey.</p></div></aside></section><ModuleWordBankDialog open={wordBankOpen} onOpenChange={setWordBankOpen} level={level} moduleNumber={currentLesson.moduleNumber} entries={moduleWordBank} reviewedWordIds={reviewedWordIds} onToggleReview={toggleWordReview} /></div>;
}

export const WORD_BANK_DIALOG_LAYOUT_CLASS = "top-[5vh] max-h-[90vh] max-w-[min(1280px,calc(100%-1rem))] translate-y-0 overflow-hidden border-[#dfd4bf] bg-[#fffdf7] p-0 sm:top-[6vh] sm:max-w-[min(1280px,calc(100%-2rem))]";
export const WORD_BANK_TABLE_SCROLL_CLASS = "relative isolate max-h-[62vh] overflow-auto px-4 py-4 sm:px-8 sm:py-5 lg:px-10";
export const WORD_BANK_TABLE_LAYOUT_CLASS = "w-full min-w-[1180px] table-fixed border-separate border-spacing-0 text-left";
const WORD_BANK_HEADER_CELL_CLASS = "sticky top-0 z-20 border-b border-[#eadfce] bg-[#fffdf7] px-4 py-4 shadow-[0_1px_0_#eadfce,0_8px_12px_rgba(45,55,72,0.05)]";

export function ModuleWordBankDialog({ open, onOpenChange, level, moduleNumber, entries, reviewedWordIds, onToggleReview }: { open: boolean; onOpenChange: (open: boolean) => void; level: ActiveLevel; moduleNumber: number; entries: ReturnType<typeof buildModuleWordBank>; reviewedWordIds: Set<string>; onToggleReview: (wordId: string, exampleEN: string) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={WORD_BANK_DIALOG_LAYOUT_CLASS}>
      <DialogHeader className="border-b border-[#eadfce] px-5 py-5 text-left sm:px-8 sm:py-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">{level} · Module {moduleNumber}</p>
        <DialogTitle className="text-2xl tracking-[-.035em] text-[#293751]">Module word bank</DialogTitle>
        <DialogDescription className="max-w-3xl leading-6 text-[#68758a]">Review every word from this module. Use the source lesson and example columns to return to a word in context.</DialogDescription>
        <p dir="rtl" className="arabic-support text-right text-sm">راجع كلمات هذه الوحدة كاملةً، ثم عد إلى الدرس المصدر لرؤيتها في السياق.</p>
      </DialogHeader>
      <div aria-label="Module vocabulary table" className={WORD_BANK_TABLE_SCROLL_CLASS}>
        <table className={WORD_BANK_TABLE_LAYOUT_CLASS}>
          <thead className="relative z-20 text-[10px] font-bold uppercase tracking-[.13em] text-[#8a6d45]">
            <tr>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[23%]")}>Word</th>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[17%] text-right")}>Arabic</th>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[15%]")}>Pronunciation</th>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[25%]")}>Context</th>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[9%]")}>Source</th>
              <th className={cn(WORD_BANK_HEADER_CELL_CLASS, "w-[11%] text-right")}>Review</th>
            </tr>
          </thead>
          <tbody>{entries.map((word) => <tr key={`${word.id}:${word.introducedLessonNumber}`} className="align-top hover:bg-[#faf6ee]">
            <td className="break-words border-b border-[#f0e8dc] px-4 py-4"><p className="font-bold text-[#293751]">{word.word}</p><p className="mt-1 text-xs leading-5 text-[#68758a]">{word.partOfSpeech} · {word.definition}</p></td>
            <td dir="rtl" className="arabic-support break-words border-b border-[#f0e8dc] px-4 py-4 text-right text-sm leading-7">{word.arabic}</td>
            <td className="border-b border-[#f0e8dc] px-4 py-4 text-xs leading-5 text-[#68758a]"><p className="font-semibold text-[#a2732c]">{word.ipa}</p><p className="mt-1">{word.phoneticRespelling}</p></td>
            <td className="break-words border-b border-[#f0e8dc] px-4 py-4 text-xs leading-5 text-[#526077]">{word.exampleEN}</td>
            <td className="border-b border-[#f0e8dc] px-4 py-4 text-xs font-semibold text-[#68758a]">Lesson {String(word.introducedLessonNumber).padStart(2, "0")}</td>
            <td className="border-b border-[#f0e8dc] px-4 py-4 text-right"><button type="button" onClick={() => onToggleReview(word.id, word.exampleEN)} aria-pressed={reviewedWordIds.has(word.id)} className={cn("rounded-lg px-3 py-2 text-xs font-bold transition", reviewedWordIds.has(word.id) ? "bg-[#dcefe1] text-[#277350]" : "bg-[#fff0bd] text-[#765618] hover:bg-[#f9df8b]")}>{reviewedWordIds.has(word.id) ? "Reviewed" : "Review + play"}</button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </DialogContent>
  </Dialog>;
}

function Stat({ value, label }: { value: number; label: string }) { return <div className="rounded-xl bg-[#f5f0e6] px-2 py-3 text-center"><p className="text-lg font-bold text-[#293751]">{value}</p><p className="mt-0.5 text-[10px] font-semibold text-[#7c899e]">{label}</p></div>; }

export default function Home() { return <AppShell />; }
