import json
import os
from pathlib import Path

import requests

VOCABULARY_PATH = Path("/home/ubuntu/english-journey/shared/course/a1-vocabulary.json")
GENERIC_DEFINITION = "A basic English word describing a person, object, quality, or action."
MODEL = "gpt-5-mini"
CHUNK_SIZE = 25


def call_model(items):
    payload = {
        "model": MODEL,
        "max_completion_tokens": 1600,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a meticulous CEFR A1 curriculum editor. Return a learner-friendly English "
                    "definition for each requested word. Each definition must be accurate for the shown part "
                    "of speech, use very simple A1-level language, be 8–18 words, and must not merely repeat the word."
                ),
            },
            {
                "role": "user",
                "content": "Create definitions for these course entries:\n" + json.dumps(items, ensure_ascii=False),
            },
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "a1_definitions",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {"word": {"type": "string"}, "definition": {"type": "string"}},
                                "required": ["word", "definition"],
                                "additionalProperties": False,
                            },
                        }
                    },
                    "required": ["items"],
                    "additionalProperties": False,
                },
            },
        },
    }
    response = requests.post(
        f"{os.environ['OPENAI_API_BASE'].rstrip('/')}/chat/completions",
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}", "Content-Type": "application/json"},
        json=payload,
        timeout=90,
    )
    response.raise_for_status()
    body = response.json()
    content = body["choices"][0]["message"].get("content")
    if not content:
        raise RuntimeError(f"Model returned no structured content: {json.dumps(body)[:600]}")
    return json.loads(content)["items"]


entries = json.loads(VOCABULARY_PATH.read_text(encoding="utf-8"))
targets = [entry for entry in entries if entry["definition"] == GENERIC_DEFINITION]
targets_by_word = {entry["word"].lower(): entry for entry in targets}
updated = 0

for offset in range(0, len(targets), CHUNK_SIZE):
    chunk = targets[offset : offset + CHUNK_SIZE]
    request_items = [{"word": entry["word"], "partOfSpeech": entry["partOfSpeech"], "example": entry["exampleEN"]} for entry in chunk]
    for result in call_model(request_items):
        key = result["word"].lower()
        definition = result["definition"].strip()
        entry = targets_by_word.get(key)
        if entry and 12 <= len(definition) <= 220 and definition != GENERIC_DEFINITION:
            entry["definition"] = definition
            updated += 1
    print(f"Refined {min(offset + CHUNK_SIZE, len(targets))}/{len(targets)} generic definitions")

remaining = sum(entry["definition"] == GENERIC_DEFINITION for entry in entries)
if remaining:
    raise RuntimeError(f"Definition refinement incomplete: {remaining} generic definitions remain.")

VOCABULARY_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Replaced {updated} generic definitions using {MODEL}.")
