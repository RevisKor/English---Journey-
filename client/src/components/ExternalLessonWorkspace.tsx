import { Button } from "@/components/ui/button";
import { CourseReadingPractice } from "@/components/CourseReadingPractice";
import { CourseWritingPractice } from "@/components/CourseWritingPractice";
import { ExternalAiPromptPanel } from "@/components/ExternalAiPromptPanel";
import { QuizPractice } from "@/components/QuizPractice";
import { buildSentenceReviewPrompt, buildWordHelpPrompt } from "@/lib/external-ai-prompts";
import { cn } from "@/lib/utils";
import type { CefrLevel, LessonDefinition, VocabularyItem } from "@shared/course";
import { ArrowLeft, BookOpen, Headphones, Languages, PenLine, Trophy, Volume2 } from "lucide-react";
import React, { useState } from "react";

type Accent = "british" | "american";
type Tab = "words" | "grammar" | "speak" | "reading" | "writing" | "quiz";

const tabs: Array<{ id: Tab; label: string; arabic: string; icon: React.ReactNode }> = [
  { id: "words", label: "Words", arabic: "الكلمات", icon: <Languages /> },
  { id: "grammar", label: "Grammar", arabic: "القواعد", icon: <BookOpen /> },
  { id: "speak", label: "Speak", arabic: "النطق", icon: <Headphones /> },
  { id: "reading", label: "Read", arabic: "القراءة", icon: <BookOpen /> },
  { id: "writing", label: "Write", arabic: "الكتابة", icon: <PenLine /> },
  { id: "quiz", label: "Quiz", arabic: "اختبار", icon: <Trophy /> },
];

