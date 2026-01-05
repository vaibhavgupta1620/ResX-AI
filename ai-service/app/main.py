from fastapi import FastAPI, HTTPException
from .schemas import AnalyzeRequest, AnalyzeResponse
from .nlp import extract_skills, calculate_match
from .utils import clean_text

app = FastAPI(
    title="ResX.AI NLP Service",
    description="AI-powered Resume Analyzer using NLP",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {"status": "AI Service Running"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_resume(data: AnalyzeRequest):
    try:
        resume_text = clean_text(data.resume_text)
        job_text = clean_text(data.job_description)

        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_text)

        match_data = calculate_match(resume_skills, job_skills)

        # 🔍 Optional debug (remove later)
        print("RESUME SKILLS:", resume_skills)
        print("JOB SKILLS:", job_skills)
        print("MATCH %:", match_data["match_percentage"])

        return {
            "extracted_skills": resume_skills,
            "missing_skills": match_data["missing_skills"],
            "match_percentage": match_data["match_percentage"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
