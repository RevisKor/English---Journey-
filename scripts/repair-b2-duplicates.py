"""Replace repeated B2 target items with fresh, lesson-specific equivalents."""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

from openai import OpenAI

OUT = Path("shared/course/b2-draft.json")
MODEL = "gpt-5-mini"
ITEM_SCHEMA = {
    "type": "object",
    "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {
        "index": {"type": "integer"}, "word": {"type": "string"}, "arabic": {"type": "string"},
        "partOfSpeech": {"type": "string"}, "definition": {"type": "string"}, "exampleEN": {"type": "string"}, "exampleAR": {"type": "string"},
    }, "required": ["index", "word", "arabic", "partOfSpeech", "definition", "exampleEN", "exampleAR"], "additionalProperties": False}}},
    "required": ["items"], "additionalProperties": False,
}


def main() -> None:
    lessons = json.loads(OUT.read_text())
    seen: set[str] = set()
    duplicates: dict[int, list[int]] = defaultdict(list)
    for lesson in lessons:
        for index, item in enumerate(lesson["vocabulary"]):
            key = item["word"].strip().lower()
            if key in seen:
                duplicates[lesson["lessonNumber"]].append(index)
            else:
                seen.add(key)
    if not duplicates:
        print("No repeated B2 targets found.")
        return

    client = OpenAI()
    used = sorted(seen)
    for lesson_number, indices in duplicates.items():
        lesson = next(item for item in lessons if item["lessonNumber"] == lesson_number)
        repeated = [{"index": index, "word": lesson["vocabulary"][index]["word"]} for index in indices]
        prompt = f"""You are repairing original B2 course vocabulary. Replace only the repeated target entries below with fresh, useful B2 terms, collocations, or precise discourse expressions that fit the lesson’s argument, evaluation, or register focus. Do not use an already-used target. Give Modern Standard Arabic support and original examples.

Lesson: {lesson['title']}; theme: {lesson['network']['theme']}; grammar: {lesson['grammar']['topic']}
Repeated entries to replace: {json.dumps(repeated)}
Already-used targets to avoid: {json.dumps(used)}
Return exactly one replacement per requested index in the required JSON."""
        replacements = []
        for attempt in range(6):
            response = client.chat.completions.create(model=MODEL, messages=[{"role": "system", "content": "You are a precise British English curriculum editor. Output only the requested JSON."}, {"role": "user", "content": prompt + f"\nThis is validation retry {attempt + 1}; every replacement must be different from the avoid list and the other replacements."}], max_completion_tokens=2400, response_format={"type": "json_schema", "json_schema": {"name": "b2_replacements", "strict": True, "schema": ITEM_SCHEMA}})
            raw = response.choices[0].message.content
            candidate = json.loads(raw)["items"] if raw else []
            candidate_keys = [item.get("word", "").strip().lower() for item in candidate]
            if sorted(item.get("index") for item in candidate) == indices and len(candidate_keys) == len(set(candidate_keys)) and all(key not in seen for key in candidate_keys):
                replacements = candidate
                break
        if not replacements:
            raise ValueError(f"Lesson {lesson_number} could not produce unique replacement entries after six validation retries")
        for replacement in replacements:
            key = replacement["word"].strip().lower()
            lesson["vocabulary"][replacement["index"]] = {field: replacement[field] for field in ["word", "arabic", "partOfSpeech", "definition", "exampleEN", "exampleAR"]}
            seen.add(key)
        OUT.write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + "\n")
        print(f"Repaired B2 lesson {lesson_number}: {len(indices)} repeated targets")


if __name__ == "__main__":
    main()
