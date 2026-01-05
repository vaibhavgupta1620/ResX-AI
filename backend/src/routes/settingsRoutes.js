const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
    getSettings,
    updateSettings,
    exportData,
    resetSettings,
    deleteAllData,
} = require("../controllers/settingsController");

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

router.get("/export", protect, exportData);
router.post("/reset", protect, resetSettings);
router.delete("/delete-all", protect, deleteAllData);

module.exports = router;
