const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* ================= TOKEN ================= */

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        return res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                settings: user.settings,
            },
        });
    } catch (err) {
        console.error("❌ Register error:", err);
        return res.status(500).json({ message: "Registration failed" });
    }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                settings: user.settings,
            },
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ message: "Login failed" });
    }
};
