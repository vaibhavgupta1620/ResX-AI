const Results = ({ result }) => {
    if (!result) return null;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">
                Match Score: {result.matchScore}%
            </h2>

            <h3 className="mt-4 font-semibold">Extracted Skills</h3>
            <div className="flex gap-2 flex-wrap">
                {result.extractedSkills.map((s) => (
                    <span key={s} className="bg-green-200 px-2 py-1 rounded">
                        {s}
                    </span>
                ))}
            </div>

            <h3 className="mt-4 font-semibold text-red-600">Missing Skills</h3>
            <div className="flex gap-2 flex-wrap">
                {result.missingSkills.map((s) => (
                    <span key={s} className="bg-red-200 px-2 py-1 rounded">
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Results;
