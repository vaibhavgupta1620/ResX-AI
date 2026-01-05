const fs = require("fs/promises");
const pdfParse = require("pdf-parse");

/* =========================================================
   PDF TEXT EXTRACTION
========================================================= */
exports.extractText = async (filePath) => {
    try {
        // 1️⃣ Read PDF asynchronously
        const dataBuffer = await fs.readFile(filePath);

        // 2️⃣ Parse PDF
        const pdfData = await pdfParse(dataBuffer);

        if (!pdfData.text || pdfData.text.trim().length === 0) {
            throw new Error("No readable text found in PDF");
        }

        return pdfData.text;
    } catch (err) {
        console.error("❌ PDF parsing error:", err.message);
        throw new Error("Failed to extract text from PDF");
    } finally {
        // 3️⃣ Cleanup uploaded file (important)
        try {
            await fs.unlink(filePath);
        } catch (_) {
            // ignore cleanup error
        }
    }
};
