import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import type { CefrLevel, LessonDefinition } from "@shared/course";
import { CircleCheck, CircleX, Lightbulb, Trophy } from "lucide-react";
import { useState } from "react";

type Question = { id: string; type: string; prompt: string; promptArabic: string; choices: string[] };
type Assessment = { assessmentInstanceId: number; questions: Question[] };
type ReviewItem = {
  questionId: string;
  prompt: string;
  promptArabic: string;
  selected: string;
  correctAnswer: string;
  isCorrect: boolean;
};
type AssessmentResult = {
  passed: boolean;
  score: number;
  xpAwarded: number;
  questionReview: ReviewItem[];
};

export function QuizPractice({ lesson, level = "A1" }: { lesson: LessonDefinition; level?: CefrLevel }) {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [moduleMode, setModuleMode] = useState(false);
  const [milestoneMode, setMilestoneMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const lessonQuery = trpc.course.lessonQuiz.useQuery(
    { level, lessonNumber: lesson.lessonNumber },
    { enabled: open && !moduleMode && !milestoneMode },
  );
  const milestoneQuery = trpc.course.milestoneQuiz.useQuery(
    { level, lessonNumber: lesson.lessonNumber },
    { enabled: open && milestoneMode },
  );
  const moduleQuery = trpc.course.moduleTest.useQuery(
    { level, moduleNumber: lesson.moduleNumber },
    { enabled: open && moduleMode },
  );
  const refreshLearningState = () => Promise.all([utils.course.dashboard.invalidate(), utils.course.warmup.invalidate()]);
  const submitLesson = trpc.course.submitLessonQuiz.useMutation({ onSuccess: refreshLearningState });
  const submitMilestone = trpc.course.submitMilestoneQuiz.useMutation({ onSuccess: refreshLearningState });
  const submitModule = trpc.course.submitModuleTest.useMutation({ onSuccess: refreshLearningState });
  const assessment = (moduleMode ? moduleQuery.data : milestoneMode ? milestoneQuery.data : lessonQuery.data) as Assessment | undefined;
  const result = (moduleMode ? submitModule.data : milestoneMode ? submitMilestone.data : submitLesson.data) as AssessmentResult | undefined;
  const questions = assessment?.questions ?? [];
  const busy = submitLesson.isPending || submitMilestone.isPending || submitModule.isPending;
  const loading = moduleMode ? moduleQuery.isLoading : milestoneMode ? milestoneQuery.isLoading : lessonQuery.isLoading;
  const error = moduleMode ? moduleQuery.error : milestoneMode ? milestoneQuery.error : lessonQuery.error;
  const resetSession = () => {
    setAnswers({});
    setHints({});
    submitLesson.reset();
    submitMilestone.reset();
    submitModule.reset();
  };
  const startLessonQuiz = () => {
    setModuleMode(false);
    setMilestoneMode(false);
    resetSession();
    setOpen(true);
  };
  const startMilestoneQuiz = () => {
    setModuleMode(false);
    setMilestoneMode(true);
    resetSession();
    setOpen(true);
  };
  const startModuleTest = () => {
    setModuleMode(true);
    setMilestoneMode(false);
    resetSession();
    setOpen(true);
  };
  const submit = () => {
    if (!assessment) return;
    if (moduleMode) {
      submitModule.mutate({
        level,
        moduleNumber: lesson.moduleNumber,
        assessmentInstanceId: assessment.assessmentInstanceId,
        answers,
      });
    } else if (milestoneMode) {
      submitMilestone.mutate({
        level,
        lessonNumber: lesson.lessonNumber,
        assessmentInstanceId: assessment.assessmentInstanceId,
        answers,
      });
    } else {
      submitLesson.mutate({
        level,
        lessonNumber: lesson.lessonNumber,
        assessmentInstanceId: assessment.assessmentInstanceId,
        answers,
      });
    }
  };
  const answeredAll = questions.length > 0 && questions.every((question) => answers[question.id]);
  const lessonsPerModule = level === "A1" ? 15 : 5;
  const isMilestone = lesson.lessonNumber % lessonsPerModule === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e7decf] bg-[#fffdf7] p-4 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">Ready when you are</p>
          <p className="mt-1 text-sm font-semibold text-[#253453]">Finish the lesson, then check your understanding in a focused quiz.</p>
          <p dir="rtl" className="arabic mt-1 text-right text-xs text-[#728098]">بعد أن تنهي الدرس، اختبر فهمك في اختبار قصير ومركّز.</p>
        </div>
        <DialogTrigger asChild>
          <Button onClick={startLessonQuiz} className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">Take lesson quiz</Button>
        </DialogTrigger>
        {isMilestone && (
          <Button onClick={startMilestoneQuiz} variant="outline" className="rounded-xl border-[#bf7f2f] bg-[#fff8e8] text-[#765618] hover:bg-[#fff0bd]">
            Take milestone checkpoint · 15 questions
          </Button>
        )}
      </div>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-hidden border-[#e5ddcf] bg-[#fffdf7] p-0 text-[#253453]">
        <DialogHeader className="border-b border-[#e7decf] bg-[#253453] px-6 py-5 text-left text-white">
          <DialogTitle className="text-2xl font-bold">{moduleMode ? `Module ${lesson.moduleNumber} cumulative test` : milestoneMode ? `Lesson ${lesson.lessonNumber} milestone checkpoint` : `Lesson ${lesson.lessonNumber} checkpoint`}</DialogTitle>
          <DialogDescription className="text-[#d4deef]">Choose the answer that best fits the context. You need 80% to pass.</DialogDescription>
          <p dir="rtl" className="arabic text-right text-sm text-[#f5d678]">اختر الإجابة الأنسب للسياق. تحتاج إلى ٨٠٪ للنجاح.</p>
        </DialogHeader>
        <div className="max-h-[calc(92vh-210px)] overflow-y-auto px-6 py-5">
          {loading && <div className="rounded-xl bg-[#f4efe3] p-5 text-sm text-[#64718a]">Preparing your assessment…</div>}
          {error && <div className="rounded-xl bg-[#fff4e4] p-5 text-sm text-[#8a5a18]">{error.message}</div>}
          {!loading && !error && result && (
            <div className="space-y-5">
              <div className={cn("rounded-2xl p-5", result.passed ? "bg-[#e9f2ec] text-[#38755b]" : "bg-[#fff0bd] text-[#765618]")}>
                <div className="flex items-center gap-3">
                  <Trophy className="h-7 w-7" />
                  <div>
                    <p className="text-2xl font-bold">{result.passed ? "Passed" : "Failed"} · {result.score}%</p>
                    <p className="text-sm font-semibold">{result.passed ? `+${result.xpAwarded} XP · Your next lesson is now available.` : "Review the explanations and try the quiz again."}</p>
                  </div>
                </div>
                <p dir="rtl" className="arabic mt-3 text-right text-sm">{result.passed ? "أحسنت! يمكنك الآن الانتقال إلى الدرس التالي." : "لا بأس. راجع إجاباتك ثم حاول مرة أخرى."}</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-[.14em] text-[#a2732c]">Your answer review</h3>
                {result.questionReview.map((item, index) => (
                  <div key={item.questionId} className={cn("rounded-xl border p-4", item.isCorrect ? "border-[#c8dfd0] bg-[#f3faf5]" : "border-[#eed7b0] bg-[#fff9e9]")}>
                    <div className="flex items-start gap-3">
                      {item.isCorrect ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#397558]" /> : <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-[#b66d2f]" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7755]">Question {index + 1}</p>
                        <p className="mt-1 font-semibold">{item.prompt}</p>
                        <p dir="rtl" className="arabic mt-1 text-right text-xs text-[#728098]">{item.promptArabic}</p>
                        <p className="mt-2 text-sm">Your answer: <strong>{item.selected || "No answer"}</strong></p>
                        {!item.isCorrect && <p className="mt-1 text-sm">Correct answer: <strong>{item.correctAnswer}</strong></p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && !error && !result && (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <article key={question.id} className="rounded-2xl border border-[#e5ddcf] bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">{question.type} · {index + 1}</p>
                      <p className="mt-2 font-bold">{question.prompt}</p>
                      <p dir="rtl" className="arabic mt-1 text-right text-sm text-[#728098]">{question.promptArabic}</p>
                    </div>
                    <button type="button" onClick={() => setHints((current) => ({ ...current, [question.id]: !current[question.id] }))} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#e7decf] px-3 py-1.5 text-xs font-bold text-[#765618] hover:bg-[#fff8e8]" aria-label={`Show Arabic hint for question ${index + 1}`}>
                      <Lightbulb className="h-3.5 w-3.5" /> Hint
                    </button>
                  </div>
                  {hints[question.id] && <div className="mt-3 rounded-xl bg-[#fff8e8] p-3 text-sm text-[#765618]"><p>Hint: read the whole sentence and ask what meaning or grammar form fits the context.</p><p dir="rtl" className="arabic mt-1 text-right">تلميح: اقرأ الجملة كاملة وفكّر في المعنى أو القاعدة النحوية التي تناسب السياق. لن نكشف الإجابة.</p></div>}
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">{question.choices.map((choice) => <button key={choice} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))} className={cn("rounded-xl border p-3 text-left text-sm font-semibold transition", answers[question.id] === choice ? "border-[#bf7f2f] bg-[#fff0bd] text-[#765618]" : "border-[#e6ddcc] bg-[#fffdfa] hover:border-[#d4ba84]")}>{choice}</button>)}</div>
                </article>
              ))}
              {!!questions.length && <Button onClick={submit} disabled={busy || !answeredAll} className="w-full rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">{busy ? "Checking your answers…" : moduleMode ? "Submit cumulative test" : milestoneMode ? "Submit milestone checkpoint" : "Submit quiz"}</Button>}
            </div>
          )}
        </div>
        {result && <DialogFooter className="border-t border-[#e7decf] bg-[#fffaf0] px-6 py-4"><DialogClose asChild><Button className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">{result.passed ? "Continue to next lesson" : "Close and try again"}</Button></DialogClose></DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
