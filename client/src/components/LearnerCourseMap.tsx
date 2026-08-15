import React from "react";
import type { LessonDefinition } from "@shared/course";
import { buildLearnerCourseMap } from "@shared/course/learner-map";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, LockKeyhole } from "lucide-react";

type Props = {
  level: LessonDefinition["level"];
  lessons: LessonDefinition[];
  completedLessons: Set<number>;
  canEnter: (lessonNumber: number) => boolean;
  openLesson: (lesson: LessonDefinition) => void;
};

export function LearnerCourseMap({ level, lessons, completedLessons, canEnter, openLesson }: Props) {
  const sections = buildLearnerCourseMap(level, lessons);
  return <div className="mt-5 space-y-6">{sections.map((section) => <section key={section.moduleNumber} aria-labelledby={`module-${level}-${section.moduleNumber}`} className="rounded-[1.35rem] border border-[#e2d8c5] bg-[#fbf8f0] p-4 sm:p-5"><div className="flex flex-col gap-2 border-b border-[#e8dfd0] pb-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a2732c]">Module {section.moduleNumber}</p><h3 id={`module-${level}-${section.moduleNumber}`} className="mt-1 text-xl font-bold tracking-[-.03em] text-[#293751]">{section.title}</h3><p dir="rtl" className="arabic mt-1 text-right text-sm text-[#68758a]">{section.titleArabic}</p></div><p className="max-w-xl text-xs leading-5 text-[#68758a]">{section.overview}</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{section.lessons.map((lesson) => { const completed = completedLessons.has(lesson.lessonNumber); const enter = canEnter(lesson.lessonNumber); return <button key={lesson.lessonNumber} disabled={!enter} onClick={() => openLesson(lesson)} className={cn("group rounded-2xl border p-4 text-left transition", completed ? "border-[#b9d8c4] bg-[#f0f8f1]" : enter ? "border-[#e2d8c5] bg-[#fffdf7] shadow-sm hover:-translate-y-0.5 hover:shadow-md" : "cursor-not-allowed border-[#ebe4d9] bg-[#f5f1e9] text-[#99a2b1]")}><div className="flex items-start justify-between"><span className={cn("grid h-9 w-9 place-items-center rounded-xl text-xs font-bold", completed ? "bg-[#cdebd6] text-[#277350]" : enter ? "bg-[#fff0bd] text-[#765618]" : "bg-[#e8e4dd]")}>{completed ? <CheckCircle2 className="h-4 w-4" /> : enter ? String(lesson.lessonNumber).padStart(2, "0") : <LockKeyhole className="h-4 w-4" />}</span><span className="text-[10px] font-bold uppercase tracking-[.13em]">Module {lesson.moduleNumber}</span></div><p className="mt-5 text-sm font-bold text-[#293751]">{lesson.title}</p><p dir="rtl" className="arabic mt-1 text-right text-xs text-[#768399]">{lesson.titleArabic}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-[#65738a]">{lesson.learningPlan?.outcome.canDo}</p><ChevronRight className="mt-4 h-4 w-4 text-[#8390a5] transition group-hover:translate-x-1" /></button>; })}</div></section>)}</div>;
}
