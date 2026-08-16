import React from "react";
import { A1_IMMERSIVE_MODULES } from "@shared/course/a1-immersive-modules";
import { IMMERSIVE_DIFFICULTY_PROFILES, PROGRESSIVE_IMMERSIVE_MODULES } from "@shared/course/progressive-immersive";
import { buildA1ImmersiveMigrationPlan, buildProgressiveImmersiveMigrationPlan } from "@shared/course/immersive-migration-plan";

export function ImmersiveCurriculumInventory() {
  const modules = [...A1_IMMERSIVE_MODULES, ...PROGRESSIVE_IMMERSIVE_MODULES];
  const migrationPlan = [...buildA1ImmersiveMigrationPlan(), ...(["A2", "B1", "B2", "C1", "C2"] as const).flatMap((level) => buildProgressiveImmersiveMigrationPlan(level, 0))];
  return (
    <section aria-labelledby="immersive-inventory" className="mb-6 rounded-[1.35rem] border border-[#d9c58b] bg-[#fff9e8] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9a7743]">Immersive authoring inventory</p>
          <h3 id="immersive-inventory" className="mt-2 text-xl font-bold tracking-[-.03em] text-[#253453]">A1–C2 depth model ready for review</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#56647a]">These authored blueprints are reviewable before they replace the active gated catalog. A1 begins with high Arabic scaffolding and repeated concrete practice; later levels increase source length, independence, discourse complexity, mediation, and writing expectations.</p>
        </div>
        <span className="rounded-full bg-[#e7b84a] px-3 py-1.5 text-xs font-bold text-[#253453]">{modules.length} modules · {migrationPlan.length} migration records</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const profile = module.level === "A1" ? null : IMMERSIVE_DIFFICULTY_PROFILES[module.level];
          return <article key={`${module.level}-${module.moduleNumber}`} className="rounded-xl border border-[#eadfbd] bg-[#fffdf7] p-4">
            <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#397558]">{module.level} · Module {module.moduleNumber}</span><span className="rounded-full bg-[#f2ede2] px-2 py-1 text-[9px] font-bold text-[#806b48]">{module.lessonBlueprints.length} lessons</span></div>
            <h4 className="mt-3 text-sm font-bold text-[#253453]">{module.title}</h4>
            <p dir="rtl" className="arabic mt-1 text-right text-xs text-[#68758a]">{module.titleArabic}</p>
            <p className="mt-2 text-xs leading-5 text-[#65738a]">{module.overview}</p>
            <p className="mt-3 text-[10px] font-semibold text-[#9a7743]">{profile ? `${profile.expectedReadingWords} reading · ${profile.expectedWritingWords} writing · ${profile.mentorMode}` : "Absolute-beginner scaffolding · concrete retrieval"}</p>
          </article>;
        })}
      </div>
    </section>
  );
}

export const IMMERSIVE_INVENTORY_TEST_MARKER = "A1–C2 depth model ready for review";
