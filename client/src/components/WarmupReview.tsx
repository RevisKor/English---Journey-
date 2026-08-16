import React from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Brain, CheckCircle2, Headphones, RotateCcw, Settings2, ShieldCheck } from "lucide-react";

type ReviewLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type Accent = "british" | "american";
type InterfaceLanguage = "bilingual" | "english" | "arabic";

function speakWord(text: string, accent: Accent) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === "british" ? "en-GB" : "en-US";
  window.speechSynthesis.speak(utterance);
}

function DailyReviewSupport({ level, accent }: { level: ReviewLevel; accent: Accent }) {
  const dashboard = trpc.course.dashboard.useQuery({ level });
  const utils = trpc.useUtils();
  const updatePreferences = trpc.course.updatePreferences.useMutation({
    onSuccess: () => Promise.all([dashboard.refetch(), utils.course.dashboard.invalidate()]),
  });
  const preferredAccent = (dashboard.data?.profile?.preferredAccent ?? accent) as Accent;
  const interfaceLanguage = (dashboard.data?.profile?.interfaceLanguage ?? "bilingual") as InterfaceLanguage;
  const save = (next: Partial<{ preferredAccent: Accent; interfaceLanguage: InterfaceLanguage }>) => updatePreferences.mutate({
    preferredAccent: next.preferredAccent ?? preferredAccent,
    interfaceLanguage: next.interfaceLanguage ?? interfaceLanguage,
  });

  return <section aria-label="Learning preferences and help" className="mt-5 rounded-[1.5rem] border border-[#e2d8c5] bg-[#fffdf7] p-5 text-[#293751]">
    <div className="flex items-start gap-3"><Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a2732c]" /><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a2732c]">Your no-cost settings</p><h3 className="mt-1 font-bold">Speech and language support</h3><p dir="rtl" className="arabic mt-1 text-right text-xs leading-6 text-[#68758a]">اختر تفضيلاتك. تستخدم القراءة الصوتية الصوت المتاح في متصفحك فقط.</p></div></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-bold text-[#526077]">English accent<select aria-label="English accent" disabled={updatePreferences.isPending} value={preferredAccent} onChange={(event) => save({ preferredAccent: event.target.value as Accent })} className="mt-1.5 block w-full rounded-xl border border-[#e2d8c5] bg-white px-3 py-2.5 text-sm font-semibold text-[#293751] outline-none focus:ring-2 focus:ring-[#e7b84a]"><option value="british">British English</option><option value="american">American English</option></select></label>
      <label className="text-xs font-bold text-[#526077]">Interface support<select aria-label="Interface language" disabled={updatePreferences.isPending} value={interfaceLanguage} onChange={(event) => save({ interfaceLanguage: event.target.value as InterfaceLanguage })} className="mt-1.5 block w-full rounded-xl border border-[#e2d8c5] bg-white px-3 py-2.5 text-sm font-semibold text-[#293751] outline-none focus:ring-2 focus:ring-[#e7b84a]"><option value="bilingual">Bilingual: English + Arabic</option><option value="english">English-first</option><option value="arabic">Arabic-first support</option></select></label>
    </div>
    <p aria-live="polite" className="mt-3 text-xs font-semibold text-[#38755b]">{updatePreferences.isSuccess ? "Preferences saved." : "No paid AI, speech, or tracking service is used here."}</p>
    <details className="mt-4 border-t border-[#eee6d8] pt-4"><summary className="cursor-pointer text-sm font-bold text-[#293751]">Help, privacy, and external prompts</summary><div className="mt-3 space-y-3 text-sm leading-6 text-[#5c6a80]"><p>Daily review retrieves missed quiz language using your saved learning progress. The word audio uses your browser’s built-in voice when available; it does not upload your audio.</p><p dir="rtl" className="arabic text-right">تستخدم مراجعة اليوم تقدّمك المحفوظ لاسترجاع اللغة الصعبة. ويستخدم الصوت المدمج في المتصفح عند توفره ولا يرفع صوتك إلى خدمة خارجية.</p><p>When a lesson offers an AI prompt, you choose whether to copy it into an external tool. Avoid putting sensitive personal information in writing practice or external prompts.</p><div className="flex items-center gap-2 font-semibold text-[#38755b]"><ShieldCheck className="h-4 w-4" /> Your course uses no third-party analytics or paid runtime API.</div></div></details>
  </section>;
}

