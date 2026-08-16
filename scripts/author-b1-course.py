"""Author original English Journey B1 course packs in resumable, schema-validated batches."""

from __future__ import annotations

import json
import time
from pathlib import Path

from openai import OpenAI

OUT = Path("shared/course/b1-draft.json")
MODEL = "gpt-5-mini"

LESSONS = [
    (1, 1, "Stories worth telling", "حكايات تستحق أن تُروى", "personal stories, turning points, memory", "narrative tenses and sequencing"),
    (2, 1, "Decisions and consequences", "القرارات والنتائج", "choices, results, responsibility", "conditionals for real and imagined outcomes"),
    (3, 1, "People, boundaries, and trust", "الأشخاص والحدود والثقة", "relationships, disagreement, support", "relative clauses and polite disagreement"),
    (4, 1, "Changing a habit", "تغيير عادة", "routines, motivation, setbacks", "used to, would, and present perfect progress"),
    (5, 1, "Seeing it differently", "رؤية الأمور من زاوية مختلفة", "opinions, evidence, agreement", "hedging and contrast linkers"),
    (6, 1, "A message that matters", "رسالة لها أثر", "emails, tone, requests", "formal and informal requests"),
    (7, 2, "A better neighbourhood", "حيّ أفضل", "community, facilities, local priorities", "modals for obligation, advice, and possibility"),
    (8, 2, "Working with different people", "العمل مع أشخاص مختلفين", "teamwork, roles, conflict", "reported speech for meetings"),
    (9, 2, "Explaining a problem clearly", "شرح مشكلة بوضوح", "services, complaints, solutions", "passives in practical communication"),
    (10, 2, "Work that fits", "عمل يناسبك", "skills, strengths, job choices", "gerunds and infinitives after verbs"),
    (11, 2, "Making a proposal", "تقديم اقتراح", "plans, benefits, risks", "linking a proposal with purpose and result"),
    (12, 2, "Helping beyond yourself", "المساعدة خارج نطاقك", "volunteering, impact, civic action", "defining and non-defining relative clauses"),
    (13, 3, "How a story becomes news", "كيف تصبح الحكاية خبراً", "news, perspective, reliability", "reporting verbs and source language"),
    (14, 3, "Attention by design", "الانتباه بتصميم مقصود", "apps, habits, persuasion", "cause, effect, and emphasis"),
    (15, 3, "Buying an idea", "شراء فكرة", "advertising, claims, value", "comparatives, qualifiers, and persuasive language"),
    (16, 3, "What the data does not say", "ما لا تقوله البيانات", "facts, inference, uncertainty", "modal deduction and cautious claims"),
    (17, 3, "Culture in everyday choices", "الثقافة في الخيارات اليومية", "identity, customs, belonging", "contrast, concession, and respectful generalisation"),
    (18, 3, "A review with a point of view", "مراجعة تحمل وجهة نظر", "books, films, experiences", "evaluative adjectives and recommendation language"),
    (19, 4, "Learning how to learn", "تعلّم كيف تتعلّم", "strategies, feedback, progress", "present perfect simple and continuous"),
    (20, 4, "A career conversation", "حديث عن المسار المهني", "goals, qualifications, interviews", "speculation about present and future"),
    (21, 4, "Travel when plans change", "السفر حين تتغيّر الخطط", "disruption, negotiation, rights", "polite negotiation and past perfect"),
    (22, 4, "Small choices, wider effects", "خيارات صغيرة وآثار أوسع", "sustainability, trade-offs, action", "conditionals and consequence clauses"),
    (23, 4, "A question worth debating", "سؤال يستحق النقاش", "debate, evidence, counterargument", "structured argument and concession"),
    (24, 4, "The next chapter", "الفصل التالي", "reflection, plans, confidence", "integrated B1 review and future perspective"),
]

