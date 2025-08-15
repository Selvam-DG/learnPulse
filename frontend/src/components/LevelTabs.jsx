export default function LevelTabs({levels, active, onChange}) {
    return (
        <div className="flex gap-2 mt-4 bg-gray-200 dark:bg-slate-700">
            {levels.map( level => (
                <button key={level}
                onClick={() => onChange(level)}
                className={"px-3 py-1 rounded-md text-sm border" + 
                (active === level ? " text-white bg-slate-900 dark:bg-white dark:text-slate-900" : "border-slate-300 dark:border-slate-600" )}
                >
                    {level[0].toUpperCase()+level.slice(1)}
                </button>
            ))}
        </div>
    )
    
};
