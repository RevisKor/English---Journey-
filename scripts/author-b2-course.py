"""Author original English Journey B2 course packs in resumable, schema-validated batches."""

from __future__ import annotations

import re
from pathlib import Path


LESSONS = [
    (1, 1, "Information under pressure", "المعلومات تحت الضغط", "claims, sources, verification", "reporting verbs and degrees of certainty"),
    (2, 1, "The price of convenience", "ثمن السهولة", "services, trade-offs, consumer choices", "concession, qualification, and complex comparison"),
    (3, 1, "A workplace worth joining", "مكان عمل يستحق الانضمام إليه", "work culture, values, expectations", "advanced modals for obligation, criticism, and inference"),
    (4, 1, "When a system fails", "حين يفشل نظام ما", "institutions, accountability, remedies", "passive reporting and impersonal structures"),
    (5, 1, "The story behind a statistic", "القصة وراء الإحصائية", "data, trends, interpretation", "hedging, approximation, and trend language"),
    (6, 1, "A difficult decision", "قرار صعب", "ethics, priorities, consequences", "mixed conditionals and counterfactual reasoning"),
    (7, 2, "Designing public space", "تصميم المساحة العامة", "cities, access, inclusion", "nominalisation and formal proposal language"),
    (8, 2, "Who gets heard?", "من يُسمع صوته؟", "representation, participation, power", "cleft sentences and emphasis"),
    (9, 2, "The case for change", "الحجة من أجل التغيير", "reform, evidence, resistance", "argument structure and refutation"),
    (10, 2, "Risk without panic", "المخاطرة دون هلع", "health, safety, probability", "speculation and calibrated certainty"),
    (11, 2, "Expertise and trust", "الخبرة والثقة", "advice, credentials, credibility", "reporting clauses and stance markers"),
    (12, 2, "A fair compromise", "تسوية عادلة", "negotiation, interests, outcomes", "conditional negotiation and diplomatic disagreement"),
    (13, 3, "The attention economy", "اقتصاد الانتباه", "media, habits, persuasion", "participle clauses and cause-effect chains"),
    (14, 3, "Progress, for whom?", "تقدم، ولمن؟", "innovation, inequality, access", "contrast, concession, and nuanced comparison"),
    (15, 3, "A culture in translation", "ثقافة في الترجمة", "language, identity, representation", "hedging generalisations and respectful qualification"),
    (16, 3, "The business of belonging", "تجارة الانتماء", "brands, communities, loyalty", "evaluative language and rhetorical questions"),
    (17, 3, "Making a strong case", "بناء حجة قوية", "debate, counterargument, evidence", "advanced discourse markers and rebuttal"),
    (18, 3, "When technology decides", "حين تقرر التكنولوجيا", "automation, bias, responsibility", "relative clauses, passives, and ethical framing"),
    (19, 4, "A review that changes minds", "مراجعة تغيّر الآراء", "criticism, recommendation, criteria", "appraisal language and nuanced evaluation"),
    (20, 4, "Learning from disagreement", "التعلّم من الخلاف", "discussion, conflict, perspective", "reformulation and respectful challenge"),
    (21, 4, "A proposal with consequences", "مقترح له تبعات", "planning, policy, implementation", "formal recommendations and projected outcomes"),
    (22, 4, "Work, purpose, and pressure", "العمل والمعنى والضغط", "careers, fulfilment, burnout", "complex verb patterns and emphasis"),
    (23, 4, "What should be preserved?", "ما الذي ينبغي الحفاظ عليه؟", "heritage, development, sustainability", "balanced argument and conditional consequence"),
    (24, 4, "A position worth defending", "موقف يستحق الدفاع عنه", "synthesis, audience, response", "integrated B2 argument, register, and cohesion"),
]


def main() -> None:
    source_path = Path(__file__).with_name("author-b1-course.py")
    source = source_path.read_text()
    lesson_block = "LESSONS = " + repr(LESSONS) + "\n\nSCHEMA ="
    source = re.sub(r"LESSONS = \[.*?\]\n\nSCHEMA =", lesson_block, source, flags=re.S)
    source = source.replace('OUT = Path("shared/course/b1-draft.json")', 'OUT = Path("shared/course/b2-draft.json")')
    source = source.replace("English Journey B1", "English Journey B2")
    source = source.replace("adult B1 learners", "adult B2 learners")
    source = source.replace("Return only the required JSON. Include exactly 12 new high-value target entries; at least five must be multi-word chunks or strong collocations. Build three accurate word-family groups. Retrieval must repurpose A2 language (experiences, plans, preferences, services, opinions, change) in a B1 task. The scenario must need a connected narrative, practical problem solution, or qualified opinion. The reading brief must specify an original 250–350-word article, email, interview, or story. The writing prompt must request 140–180 words with a clear audience, purpose, and at least one success criterion involving organisation or tone.", "Return only the required JSON. Include exactly 12 new high-value target entries; at least six must be multi-word chunks, strong collocations, or formal discourse expressions. Build three accurate word-family groups. Retrieval must repurpose B1 language (viewpoint, evidence, consequence, negotiation, narrative, review) in a B2 task. The scenario must require an argument, evaluation, proposal, or nuanced response to a real reader. The reading brief must specify an original 350–450-word article, report, interview, review, or feature. The writing prompt must request 200–260 words with a clear audience, purpose, counterpoint or qualification, and success criteria for register and cohesion.")
    source = source.replace("B1 lesson", "B2 lesson").replace("B1 content gate", "B2 content gate").replace("Saved B1 lesson", "Saved B2 lesson")
    globals_dict = {"__name__": "__main__", "__file__": str(Path(__file__).resolve())}
    exec(compile(source, str(source_path), "exec"), globals_dict)


if __name__ == "__main__":
    main()
