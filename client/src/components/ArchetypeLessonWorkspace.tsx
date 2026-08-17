import { CourseReadingPractice } from "@/components/CourseReadingPractice";
import { CourseWritingPractice } from "@/components/CourseWritingPractice";
import { ExternalAiPromptPanel } from "@/components/ExternalAiPromptPanel";
import { LessonSemanticCard } from "@/components/LessonSemanticCard";
import { QuizPractice } from "@/components/QuizPractice";
import { buildSentenceReviewPrompt, buildWordHelpPrompt } from "@/lib/external-ai-prompts";
import type { CefrLevel, LessonDefinition, LessonExperienceStage, VocabularyItem } from "@shared/course";
import { ArrowLeft, CheckCircle2, Volume2 } from "lucide-react";
import React, { useState } from "react";

type Accent = "british" | "american";

const stageDetails: Record<LessonExperienceStage, { label: string; arabic: string; semantic: "objective" | "vocabulary" | "grammar" | "activity" | "retrieval" | "assessment" | "tip" }> = {
  orientation: { label: "Know the purpose", arabic: "اعرف الهدف", semantic: "objective" },
  encounter: { label: "Meet the English", arabic: "تعرّف إلى الإنجليزية", semantic: "vocabulary" },
  notice: { label: "Notice one pattern", arabic: "لاحظ نمطاً واحداً", semantic: "grammar" },
  "supported-practice": { label: "Try with support", arabic: "جرّب مع الدعم", semantic: "activity" },
  "meaningful-use": { label: "Use it for a reason", arabic: "استخدمها لهدف", semantic: "activity" },
  retrieval: { label: "Bring it back", arabic: "استدعِ ما تعلّمته", semantic: "retrieval" },
  evidence: { label: "Show what you can do", arabic: "أظهر ما تستطيع فعله", semantic: "assessment" },
  "next-bridge": { label: "Carry it forward", arabic: "خذه إلى الدرس القادم", semantic: "tip" },
};

