// src/components/LessonCard.jsx
export default function LessonCard({ item, onOpen }) {
  const levelLabel = item.level?.[0]?.toUpperCase() + item.level?.slice(1) || "Level";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-500/70 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-slate-900 dark:text-slate-100">
          {item.title}
        </h3>

        <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          {levelLabel}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {item.summary || "A short LearnPulse summary will appear here."}
      </p>

      {item.topic_slug && (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          {item.topic_slug}
        </p>
      )}

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => onOpen(item.slug)}
          className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          View
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
