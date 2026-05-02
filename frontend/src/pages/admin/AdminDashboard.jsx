import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";

export default function AdminDashboard() {
  const [topics, setTopics] = useState([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await api.getAdminMe();

        const topicData = await api.getTopics();
        setTopics(topicData);

        let total = 0;

        for (const topic of topicData) {
          const levels = topic.levels || ["basics", "intermediate", "advanced"];

          for (const level of levels) {
            const lessons = await api.getLessonsByTopic(topic.slug, level);
            total += lessons.length;
          }
        }

        setLessonCount(total);
      } catch (e) {
        setError(e.message || "Unable to load dashboard");
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage LearnPulse topics and lesson cards from one place.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/topics"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Manage Topics
          </Link>
          <Link
            to="/admin/lessons"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Manage Lessons
          </Link>
        </div>
      </header>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Topics</p>
          <p className="mt-2 text-3xl font-extrabold">{topics.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Lessons</p>
          <p className="mt-2 text-3xl font-extrabold">{lessonCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
          <p className="mt-2 text-lg font-bold text-emerald-600">Active</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h2 className="font-bold">Quick Actions</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            to="/admin/topics"
            className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-400 hover:bg-violet-50 dark:border-slate-800 dark:hover:bg-violet-950/30"
          >
            <p className="font-semibold">Add or edit topics</p>
            <p className="mt-1 text-sm text-slate-500">
              Create categories like Python, DSA, Math, Science, and more.
            </p>
          </Link>

          <Link
            to="/admin/lessons"
            className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-400 hover:bg-violet-50 dark:border-slate-800 dark:hover:bg-violet-950/30"
          >
            <p className="font-semibold">Create lesson cards</p>
            <p className="mt-1 text-sm text-slate-500">
              Add summaries, markdown explanations, tags, and code snippets.
            </p>
          </Link>
          <Link
            to="/admin/suggestions"
            className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-400 hover:bg-violet-50 dark:border-slate-800 dark:hover:bg-violet-950/30"
          >
            <p className="font-semibold">Review suggestions</p>
            <p className="mt-1 text-sm text-slate-500">
              Approve, reject, edit, or convert user ideas into new LearnPulse content.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
