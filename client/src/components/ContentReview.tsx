import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { BookOpen, ClipboardList, FileText, Languages, Loader2, PenLine, ScrollText } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

export type ReviewLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ReviewTab = "overview" | "language" | "practice" | "assessment";
type ReviewDetail = any;

export function buildReviewRequestPlan(level: ReviewLevel = "A1", lessonNumber = 1) {
  return {
    catalog: { procedure: "admin.catalog", input: undefined },
    lesson: { procedure: "admin.lesson", input: { level, lessonNumber } },
  } as const;
}

export function isReviewDetailResolved(detail: ReviewDetail | null | undefined) {
  return Boolean(detail?.lesson?.title && Array.isArray(detail?.vocabulary) && Array.isArray(detail?.grammar) && Array.isArray(detail?.assessments));
}

export function isReviewCatalogResolved(catalog: any[] | null | undefined) {
  return Boolean(catalog?.length && catalog.every((level) => level?.code && Array.isArray(level.modules) && typeof level.totalLessons === "number"));
}

export function reviewDispatchStatus(catalog: any[] | null | undefined, detail: ReviewDetail | null | undefined) {
  return { catalogLoaded: isReviewCatalogResolved(catalog), lessonLoaded: isReviewDetailResolved(detail) };
}

const tabs: Array<{ id: ReviewTab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Lesson brief", icon: <BookOpen /> },
  { id: "language", label: "Words & grammar", icon: <Languages /> },
  { id: "practice", label: "Reading & writing", icon: <PenLine /> },
  { id: "assessment", label: "Assessment bank", icon: <ClipboardList /> },
];

export type ReviewInitialData = { catalog: any[]; detail: ReviewDetail; selectedLevel?: ReviewLevel; selectedLesson?: number };

