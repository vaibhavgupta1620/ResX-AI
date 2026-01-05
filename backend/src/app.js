const express = require("express");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(
    cors({
        origin: "*", // frontend URL later (e.g. http://localhost:5173)
        credentials: true,
    })
);

app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
    res.send("ResX.AI Backend Running 🚀");
});

module.exports = app;
