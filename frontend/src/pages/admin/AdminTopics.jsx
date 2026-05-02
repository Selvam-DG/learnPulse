import { useEffect, useState } from "react";
import { api } from "../../api";

const ALL_LEVELS = ["basics", "intermediate", "advanced"];

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editingSlug, setEditingSlug] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    order: 1,
    levels: ALL_LEVELS,
  });

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await api.getTopics();
      setTopics(Array.isArray(data) ? data : []);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const startNew = () => {
    setEditingSlug(null);
    setForm({
      name: "",
      slug: "",
      order: topics.length + 1,
      levels: ALL_LEVELS,
    });
  };

  const startEdit = (topic) => {
    setEditingSlug(topic.slug);
    setForm({
      name: topic.name,
      slug: topic.slug,
      order: topic.order ?? 1,
      levels: topic.levels ?? ALL_LEVELS,
    });
  };

  const toggleLevel = (level) => {
    setForm((prev) => {
      const exists = prev.levels.includes(level);

      return {
        ...prev,
        levels: exists
          ? prev.levels.filter((item) => item !== level)
          : [...prev.levels, level],
      };
    });
  };

  const saveTopic = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        order: Number(form.order) || 1,
        levels: form.levels,
      };

      if (!payload.name || !payload.slug) {
        setErr("Name and slug are required.");
        return;
      }

      if (editingSlug) {
        await api.updateTopic(editingSlug, payload);
      } else {
        await api.createTopic(payload);
      }

      await loadTopics();
      startNew();
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  };

  const deleteTopic = async (slug) => {
    if (!confirm("Delete this topic? Lessons will not be automatically removed.")) return;

    try {
      await api.deleteTopic(slug);
      await loadTopics();

      if (editingSlug === slug) {
        startNew();
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Content structure
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">Manage Topics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and organize topics shown on the LearnPulse home and learn pages.
          </p>
        </div>

        <button
          onClick={startNew}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          New Topic
        </button>
      </header>

      {err && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {err}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
        <form
          onSubmit={saveTopic}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="font-bold">
            {editingSlug ? `Editing: ${editingSlug}` : "Create Topic"}
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Python"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="python"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use lowercase text without spaces.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Order</label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Levels</label>
              <div className="flex flex-wrap gap-2">
                {ALL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleLevel(level)}
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      form.levels.includes(level)
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300",
                    ].join(" ")}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                {editingSlug ? "Save Topic" : "Create Topic"}
              </button>

              {editingSlug && (
                <button
                  type="button"
                  onClick={startNew}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="font-bold">Existing Topics</h2>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading topics...</p>
          ) : topics.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
              No topics yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                    <th className="py-2">Name</th>
                    <th className="py-2">Slug</th>
                    <th className="py-2">Order</th>
                    <th className="py-2">Levels</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr
                      key={topic.slug}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-3 font-medium">{topic.name}</td>
                      <td className="py-3 text-xs text-slate-500">{topic.slug}</td>
                      <td className="py-3">{topic.order}</td>
                      <td className="py-3 text-xs">
                        {topic.levels?.join(" • ") || ALL_LEVELS.join(" • ")}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => startEdit(topic)}
                          className="mr-3 text-xs font-medium text-violet-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.slug)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
