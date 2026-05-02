// src/components/LevelTabs.jsx
export default function LevelTabs({ levels, active, onChange }) {
  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
      {levels.map((level) => {
        const label = level[0].toUpperCase() + level.slice(1);
        const isActive = active === level;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={[
              "px-3 py-1 text-xs font-medium rounded-md transition",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
