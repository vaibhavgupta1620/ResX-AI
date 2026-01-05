const axios = require("axios");

/* =========================================================
   AI SERVICE CALL
========================================================= */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

if (!AI_SERVICE_URL) {
    console.error("❌ AI_SERVICE_URL is not defined in .env");
}

exports.extractSkills = async (resumeText, jobDescription = "") => {
    try {
        if (!AI_SERVICE_URL) {
            throw new Error("AI_SERVICE_URL is missing");
        }

        const response = await axios.post(
            `${AI_SERVICE_URL}/analyze`,
            {
                resume_text: resumeText,
                job_description: jobDescription,
            },
            {
                timeout: 20000, // 20 seconds timeout
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // 🔍 Debug (remove later if needed)
        console.log("✅ AI SERVICE RESPONSE:", response.data);

        return {
            extractedSkills: response.data.extracted_skills || [],
            missingSkills: response.data.missing_skills || [],
            matchPercentage: response.data.match_percentage || 0,
        };

    } catch (error) {
        console.error("❌ AI SERVICE ERROR");

        // Axios timeout
        if (error.code === "ECONNABORTED") {
            throw new Error("AI service timeout (20s exceeded)");
        }

        // FastAPI responded with error
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            throw new Error(
                `AI service error: ${error.response.status}`
            );
        }

        // Network / service down
        if (error.request) {
            throw new Error("AI service unreachable");
        }

        // Unknown error
        throw new Error("Failed to process resume with AI service");
    }
};
