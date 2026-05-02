import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  default: {
    bg: "bg-violet-50 dark:bg-violet-950",
    accent: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    hover:
      "hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/50",
  },
  python: {
    bg: "bg-sky-50 dark:bg-sky-950",
    accent: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    hover:
      "hover:border-sky-400 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/50",
  },
  javascript: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    accent: "bg-yellow-500",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    hover:
      "hover:border-yellow-400 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/50",
  },
  math: {
    bg: "bg-amber-50 dark:bg-amber-950",
    accent: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    hover:
      "hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/50",
  },
  science: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    accent: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    hover:
      "hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50",
  },
  history: {
    bg: "bg-rose-50 dark:bg-rose-950",
    accent: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    hover:
      "hover:border-rose-400 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/50",
  },
  dsa: {
    bg: "bg-indigo-50 dark:bg-indigo-950",
    accent: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    hover:
      "hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50",
  },
};

function getColor(slug = "", name = "") {
  const value = `${slug} ${name}`.toLowerCase();

  const key = Object.keys(CATEGORY_COLORS).find(
    (k) => k !== "default" && value.includes(k)
  );

  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
}

function TopicCard({ topic }) {
  const c = getColor(topic.slug, topic.name);
  const initials = topic.name?.slice(0, 2).toUpperCase() || "LP";

  return (
    <Link
      to={`/learn/${topic.slug}`}
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 bg-white dark:bg-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${c.border} ${c.hover}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white ${c.accent}`}
        >
          {initials}
        </div>

        <svg
          className="mt-1 h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div>
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {topic.name}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Learn the core ideas, revise quickly, and practice with short examples.
        </p>

        {topic.levels?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topic.levels.map((level) => (
              <span
                key={level}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.text} ${c.bg}`}
              >
                {level}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

const STEPS = [
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    label: "Pick a topic",
    desc: "Choose from programming, computer science, math, science, history, and more.",
  },
  {
    icon: "M3 4h13M3 8h9m-9 4h6m4 0l4-4-4-4",
    label: "Choose your level",
    desc: "Start with Basics, move to Intermediate, or jump into Advanced concepts.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    label: "Learn in short pulses",
    desc: "Read focused cards with clear explanations, examples, and code snippets.",
  },
  {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0",
    label: "Revise anytime",
    desc: "Use quick cards to refresh concepts before exams, interviews, or projects.",
  },
];

const STATS = [
  { value: "Quick", label: "Short lessons" },
  { value: "3", label: "Learning levels" },
  { value: "∞", label: "Growing library" },
];

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTopics()
      .then((data) => {
        setTopics(Array.isArray(data) ? data : (data.items ?? []));
      })
      .catch((e) => {
        setError(e.message || "Unable to load topics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) =>
      topic.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [topics, search]);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 px-6 py-14 text-center dark:from-violet-700 dark:via-violet-800 dark:to-indigo-950 sm:px-8">
        <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-100">
            LearnPulse · Micro-learning for quick revision
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Revise smarter with
            <br />
            <span className="text-violet-200">focused learning pulses</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-violet-100/90">
            LearnPulse helps you understand and revise important topics through focused
            concept cards, clean explanations, and practical examples — perfect for exams,
            interviews, and daily learning.
          </p>

          <div className="mt-8 flex items-center justify-center gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-violet-300">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#topics"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition-colors hover:bg-violet-50"
            >
              Explore Topics
            </a>

            <Link
              to="/suggest"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Suggest a Topic
            </Link>
          </div>
        </div>
      </section>

      {/* Why LearnPulse */}
      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Why LearnPulse
        </h2>
        <p className="mb-6 text-xl font-bold text-slate-800 dark:text-slate-100">
          Built for fast learning and even faster revision.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              No long tutorials
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Get the core idea first. Each card focuses on what matters most, without
              overwhelming details.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              Learn by level
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Move step by step from Basics to Intermediate and Advanced concepts.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              Practical examples
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Understand faster with short examples, code snippets, and revision-friendly
              summaries.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          How it works
        </h2>
        <p className="mb-6 text-xl font-bold text-slate-800 dark:text-slate-100">
          Four simple steps. Zero fluff.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/60 dark:text-violet-300">
                  {index + 1}
                </span>

                <svg
                  className="h-5 w-5 text-violet-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {step.label}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section id="topics">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Explore
            </h2>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Available Topics
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose a topic and start revising from the level that fits you.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder-slate-400 outline-none ring-violet-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-14 text-center dark:border-slate-700">
            <svg
              className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search ? `No topics match "${search}".` : "No topics are available yet."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-medium text-violet-500 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-violet-200 bg-violet-50 px-6 py-7 dark:border-violet-800/50 dark:bg-violet-950/30 sm:flex-row">
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">
            Want a topic added to LearnPulse?
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Suggest a concept, programming topic, or subject you want to revise faster.
          </p>
        </div>

        <Link
          to="/suggest"
          className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Suggest a Topic →
        </Link>
      </section>
    </div>
  );
}
