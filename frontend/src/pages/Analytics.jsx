import { useEffect, useState } from "react";
import {
    FileText,
    BarChart3,
    Users,
    Clock,
    Download,
} from "lucide-react";
import api from "../services/api";
import { socket } from "../services/socket";

const Analytics = () => {
    const [range, setRange] = useState("7");
    const [loading, setLoading] = useState(true);

    const [analytics, setAnalytics] = useState({
        stats: {
            totalApplications: 0,
            avgScore: 0,
            excellentCandidates: 0,
            avgProcessingTime: 0,
        },
        scoreTrends: [],
        topSkills: [],
        applicationVolume: [],
        performanceMetrics: null,
    });

    const fetchAnalytics = async () => {
        try {
            const res = await api.get(`/analytics?days=${range}`);
            setAnalytics(res.data);
        } catch (err) {
            console.error("Analytics fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [range]);

    useEffect(() => {
        // 🔴 Live update
        socket.on("analytics:update", fetchAnalytics);

        // 🟡 Polling fallback
        const interval = setInterval(fetchAnalytics, 15000);

        return () => {
            socket.off("analytics:update", fetchAnalytics);
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading analytics...</p>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-semibold text-purple-600">
                        Analytics & Reports
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive insights into your recruitment process.
                    </p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="px-4 py-2 rounded-full border bg-white shadow-sm text-sm"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={<FileText />}
                    label="Total Applications"
                    value={analytics.stats.totalApplications}
                />
                <StatCard
                    icon={<BarChart3 />}
                    label="Average Score"
                    value={`${analytics.stats.avgScore}%`}
                />
                <StatCard
                    icon={<Users />}
                    label="Excellent Candidates"
                    value={analytics.stats.excellentCandidates}
                />
                <StatCard
                    icon={<Clock />}
                    label="Avg. Processing Time"
                    value={`${analytics.stats.avgProcessingTime} min`}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Trends */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="font-semibold mb-4">Score Trends</h3>
                    {analytics.scoreTrends.length === 0 ? (
                        <EmptyChart text="No score trend data available" />
                    ) : (
                        <ChartPlaceholder text="📈 Line Chart (Scores Over Time)" />
                    )}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="font-semibold mb-4">
                        Most In-Demand Skills
                    </h3>
                    {analytics.topSkills.length === 0 ? (
                        <EmptyChart text="No skill data available" />
                    ) : (
                        <ChartPlaceholder text="📊 Skills Distribution Chart" />
                    )}
                </div>
            </div>

            {/* Application Volume */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-semibold mb-4">Application Volume</h3>
                {analytics.applicationVolume.length === 0 ? (
                    <EmptyChart text="No application volume data" />
                ) : (
                    <ChartPlaceholder text="🌊 Area Chart (Applications per Day)" />
                )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-semibold mb-6">Performance Metrics</h3>

                {!analytics.performanceMetrics ? (
                    <EmptyChart text="Performance metrics unavailable" />
                ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-gray-400">
                        🕸 Radar Chart (Performance vs Benchmark)
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------- Components ---------------- */

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl shadow p-6 relative">
        <div className="absolute top-4 right-4 text-purple-500">
            {icon}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
);

const EmptyChart = ({ text }) => (
    <div className="h-64 flex items-center justify-center text-gray-400">
        {text}
    </div>
);

const ChartPlaceholder = ({ text }) => (
    <div className="h-64 flex items-center justify-center text-gray-400">
        {text}
    </div>
);

export default Analytics;
