const Resume = require("../models/Resume");
const { extractText } = require("../utils/pdfParser");
const { extractSkills } = require("../services/pythonService");

/* =========================================================
   DEFAULT JOB DESCRIPTION (FALLBACK)
   Used when user does not paste JD
========================================================= */
const DEFAULT_JOB_DESCRIPTION = `
python java javascript react node express django flask fastapi
mongodb mysql postgresql sql
git github docker linux aws
machine learning pandas numpy scikit-learn
`;

/* =========================================================
   UPLOAD & ANALYZE RESUME
   Used by: ResumeAnalyzer.jsx
========================================================= */
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No resume file uploaded",
            });
        }

        const startTime = Date.now();

        /* 1️⃣ Extract text from PDF */
        const resumeText = await extractText(req.file.path);

        /* 2️⃣ Prepare Job Description */
        const jobDescription =
            req.body.jobDescription &&
                req.body.jobDescription.trim().length > 0
                ? req.body.jobDescription
                : DEFAULT_JOB_DESCRIPTION;

        console.log("📄 JD SENT TO AI:", jobDescription.slice(0, 200));

        /* 3️⃣ Call AI Service */
        const aiResult = await extractSkills(
            resumeText,
            jobDescription
        );

        console.log("🧠 AI RESULT:", aiResult);

        const processingTime = Math.round(
            (Date.now() - startTime) / 1000
        );

        /* 4️⃣ Save result to MongoDB */
        const resume = await Resume.create({
            user: req.user.id,
            filename: req.file.originalname,

            // ✅ CORRECT FIELD MAPPING
            skills: aiResult.extractedSkills || [],
            missingSkills: aiResult.missingSkills || [],
            score: aiResult.matchPercentage || 0,

            processingTime,
        });

        /* 5️⃣ Emit socket updates */
        const io = req.app.get("io");
        if (io) {
            io.emit("dashboard:update");
            io.emit("analytics:update");
        }

        return res.status(201).json(resume);

    } catch (err) {
        console.error("❌ Resume upload error:", err);
        return res.status(500).json({
            message: "Resume analysis failed",
        });
    }
};

/* =========================================================
   DASHBOARD DATA
   Used by: DashboardHome.jsx
========================================================= */
exports.getDashboardData = async (req, res) => {
    try {
        const resumes = await Resume.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        const total = resumes.length;

        const avgScore =
            total === 0
                ? 0
                : Math.round(
                    resumes.reduce((s, r) => s + (r.score || 0), 0) /
                    total
                );

        const avgTime =
            total === 0
                ? 0
                : Math.round(
                    resumes.reduce(
                        (s, r) => s + (r.processingTime || 0),
                        0
                    ) / total
                );

        /* ---------- TOP SKILLS ---------- */
        const skillMap = {};
        resumes.forEach((r) => {
            (r.skills || []).forEach((skill) => {
                skillMap[skill] = (skillMap[skill] || 0) + 1;
            });
        });

        const topSkills = Object.entries(skillMap).map(
            ([name, count]) => ({ name, count })
        );

        /* ---------- SCORE DISTRIBUTION ---------- */
        const scoreDistribution = [
            { label: "0-40", percent: 0 },
            { label: "41-60", percent: 0 },
            { label: "61-80", percent: 0 },
            { label: "81-100", percent: 0 },
        ];

        resumes.forEach((r) => {
            if (r.score <= 40) scoreDistribution[0].percent++;
            else if (r.score <= 60) scoreDistribution[1].percent++;
            else if (r.score <= 80) scoreDistribution[2].percent++;
            else scoreDistribution[3].percent++;
        });

        scoreDistribution.forEach((range) => {
            range.percent =
                total === 0
                    ? 0
                    : Math.round((range.percent / total) * 100);
        });

        return res.json({
            stats: {
                total,
                analyzed: total,
                avgScore,
                avgTime,
            },
            topSkills,
            recentResumes: resumes.slice(0, 3),
            scoreDistribution,
        });

    } catch (err) {
        console.error("❌ Dashboard error:", err);
        return res.status(500).json({
            message: "Failed to load dashboard data",
        });
    }
};

/* =========================================================
   ANALYTICS DATA
   Used by: Analytics.jsx
========================================================= */
exports.getAnalyticsData = async (req, res) => {
    try {
        const days = parseInt(req.query.days || "7", 10);

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const resumes = await Resume.find({
            user: req.user.id,
            createdAt: { $gte: fromDate },
        });

        const totalApplications = resumes.length;

        const avgScore =
            totalApplications === 0
                ? 0
                : Math.round(
                    resumes.reduce((s, r) => s + (r.score || 0), 0) /
                    totalApplications
                );

        const excellentCandidates = resumes.filter(
            (r) => r.score >= 85
        ).length;

        const avgProcessingTime =
            totalApplications === 0
                ? 0
                : Math.round(
                    resumes.reduce(
                        (s, r) => s + (r.processingTime || 0),
                        0
                    ) / totalApplications
                );

        /* ---------- SCORE TRENDS ---------- */
        const scoreTrends = resumes.map((r) => ({
            date: r.createdAt,
            score: r.score,
        }));

        /* ---------- TOP SKILLS ---------- */
        const skillMap = {};
        resumes.forEach((r) => {
            (r.skills || []).forEach((skill) => {
                skillMap[skill] = (skillMap[skill] || 0) + 1;
            });
        });

        const topSkills = Object.entries(skillMap).map(
            ([name, count]) => ({ name, count })
        );

        /* ---------- APPLICATION VOLUME ---------- */
        const applicationVolume = resumes.reduce((acc, r) => {
            const day = r.createdAt.toISOString().split("T")[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});

        return res.json({
            stats: {
                totalApplications,
                avgScore,
                excellentCandidates,
                avgProcessingTime,
            },
            scoreTrends,
            topSkills,
            applicationVolume,
            performanceMetrics: null,
        });

    } catch (err) {
        console.error("❌ Analytics error:", err);
        return res.status(500).json({
            message: "Failed to load analytics data",
        });
    }
};
