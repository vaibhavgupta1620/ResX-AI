const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadResume,
    getDashboardData,
    getAnalyticsData, // ✅ ADD THIS
} = require("../controllers/resumeController");

/* =====================================================
   UPLOAD & ANALYZE RESUME
   Used by: ResumeAnalyzer.jsx
===================================================== */
router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);

/* =====================================================
   DASHBOARD DATA
   Used by: DashboardHome.jsx
===================================================== */
router.get(
    "/dashboard",
    protect,
    getDashboardData
);

/* =====================================================
   ANALYTICS DATA
   Used by: Analytics.jsx
===================================================== */
router.get(
    "/analytics",
    protect,
    getAnalyticsData
);

module.exports = router;
