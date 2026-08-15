import { ExternalAiPromptPanel } from "@/components/ExternalAiPromptPanel";
import { buildReadingPrompt } from "@/lib/external-ai-prompts";
import type { LessonDefinition } from "@shared/course";

export function CourseReadingPractice({ lesson }: { lesson: LessonDefinition }) {
  const target = lesson.level === "A1" ? "80–100" : lesson.level === "A2" ? "160–200" : lesson.level === "B1" ? "250–350" : "350–450";

  return (
    <ExternalAiPromptPanel
      title={`Create a ${lesson.level} reading practice`}
      description={`Copy this prepared prompt into an AI tool you choose. It includes your module, lesson goal, grammar focus, target vocabulary, and a ${target}-word target range.`}
      descriptionArabic="انسخ هذا الطلب إلى أداة الذكاء الاصطناعي التي تختارها. يتضمن الوحدة والدرس والقاعدة والكلمات المستهدفة وطول النص المناسب لمستواك."
      prompt={buildReadingPrompt(lesson)}
    />
  );
}
