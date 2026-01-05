const User = require("../models/User");
const Resume = require("../models/Resume");

/* =====================================================
   GET SETTINGS
===================================================== */
exports.getSettings = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
        profile: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
        notifications: user.settings.notifications,
        theme: user.settings.theme,
    });
};

/* =====================================================
   UPDATE SETTINGS
===================================================== */
exports.updateSettings = async (req, res) => {
    const { profile, notifications, theme } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        "settings.notifications": notifications,
        "settings.theme": theme,
    });

    res.json({ message: "Settings updated" });
};

/* =====================================================
   EXPORT DATA
===================================================== */
exports.exportData = async (req, res) => {
    const resumes = await Resume.find({ user: req.user.id });
    const user = await User.findById(req.user.id);

    res.json({
        user,
        resumes,
    });
};

/* =====================================================
   RESET SETTINGS
===================================================== */
exports.resetSettings = async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
        settings: {
            theme: "light",
            notifications: {
                emailAlerts: false,
                pushNotifications: false,
                weeklyReports: false,
                analysisComplete: false,
            },
        },
    });

    res.json({ message: "Settings reset" });
};

/* =====================================================
   DELETE ALL DATA
===================================================== */
exports.deleteAllData = async (req, res) => {
    await Resume.deleteMany({ user: req.user.id });
    res.json({ message: "All resume data deleted" });
};
