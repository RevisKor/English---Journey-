import type { LessonVisualSemantic } from "@shared/course";
import { AlertTriangle, BookOpen, CheckCircle2, Lightbulb, ListChecks, RotateCcw, Sparkles, Target, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SemanticPresentation = {
  label: string;
  labelArabic: string;
  Icon: LucideIcon;
  className: string;
};

/** A restrained semantic system: the icon and label carry meaning; colour only reinforces it. */
export const LESSON_SEMANTIC_PRESENTATION: Record<LessonVisualSemantic, SemanticPresentation> = {
  objective: { label: "Objective", labelArabic: "الهدف", Icon: Target, className: "border-[#c7dbe8] bg-[#f4f8fb] text-[#27516a]" },
  example: { label: "Example", labelArabic: "مثال", Icon: BookOpen, className: "border-[#d8d6ee] bg-[#f7f6fc] text-[#504b82]" },
  tip: { label: "Helpful tip", labelArabic: "نصيحة مفيدة", Icon: Lightbulb, className: "border-[#e9dbab] bg-[#fff9e8] text-[#7d5e19]" },
  "common-mistake": { label: "Common mistake", labelArabic: "خطأ شائع", Icon: AlertTriangle, className: "border-[#efcbc0] bg-[#fff5f2] text-[#98432f]" },
  vocabulary: { label: "Vocabulary", labelArabic: "المفردات", Icon: Sparkles, className: "border-[#cce0d1] bg-[#f2f8f3] text-[#316647]" },
  grammar: { label: "Grammar", labelArabic: "القواعد", Icon: ListChecks, className: "border-[#d8d6ee] bg-[#f7f6fc] text-[#504b82]" },
  activity: { label: "Activity", labelArabic: "نشاط", Icon: CheckCircle2, className: "border-[#d4dfd1] bg-[#f6f9f4] text-[#48674b]" },
  retrieval: { label: "Remember", labelArabic: "تذكّر", Icon: RotateCcw, className: "border-[#d2dfdf] bg-[#f3f8f8] text-[#346565]" },
  assessment: { label: "Check", labelArabic: "تحقّق", Icon: Trophy, className: "border-[#ead5a4] bg-[#fff9e9] text-[#795414]" },
};

export function LessonSemanticCard({
  semantic,
  title,
  titleArabic,
  children,
  className,
}: {
  semantic: LessonVisualSemantic;
  title?: string;
  titleArabic?: string;
  children: ReactNode;
  className?: string;
}) {
  const presentation = LESSON_SEMANTIC_PRESENTATION[semantic];
  const { Icon } = presentation;

  return (
    <section aria-label={presentation.label} className={cn("rounded-2xl border p-4 sm:p-5", presentation.className, className)}>
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.14em]">{presentation.label}</p>
          <p dir="rtl" className="arabic mt-0.5 text-right text-xs font-semibold opacity-85">{presentation.labelArabic}</p>
          {title ? <h3 className="mt-3 text-lg font-bold text-[#253453]">{title}</h3> : null}
          {titleArabic ? <p dir="rtl" className="arabic mt-1 text-right text-sm font-semibold text-[#526078]">{titleArabic}</p> : null}
          <div className="mt-3 text-sm leading-6 text-[#435069]">{children}</div>
        </div>
      </div>
    </section>
  );
}
