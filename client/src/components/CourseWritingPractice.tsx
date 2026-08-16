import { ExternalAiPromptPanel } from "@/components/ExternalAiPromptPanel";
import { buildWritingFeedbackPrompt, writingTaskFor } from "@/lib/external-ai-prompts";
import type { LessonDefinition } from "@shared/course";
import { useEffect, useMemo, useState } from "react";

export function CourseWritingPractice({ lesson }: { lesson: LessonDefinition }) {
  const [draft, setDraft] = useState("");
  const task = useMemo(() => writingTaskFor(lesson), [lesson]);

  useEffect(() => { setDraft(""); }, [lesson.lessonNumber, lesson.level]);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-[#fff0bd] p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8d6415]">Writing studio · {lesson.level}</p>
        <h3 className="mt-2 text-xl font-bold text-[#5d491d]">{task.title}</h3>
        <p className="mt-5 font-medium leading-7 text-[#44391d]">{task.instructions}</p>
        <p dir="rtl" className="arabic mt-2 text-right text-sm leading-7 text-[#725d2b]">{task.instructionsArabic}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-[#715d2b]">Target: {task.targetLength}</span>
          {task.usefulWords.map((word) => <span key={word} className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-[#715d2b]">{word}</span>)}
        </div>
      </div>

      <div>
        <label htmlFor="external-ai-writing-draft" className="text-sm font-bold text-[#34425b]">Your draft</label>
        <textarea id="external-ai-writing-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write your response in English…" className="mt-3 min-h-64 w-full rounded-2xl border border-[#e3d3a7] bg-[#fffef9] p-5 leading-7 outline-none focus:border-[#bf7f2f]" />
        <p className="mt-2 text-xs text-[#7c6e4a]">{draft.trim() ? draft.trim().split(/\s+/).length : 0} words · Your draft stays in this browser until you copy it yourself.</p>
      </div>

      <ExternalAiPromptPanel
        title="Ask an external AI for writing feedback"
        description="Your current draft is included in the prompt. Copy it only when you are ready to share the draft with the AI service you choose."
        descriptionArabic="يتضمن الطلب مسودتك الحالية. انسخه فقط عندما تكون مستعداً لمشاركة المسودة مع خدمة الذكاء الاصطناعي التي تختارها."
        prompt={buildWritingFeedbackPrompt({ lesson, draft })}
      />
    </section>
  );
}
