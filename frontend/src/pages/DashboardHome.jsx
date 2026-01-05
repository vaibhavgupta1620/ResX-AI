// DashboardHome.jsx
import { useEffect, useState } from "react";
import { FileText, Users, Star, Clock, MoreVertical } from "lucide-react";
import api from "../services/api";
import { socket } from "../services/socket";

// Recharts
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

/* ---------------- COLORS ---------------- */

const SKILL_COLORS = [
    "#7dd3fc", // blue
    "#c084fc", // purple
    "#fb7185", // pink
    "#fbbf24", // amber
    "#34d399", // green
    "#60a5fa", // indigo
];

/* ---------------- COMPONENT ---------------- */

const DashboardHome = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState({
        stats: { total: 0, analyzed: 0, avgScore: 0, avgTime: 0 },
        topSkills: [],
        recentResumes: [],
        scoreDistribution: [],
    });

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/resume/dashboard");
            setDashboard(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        socket.on("dashboard:update", fetchDashboard);
        return () => socket.off("dashboard:update", fetchDashboard);
    }, []);

    if (loading) {
        return <p className="text-gray-400">Loading dashboard...</p>;
    }

    const totalSkills = dashboard.topSkills.reduce(
        (sum, s) => sum + s.count,
        0
    );

    const pieData = dashboard.topSkills.map((s) => ({
        name: s.name,
        value: s.count,
        percent: Math.round((s.count / totalSkills) * 100),
    }));

    return (
        <>
            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-purple-400">
                    ATS Resume Analyzer
                </h1>
                <p className="text-gray-400 mt-1">
                    AI-powered candidate analysis
                </p>
                <div className="h-px mt-6 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-transparent" />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={<FileText />} label="Total Resumes" value={dashboard.stats.total} />
                <StatCard icon={<Users />} label="Analyzed Resumes" value={dashboard.stats.analyzed} />
                <StatCard icon={<Star />} label="Avg. Match Score" value={`${dashboard.stats.avgScore}%`} />
                <StatCard icon={<Clock />} label="Avg. Processing Time" value={`${dashboard.stats.avgTime} min`} />
            </div>

            {/* TOP SKILLS */}
            <DarkCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-100">
                        Top Skills Detected
                    </h3>
                    <MoreVertical className="text-gray-400" />
                </div>

                {pieData.length === 0 ? (
                    <p className="text-gray-400 text-center">
                        Upload resumes to see skills
                    </p>
                ) : (
                    <div className="h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    innerRadius={90}
                                    outerRadius={130}
                                    paddingAngle={3}
                                    label={({ percent }) => `${percent}%`}
                                >
                                    {pieData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={SKILL_COLORS[i % SKILL_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: "#020617",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 8,
                                        color: "#fff",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </DarkCard>

            {/* RECENT + QUEUE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                <DarkCard>
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">
                        Processing Queue
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400">
                        <Clock size={32} />
                        <span className="ml-2">No resumes processing</span>
                    </div>
                </DarkCard>

                <DarkCard>
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">
                        Recent Resumes
                    </h3>

                    {dashboard.recentResumes.map((r) => (
                        <RecentResume
                            key={r._id}
                            initials={r.filename.slice(0, 2).toUpperCase()}
                            name={r.filename}
                            date={new Date(r.createdAt).toLocaleDateString()}
                            score={`${r.score}%`}
                        />
                    ))}
                </DarkCard>
            </div>

            {/* SCORE DISTRIBUTION */}
            <div className="mt-12">
                <DarkCard>
                    <h3 className="text-lg font-semibold text-gray-100 mb-6">
                        Score Distribution
                    </h3>

                    {!dashboard.scoreDistribution.length ? (
                        <p className="text-gray-400">
                            No data available
                        </p>
                    ) : (
                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <BarChart
                                    data={dashboard.scoreDistribution.map((s) => ({
                                        range: s.label,
                                        percent: Math.round(s.percent * 100),
                                    }))}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.08)"
                                    />
                                    <XAxis
                                        dataKey="range"
                                        stroke="#9ca3af"
                                    />
                                    <YAxis
                                        unit="%"
                                        stroke="#9ca3af"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#020617",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 8,
                                            color: "#fff",
                                        }}
                                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                    />
                                    <Bar
                                        dataKey="percent"
                                        fill="#a78bfa"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </DarkCard>
            </div>


        </>
    );
};

/* ---------------- UI COMPONENTS ---------------- */

const DarkCard = ({ children }) => (
    <div className="
        rounded-2xl p-6
        bg-gradient-to-br from-[#020617] to-[#020617]/80
        border border-white/10
        shadow-xl
    ">
        {children}
    </div>
);

const StatCard = ({ icon, label, value }) => (
    <div className="
        relative rounded-xl p-6
        bg-gradient-to-br from-[#020617] to-[#020617]/70
        border border-white/10
    ">
        <div className="absolute top-4 right-4 text-purple-400">
            {icon}
        </div>
        <p className="text-sm text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-2">
            {value}
        </h3>
    </div>
);

const RecentResume = ({ initials, name, date, score }) => (
    <div className="
        flex items-center justify-between
        p-3 rounded-lg
        hover:bg-white/5 transition
    ">
        <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                {initials}
            </div>
            <div>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-xs text-gray-400">{date}</p>
            </div>
        </div>
        <span className="text-green-400 text-sm font-medium">
            ⭐ {score}
        </span>
    </div>
);

export default DashboardHome;
