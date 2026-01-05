const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ---------------- UPLOAD FOLDER ---------------- */
const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------- STORAGE CONFIG ---------------- */
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

/* ---------------- FILE FILTER ---------------- */
const fileFilter = (_, file, cb) => {
    const allowedTypes = ["application/pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && ext === ".pdf") {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only PDF resumes are allowed."
            ),
            false
        );
    }
};

/* ---------------- MULTER EXPORT ---------------- */
module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
