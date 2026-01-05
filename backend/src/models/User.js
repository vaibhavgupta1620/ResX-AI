// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        /* ================= SETTINGS ================= */

        role: {
            type: String,
            default: "User", // HR Manager, Recruiter, Admin, etc.
        },

        settings: {
            theme: {
                type: String,
                default: "light",
            },

            notifications: {
                emailAlerts: {
                    type: Boolean,
                    default: false,
                },
                pushNotifications: {
                    type: Boolean,
                    default: false,
                },
                weeklyReports: {
                    type: Boolean,
                    default: false,
                },
                analysisComplete: {
                    type: Boolean,
                    default: false,
                },
            },
        },
    },
    { timestamps: true }
);

/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* ================= PASSWORD CHECK ================= */

userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
