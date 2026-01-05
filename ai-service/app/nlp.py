import re
import spacy
from .skills import SKILLS

# Load spaCy model (already installed)
nlp = spacy.load("en_core_web_sm")


def normalize_text(text: str) -> str:
    """
    Normalize resume text for better matching
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9+\s]", " ", text)  # remove punctuation
    text = re.sub(r"\s+", " ", text)           # normalize spaces
    return text


def extract_skills(text: str):
    """
    Extract skills using keyword + regex matching
    """
    if not text:
        return []

    text = normalize_text(text)
    found_skills = set()

    for skill in SKILLS:
        skill_lower = skill.lower()

        # Word-boundary safe match
        pattern = r"\b" + re.escape(skill_lower) + r"\b"

        if re.search(pattern, text):
            found_skills.add(skill)

    return sorted(found_skills)


def calculate_match(resume_skills, job_skills):
    """
    Calculate ATS-style match score
    """
    resume_set = set(map(str.lower, resume_skills))
    job_set = set(map(str.lower, job_skills))

    if not job_set:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "match_percentage": 0
        }

    matched = resume_set & job_set
    missing = job_set - resume_set

    match_percentage = int((len(matched) / len(job_set)) * 100)

    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "match_percentage": match_percentage
    }
