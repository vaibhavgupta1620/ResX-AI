// Dashboard.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Moon,
    Sun,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <div
            className="
            h-screen flex
            bg-gray-100
            dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#020617] dark:to-black
            transition-colors duration-300
        "
        >
            {/* Sidebar */}
            <aside
                className="
                w-64 flex flex-col h-screen
                bg-white
                dark:bg-white/5 dark:backdrop-blur-xl
                border-r border-gray-200 dark:border-white/10
            "
            >
                {/* Logo + Theme Toggle */}
                <div className="p-6 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            ResX
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            AI-Powered Resume Analyzer
                        </p>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="
                        p-2 rounded-lg
                        bg-gray-100 hover:bg-gray-200
                        dark:bg-white/10 dark:hover:bg-white/20
                        transition
                    "
                        title="Toggle Theme"
                    >
                        {isDark ? (
                            <Sun size={18} className="text-yellow-400" />
                        ) : (
                            <Moon size={18} className="text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
                    <SidebarLink to="/resume-analyzer" icon={<FileText />} label="Resume Analyzer" />
                    <SidebarLink to="/analytics" icon={<BarChart3 />} label="Analytics" />
                    <SidebarLink to="/settings" icon={<Settings />} label="Settings" />
                </nav>

                {/* Logout */}
                <div className="p-4 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="
                        w-full flex items-center gap-3 px-4 py-2 rounded-lg
                        text-red-600 dark:text-red-400
                        hover:bg-red-50 dark:hover:bg-red-500/10
                        transition
                    "
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 text-gray-900 dark:text-gray-100">
                <Outlet />
            </main>
        </div>
    );
};

/* Sidebar Link */
const SidebarLink = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `
            flex items-center gap-3 px-4 py-2 rounded-lg transition-all
            ${isActive
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
            }
        `
        }
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

export default Dashboard;
