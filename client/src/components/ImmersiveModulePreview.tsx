import React from "react";
import { A1_MEETING_PEOPLE_IMMERSIVE } from "@shared/course/a1-immersive-modules";

export function ImmersiveModulePreview() {
  const module = A1_MEETING_PEOPLE_IMMERSIVE;
  return (
    <section aria-labelledby="a1-immersive-preview" className="mb-6 rounded-[1.35rem] border border-[#d9c58b] bg-[#fff9e8] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9a7743]">Next authoring slice · A1 Module 1</p>
          <h3 id="a1-immersive-preview" className="mt-2 text-xl font-bold tracking-[-.03em] text-[#253453]">{module.title}</h3>
          <p dir="rtl" className="arabic mt-1 text-right text-sm text-[#68758a]">{module.titleArabic}</p>
        </div>
        <span className="rounded-full bg-[#e7b84a] px-3 py-1.5 text-xs font-bold text-[#253453]">{module.lessonBlueprints.length} lesson blueprint</span>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[#56647a]">{module.overview}</p>
      <p dir="rtl" className="arabic mt-2 max-w-3xl text-right text-sm leading-7 text-[#68758a]">{module.overviewArabic}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {module.lessonBlueprints.map((lesson) => (
          <article key={lesson.lessonNumber} className="rounded-xl border border-[#eadfbd] bg-[#fffdf7] p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eef4eb] text-[10px] font-bold text-[#397558]">{String(lesson.lessonNumber).padStart(2, "0")}</span>
              <span className="rounded-full bg-[#f2ede2] px-2 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#806b48]">{lesson.type}</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#253453]">{lesson.title}</h4>
            <p dir="rtl" className="arabic mt-1 text-right text-xs text-[#68758a]">{lesson.titleArabic}</p>
            <p className="mt-2 text-xs leading-5 text-[#65738a]">{lesson.canDo}</p>
            <p className="mt-2 text-[10px] font-semibold text-[#9a7743]">{lesson.exposurePlan.length} planned exposures · {lesson.vocabularyAnchors.slice(0, 3).join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