export function WarmupReview({ level = "A1", accent = "british", onContinue }: { level?: ReviewLevel; accent?: Accent; onContinue: () => void }) {
  const reviewQuery = trpc.course.warmup.useQuery({ level });
  const utils = trpc.useUtils();
  const submit = trpc.course.submitWarmup.useMutation({ onSuccess: () => Promise.all([reviewQuery.refetch(), utils.course.dashboard.invalidate(), utils.course.warmup.invalidate()]) });
  const item = reviewQuery.data?.[0];
  if (reviewQuery.isLoading) return <div className="mx-auto max-w-3xl px-5 py-10 text-sm text-[#64718a]">Preparing your review…</div>;
  if (!item) return <div className="mx-auto max-w-3xl px-5 py-10"><section className="rounded-[1.8rem] border border-[#dce5d8] bg-[#eef4eb] p-6 text-[#285a45] sm:p-9"><div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6" /><p className="text-xs font-bold uppercase tracking-[.15em]">Daily review</p></div><h2 className="mt-5 text-3xl font-bold tracking-[-.04em]">Your review queue is clear.</h2><p className="mt-3 max-w-xl leading-7 text-[#527261]">Newly missed quiz items appear here automatically. Keep moving through your next lesson, and return when the course asks you to retrieve something again.</p><p dir="rtl" className="arabic mt-3 text-right text-sm leading-7">قائمة المراجعة فارغة الآن. ستظهر الأسئلة أو الكلمات الصعبة هنا تلقائياً بعد الاختبارات.</p><Button onClick={onContinue} className="mt-7 rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">Return to my course</Button></section><DailyReviewSupport level={level} accent={accent} /></div>;
  return <div className="mx-auto max-w-3xl px-5 py-10"><div className="rounded-[1.8rem] bg-[#253453] p-6 text-white shadow-[0_18px_45px_rgba(37,52,83,.14)] sm:p-9"><div className="flex items-center gap-3 text-[#e7b84a]"><Brain className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[.15em]">Daily review · {level}</p></div><h2 className="mt-5 text-3xl font-bold tracking-[-.04em]">Retrieve it before you move on.</h2><p dir="rtl" className="arabic mt-2 text-right text-sm leading-7 text-[#cbd6eb]">راجع عنصراً واحداً بتركيز. التكرار في الوقت المناسب يساعدك على تذكّر اللغة واستخدامها.</p><div className="mt-7 rounded-2xl bg-white/10 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7b84a]">{item.type}</p><p className="mt-3 text-3xl font-bold">{item.prompt}</p></div>{item.type === "vocabulary" && <button type="button" onClick={() => speakWord(item.prompt, accent)} aria-label={`Play ${item.prompt}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e7b84a] text-[#253453] transition hover:bg-[#f2ca68]"><Headphones className="h-5 w-5" /></button>}</div><p dir="rtl" className="arabic mt-2 text-right text-lg text-[#eef4ff]">{item.promptArabic}</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button disabled={submit.isPending} onClick={() => submit.mutate({ reviewId: item.id, correct: true })} className="rounded-xl bg-[#e7b84a] text-[#253453] hover:bg-[#f2ca68]"><CheckCircle2 className="mr-2 h-4 w-4" /> I know this</Button><Button disabled={submit.isPending} onClick={() => submit.mutate({ reviewId: item.id, correct: false })} className="rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10"><RotateCcw className="mr-2 h-4 w-4" /> Review again</Button></div><button onClick={onContinue} className="mt-5 text-sm font-bold text-[#cbd6eb] hover:text-white">Continue to my lesson</button></div><DailyReviewSupport level={level} accent={accent} /></div>;
}
