"""Author original English Journey C1 course packs in resumable, schema-validated batches."""

from __future__ import annotations

import re
from pathlib import Path


LESSONS = [
    (1, 1, "Reading between the lines", "القراءة بين السطور", "implication, framing, authorial purpose", "stance, pragmatic inference, and cautious attribution"),
    (2, 1, "A claim under scrutiny", "ادعاء قيد التدقيق", "evidence, methods, limitations", "evaluative reporting and methodological qualification"),
    (3, 1, "The language of uncertainty", "لغة عدم اليقين", "risk, probability, ambiguity", "epistemic stance and calibrated speculation"),
    (4, 1, "When sources disagree", "عندما تختلف المصادر", "corroboration, bias, competing accounts", "contrastive synthesis and source comparison"),
    (5, 1, "A conclusion, not a slogan", "خلاصة لا شعار", "reasoning, inference, proportion", "complex concession and evidence-led conclusion"),
    (6, 2, "A public issue, privately felt", "قضية عامة تُعاش شخصياً", "policy, lived experience, social impact", "abstract noun phrases and precise contextualisation"),
    (7, 2, "The ethics of convenience", "أخلاقيات السهولة", "technology, consent, responsibility", "counterfactual evaluation and ethical conditionality"),
    (8, 2, "Beyond a single story", "أبعد من رواية واحدة", "identity, representation, perspective", "discursive framing and respectful critical challenge"),
    (9, 2, "What counts as progress?", "ما الذي يُعدّ تقدماً؟", "development, metrics, trade-offs", "nominalisation and balanced evaluative comparison"),
    (10, 2, "The cost of a decision", "كلفة القرار", "allocation, priorities, unintended effects", "complex cause, consequence, and mitigation language"),
    (11, 3, "Designing for disagreement", "تصميم مساحة للخلاف", "deliberation, compromise, public dialogue", "hedged persuasion and diplomatic rebuttal"),
    (12, 3, "An argument with a memory", "حجة لها سياق", "history, precedent, interpretation", "allusive reference and nuanced temporal framing"),
    (13, 3, "Culture in motion", "ثقافة في حركة", "adaptation, belonging, change", "metaphor, qualification, and register shifts"),
    (14, 3, "The limits of expertise", "حدود الخبرة", "authority, evidence, uncertainty", "reported stance and critical appraisal"),
    (15, 3, "A review with consequences", "مراجعة لها تبعات", "criticism, recommendation, public influence", "evaluative lexis, concessive balance, and precise recommendation"),
    (16, 4, "Making complexity readable", "جعل التعقيد قابلاً للقراءة", "explanation, audience, accessibility", "controlled simplification and information structure"),
    (17, 4, "A proposal under pressure", "مقترح تحت الضغط", "implementation, stakeholders, feasibility", "formal proposals, conditions, and contingency planning"),
    (18, 4, "The case against certainty", "الحجة ضد اليقين", "assumptions, doubt, intellectual humility", "rhetorical control and layered qualification"),
    (19, 4, "A voice in a crowded debate", "صوت في نقاش مزدحم", "media, attention, intervention", "strategic emphasis and cohesive argument architecture"),
    (20, 4, "Synthesis with integrity", "تركيب الأفكار بنزاهة", "multiple sources, original judgement, responsible conclusion", "integrated C1 synthesis, citation-aware attribution, and flexible register"),
]


def main() -> None:
    source_path = Path(__file__).with_name("author-b1-course.py")
    source = source_path.read_text()
    lesson_block = "LESSONS = " + repr(LESSONS) + "\n\nSCHEMA ="
    source = re.sub(r"LESSONS = \[.*?\]\n\nSCHEMA =", lesson_block, source, flags=re.S)
    source = source.replace('OUT = Path("shared/course/b1-draft.json")', 'OUT = Path("shared/course/c1-draft.json")')
    source = source.replace("English Journey B1", "English Journey C1")
    source = source.replace("adult B1 learners", "adult C1 learners")
    source = source.replace(
        "Return only the required JSON. Include exactly 12 new high-value target entries; at least five must be multi-word chunks or strong collocations. Build three accurate word-family groups. Retrieval must repurpose A2 language (experiences, plans, preferences, services, opinions, change) in a B1 task. The scenario must need a connected narrative, practical problem solution, or qualified opinion. The reading brief must specify an original 250–350-word article, email, interview, or story. The writing prompt must request 140–180 words with a clear audience, purpose, and at least one success criterion involving organisation or tone.",
        "Return only the required JSON. Include exactly 14 new high-value target entries; at least seven must be precise multi-word expressions, disciplined collocations, or stance-rich discourse moves. Build at least three accurate word-family groups. Retrieval must repurpose B2 language (evidence, counterargument, register, consequence, evaluation, proposal) in a C1 task. The scenario must require critical interpretation, source-aware synthesis, a formal proposal, or a nuanced public intervention. The reading brief must specify an original 550–700-word article, feature, critical review, policy extract, or paired-source dossier with a source-awareness purpose. The writing prompt must request 320–420 words for a defined expert or public audience, require a defensible position informed by more than one perspective, and state success criteria for precision, cohesion, register, and responsible attribution."
    )
    source = source.replace("B1 lesson", "C1 lesson").replace("B1 content gate", "C1 content gate").replace("Saved B1 lesson", "Saved C1 lesson")
    globals_dict = {"__name__": "__main__", "__file__": str(Path(__file__).resolve())}
    exec(compile(source, str(source_path), "exec"), globals_dict)


if __name__ == "__main__":
    main()
