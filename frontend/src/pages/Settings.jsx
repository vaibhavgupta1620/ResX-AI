import { useEffect, useState } from "react";
import {
    User,
    Bell,
    Database,
    Save,
    Download,
    Upload,
    Trash2,
    RotateCcw,
} from "lucide-react";
import api from "../services/api";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: false,
        pushNotifications: false,
        weeklyReports: false,
        analysisComplete: false,
    });

    /* ---------------- FETCH SETTINGS ---------------- */

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/settings");
                setProfile(res.data.profile);
                setNotifications(res.data.notifications);
            } catch (err) {
                console.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    /* ---------------- SAVE SETTINGS ---------------- */

    const saveSettings = async () => {
        try {
            setSaving(true);
            await api.put("/settings", {
                profile,
                notifications,
            });
            alert("Settings saved successfully");
        } catch (err) {
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                Loading settings...
            </p>
        );
    }

    return (
        <div className="flex gap-6">
            {/* Left Menu */}
            <div className="w-72 bg-white dark:bg-gray-900 rounded-2xl shadow dark:shadow-none p-4 h-fit">
                <SettingsTab icon={<User />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                <SettingsTab icon={<Bell />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
                <SettingsTab icon={<Database />} label="Data Management" active={activeTab === "data"} onClick={() => setActiveTab("data")} />
            </div>

            {/* Right Content */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow dark:shadow-none p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold capitalize text-gray-800 dark:text-gray-200">
                        {activeTab.replace("-", " ")}
                    </h2>

                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-full
                        bg-gradient-to-r from-purple-500 to-teal-500
                        text-white text-sm shadow"
                    >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {activeTab === "profile" && (
                    <ProfileSection profile={profile} setProfile={setProfile} />
                )}
                {activeTab === "notifications" && (
                    <NotificationsSection notifications={notifications} setNotifications={setNotifications} />
                )}
                {activeTab === "data" && <DataManagementSection />}
            </div>
        </div>
    );
};

/* ---------------- SECTIONS ---------------- */

const ProfileSection = ({ profile, setProfile }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <Input label="Email Address" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
                label="Role"
                value={profile.role}
                options={["HR Manager", "Recruiter", "Talent Acquisition", "Admin"]}
                onChange={(v) => setProfile({ ...profile, role: v })}
            />
            <Input
                label="Change Password"
                type="password"
                placeholder="Enter new password"
                onChange={(v) => setProfile({ ...profile, password: v })}
            />
        </div>
    </div>
);

const NotificationsSection = ({ notifications, setNotifications }) => (
    <div className="space-y-6">
        {Object.entries(notifications).map(([key, value]) => (
            <Toggle
                key={key}
                title={formatLabel(key)}
                enabled={value}
                onToggle={() =>
                    setNotifications({ ...notifications, [key]: !value })
                }
            />
        ))}
    </div>
);

const DataManagementSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard icon={<Download className="text-purple-500" />} title="Export Data" />
        <ActionCard icon={<Upload className="text-teal-500" />} title="Import Data" />
        <ActionCard icon={<RotateCcw className="text-blue-500" />} title="Reset Settings" />

        <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400">
                <Trash2 />
                <h3 className="font-semibold">Delete All Data</h3>
            </div>
            <p className="text-sm text-red-500 dark:text-red-400">
                Permanently delete all your data. This action cannot be undone.
            </p>
        </div>
    </div>
);

/* ---------------- COMPONENTS ---------------- */

const SettingsTab = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm mb-2 transition
        ${active
                ? "bg-gradient-to-r from-purple-500 to-teal-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
    >
        {icon}
        {label}
    </button>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div>
        <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            {label}
        </label>
        <input
            type={type}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border
            bg-gray-50 dark:bg-gray-800
            border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-purple-500"
        />
    </div>
);

const Select = ({ label, value, options, onChange }) => (
    <div>
        <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            {label}
        </label>
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border
            bg-gray-50 dark:bg-gray-800
            border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-purple-500"
        >
            <option value="">Select</option>
            {options.map((opt) => (
                <option key={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

const Toggle = ({ title, enabled, onToggle }) => (
    <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">
            {title}
        </h4>
        <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition
            ${enabled ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"}`}
        >
            <div
                className={`w-4 h-4 bg-white rounded-full transition
                ${enabled ? "translate-x-6" : ""}`}
            />
        </button>
    </div>
);

const ActionCard = ({ icon, title }) => (
    <div className="border dark:border-gray-700 rounded-xl p-6 hover:shadow dark:hover:shadow-none transition">
        <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
            {icon}
            <h3 className="font-semibold">{title}</h3>
        </div>
    </div>
);

const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default Settings;
