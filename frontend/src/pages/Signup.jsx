import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const res = await registerUser({
                name,
                email,
                password,
            });

            // ✅ IMPORTANT: store token + user
            login(res.data.token, res.data.user);

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-white"
            >
                <h2 className="text-3xl font-bold text-center mb-2">
                    Create Account 🚀
                </h2>
                <p className="text-center text-sm text-gray-300 mb-6">
                    Join{" "}
                    <span className="text-blue-400 font-semibold">
                        ResX.AI
                    </span>{" "}
                    today
                </p>

                {error && (
                    <p className="bg-red-500/20 text-red-300 text-sm text-center py-2 rounded mb-4">
                        {error}
                    </p>
                )}

                {/* Name */}
                <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-1 block">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-1 block">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                {/* Password */}
                <div className="mb-6 relative">
                    <label className="text-sm text-gray-300 mb-1 block">
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-60"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* Footer */}
                <p className="text-sm mt-6 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-400 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
