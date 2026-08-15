import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import type { CefrLevel, LessonDefinition } from "@shared/course";
import { CheckCircle2, Trophy } from "lucide-react";
import { useState } from "react";

type Question = { id: string; type: string; prompt: string; promptArabic: string; choices: string[] };
type Assessment = { assessmentInstanceId: number; questions: Question[] };

export function QuizPractice({ lesson, level = "A1" }: { lesson: LessonDefinition; level?: CefrLevel }) {
  const utils = trpc.useUtils();
  const [moduleMode, setModuleMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const lessonQuery = trpc.course.lessonQuiz.useQuery({ level, lessonNumber: lesson.lessonNumber });
  const moduleQuery = trpc.course.moduleTest.useQuery({ level, moduleNumber: lesson.moduleNumber }, { enabled: moduleMode });
  const refreshLearningState = () => Promise.all([utils.course.dashboard.invalidate(), utils.course.warmup.invalidate()]);
  const submitLesson = trpc.course.submitLessonQuiz.useMutation({ onSuccess: refreshLearningState });
  const submitModule = trpc.course.submitModuleTest.useMutation({ onSuccess: refreshLearningState });
  const assessment = (moduleMode ? moduleQuery.data : lessonQuery.data) as Assessment | undefined;
  const questions = assessment?.questions;
  const result = moduleMode ? submitModule.data : submitLesson.data;
  const busy = submitLesson.isPending || submitModule.isPending;
  const submit = () => {
    if (!questions) return;
    if (!assessment) return;
    if (moduleMode) submitModule.mutate({ level, moduleNumber: lesson.moduleNumber, assessmentInstanceId: assessment.assessmentInstanceId, answers });
    else submitLesson.mutate({ level, lessonNumber: lesson.lessonNumber, assessmentInstanceId: assessment.assessmentInstanceId, answers });
  };
  if (lessonQuery.isLoading || (moduleMode && moduleQuery.isLoading)) return <div className="rounded-2xl bg-[#f4efe3] p-6 text-sm text-[#64718a]">Preparing your assessment…</div>;
  if (lessonQuery.error) return <div className="rounded-2xl bg-[#fff4e4] p-6 text-sm text-[#8a5a18]">{lessonQuery.error.message}</div>;
  return <div className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-[#253453] p-5 text-white"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7b84a]">{moduleMode ? `Module ${lesson.moduleNumber} test` : "Lesson checkpoint"}</p><h3 className="mt-2 text-2xl font-bold">Show what you know</h3><p dir="rtl" className="arabic mt-2 text-right text-sm text-[#cbd6eb]">تحتاج إلى 80٪ للانتقال. ستظهر الكلمات الصعبة في المراجعة.</p></div>{lesson.lessonNumber % 5 === 0 && <button onClick={() => { setModuleMode((value) => !value); setAnswers({}); }} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold">{moduleMode ? "Lesson quiz" : "Module test"}</button>}</div>{questions?.map((question, index) => <article key={question.id} className="rounded-2xl border border-[#e5ddcf] bg-[#fffdf7] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">{question.type} · {index + 1}</p><p className="mt-3 font-bold">{question.prompt}</p><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#728098]">{question.promptArabic}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{question.choices.map((choice) => <button key={choice} onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))} className={cn("rounded-xl border p-3 text-left text-sm font-semibold transition", answers[question.id] === choice ? "border-[#bf7f2f] bg-[#fff0bd] text-[#765618]" : "border-[#e6ddcc] bg-[#fffdfa] hover:border-[#d4ba84]")}>{choice}</button>)}</div></article>)}<Button onClick={submit} disabled={busy || !questions?.length || questions.some((question) => !answers[question.id])} className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">{busy ? "Checking your answers…" : moduleMode ? "Submit module test" : "Submit & unlock"}</Button>{result && <div className={cn("rounded-2xl p-5", result.passed ? "bg-[#e9f2ec] text-[#38755b]" : "bg-[#fff0bd] text-[#765618]")}><div className="flex items-center gap-2"><Trophy className="h-5 w-5" /><p className="text-2xl font-bold">{result.passed ? "Passed" : "Keep practising"} · {result.xpAwarded ? `+${result.xpAwarded} XP` : "Try again"}</p></div><p dir="rtl" className="arabic mt-2 text-right text-sm">{result.passed ? "أحسنت! تم فتح الخطوة التالية." : "راجع الكلمات التي أخطأت فيها ثم حاول مرة أخرى."}</p>{result.passed && <CheckCircle2 className="mt-3 h-5 w-5" />}</div>}</div>;
}