function speak(text: string, accent: Accent, rate = 0.82) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === "british" ? "en-GB" : "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function ArchetypeLessonWorkspace({ lesson, accent, onBack }: { lesson: LessonDefinition; accent: Accent; onBack: () => void }) {
  const experience = lesson.experience;
  const [selectedWord, setSelectedWord] = useState<VocabularyItem>(lesson.words[0]);
  const [question, setQuestion] = useState("");
  const [sentence, setSentence] = useState("");

  if (!experience) return null;

  const scrollTo = (stage: LessonExperienceStage) => document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const mentorWelcome = lesson.mentorGuide?.moments.find((moment) => moment.id === "welcome");

  const renderStage = (stage: LessonExperienceStage) => {
    const detail = stageDetails[stage];
    const common = { semantic: detail.semantic, title: detail.label, titleArabic: detail.arabic } as const;

    switch (stage) {
      case "orientation":
        return <LessonSemanticCard {...common}><p>{experience.firstView.whatToDo}</p><p dir="rtl" className="arabic mt-3 text-right">{experience.firstView.whatMatters}</p></LessonSemanticCard>;
      case "encounter":
        return <LessonSemanticCard {...common}><p>Listen to one word at a time. Choose a word to see its meaning, Arabic support, and a real example.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => <button key={word.id} type="button" onClick={() => setSelectedWord(word)} className={`rounded-xl border p-4 text-left transition ${selectedWord.id === word.id ? "border-[#72a783] bg-white shadow-sm" : "border-[#d9e5da] bg-white/60 hover:bg-white"}`}><div className="flex items-start justify-between gap-3"><span className="text-lg font-bold text-[#253453]">{word.word}</span><button type="button" aria-label={`Play ${word.word}`} onClick={(event) => { event.stopPropagation(); speak(word.word, accent); }} className="grid h-8 w-8 place-items-center rounded-full border border-[#c5d9ca] bg-[#f7fbf7] text-[#316647]"><Volume2 className="h-4 w-4" /></button></div><p dir="rtl" className="arabic mt-2 text-right font-semibold text-[#397558]">{word.arabic}</p><p className="mt-2 text-xs leading-5 text-[#526078]">{word.definition}</p></button>)}</div><LessonSemanticCard semantic="example" className="mt-4" title={selectedWord.word}><p>{selectedWord.exampleEN}</p><p dir="rtl" className="arabic mt-2 text-right">{selectedWord.exampleAR}</p></LessonSemanticCard><div className="mt-4"><ExternalAiPromptPanel title="Ask your chosen AI about this word" description="Copy a focused bilingual explanation prompt. The site does not send your question to any model." descriptionArabic="انسخ طلباً ثنائي اللغة للكلمة المحددة. لا يرسل الموقع سؤالك إلى أي نموذج." prompt={buildWordHelpPrompt({ lesson, word: selectedWord, question })} /></div></LessonSemanticCard>;
      case "notice":
        return <LessonSemanticCard {...common} title={lesson.grammar.topic} titleArabic={lesson.grammar.arabicName}><p>{lesson.grammar.concept}</p><p dir="rtl" className="arabic mt-3 border-t border-current/15 pt-3 text-right">{lesson.grammar.arabicComparison}</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{(["positive", "negative", "question"] as const).map((form) => <div key={form} className="rounded-xl border border-current/15 bg-white/60 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em]">{form}</p><p className="mt-2 text-sm font-semibold">{lesson.grammar.structure[form]}</p></div>)}</div><LessonSemanticCard semantic="example" className="mt-4" title="See it in use"><p>{lesson.grammar.examples[0]?.en}</p><p dir="rtl" className="arabic mt-2 text-right">{lesson.grammar.examples[0]?.ar}</p></LessonSemanticCard></LessonSemanticCard>;
      case "supported-practice":
        return <LessonSemanticCard {...common}><p>Read the model aloud, then change one word to make it true for you.</p><div className="mt-4 rounded-xl border border-current/15 bg-white/60 p-4"><p className="font-semibold text-[#253453]">{lesson.grammar.examples[0]?.en}</p><p dir="rtl" className="arabic mt-2 text-right text-sm text-[#526078]">{lesson.grammar.examples[0]?.ar}</p><button type="button" onClick={() => speak(lesson.grammar.examples[0]?.en ?? selectedWord.word, accent)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-current/20 bg-white px-3 py-2 text-sm font-bold"><Volume2 className="h-4 w-4" /> Listen, then repeat</button></div></LessonSemanticCard>;
      case "meaningful-use":
        return <LessonSemanticCard {...common}><p>Use today’s language for a small real purpose. A short, clear message is better than a long difficult one.</p><div className="mt-4"><CourseWritingPractice lesson={lesson} /></div><div className="mt-4 rounded-xl border border-current/15 bg-white/60 p-4"><label className="text-sm font-bold text-[#253453]" htmlFor="archetype-sentence">Your own sentence</label><textarea id="archetype-sentence" value={sentence} onChange={(event) => setSentence(event.target.value)} placeholder="Write one useful sentence…" className="mt-3 min-h-24 w-full rounded-lg border border-[#cdd8cf] bg-white p-3 text-sm text-[#253453] outline-none focus:border-[#397558]" /><div className="mt-3"><ExternalAiPromptPanel title="Ask an external AI for helpful feedback" description="Copy a bilingual formative-feedback prompt when you are ready." descriptionArabic="انسخ طلب ملاحظات تعليمية ثنائي اللغة عندما تكون مستعداً." prompt={buildSentenceReviewPrompt({ lesson, sentence })} /></div></div></LessonSemanticCard>;
      case "retrieval":
        return <LessonSemanticCard {...common}><p>Before moving on, say or write one useful item from an earlier lesson that fits naturally here. Retrieval is a bridge, not a forced list.</p><div className="mt-4 flex flex-wrap gap-2">{lesson.words.slice(0, 3).map((word) => <button key={word.id} type="button" onClick={() => speak(word.word, accent)} className="rounded-full border border-current/20 bg-white px-3 py-1.5 text-sm font-bold text-[#346565]">{word.word}<span className="sr-only">: play word</span></button>)}</div></LessonSemanticCard>;
      case "evidence":
        return <LessonSemanticCard {...common}><p>The check asks you to recognise and use the language in context. Review the feedback, then try again if needed.</p><div className="mt-5"><QuizPractice lesson={lesson} level={lesson.level as CefrLevel} /></div></LessonSemanticCard>;
      case "next-bridge":
        return <LessonSemanticCard {...common}><p>{experience.firstView.whatNext}</p><p dir="rtl" className="arabic mt-3 text-right">احتفِ بالنجاح الصغير اليوم، ثم خذ هذه اللغة إلى الدرس التالي.</p></LessonSemanticCard>;
    }
  };

  return <main className="mx-auto max-w-[1280px] px-5 py-7 lg:px-9 lg:py-9">
    <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#63718a] hover:text-[#253453]"><ArrowLeft className="h-4 w-4" /> Back to course</button>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <section className="min-w-0 space-y-5">
        <header className="rounded-[1.8rem] border border-[#e2d8c5] bg-[#fffdf7] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a2732c]">Module {lesson.moduleNumber} · Lesson {String(lesson.lessonNumber).padStart(2, "0")} · {experience.archetype} lesson</p><h1 className="mt-3 text-3xl font-bold tracking-[-.045em] text-[#253453]">{lesson.title}</h1><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#708098]">{lesson.titleArabic}</p><LessonSemanticCard semantic="objective" className="mt-5" title={experience.firstView.whatItIs}><p><strong>What you do:</strong> {experience.firstView.whatToDo}</p><p className="mt-2"><strong>What matters:</strong> {experience.firstView.whatMatters}</p><p className="mt-2"><strong>What is next:</strong> {experience.firstView.whatNext}</p></LessonSemanticCard>{mentorWelcome ? <LessonSemanticCard semantic="tip" className="mt-4" title={mentorWelcome.title} titleArabic="كلمة من المرشد"><p>{mentorWelcome.message}</p><p dir="rtl" className="arabic mt-3 border-t border-current/15 pt-3 text-right">{mentorWelcome.messageArabic}</p></LessonSemanticCard> : null}</header>
        {experience.selectedStages.map((stage, index) => <section id={`stage-${stage}`} key={stage} className="scroll-mt-8"><p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[#8a7760]">Part {index + 1} of {experience.selectedStages.length}</p>{renderStage(stage)}</section>)}
      </section>
      <aside className="h-fit space-y-4 xl:sticky xl:top-24"><nav aria-label="This lesson’s route" className="rounded-2xl border border-[#e4dbca] bg-[#fffdf7] p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">This lesson’s route</p><p dir="rtl" className="arabic mt-1 text-right text-xs text-[#708098]">مسار هذا الدرس</p><div className="mt-4 space-y-1">{experience.selectedStages.map((stage, index) => <button type="button" key={stage} onClick={() => scrollTo(stage)} className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-[#526078] hover:bg-[#f7f3e9]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#397558]" /><span><span className="block text-sm font-bold">{index + 1}. {stageDetails[stage].label}</span><span dir="rtl" className="arabic mt-0.5 block text-xs">{stageDetails[stage].arabic}</span></span></button>)}</div></nav><LessonSemanticCard semantic="tip" title="A calm reminder"><p>You do not need every skill in every lesson. Do the route shown today, then return to English tomorrow.</p><p dir="rtl" className="arabic mt-3 text-right">لا تحتاج إلى كل المهارات في كل درس. اتبع مسار اليوم، ثم عد إلى الإنجليزية غداً.</p></LessonSemanticCard></aside>
    </div>
  </main>;
}
