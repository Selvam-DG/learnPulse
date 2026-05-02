import { useState } from "react";
import { api } from "../api";

const EMPTY_FORM = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

export default function Suggest() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [err, setErr] = useState("");

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    setErr("");

    if (!form.email.trim() || !form.topic.trim()) {
      setErr("Email and topic are required.");
      return;
    }

    try {
      setStatus("sending");

      await api.sendFeedback({
        ...form,
        email: form.email.trim(),
        topic: form.topic.trim(),
        source: "web",
      });

      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch (e) {
      setErr(e.message || "Unable to send suggestion.");
      setStatus("idle");
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[1fr,420px] lg:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Suggest a topic
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            What should LearnPulse explain next?
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Tell us which concept, programming topic, subject, or revision card you want
            added. Your suggestion helps shape the LearnPulse content roadmap.
          </p>

          {status === "sent" && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              Thanks! Your suggestion has been submitted for review.
            </div>
          )}

          {err && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.topic}
                onChange={(e) => updateField("topic", e.target.value)}
                placeholder="Example: SQL Joins, React Hooks, Dijkstra Algorithm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="What should the lesson cover? Basics, examples, code snippets, interview tips, or revision notes?"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suggestions are reviewed before being added to LearnPulse.
              </p>

              <button
                disabled={status === "sending"}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending"
                  ? "Submitting..."
                  : status === "sent"
                    ? "Suggestion Sent"
                    : "Submit Suggestion"}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-800 dark:bg-violet-950/30">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Good suggestions include:
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>• A clear topic name</li>
              <li>• The level: basics, intermediate, or advanced</li>
              <li>• Example use cases or code snippets you want covered</li>
              <li>• Whether it is for exams, interviews, or quick revision</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Popular ideas
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Python OOP",
                "SQL Joins",
                "React Hooks",
                "DSA Sorting",
                "MongoDB Basics",
                "REST APIs",
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => updateField("topic", topic)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-400"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
