"""Create original English Journey A2 lesson content in resumable, schema-validated batches.

This is a one-time authoring aid. It uses a low-cost model, validates structure,
and writes data for subsequent editorial and automated checks. It does not copy
Oxford or Cambridge material; those resources remain CEFR-alignment references.
"""

from __future__ import annotations

import json
import os
import time
from pathlib import Path

from openai import OpenAI

OUT = Path("shared/course/a2-draft.json")
MODEL = "gpt-5-mini"

LESSONS = [
    (1, 1, "Routines that work", "عادات وروتين مفيد", "habits, wellbeing, frequency", "present simple, adverbs of frequency"),
    (2, 1, "Small changes, real results", "تغييرات صغيرة ونتائج حقيقية", "change, progress, comparison", "comparatives and present continuous"),
    (3, 1, "Food, energy, and choices", "الطعام والطاقة والاختيارات", "food choices, health, quantity", "countable/uncountable nouns and quantifiers"),
    (4, 1, "Free time and priorities", "وقت الفراغ والأولويات", "hobbies, preferences, time", "like, would like, prefer"),
    (5, 1, "People who help us", "الأشخاص الذين يساعدوننا", "relationships, personality, support", "adjectives and basic relative clauses"),
    (6, 2, "A neighbourhood worth knowing", "حي يستحق أن تعرفه", "towns, services, places", "there is/are, place prepositions"),
    (7, 2, "Getting there", "الوصول إلى هناك", "transport, directions, movement", "imperatives, direction phrases"),
    (8, 2, "Staying somewhere new", "الإقامة في مكان جديد", "accommodation, requests, problems", "can/could for requests"),
    (9, 2, "Shopping with a purpose", "تسوّق لهدف", "products, money, value", "too/enough, comparisons"),
    (10, 2, "The people around you", "الأشخاص من حولك", "appearance, character, community", "who/which/that clauses"),
    (11, 3, "A day I will remember", "يوم لن أنساه", "events, memories, feelings", "past simple narrative and sequencing"),
    (12, 3, "Things I have done", "أشياء قمت بها", "life experience, travel, achievement", "present perfect with ever/never/already/yet"),
    (13, 3, "Making plans together", "وضع خطط معاً", "invitations, arrangements, future time", "going to, present continuous for arrangements"),
    (14, 3, "When plans go wrong", "عندما لا تسير الخطط كما نريد", "problems, apologies, solutions", "advice with should and polite apologies"),
    (15, 3, "Celebrations and traditions", "الاحتفالات والتقاليد", "culture, events, invitations", "past habits and time expressions"),
    (16, 4, "Study, work, and goals", "الدراسة والعمل والأهداف", "learning, work, ambition", "have to, need to, can"),
    (17, 4, "Technology in daily life", "التقنية في الحياة اليومية", "devices, communication, online habits", "first conditional introduction"),
    (18, 4, "Media and simple opinions", "الإعلام والآراء البسيطة", "films, news, preference, reasons", "because, so, although"),
    (19, 4, "Solving everyday problems", "حل المشكلات اليومية", "services, complaints, repair, support", "requests, offers, and suggestions"),
    (20, 4, "My next step", "خطوتي التالية", "review, goals, confidence", "mixed A2 review and future plans"),
]

