import { Button } from "@/components/ui/button";
import { CourseReadingPractice } from "@/components/CourseReadingPractice";
import { CourseWritingPractice } from "@/components/CourseWritingPractice";
import { ExternalAiPromptPanel } from "@/components/ExternalAiPromptPanel";
import { QuizPractice } from "@/components/QuizPractice";
import { buildSentenceReviewPrompt } from "@/lib/external-ai-prompts";
import { buildMentorGuide } from "@shared/course/mentor-guidance";
import type { LessonDefinition, MentorMomentId } from "@shared/course";
import { ArrowLeft, BookOpen, CheckCircle2, Headphones, Languages, PenLine, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

type Accent = "british" | "american";

const journey: Array<{ id: MentorMomentId; label: string; arabic: string; icon: typeof Sparkles }> = [
  { id: "welcome", label: "Start together", arabic: "نبدأ معاً", icon: Sparkles },
  { id: "vocabulary", label: "Make it familiar", arabic: "اجعلها مألوفة", icon: Languages },
  { id: "grammar", label: "Give it shape", arabic: "امنحها شكلاً", icon: BookOpen },
  { id: "practice", label: "Try it yourself", arabic: "جرّب بنفسك", icon: PenLine },
  { id: "reading", label: "Read with purpose", arabic: "اقرأ بهدف", icon: BookOpen },
  { id: "writing", label: "Write for meaning", arabic: "اكتب للمعنى", icon: PenLine },
  { id: "check", label: "Notice your progress", arabic: "لاحظ تقدّمك", icon: Trophy },
];

function scrollToSection(id: MentorMomentId) {
  document.getElementById(`journey-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function StructuredLessonWorkspace({ lesson, accent, onBack }: { lesson: LessonDefinition; accent: Accent; onBack: () => void }) {
  const [sentence, setSentence] = useState("");
  const [grammarChoice, setGrammarChoice] = useState<string | null>(null);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const mentor = useMemo(() => buildMentorGuide(lesson), [lesson]);
  const network = lesson.lexicalNetworks?.[0];
  const isB1Plus = lesson.level === "B1" || lesson.level === "B2";
  const grammarExample = lesson.grammar.examples[0];
  const grammarPractice = lesson.grammar.practice[0] ?? (grammarExample ? {
    question: `Which sentence correctly uses today’s grammar focus: ${lesson.grammar.topic}?`,
    answer: grammarExample.en,
    choices: [grammarExample.en, lesson.grammar.commonMistakes[0]?.wrong].filter((choice): choice is string => Boolean(choice)),
  } : null);
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === "british" ? "en-GB" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  const mentorMoment = (id: MentorMomentId) => mentor?.moments.find((moment) => moment.id === id);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-7 lg:px-9 lg:py-10">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#69768d] transition hover:text-[#253453]"><ArrowLeft className="h-4 w-4" /> Back to {lesson.level} course</button>

      <header className="rounded-[1.8rem] border border-[#e2d8c5] bg-[#fffdf7] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.17em] text-[#a2732c]">Module {lesson.moduleNumber} · Lesson {String(lesson.lessonNumber).padStart(2, "0")} · Guided journey</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-.05em] text-[#253453] sm:text-4xl">{lesson.title}</h1>
            <p dir="rtl" className="arabic mt-2 text-right text-base text-[#718098]">{lesson.titleArabic}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#58677d]">You do not need to decide what comes next. Follow the path below: make the language familiar, give it shape, use it, then check what you can now do.</p>
          </div>
          <div className="rounded-2xl bg-[#eef4eb] p-5"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#38755b]">Today’s destination</p><p className="mt-3 text-sm leading-7 text-[#3f614c]">{lesson.learningPlan?.outcome.canDo ?? "Use today’s language in a connected response."}</p><p dir="rtl" className="arabic mt-3 text-right text-xs leading-6 text-[#587160]">{lesson.learningPlan?.outcome.canDoArabic}</p></div>
        </div>
      </header>

      <nav aria-label="Lesson journey" className="sticky top-[72px] z-10 mt-5 overflow-x-auto rounded-2xl border border-[#ded4c4] bg-[#fffdf7]/95 p-2 shadow-sm backdrop-blur xl:hidden"><div className="flex min-w-max gap-1">{journey.map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)} className="rounded-xl px-3 py-2 text-left text-xs font-bold text-[#526178] hover:bg-[#fff0bd] hover:text-[#6f5216]"><span className="block">{item.label}</span><span dir="rtl" className="arabic mt-0.5 block text-[10px] font-medium text-[#8490a1]">{item.arabic}</span></button>)}</div></nav>

      <div className="mt-6 grid gap-7 xl:grid-cols-[245px_minmax(0,1fr)]">
        <aside className="hidden xl:block"><nav aria-label="Lesson journey" className="sticky top-24 rounded-[1.6rem] bg-[#253453] p-4 text-white"><p className="px-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#f2cf71]">Your next step is always clear</p><div className="mt-4 space-y-1">{journey.map((item, index) => { const Icon = item.icon; return <button key={item.id} onClick={() => scrollToSection(item.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/10"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black text-[#f2cf71]">{index + 1}</span><span className="min-w-0"><span className="flex items-center gap-1.5 text-sm font-semibold"><Icon className="h-3.5 w-3.5 text-[#cbd8ed]" />{item.label}</span><span dir="rtl" className="arabic mt-1 block text-xs text-[#cbd6ea]">{item.arabic}</span></span></button>; })}</div></nav></aside>

        <div className="min-w-0 space-y-6">
          <JourneySection id="welcome" number={1} icon={<Sparkles />} moment={mentorMoment("welcome")} next="vocabulary">
            <div className="rounded-[1.55rem] bg-[#253453] p-6 text-white sm:p-8"><p className="text-sm leading-8 text-[#e4eafa]">{mentorMoment("welcome")?.message}</p><p dir="rtl" className="arabic mt-4 text-right text-sm leading-8 text-[#cbd6ea]">{mentorMoment("welcome")?.messageArabic}</p><div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#f2cf71]">The promise of this lesson</p><p className="mt-2 text-sm leading-7 text-[#d9e2f1]">By the end, you can {lesson.learningPlan?.outcome.canDo ?? "use today’s language in a connected response."}</p></div></div>
          </JourneySection>

          <JourneySection id="vocabulary" number={2} icon={<Languages />} moment={mentorMoment("vocabulary")} next="grammar">
            <p className="text-sm leading-7 text-[#58677d]">{mentorMoment("vocabulary")?.message}</p>
            <div className="mt-5 rounded-2xl bg-[#eef4eb] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-[#315944]">{network?.theme ?? "Today’s useful language"}</h3><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#56725f]">{network?.themeArabic}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#397558]">{network?.register ?? "useful"} register</span></div><div className="mt-4 flex flex-wrap gap-2">{network?.chunks.slice(0, 8).map((chunk) => <button key={chunk} onClick={() => speak(chunk)} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#397558] shadow-sm transition hover:bg-[#fff8dd]"><Headphones className="mr-1 inline h-3.5 w-3.5" />{chunk}</button>)}</div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => <button key={word.id} onClick={() => speak(word.exampleEN)} className="rounded-2xl border border-[#e5ddcf] bg-[#fffefb] p-4 text-left transition hover:border-[#bf7f2f] hover:bg-[#fffcf4]"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-[#253453]">{word.word}</p><p className="mt-1 text-xs text-[#8a96a9]">{word.partOfSpeech} · {word.ipa}</p></div><Headphones className="h-4 w-4 shrink-0 text-[#bf7f2f]" /></div><p className="mt-3 text-sm leading-6 text-[#59687d]">{word.definition}</p><p className="mt-3 border-t border-[#eee7db] pt-3 text-sm font-medium leading-6 text-[#425167]">{word.exampleEN}</p><p dir="rtl" className="arabic mt-2 text-right text-xs leading-6 text-[#778399]">{word.exampleAR}</p></button>)}</div>
          </JourneySection>

          <JourneySection id="grammar" number={3} icon={<BookOpen />} moment={mentorMoment("grammar")} next="practice">
            <p className="text-sm leading-7 text-[#58677d]">{mentorMoment("grammar")?.message}</p>
            <div className="mt-5 rounded-[1.4rem] bg-[#f8f4ec] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#9c711f]">Today’s pattern</p><h3 className="mt-2 text-2xl font-bold text-[#253453]">{lesson.grammar.topic}</h3><p dir="rtl" className="arabic mt-2 text-right leading-7 text-[#68758c]">{lesson.grammar.arabicComparison}</p><p className="mt-5 rounded-xl bg-white/70 p-4 font-mono text-sm text-[#8d6415]">{lesson.grammar.structure.positive}</p><p className="mt-4 text-sm leading-7 text-[#58677d]">{lesson.grammar.concept}</p></div>
            <div className="mt-4 space-y-3">{lesson.grammar.examples.slice(0, 3).map((example) => <button key={example.en} onClick={() => speak(example.en)} className="block w-full rounded-xl border border-[#e6dece] bg-[#fffefb] p-4 text-left transition hover:bg-[#fcf9f1]"><p className="font-semibold text-[#253453]">{example.en} <Headphones className="ml-1 inline h-3.5 w-3.5 text-[#bf7f2f]" /></p><p dir="rtl" className="arabic mt-2 text-right text-sm text-[#778399]">{example.ar}</p></button>)}</div>
          </JourneySection>

          <JourneySection id="practice" number={4} icon={<PenLine />} moment={mentorMoment("practice")} next="reading">
            <p className="text-sm leading-7 text-[#58677d]">{mentorMoment("practice")?.message}</p>
            {grammarPractice && <div className="mt-5 rounded-[1.35rem] border border-[#dfd6c5] bg-[#fffaf0] p-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a2732c]">A two-minute grammar check</p><p className="mt-3 font-semibold leading-7 text-[#253453]">{grammarPractice.question}</p><div className="mt-4 grid gap-2">{grammarPractice.choices.map((choice) => <button key={choice} onClick={() => { setGrammarChoice(choice); setGrammarChecked(true); }} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${grammarChoice === choice ? choice === grammarPractice.answer ? "border-[#397558] bg-[#e8f3ea] text-[#285d40]" : "border-[#b45d49] bg-[#fff0ed] text-[#8c3e32]" : "border-[#e1d6c4] bg-white text-[#46566c] hover:border-[#bf7f2f]"}`}>{choice}</button>)}</div>{grammarChecked && <p aria-live="polite" className={`mt-4 text-sm font-semibold ${grammarChoice === grammarPractice.answer ? "text-[#397558]" : "text-[#b45d49]"}`}>{grammarChoice === grammarPractice.answer ? "That choice fits the pattern. Keep going." : `Look once more at the pattern. The best choice is: ${grammarPractice.answer}`}</p>}</div>}
            <div className="mt-6 rounded-[1.35rem] border border-[#e3dacd] bg-[#fffefb] p-5"><h3 className="text-lg font-bold text-[#253453]">Make a sentence that matters to you</h3><p className="mt-2 text-sm leading-7 text-[#64738a]">{isB1Plus ? "State a view and support it with a reason, qualification, or example." : "Use one useful expression and today’s grammar to say something true about your life or plans."}</p><textarea value={sentence} onChange={(event) => setSentence(event.target.value)} placeholder={isB1Plus ? "State your view, then support it with a reason or example…" : "For example: I usually … because …"} className="mt-4 min-h-32 w-full rounded-2xl border border-[#dfd6c5] bg-white p-4 outline-none transition focus:border-[#bf7f2f] focus:ring-2 focus:ring-[#f6df9f]" /><ExternalAiPromptPanel className="mt-5" title="Ask an external AI to review this sentence" description="Copy a focused prompt with your lesson language and sentence. You choose which external AI service to use." descriptionArabic="انسخ طلباً مركزاً يتضمن لغة الدرس وجملتك. أنت تختار خدمة الذكاء الاصطناعي الخارجية." prompt={buildSentenceReviewPrompt({ lesson, sentence })} /></div>
          </JourneySection>

          <JourneySection id="reading" number={5} icon={<BookOpen />} moment={mentorMoment("reading")} next="writing"><p className="text-sm leading-7 text-[#58677d]">{mentorMoment("reading")?.message}</p><div className="mt-5"><CourseReadingPractice lesson={lesson} /></div></JourneySection>
          <JourneySection id="writing" number={6} icon={<PenLine />} moment={mentorMoment("writing")} next="check"><p className="text-sm leading-7 text-[#58677d]">{mentorMoment("writing")?.message}</p><div className="mt-5"><CourseWritingPractice lesson={lesson} /></div></JourneySection>
          <JourneySection id="check" number={7} icon={<Trophy />} moment={mentorMoment("check")}><p className="text-sm leading-7 text-[#58677d]">{mentorMoment("check")?.message}</p><div className="mt-5 border-t border-[#e7decf] pt-6"><QuizPractice lesson={lesson} /></div></JourneySection>

          <div className="rounded-[1.5rem] bg-[#253453] p-6 text-center text-white"><CheckCircle2 className="mx-auto h-7 w-7 text-[#f2cf71]" /><h2 className="mt-3 text-xl font-bold">You have a route, not a pile of tasks.</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-[#d5dff0]">Return to any point when you need it. Each pass through the journey helps the language become easier to notice, choose, and use.</p></div>
        </div>
      </div>
    </main>
  );
}

