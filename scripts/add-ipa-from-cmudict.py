import json
from pathlib import Path

import cmudict

VOCABULARY_PATH = Path("/home/ubuntu/english-journey/shared/course/a1-vocabulary.json")

ARPABET_TO_IPA = {
    "AA": "ɑ", "AE": "æ", "AH": "ʌ", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ",
    "B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "EH": "ɛ", "ER": "ɜr",
    "EY": "eɪ", "F": "f", "G": "ɡ", "HH": "h", "IH": "ɪ", "IY": "i",
    "JH": "dʒ", "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ŋ",
    "OW": "oʊ", "OY": "ɔɪ", "P": "p", "R": "r", "S": "s", "SH": "ʃ",
    "T": "t", "TH": "θ", "UH": "ʊ", "UW": "u", "V": "v", "W": "w",
    "Y": "j", "Z": "z", "ZH": "ʒ",
}


def pronunciation_to_ipa(pronunciation):
    pieces = []
    for phoneme in pronunciation:
        base = phoneme.rstrip("012")
        stress = phoneme[-1] if phoneme[-1].isdigit() else ""
        ipa = ARPABET_TO_IPA.get(base, "")
        if stress == "1":
            pieces.append("ˈ")
        elif stress == "2":
            pieces.append("ˌ")
        pieces.append(ipa)
    return "/" + "".join(pieces) + "/" if pieces else ""


entries = json.loads(VOCABULARY_PATH.read_text(encoding="utf-8"))
pronunciations = cmudict.dict()
covered = 0
missing = []

for entry in entries:
    lookup = entry["word"].lower().replace(" ", "_")
    variants = pronunciations.get(lookup)
    if variants:
        entry["ipa"] = pronunciation_to_ipa(variants[0])
        covered += 1
    else:
        missing.append(entry["word"])

VOCABULARY_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Added local IPA for {covered}/{len(entries)} A1 vocabulary records.")
print("Missing IPA:", ", ".join(missing) if missing else "none")
