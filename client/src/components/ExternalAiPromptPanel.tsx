import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ExternalAiPromptPanel({
  title,
  description,
  descriptionArabic,
  prompt,
  className = "",
}: {
  title: string;
  description: string;
  descriptionArabic: string;
  prompt: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={`rounded-2xl border border-[#d8e6dc] bg-[#eef4eb] p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#38755b]">Bring your own AI</p>
          <h3 className="mt-2 text-lg font-bold text-[#315944]">{title}</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#397558]"><ExternalLink className="h-3.5 w-3.5" /> Your choice of tool</span>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4c6b58]">{description}</p>
      <p dir="rtl" className="arabic mt-2 max-w-3xl text-right text-sm leading-6 text-[#587160]">{descriptionArabic}</p>
      <textarea aria-label={`${title} prompt`} readOnly value={prompt} className="mt-4 min-h-48 w-full resize-y rounded-xl border border-[#cddfd1] bg-[#fffefb] p-3 text-xs leading-6 text-[#405a4b] outline-none" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={copyPrompt} className="rounded-xl bg-[#253453] text-white hover:bg-[#35476d]">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy prompt"}
        </Button>
        <p aria-live="polite" className="text-xs text-[#587160]">Paste it into ChatGPT, Gemini, or another AI tool you trust. This site does not send the prompt or your work anywhere.</p>
      </div>
    </section>
  );
}
