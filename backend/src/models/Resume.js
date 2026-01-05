const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        filename: {
            type: String,
            required: true,
        },

        // ✅ CANONICAL FIELD (used everywhere)
        skills: {
            type: [String],
            default: [],
        },

        missingSkills: {
            type: [String],
            default: [],
        },

        score: {
            type: Number,
            default: 0,
        },

        processingTime: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