SCHEMA = {
    "type": "object",
    "properties": {
        "lessonNumber": {"type": "integer"}, "title": {"type": "string"}, "titleArabic": {"type": "string"},
        "outcome": {"type": "object", "properties": {"canDo": {"type": "string"}, "canDoArabic": {"type": "string"}, "scenario": {"type": "string"}, "scenarioArabic": {"type": "string"}}, "required": ["canDo", "canDoArabic", "scenario", "scenarioArabic"], "additionalProperties": False},
        "retrieval": {"type": "array", "minItems": 3, "maxItems": 4, "items": {"type": "object", "properties": {"language": {"type": "string"}, "prompt": {"type": "string"}, "purpose": {"type": "string"}}, "required": ["language", "prompt", "purpose"], "additionalProperties": False}},
        "network": {"type": "object", "properties": {"theme": {"type": "string"}, "themeArabic": {"type": "string"}, "anchor": {"type": "string"}, "relatedWords": {"type": "array", "minItems": 6, "items": {"type": "string"}}, "chunks": {"type": "array", "minItems": 5, "items": {"type": "string"}}, "collocations": {"type": "array", "minItems": 5, "items": {"type": "string"}}, "register": {"type": "string", "enum": ["neutral", "informal", "formal", "mixed"]}, "priorLevelLinks": {"type": "array", "minItems": 3, "items": {"type": "string"}}, "learningNote": {"type": "string"}, "learningNoteArabic": {"type": "string"}, "wordFamilies": {"type": "array", "minItems": 3, "items": {"type": "object", "properties": {"headword": {"type": "string"}, "forms": {"type": "array", "minItems": 2, "items": {"type": "string"}}, "note": {"type": "string"}, "noteArabic": {"type": "string"}}, "required": ["headword", "forms", "note", "noteArabic"], "additionalProperties": False}}}, "required": ["theme", "themeArabic", "anchor", "relatedWords", "chunks", "collocations", "register", "priorLevelLinks", "learningNote", "learningNoteArabic", "wordFamilies"], "additionalProperties": False},
        "vocabulary": {"type": "array", "minItems": 12, "maxItems": 12, "items": {"type": "object", "properties": {"word": {"type": "string"}, "arabic": {"type": "string"}, "partOfSpeech": {"type": "string"}, "definition": {"type": "string"}, "exampleEN": {"type": "string"}, "exampleAR": {"type": "string"}}, "required": ["word", "arabic", "partOfSpeech", "definition", "exampleEN", "exampleAR"], "additionalProperties": False}},
        "grammar": {"type": "object", "properties": {"topic": {"type": "string"}, "arabicName": {"type": "string"}, "concept": {"type": "string"}, "arabicComparison": {"type": "string"}, "structure": {"type": "string"}, "commonError": {"type": "string"}, "exampleEN": {"type": "string"}, "exampleAR": {"type": "string"}}, "required": ["topic", "arabicName", "concept", "arabicComparison", "structure", "commonError", "exampleEN", "exampleAR"], "additionalProperties": False},
        "readingBrief": {"type": "string"}, "writingPrompt": {"type": "string"},
    },
    "required": ["lessonNumber", "title", "titleArabic", "outcome", "retrieval", "network", "vocabulary", "grammar", "readingBrief", "writingPrompt"], "additionalProperties": False,
}

SYSTEM = """You are an experienced British English curriculum author for Arabic-speaking adult B1 learners. Write original English Journey content only; do not quote, reproduce, or imitate any publisher. Use natural, varied British English and Modern Standard Arabic. Teach vocabulary as purposeful chunks, collocations, word families, and register choices rather than alphabetical lists. Give concise Arabic support for genuinely difficult distinctions, but let English carry the task. Examples must be original, accurate, and usable. Do not invent IPA."""


def prompt(lesson: tuple[int, int, str, str, str, str]) -> str:
    number, module, title, title_ar, theme, grammar = lesson
    return f"""Author English Journey B1 lesson {number} of 24 in module {module}.
Title: {title} / {title_ar}
Theme: {theme}
Grammar/discourse spine: {grammar}

Return only the required JSON. Include exactly 12 new high-value target entries; at least five must be multi-word chunks or strong collocations. Build three accurate word-family groups. Retrieval must repurpose A2 language (experiences, plans, preferences, services, opinions, change) in a B1 task. The scenario must need a connected narrative, practical problem solution, or qualified opinion. The reading brief must specify an original 250–350-word article, email, interview, or story. The writing prompt must request 140–180 words with a clear audience, purpose, and at least one success criterion involving organisation or tone."""


def main() -> None:
    client = OpenAI()
    existing = json.loads(OUT.read_text()) if OUT.exists() else []
    done = {item["lessonNumber"] for item in existing}
    for lesson in LESSONS:
        if lesson[0] in done:
            continue
        response = client.chat.completions.create(model=MODEL, messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": prompt(lesson)}], max_completion_tokens=4600, response_format={"type": "json_schema", "json_schema": {"name": "b1_lesson", "strict": True, "schema": SCHEMA}})
        raw = response.choices[0].message.content
        if not raw:
            raise RuntimeError(f"Lesson {lesson[0]} returned no content")
        authored = json.loads(raw)
        if authored["lessonNumber"] != lesson[0] or len(authored["vocabulary"]) != 12 or len(authored["network"]["wordFamilies"]) < 3:
            raise ValueError(f"Lesson {lesson[0]} failed the B1 content gate")
        existing.append(authored)
        existing.sort(key=lambda item: item["lessonNumber"])
        OUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n")
        print(f"Saved B1 lesson {lesson[0]} ({len(existing)}/24)")
        time.sleep(0.5)


if __name__ == "__main__":
    main()
