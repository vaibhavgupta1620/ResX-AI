require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

/* ---------------- DB CONNECT ---------------- */
connectDB();

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
    cors: {
        origin: "*", // frontend URL later
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    });
});

/* 🔑 Make io available inside controllers */
app.set("io", io);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
