import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Brain, CheckCircle2, RotateCcw } from "lucide-react";

export function WarmupReview({ onContinue }: { onContinue: () => void }) {
  const reviewQuery = trpc.course.warmup.useQuery();
  const submit = trpc.course.submitWarmup.useMutation({ onSuccess: () => reviewQuery.refetch() });
  const item = reviewQuery.data?.[0];
  if (reviewQuery.isLoading) return <div className="mx-auto max-w-2xl px-5 py-10 text-sm text-[#64718a]">Preparing your review…</div>;
  if (!item) return null;
  return <div className="mx-auto max-w-2xl px-5 py-10"><div className="rounded-[1.8rem] bg-[#253453] p-6 text-white sm:p-9"><div className="flex items-center gap-3 text-[#e7b84a]"><Brain className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[.15em]">Warm-up review</p></div><h2 className="mt-5 text-3xl font-bold">Before the next step</h2><p dir="rtl" className="arabic mt-2 text-right text-sm leading-7 text-[#cbd6eb]">راجع هذه الكلمة أو القاعدة بسرعة. التكرار الذكي يساعدك على تذكرها.</p><div className="mt-7 rounded-2xl bg-white/10 p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#e7b84a]">{item.type}</p><p className="mt-3 text-3xl font-bold">{item.prompt}</p><p dir="rtl" className="arabic mt-2 text-right text-lg text-[#eef4ff]">{item.promptArabic}</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button disabled={submit.isPending} onClick={() => submit.mutate({ reviewId: item.id, correct: true })} className="rounded-xl bg-[#e7b84a] text-[#253453] hover:bg-[#f2ca68]"><CheckCircle2 className="mr-2 h-4 w-4" /> I know this</Button><Button disabled={submit.isPending} onClick={() => submit.mutate({ reviewId: item.id, correct: false })} className="rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10"><RotateCcw className="mr-2 h-4 w-4" /> Review again</Button></div><button onClick={onContinue} className="mt-5 text-sm font-bold text-[#cbd6eb] hover:text-white">Continue to my lesson</button></div></div>;
}