function JourneySection({ id, number, icon, moment, next, children }: { id: MentorMomentId; number: number; icon: React.ReactNode; moment?: { title: string; titleArabic: string }; next?: MentorMomentId; children: React.ReactNode }) {
  return <section id={`journey-${id}`} className="scroll-mt-28 rounded-[1.7rem] border border-[#e4dccf] bg-[#fffdf7] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8f3ea] text-[#38755b]">{icon}</span><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a2732c]">Step {number} of 7</p><h2 className="text-xl font-bold text-[#253453]">{moment?.title}</h2><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#78859a]">{moment?.titleArabic}</p></div></div>{next && <Button variant="outline" onClick={() => scrollToSection(next)} className="hidden shrink-0 rounded-xl border-[#dfd4c0] text-xs text-[#526178] hover:bg-[#fff5d7] sm:inline-flex">Next step</Button>}</div><div className="mt-6">{children}</div>{next && <Button variant="outline" onClick={() => scrollToSection(next)} className="mt-6 w-full rounded-xl border-[#dfd4c0] text-sm text-[#526178] hover:bg-[#fff5d7] sm:hidden">Continue to the next step</Button>}</section>;
}

export function A2LessonWorkspace(props: { lesson: LessonDefinition; accent: Accent; onBack: () => void }) { return <StructuredLessonWorkspace {...props} />; }
