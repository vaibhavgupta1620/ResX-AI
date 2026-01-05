import { useRef, useState } from "react";
import {
    UploadCloud,
    X,
    Loader2,
} from "lucide-react";
import api from "../services/api";
import { socket } from "../services/socket";

const ResumeAnalyzer = () => {
    const fileInputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState("");

    const [analysisResult, setAnalysisResult] = useState({
        filename: "",
        createdAt: null,
        skills: [],
        missingSkills: [],
        score: 0,
    });

    const [error, setError] = useState("");

    /* ---------------- FILE HANDLING ---------------- */

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
        setError("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles(Array.from(e.dataTransfer.files));
        setError("");
    };

    const handleDragOver = (e) => e.preventDefault();

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    /* ---------------- UPLOAD & ANALYZE ---------------- */

    const analyzeResume = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        formData.append("resume", files[0]);
        formData.append("jobDescription", jobDescription);

        try {
            setAnalyzing(true);
            setError("");

            const res = await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setAnalysisResult({
                filename: res.data.filename || "",
                createdAt: res.data.createdAt || null,
                skills: res.data.skills || [],
                missingSkills: res.data.missingSkills || [],
                score: res.data.score || 0,
            });

            socket.emit("dashboard:update");
            socket.emit("analytics:update");

        } catch (err) {
            setError("Resume analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen p-8
            bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50
            dark:from-gray-900 dark:via-gray-950 dark:to-black">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-purple-600 dark:text-purple-400">
                    Resume Analyzer
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Upload a resume and compare it with a job description.
                </p>
            </div>

            {/* Upload Box */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed rounded-2xl p-12 text-center
                border-purple-300 dark:border-gray-700
                bg-gradient-to-r from-purple-100/50 to-cyan-100/50
                dark:from-gray-800 dark:to-gray-900"
            >
                <UploadCloud className="mx-auto mb-4 text-purple-500 dark:text-purple-400" size={40} />
                <h2 className="text-xl font-medium mb-1 text-gray-800 dark:text-gray-200">
                    Upload Resume
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Drag & drop or browse
                </p>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    className="mt-4 px-6 py-2 rounded-full
                    bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                >
                    Choose File
                </button>
            </div>

            {/* Job Description */}
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow dark:shadow-none p-6">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Job Description
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Paste the job description to compare against the resume
                </p>

                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here..."
                    rows={6}
                    className="w-full p-4 border rounded-xl
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow dark:shadow-none p-6">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Selected Resume
                    </h3>

                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center
                            border rounded-lg px-4 py-2
                            border-gray-300 dark:border-gray-700
                            text-gray-800 dark:text-gray-200"
                        >
                            <span>{file.name}</span>
                            <button onClick={() => removeFile(index)}>
                                <X size={16} className="text-red-500" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={analyzeResume}
                        disabled={analyzing}
                        className="mt-4 px-6 py-2 rounded-full
                        bg-purple-600 text-white
                        flex items-center gap-2"
                    >
                        {analyzing && <Loader2 className="animate-spin" size={16} />}
                        Analyze Resume
                    </button>
                </div>
            )}

            {error && <p className="mt-6 text-red-500">{error}</p>}

            {/* Analysis Result */}
            {analysisResult.filename && (
                <div className="mt-10 bg-white dark:bg-gray-900 rounded-3xl shadow-xl dark:shadow-none p-8">
                    <div className="flex justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                {analysisResult.filename}
                            </h2>
                            {analysisResult.createdAt && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Analyzed on{" "}
                                    {new Date(analysisResult.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {analysisResult.score}%
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Match Score
                            </p>
                        </div>
                    </div>

                    <ScoreBar label="Overall Match" value={analysisResult.score} />

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                            Detected Skills
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {analysisResult.skills.length > 0 ? (
                                analysisResult.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full
                                        bg-gray-100 dark:bg-gray-800
                                        text-gray-800 dark:text-gray-200 text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No skills detected
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Components */

const ScoreBar = ({ label, value }) => (
    <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-green-600 dark:text-green-400">{value}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);

export default ResumeAnalyzer;
