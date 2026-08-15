import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import type { LessonDefinition } from "@shared/course";
import { useState } from "react";

type ReadingExercise = {
  title: string;
  titleArabic: string;
  passage: string;
  questions: Array<{ question: string; questionArabic: string; answer: string; explanationArabic: string }>;
};

export function CourseReadingPractice({ lesson }: { lesson: LessonDefinition }) {
  const level = lesson.level === "A2" ? "A2" : "A1";
  const [exercise, setExercise] = useState<ReadingExercise | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const readingMutation = trpc.ai.generateReading.useMutation({
    onSuccess: (data) => {
      setExercise(data);
      setAnswers(data.questions.map(() => ""));
    },
  });
  const gradeMutation = trpc.ai.gradeReading.useMutation();
  const target = level === "A2" ? "160–200" : "80–100";

  if (!exercise) {
    return (
      <section className="rounded-2xl bg-[#eef4eb] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#38755b]">AI reading practice · {level}</p>
        <h3 className="mt-3 max-w-xl text-2xl font-bold">Read a passage that connects today’s language to what you already know.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#52715c]">Your tutor will create an original {target}-word British English text using today’s target language and relevant earlier learning.</p>
        <p dir="rtl" className="arabic mt-3 max-w-2xl text-right text-sm leading-7 text-[#52715c]">سيُنشئ المعلّم نصاً أصلياً مناسباً لمستواك، ثم يشرح إجابات الفهم بالعربية.</p>
        <Button disabled={readingMutation.isPending} onClick={() => readingMutation.mutate({ level, lessonNumber: lesson.lessonNumber })} className="mt-6 rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">
          {readingMutation.isPending ? "Preparing your passage…" : "Generate my reading practice"}
        </Button>
        {readingMutation.error && <p className="mt-3 text-sm text-red-700">{readingMutation.error.message}</p>}
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-[#eef4eb] p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#38755b]">{exercise.title}</p>
        <h3 dir="rtl" className="arabic mt-2 text-right text-xl font-bold text-[#355d48]">{exercise.titleArabic}</h3>
        <p className="mt-6 whitespace-pre-line leading-8 text-[#34425b]">{exercise.passage}</p>
      </div>
      <div className="space-y-4">
        {exercise.questions.map((item, index) => {
          const response = gradeMutation.data?.feedback.answerFeedbackArabic[index];
          return <div key={`${item.question}-${index}`} className="rounded-2xl border border-[#e5ddcf] bg-[#fffdf7] p-5">
            <p className="font-bold">{index + 1}. {item.question}</p>
            <p dir="rtl" className="arabic mt-1 text-right text-sm text-[#758198]">{item.questionArabic}</p>
            <textarea value={answers[index] ?? ""} onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))} placeholder="Write your answer in English…" className="mt-4 min-h-20 w-full rounded-xl border border-[#ddd4c3] bg-[#fffdfa] p-3 text-sm outline-none focus:border-[#bf7f2f]" />
            {response && <p dir="rtl" className={cn("arabic mt-3 rounded-lg p-3 text-right text-xs leading-6", response.correct ? "bg-[#eef7f0] text-[#38755b]" : "bg-[#fff4e4] text-[#8a5a18]")}>{response.feedbackArabic}</p>}
          </div>;
        })}
      </div>
      <Button disabled={gradeMutation.isPending || answers.some((answer) => !answer.trim())} onClick={() => gradeMutation.mutate({ level, lessonNumber: lesson.lessonNumber, passage: exercise.passage, questions: exercise.questions.map((item) => ({ question: item.question, answer: item.answer })), answers })} className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">
        {gradeMutation.isPending ? "Checking your answers…" : "Check my answers"}
      </Button>
      {gradeMutation.data && <p dir="rtl" className="arabic rounded-xl bg-[#fff0bd] p-4 text-right text-sm leading-7 text-[#755b22]">{gradeMutation.data.feedback.feedbackArabic}</p>}
      {gradeMutation.error && <p className="text-sm text-red-700">{gradeMutation.error.message}</p>}
    </section>
  );
}
