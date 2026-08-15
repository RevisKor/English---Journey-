"""Author small, original word-family networks for the existing A2 lessons."""

from __future__ import annotations

import json
from pathlib import Path

from openai import OpenAI

SOURCE = Path("shared/course/a2-draft.json")
OUTPUT = Path("shared/course/a2-word-families.json")

SCHEMA = {
    "type": "object",
    "properties": {
        "lessonNumber": {"type": "integer"},
        "families": {
            "type": "array", "minItems": 2, "maxItems": 2,
            "items": {
                "type": "object",
                "properties": {
                    "headword": {"type": "string"},
                    "forms": {"type": "array", "minItems": 2, "maxItems": 4, "items": {"type": "string"}},
                    "note": {"type": "string"},
                    "noteArabic": {"type": "string"},
                },
                "required": ["headword", "forms", "note", "noteArabic"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["lessonNumber", "families"],
    "additionalProperties": False,
}


def main() -> None:
    client = OpenAI()
    lessons = json.loads(SOURCE.read_text())
    complete = json.loads(OUTPUT.read_text()) if OUTPUT.exists() else []
    done = {item["lessonNumber"] for item in complete}
    for lesson in lessons:
        number = lesson["lessonNumber"]
        if number in done:
            continue
        targets = ", ".join(item["word"] for item in lesson["vocabulary"])
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": "You are a precise British English curriculum editor for Arabic-speaking A2 learners. Return JSON only. Create original learning notes; do not reproduce publisher content."},
                {"role": "user", "content": f"For A2 lesson {number}, {lesson['title']}, create exactly two real word families drawn from these lesson targets: {targets}. Each family must list a genuine headword and 2–4 closely related forms useful at A2 (for example decide/decision/decisive). Do not invent forms. Explain the relationship in plain English and Modern Standard Arabic."},
            ],
            max_completion_tokens=1000,
            response_format={"type": "json_schema", "json_schema": {"name": "a2_word_families", "strict": True, "schema": SCHEMA}},
        )
        content = response.choices[0].message.content
        if not content:
            raise RuntimeError(f"No word-family output for A2 lesson {number}")
        item = json.loads(content)
        if item["lessonNumber"] != number:
            raise ValueError(f"Mismatched word-family output for lesson {number}")
        complete.append(item)
        complete.sort(key=lambda entry: entry["lessonNumber"])
        OUTPUT.write_text(json.dumps(complete, ensure_ascii=False, indent=2) + "\n")
        print(f"Saved families for A2 lesson {number}")


if __name__ == "__main__":
    main()