function speak(text: string, accent: Accent, rate = 0.82) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === "british" ? "en-GB" : "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function ExternalLessonWorkspace({ lesson, accent, onBack }: { lesson: LessonDefinition; accent: Accent; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("words");
  const [selectedWord, setSelectedWord] = useState<VocabularyItem>(lesson.words[0]);
  const [question, setQuestion] = useState("");
  const [sentence, setSentence] = useState("");
  const [rate, setRate] = useState(0.82);

  if (tab === "quiz") return <div className="mx-auto max-w-4xl px-5 py-8 lg:px-9"><button onClick={() => setTab("words")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#63718a] hover:text-[#253453]"><ArrowLeft className="h-4 w-4" /> Back to lesson</button><QuizPractice lesson={lesson} level={lesson.level as CefrLevel} /></div>;

  return (
    <main className="mx-auto max-w-[1420px] px-5 py-7 lg:px-9 lg:py-9">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#63718a] hover:text-[#253453]"><ArrowLeft className="h-4 w-4" /> Back to course</button>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 overflow-hidden rounded-[1.6rem] border border-[#e2d8c5] bg-[#fffdf7]">
          <div className="border-b border-[#eee6d9] px-5 pt-5 sm:px-7 sm:pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a2732c]">Module {lesson.moduleNumber} · lesson {String(lesson.lessonNumber).padStart(2, "0")}</p><h1 className="mt-1 text-3xl font-bold tracking-[-.045em]">{lesson.title}</h1><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#708098]">{lesson.titleArabic}</p></div><div className="rounded-full bg-[#e9f2ec] px-3 py-1.5 text-xs font-bold text-[#38755b]">{lesson.words.length} target words</div></div>
            <nav aria-label="Lesson sections" className="mt-7 flex gap-1 overflow-x-auto pb-px">{tabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={cn("relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-bold", tab === item.id ? "text-[#253453]" : "text-[#8c97a8] hover:text-[#526078]")}>{item.icon}<span>{item.label}</span><span dir="rtl" className="arabic text-xs font-medium">{item.arabic}</span>{tab === item.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#bf7f2f]" />}</button>)}</nav>
          </div>
          <div className="p-5 sm:p-7">
            {tab === "words" && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => <button key={word.id} onClick={() => setSelectedWord(word)} className={cn("rounded-2xl border p-4 text-left transition", selectedWord.id === word.id ? "border-[#d3b36a] bg-[#fff8e9] ring-2 ring-[#e7b84a]/35" : "border-[#e6ddcc] bg-[#fffdf7] hover:border-[#d3b36a]")}><div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.13em] text-[#a2732c]">{word.partOfSpeech}</span><span role="button" tabIndex={0} aria-label={`Play ${word.word}`} onClick={(event) => { event.stopPropagation(); speak(word.word, accent, rate); }} onKeyDown={(event) => { if (event.key === "Enter") speak(word.word, accent, rate); }} className="grid h-8 w-8 place-items-center rounded-full bg-[#edf1e7] text-[#38755b]"><Volume2 className="h-4 w-4" /></span></div><p className="mt-6 text-xl font-bold text-[#253453]">{word.word}</p><p className="mt-1 text-xs text-[#748198]">{word.ipa} · {word.phoneticRespelling}</p><p dir="rtl" className="arabic mt-4 text-right text-base font-bold text-[#397558]">{word.arabic}</p><p className="mt-3 text-xs leading-5 text-[#526078]">{word.definition}</p></button>)}</div><aside className="h-fit space-y-4 lg:sticky lg:top-24"><div className="rounded-2xl bg-[#253453] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7b84a]">Selected word</p><p className="mt-4 text-2xl font-bold">{selectedWord.word}</p><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#cbd6eb]">{selectedWord.arabic}</p><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about meaning, spelling, synonyms, or examples…" className="mt-5 min-h-24 w-full rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-white placeholder:text-[#b7c2d8] outline-none focus:border-[#e7b84a]" /></div><ExternalAiPromptPanel title="Ask your chosen AI about this word" description="Copy a focused bilingual explanation prompt for the selected word. The site does not send your question to any model." descriptionArabic="انسخ طلباً ثنائي اللغة للكلمة المحددة. لا يرسل الموقع سؤالك إلى أي نموذج." prompt={buildWordHelpPrompt({ lesson, word: selectedWord, question })} /></aside></div>}
            {tab === "grammar" && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div><div className="rounded-2xl bg-[#eef4eb] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#38755b]">Today’s grammar</p><h2 className="mt-2 text-2xl font-bold">{lesson.grammar.topic}</h2><p dir="rtl" className="arabic mt-2 text-right font-semibold text-[#416b54]">{lesson.grammar.arabicName}</p><p className="mt-4 leading-7 text-[#526078]">{lesson.grammar.concept}</p><p dir="rtl" className="arabic mt-3 border-t border-[#d5e6d8] pt-3 text-right text-sm leading-7 text-[#52715c]">{lesson.grammar.arabicComparison}</p></div><div className="mt-5 grid gap-4 sm:grid-cols-3">{(["positive", "negative", "question"] as const).map((form) => <div key={form} className="rounded-xl border border-[#e5ddcf] bg-[#fffdf7] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a2732c]">{form}</p><p className="mt-3 text-sm font-bold text-[#34425b]">{lesson.grammar.structure[form]}</p></div>)}</div><div className="mt-5 space-y-3">{lesson.grammar.examples.map((example) => <button key={example.en} onClick={() => speak(example.en, accent, rate)} className="block w-full rounded-xl border border-[#e6dece] bg-[#fffdf7] p-4 text-left hover:bg-[#fcf9f1]"><p className="font-semibold">{example.en}</p><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#778399]">{example.ar}</p></button>)}</div></div><aside className="h-fit space-y-4 lg:sticky lg:top-24"><div className="rounded-2xl border border-[#e5ddcf] bg-[#fffdf7] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">Try a sentence</p><textarea value={sentence} onChange={(event) => setSentence(event.target.value)} placeholder="Write one sentence with today’s grammar…" className="mt-4 min-h-28 w-full rounded-xl border border-[#ddd4c3] bg-[#fffdfa] p-3 text-sm outline-none focus:border-[#bf7f2f]" /></div><ExternalAiPromptPanel title="Ask an external AI to review your sentence" description="Copy the sentence-review prompt whenever you are ready. It asks for simple bilingual formative feedback." descriptionArabic="انسخ طلب مراجعة الجملة عندما تكون مستعداً. يطلب ملاحظات تعليمية بسيطة باللغتين." prompt={buildSentenceReviewPrompt({ lesson, sentence })} /></aside></div>}
            {tab === "speak" && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div><div className="rounded-2xl bg-[#253453] p-6 text-white"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7b84a]">Listen carefully</p><h2 className="mt-2 text-2xl font-bold">{accent === "british" ? "British" : "American"} pronunciation</h2><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#c6d2e7]">استمع ثم كرر بصوت مرتفع.</p></div><button onClick={() => speak(selectedWord.word, accent, rate)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e7b84a] text-[#253453] active:scale-95"><Volume2 className="h-5 w-5" /></button></div><div className="mt-6"><div className="flex justify-between text-xs text-[#bdcae0]"><span>Slow</span><span>{Math.round(rate * 100)}% speed</span><span>Natural</span></div><input aria-label="Pronunciation speed" type="range" min="0.55" max="1" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))} className="mt-2 w-full accent-[#e7b84a]" /></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => <button key={word.id} onClick={() => { setSelectedWord(word); speak(word.word, accent, rate); }} className={cn("flex items-center justify-between rounded-xl border p-4 text-left transition hover:border-[#b9d8c4]", selectedWord.id === word.id ? "border-[#78b38a] bg-[#eef7f0]" : "border-[#e5ddcf] bg-[#fffdf7]")}><span><span className="block font-bold">{word.word}</span><span className="mt-1 block text-xs text-[#758198]">{word.ipa} · {word.phoneticRespelling}</span></span><Volume2 className="h-4 w-4 text-[#38755b]" /></button>)}</div></div><aside className="h-fit rounded-2xl bg-[#fff0bd] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#80611c]">Pronunciation tip</p><p className="mt-3 text-sm font-bold leading-6 text-[#594416]">Use the slow setting first. Listen, repeat, then play at normal speed.</p><p dir="rtl" className="arabic mt-4 border-t border-[#e6cf87] pt-4 text-right text-xs leading-6 text-[#755b22]">لا تقلق إن كان صوتك مختلفاً في البداية. الوضوح أهم من السرعة.</p></aside></div>}
            {tab === "reading" && <CourseReadingPractice lesson={lesson} />}
            {tab === "writing" && <CourseWritingPractice lesson={lesson} />}
          </div>
        </section>
        <aside className="h-fit space-y-5 xl:sticky xl:top-24"><div className="rounded-2xl border border-[#e4dbca] bg-[#fffdf7] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a2732c]">Lesson route</p><div className="mt-4 space-y-3">{tabs.filter((item) => item.id !== "quiz").map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", tab === item.id ? "bg-[#fff0bd] text-[#765618]" : "text-[#63718a] hover:bg-[#f7f3e9]")}><span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span><span className="text-sm font-bold">{item.label}</span></button>)}<button onClick={() => setTab("quiz")} className="mt-2 flex w-full items-center gap-3 rounded-xl bg-[#253453] px-3 py-3 text-left text-white"><Trophy className="h-4 w-4 text-[#e7b84a]" /><span className="text-sm font-bold">Take the 8-question quiz</span></button></div></div><div className="rounded-2xl bg-[#e9f2ec] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#38755b]">AI choice is yours</p><p className="mt-3 text-sm leading-6 text-[#52715c]">The course creates a clear prompt, but you decide whether and where to share it. Your selected AI tool may have its own terms and privacy policy.</p></div></aside>
      </div>
    </main>
  );
}