export function ContentReview({ onOpenCourse, initialData }: { onOpenCourse: (level: ReviewLevel, lessonNumber: number) => void; initialData?: ReviewInitialData }) {
  const utils = trpc.useUtils();
  const [catalog, setCatalog] = useState<any[] | null>(initialData?.catalog ?? null);
  const [catalogError, setCatalogError] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ReviewLevel>(initialData?.selectedLevel ?? "A1");
  const [selectedLesson, setSelectedLesson] = useState(initialData?.selectedLesson ?? 1);
  const [tab, setTab] = useState<ReviewTab>("overview");
  const [detail, setDetail] = useState<ReviewDetail | null>(initialData?.detail ?? null);
  const [detailLoading, setDetailLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setCatalogError(false);
    const requestPlan = buildReviewRequestPlan();
    void requestPlan;
    utils.admin.catalog.fetch()
      .then(data => { if (!cancelled) setCatalog(data); })
      .catch(() => { if (!cancelled) setCatalogError(true); });
    return () => { cancelled = true; };
  }, [initialData, utils]);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setDetailLoading(true);
    setDetail(null);
    utils.admin.lesson.fetch({ level: selectedLevel, lessonNumber: selectedLesson })
      .then(data => { if (!cancelled) setDetail(data); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [initialData, selectedLesson, selectedLevel, utils]);

  const activeLevel = useMemo(
    () => catalog?.find(level => level.code === selectedLevel),
    [catalog, selectedLevel],
  );

  useEffect(() => {
    if (!catalog?.length) return;
    if (!activeLevel) {
      const first = catalog[0];
      setSelectedLevel(first.code as ReviewLevel);
      setSelectedLesson(first.modules[0]?.lessons[0]?.lessonNumber ?? 1);
    }
  }, [activeLevel, catalog]);

  const chooseLevel = (level: ReviewLevel) => {
    const item = catalog?.find(candidate => candidate.code === level);
    setSelectedLevel(level);
    setSelectedLesson(item?.modules[0]?.lessons[0]?.lessonNumber ?? 1);
    setTab("overview");
  };

  if (!catalog && !catalogError) return <LoadingReview />;
  if (catalogError) return <ReviewNotice title="Content review is unavailable" copy="Your administrator account is recognized, but the curriculum catalog could not be loaded. Please refresh once the server is ready." />;

  return (
    <div className="course-grid mx-auto max-w-[1500px] px-5 py-7 lg:px-9 lg:py-10">
      <section className="rounded-[1.7rem] bg-[#253453] px-6 py-7 text-white shadow-[0_18px_45px_rgba(37,52,83,.14)] sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e7b84a]">Administrator · curriculum review</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="text-3xl font-bold tracking-[-.045em] sm:text-4xl">Inspect every completed lesson.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#cbd6eb]">Browse the current A1–B2 course catalog exactly as it is structured for learners: modules, lesson briefs, language targets, reading and writing practice, and reusable assessment questions.</p><p dir="rtl" className="arabic mt-2 max-w-2xl text-right text-sm text-[#cbd6eb]">يمكنك هنا مراجعة المحتوى المنشور حالياً قبل متابعة التوسّع إلى المستويات الأعلى.</p></div>
          <div className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-[#d9e4f5]"><strong className="block text-lg text-white">{catalog?.reduce((sum, level) => sum + level.totalLessons, 0) ?? 0}</strong> completed course lessons in review</div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.5rem] border border-[#e2d8c5] bg-[#fffdf7] p-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
          <p className="px-2 text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Completed levels</p>
          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-1">{catalog?.map(level => <button key={level.code} onClick={() => chooseLevel(level.code as ReviewLevel)} className={cn("rounded-xl border px-3 py-3 text-left transition", selectedLevel === level.code ? "border-[#bf7f2f] bg-[#fff3ce] text-[#253453]" : "border-[#e8dfd0] bg-white hover:border-[#d8c7a8]")}><span className="text-sm font-bold">{level.code} · {level.title}</span><span dir="rtl" className="arabic mt-1 block text-xs text-[#68758a]">{level.titleArabic}</span><span className="mt-2 block text-xs text-[#7d899c]">{level.totalLessons} lessons · {level.modules.length} modules</span></button>)}</div>
          {activeLevel && <div className="mt-6 border-t border-[#ebe3d5] pt-5">{activeLevel.modules.map((module: any) => <div key={module.id} className="mb-4"><p className="px-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#9a7743]">Module {module.moduleNumber} · {module.title}</p><div className="mt-2 space-y-1">{module.lessons.map((lesson: any) => <button key={lesson.id} onClick={() => { setSelectedLesson(lesson.lessonNumber); setTab("overview"); }} className={cn("w-full rounded-lg px-2.5 py-2 text-left text-sm transition", selectedLesson === lesson.lessonNumber ? "bg-[#253453] text-white" : "hover:bg-[#f6f0e5]")}><span className="mr-2 text-xs opacity-70">{String(lesson.lessonNumber).padStart(2, "0")}</span>{lesson.title}</button>)}</div></div>)}</div>}
        </aside>

        <section className="min-w-0 rounded-[1.5rem] border border-[#e2d8c5] bg-[#fffdf7] p-5 sm:p-7">
          {detailLoading ? <LoadingReview /> : !detail ? <ReviewNotice title="Select a lesson" copy="Choose any lesson in the completed A1–B2 catalog to inspect its full stored content." /> : <>
            <div className="flex flex-col gap-4 border-b border-[#ebe3d5] pb-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">{selectedLevel} · Lesson {String(selectedLesson).padStart(2, "0")}{detail.topic ? ` · ${detail.topic.title}` : ""}</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em] text-[#253453]">{detail.lesson.title}</h2><p dir="rtl" className="arabic mt-1 text-right text-base text-[#68758a]">{detail.lesson.titleArabic}</p></div><Button onClick={() => onOpenCourse(selectedLevel, selectedLesson)} className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">Open learner view</Button></div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{tabs.map(item => <button key={item.id} onClick={() => setTab(item.id)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition", tab === item.id ? "bg-[#e7b84a] text-[#253453]" : "bg-[#f2ede2] text-[#59677d] hover:bg-[#e7dfcf]")}><span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{item.icon}</span>{item.label}</button>)}</div>
            <div className="mt-6">{tab === "overview" && <Overview detail={detail} />}{tab === "language" && <Language detail={detail} />}{tab === "practice" && <Practice detail={detail} />}{tab === "assessment" && <Assessment detail={detail} />}</div>
          </>}
        </section>
      </div>
    </div>
  );
}

function Overview({ detail }: { detail: ReviewDetail }) {
  const plan = detail.lesson.learningPlan as { outcome?: { canDo?: string; canDoArabic?: string }; steps?: Array<{ id: string; title: string; purpose: string }> } | null;
  return <div className="space-y-5"><div className="rounded-2xl bg-[#eef4eb] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#397558]">Learning outcome</p><p className="mt-3 text-lg font-semibold text-[#314f3c]">{plan?.outcome?.canDo ?? "Stored lesson outcome"}</p>{plan?.outcome?.canDoArabic && <p dir="rtl" className="arabic mt-2 text-right text-sm text-[#4d6c57]">{plan.outcome.canDoArabic}</p>}</div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Learning route</p><div className="mt-3 grid gap-3 md:grid-cols-2">{plan?.steps?.map((step, index) => <article key={step.id} className="rounded-xl border border-[#e8dfd0] p-4"><span className="text-xs font-bold text-[#bf7f2f]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-2 font-bold text-[#253453]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#68758a]">{step.purpose}</p></article>) ?? <ReviewNotice title="No route stored" copy="This lesson keeps its learning route in the legacy presentation layer." />}</div></div></div>;
}

function Language({ detail }: { detail: ReviewDetail }) {
  return <div className="space-y-7"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Vocabulary · {detail.vocabulary.length} items</p><div className="mt-3 overflow-x-auto rounded-xl border border-[#e8dfd0]"><table className="min-w-full text-left text-sm"><thead className="bg-[#f6f0e5] text-xs uppercase tracking-wide text-[#6f624f]"><tr><th className="px-3 py-3">Target</th><th className="px-3 py-3">Arabic</th><th className="px-3 py-3">Meaning & example</th></tr></thead><tbody>{detail.vocabulary.map((item: any) => <tr key={item.id} className="border-t border-[#eee6d8] align-top"><td className="px-3 py-3 font-bold text-[#253453]"><span className="block">{item.word}</span><span className="mt-1 block text-xs font-normal text-[#718099]">{item.ipa} · {item.partOfSpeech}</span></td><td dir="rtl" className="arabic px-3 py-3 text-right text-[#516078]">{item.arabic}</td><td className="px-3 py-3 text-[#56647a]"><span className="block">{item.definition}</span><span className="mt-2 block text-xs italic text-[#75829a]">“{item.exampleEN}”</span></td></tr>)}</tbody></table></div></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Grammar</p>{detail.grammar.length ? detail.grammar.map((item: any) => <article key={item.id} className="mt-3 rounded-xl border border-[#e8dfd0] p-4"><h3 className="font-bold text-[#253453]">{item.topic}</h3><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#68758a]">{item.arabicName}</p><pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-[#f6f0e5] p-3 text-xs leading-5 text-[#526077]">{JSON.stringify(item.grammarData, null, 2)}</pre></article>) : <ReviewNotice title="No grammar record" copy="This lesson has no dedicated grammar entry in the normalized catalog." />}</div></div>;
}

function Practice({ detail }: { detail: ReviewDetail }) {
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Reading task</p>{detail.readings.map((reading: any) => <article key={reading.id} className="mt-3 rounded-xl border border-[#e8dfd0] p-5"><h3 className="font-bold text-[#253453]">{reading.title}</h3><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#68758a]">{reading.titleArabic}</p><div className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-[#f6f0e5] p-4 text-sm leading-7 text-[#526077]">{reading.passage}</div><p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-[#9a7743]">Comprehension questions</p><ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-[#56647a]">{(reading.questions as Array<{ prompt?: string; question?: string }>).map((question, index) => <li key={index}>{question.prompt ?? question.question ?? JSON.stringify(question)}</li>)}</ol></article>)}</div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Writing task</p>{detail.writingTasks.map((task: any) => <article key={task.id} className="mt-3 rounded-xl border border-[#e8dfd0] p-5"><div className="flex items-center justify-between gap-4"><h3 className="font-bold text-[#253453]">{task.title}</h3><span className="rounded-full bg-[#fff0bd] px-2.5 py-1 text-xs font-bold text-[#765618]">{task.minimumWords}+ words</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#56647a]">{task.instructionsEnglish}</p><p dir="rtl" className="arabic mt-3 whitespace-pre-wrap text-right text-sm leading-7 text-[#68758a]">{task.instructionsArabic}</p><ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#526077]">{task.successCriteria.map((criteria: string) => <li key={criteria}>{criteria}</li>)}</ul></article>)}</div></div>;
}

function Assessment({ detail }: { detail: ReviewDetail }) {
  return <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Reusable lesson assessment bank · {detail.assessments.length} variants</p><div className="mt-3 space-y-3">{detail.assessments.map((item: any) => { const question = item.questionData as { prompt?: string; question?: string; options?: string[] }; return <article key={item.id} className="rounded-xl border border-[#e8dfd0] p-4"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#eef4eb] px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#397558]">{item.itemType}</span><span className="text-xs text-[#748199]">Objective: {item.objectiveKey} · Difficulty {item.difficulty}</span></div><p className="mt-3 font-semibold text-[#253453]">{question.prompt ?? question.question ?? JSON.stringify(question)}</p>{question.options && <ul className="mt-3 grid gap-2 text-sm text-[#56647a]">{question.options.map(option => <li key={option} className="rounded-lg bg-[#f6f0e5] px-3 py-2">{option}</li>)}</ul>}</article>; })}</div></div>;
}

function LoadingReview() { return <div className="grid min-h-72 place-items-center rounded-[1.5rem] border border-[#e2d8c5] bg-[#fffdf7] text-sm font-semibold text-[#68758a]"><span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading completed content…</span></div>; }
function ReviewNotice({ title, copy }: { title: string; copy: string }) { return <div className="rounded-2xl border border-dashed border-[#d9cdb8] bg-[#fbf7ef] p-6 text-center"><ScrollText className="mx-auto h-6 w-6 text-[#bf7f2f]" /><h3 className="mt-3 font-bold text-[#253453]">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68758a]">{copy}</p></div>; }
