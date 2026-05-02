// src/components/TopicPills.jsx
import { Link, useParams } from "react-router-dom";

export default function TopicPills({ topics }) {
  const { topicSlug } = useParams();

  if (!topics || topics.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No topics available yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => {
        const active = topic.slug === topicSlug;
        return (
          <Link
            key={topic.slug}
            to={`/learn/${topic.slug}`}
            className={[
              "px-3 py-1 rounded-full border text-sm transition",
              active
                ? "border-blue-500 bg-blue-500 text-white dark:bg-blue-400 dark:border-blue-400 dark:text-slate-900"
                : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            {topic.name}
          </Link>
        );
      })}
    </div>
  );
}
