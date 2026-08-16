import * as React from "react";
import type { LessonDefinition, ModuleDefinition } from "@shared/course";
import { buildLearnerCourseMap } from "@shared/course/learner-map";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, ChevronRight, LockKeyhole } from "lucide-react";

type Props = {
  level: LessonDefinition["level"];
  lessons: LessonDefinition[];
  modules?: ModuleDefinition[];
  completedLessons: Set<number>;
  canEnter: (lessonNumber: number) => boolean;
  openLesson: (lesson: LessonDefinition) => void;
};

export function LearnerCourseMap({ level, lessons, modules, completedLessons, canEnter, openLesson }: Props) {
  const sections = buildLearnerCourseMap(level, lessons, modules);
  const [collapsedModules, setCollapsedModules] = React.useState<Set<number>>(() => new Set());

  const toggleModule = (moduleNumber: number) => {
    setCollapsedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleNumber)) next.delete(moduleNumber);
      else next.add(moduleNumber);
      return next;
    });
  };

  return (
    <div className="mt-5 space-y-6">
      {sections.map((section) => {
        const isCollapsed = collapsedModules.has(section.moduleNumber);
        const contentId = `module-content-${level}-${section.moduleNumber}`;
        return (
          <section
            key={section.moduleNumber}
            aria-labelledby={`module-${level}-${section.moduleNumber}`}
            className="rounded-[1.35rem] border border-[#e2d8c5] bg-[#fbf8f0] p-4 sm:p-5"
          >
          <div className="flex flex-col gap-3 border-b border-[#e8dfd0] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a2732c]">Module {section.moduleNumber}</p>
              <h3 id={`module-${level}-${section.moduleNumber}`} className="mt-1 text-xl font-bold tracking-[-.03em] text-[#293751]">{section.title}</h3>
              <p dir="rtl" className="arabic-support mt-1 text-right text-sm">{section.titleArabic}</p>
            </div>
            <div className="flex max-w-xl items-center gap-3 sm:justify-end">
              <p className="text-xs leading-5 text-[#68758a]"><span className="font-bold text-[#a2732c]">Module focus:</span> {section.overview}</p>
              <button
                type="button"
                onClick={() => toggleModule(section.moduleNumber)}
                aria-expanded={!isCollapsed}
                aria-controls={contentId}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#ddcfb7] bg-[#fffdf7] px-2.5 py-2 text-xs font-bold text-[#56647a] transition hover:border-[#c8a969] hover:text-[#293751]"
              >
                {isCollapsed ? "Show lessons" : "Hide lessons"}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed && "-rotate-90")} />
              </button>
            </div>
          </div>

          <div id={contentId} hidden={isCollapsed}>
            {section.immersiveRoadmap && (
              <div className="mt-4 rounded-xl border border-[#d9c58b] bg-[#fff9e8] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#9a7743]">{level === "A1" ? "Active 15-lesson journey" : "Immersive roadmap"}</p>
                <span className="rounded-full bg-[#e7b84a] px-2.5 py-1 text-[10px] font-bold text-[#253453]">
                  {section.immersiveRoadmap.plannedLessons} guided lessons
                </span>
              </div>
                <p className="mt-2 text-xs leading-5 text-[#56647a]"><span className="font-bold text-[#9a7743]">Guided preview:</span> {section.immersiveRoadmap.notice}</p>
                <p dir="rtl" className="arabic-support mt-2 text-right text-xs leading-5">{section.immersiveRoadmap.noticeArabic}</p>
                <p className="mt-3 text-[10px] font-semibold text-[#9a7743]"><span className="font-bold">Learning modes:</span> {section.immersiveRoadmap.lessonTypes.join(" · ")}</p>
              </div>
            )}

            <ol className="mt-4 space-y-2" aria-label={`${section.title} lessons`}>
              {section.lessons.map((lesson) => {
              const completed = completedLessons.has(lesson.lessonNumber);
              const enter = canEnter(lesson.lessonNumber);
              return (
                <li key={lesson.lessonNumber}>
                <button
                  key={lesson.lessonNumber}
                  aria-label={`Open lesson ${lesson.lessonNumber}: ${lesson.title}`}
                  disabled={!enter}
                  onClick={() => openLesson(lesson)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition sm:gap-4 sm:p-4",
                    completed
                      ? "border-[#b9d8c4] bg-[#f0f8f1]"
                      : enter
                        ? "border-[#e2d8c5] bg-[#fffdf7] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                        : "cursor-not-allowed border-[#ebe4d9] bg-[#f5f1e9] text-[#99a2b1]",
                  )}
                >
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold", completed ? "bg-[#cdebd6] text-[#277350]" : enter ? "bg-[#fff0bd] text-[#765618]" : "bg-[#e8e4dd]")}>{completed ? <CheckCircle2 className="h-4 w-4" /> : enter ? String(lesson.lessonNumber).padStart(2, "0") : <LockKeyhole className="h-4 w-4" />}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#293751]">{lesson.title}</p>
                        <p dir="rtl" className="arabic-support mt-1 text-right text-xs">{lesson.titleArabic}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[.13em]">Module {lesson.moduleNumber}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-xs leading-5 text-[#65738a]">{lesson.learningPlan?.outcome.canDo}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#8390a5] transition group-hover:translate-x-1" />
                </button>
                </li>
              );
              })}
            </ol>
          </div>
        </section>
        );
      })}
    </div>
  );
}