SCHEMA = {
    "type": "object",
    "properties": {
        "lessonNumber": {"type": "integer"},
        "title": {"type": "string"},
        "titleArabic": {"type": "string"},
        "outcome": {
            "type": "object",
            "properties": {
                "canDo": {"type": "string"}, "canDoArabic": {"type": "string"},
                "scenario": {"type": "string"}, "scenarioArabic": {"type": "string"},
            },
            "required": ["canDo", "canDoArabic", "scenario", "scenarioArabic"],
            "additionalProperties": False,
        },
        "retrieval": {
            "type": "array", "minItems": 3, "maxItems": 4,
            "items": {
                "type": "object",
                "properties": {"language": {"type": "string"}, "prompt": {"type": "string"}, "purpose": {"type": "string"}},
                "required": ["language", "prompt", "purpose"], "additionalProperties": False,
            },
        },
        "network": {
            "type": "object",
            "properties": {
                "theme": {"type": "string"}, "themeArabic": {"type": "string"}, "anchor": {"type": "string"},
                "relatedWords": {"type": "array", "items": {"type": "string"}, "minItems": 4},
                "chunks": {"type": "array", "items": {"type": "string"}, "minItems": 3},
                "collocations": {"type": "array", "items": {"type": "string"}, "minItems": 3},
                "register": {"type": "string", "enum": ["neutral", "informal", "formal", "mixed"]},
                "priorLevelLinks": {"type": "array", "items": {"type": "string"}, "minItems": 3},
                "learningNote": {"type": "string"}, "learningNoteArabic": {"type": "string"},
            },
            "required": ["theme", "themeArabic", "anchor", "relatedWords", "chunks", "collocations", "register", "priorLevelLinks", "learningNote", "learningNoteArabic"],
            "additionalProperties": False,
        },
        "vocabulary": {
            "type": "array", "minItems": 15, "maxItems": 15,
            "items": {
                "type": "object",
                "properties": {
                    "word": {"type": "string"}, "arabic": {"type": "string"}, "partOfSpeech": {"type": "string"},
                    "definition": {"type": "string"}, "exampleEN": {"type": "string"}, "exampleAR": {"type": "string"},
                },
                "required": ["word", "arabic", "partOfSpeech", "definition", "exampleEN", "exampleAR"],
                "additionalProperties": False,
            },
        },
        "grammar": {
            "type": "object",
            "properties": {"topic": {"type": "string"}, "arabicName": {"type": "string"}, "concept": {"type": "string"}, "arabicComparison": {"type": "string"}, "structure": {"type": "string"}, "commonError": {"type": "string"}, "exampleEN": {"type": "string"}, "exampleAR": {"type": "string"}},
            "required": ["topic", "arabicName", "concept", "arabicComparison", "structure", "commonError", "exampleEN", "exampleAR"],
            "additionalProperties": False,
        },
        "readingBrief": {"type": "string"},
        "writingPrompt": {"type": "string"},
    },
    "required": ["lessonNumber", "title", "titleArabic", "outcome", "retrieval", "network", "vocabulary", "grammar", "readingBrief", "writingPrompt"],
    "additionalProperties": False,
}

SYSTEM = """You are an experienced British English curriculum author for Arabic-speaking adult A2 learners.
Create original, engaging course data. Do not quote, reproduce, or imitate Oxford, Cambridge, or any other publisher’s content. Use simple, natural British English. The Arabic must be Modern Standard Arabic and learner-friendly.
Vocabulary must be varied by theme and usefulness; include words, phrasal chunks, and collocations only when they can be taught at A2. Definitions must be plain English. Examples must be original, practical, and accurate. Do not invent IPA. Make grammar explanations clear, with a brief Arabic contrast that avoids stereotypes.
"""


def prompt(lesson: tuple[int, int, str, str, str, str]) -> str:
    number, module, title, title_ar, theme, grammar = lesson
    return f"""Author English Journey A2 lesson {number} of module {module}.
Title: {title} / {title_ar}
Theme: {theme}
Grammar spine: {grammar}

Return only the required JSON. Include exactly 15 fresh target entries, with no artificial alphabetical grouping. At least four must be multi-word chunks or strongly useful collocations. Retrieval must reuse very common A1 language (for example: time, places, people, food, go, want, like, can, yesterday, tomorrow) in an A2 context. The reading brief should describe a 130–160-word original passage, and the writing prompt should require 60–90 words with an audience and purpose."""


def main() -> None:
    client = OpenAI()
    existing = json.loads(OUT.read_text()) if OUT.exists() else []
    done = {item["lessonNumber"] for item in existing}
    for lesson in LESSONS:
        if lesson[0] in done:
            continue
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": prompt(lesson)}],
            max_completion_tokens=4200,
            response_format={"type": "json_schema", "json_schema": {"name": "a2_lesson", "strict": True, "schema": SCHEMA}},
        )
        raw = response.choices[0].message.content
        if not raw:
            raise RuntimeError(f"Lesson {lesson[0]} returned no content")
        authored = json.loads(raw)
        if authored["lessonNumber"] != lesson[0] or len(authored["vocabulary"]) != 15:
            raise ValueError(f"Lesson {lesson[0]} does not meet the expected structure")
        existing.append(authored)
        existing.sort(key=lambda x: x["lessonNumber"])
        OUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n")
        print(f"Saved A2 lesson {lesson[0]} ({len(existing)}/20)")
        time.sleep(0.4)


if __name__ == "__main__":
    main()
