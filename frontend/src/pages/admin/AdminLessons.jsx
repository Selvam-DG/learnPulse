import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../../api";

const LEVELS = ["basics", "intermediate", "advanced"];

function emptyLessonForm(topicSlug = "", level = "basics", order = 1) {
  return {
    topic_slug: topicSlug,
    level,
    order,
    title: "",
    slug: "",
    summary: "",
    content_markdown: "",
    tags: "",
    code_blocks: [],
  };
}

function formatDate(value) {
  if (!value) return "Never";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Invalid date";
  }
}

export default function AdminLessons() {
  const [topics, setTopics] = useState([]);
  const [topicSlug, setTopicSlug] = useState("");
  const [level, setLevel] = useState("basics");

  const [lessons, setLessons] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(emptyLessonForm());
  const [editingSlug, setEditingSlug] = useState(null);
  const [saving, setSaving] = useState(false);

  const selectedTopicName = useMemo(
    () => topics.find((topic) => topic.slug === topicSlug)?.name || topicSlug,
    [topics, topicSlug]
  );

  const loadTopics = async () => {
    try {
      const data = await api.getTopics();
      const list = Array.isArray(data) ? data : [];

      setTopics(list);

      if (!topicSlug && list.length > 0) {
        setTopicSlug(list[0].slug);
      }
    } catch (e) {
      setErr(e.message || "Failed to load topics");
    }
  };

  const loadLessons = async () => {
    if (!topicSlug) return;

    try {
      setLoadingList(true);
      const data = await api.getLessonsByTopic(topicSlug, level);
      setLessons(Array.isArray(data) ? data : []);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load lessons");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadLessons();
    setForm(emptyLessonForm(topicSlug, level, lessons.length + 1));
    setEditingSlug(null);
  }, [topicSlug, level]);

  const startNewLesson = () => {
    setEditingSlug(null);
    setErr("");
    setSuccess("");
    setForm(emptyLessonForm(topicSlug, level, lessons.length + 1));
  };

  const startEditLesson = async (slug) => {
    try {
      setErr("");
      setSuccess("");

      const data = await api.getLesson(slug);

      setEditingSlug(slug);
      setForm({
        topic_slug: data.topic_slug || topicSlug,
        level: data.level || level,
        order: data.order || 1,
        title: data.title || "",
        slug: data.slug || "",
        summary: data.summary || "",
        content_markdown: data.content_markdown || "",
        tags: (data.tags || []).join(", "),
        code_blocks: data.code_blocks || [],
      });
    } catch (e) {
      setErr(e.message || "Failed to load lesson");
    }
  };

  const onChangeField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addCodeBlock = () => {
    setForm((prev) => ({
      ...prev,
      code_blocks: [
        ...prev.code_blocks,
        {
          language: "python",
          snippet: "",
        },
      ],
    }));
  };

  const updateCodeBlock = (index, key, value) => {
    setForm((prev) => {
      const blocks = [...prev.code_blocks];
      blocks[index] = {
        ...blocks[index],
        [key]: value,
      };

      return {
        ...prev,
        code_blocks: blocks,
      };
    });
  };

  const removeCodeBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      code_blocks: prev.code_blocks.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const buildPayload = () => {
    return {
      topic_slug: form.topic_slug || topicSlug,
      level: form.level || level,
      order: Number(form.order) || 1,
      title: form.title.trim(),
      slug: form.slug.trim(),
      summary: form.summary.trim(),
      content_markdown: form.content_markdown.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      code_blocks: form.code_blocks.filter((block) => block.snippet?.trim()),
    };
  };

  const saveLesson = async (e) => {
    e.preventDefault();

    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      const payload = buildPayload();

      if (!payload.title || !payload.slug || !payload.content_markdown) {
        setErr("Title, slug, and content are required.");
        return;
      }

      if (payload.content_markdown.length < 40) {
        setErr("Content must be at least 40 characters.");
        return;
      }

      if (editingSlug) {
        await api.updateLesson(editingSlug, payload);
        setSuccess("Lesson updated successfully.");
      } else {
        await api.createLesson(payload);
        setSuccess("Lesson created successfully.");
      }

      await loadLessons();
      setEditingSlug(payload.slug);
    } catch (e) {
      setErr(e.message || "Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (slug) => {
    if (!confirm("Delete this lesson permanently?")) return;

    try {
      await api.deleteLesson(slug);
      await loadLessons();

      if (editingSlug === slug) {
        startNewLesson();
      }

      setSuccess("Lesson deleted successfully.");
    } catch (e) {
      setErr(e.message || "Failed to delete lesson");
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Lesson editor
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">Manage Lessons</h1>
          <p className="mt-1 text-sm text-slate-500">
            Click a lesson to edit it. Add summaries, markdown, tags, and code snippets.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={topicSlug}
            onChange={(e) => setTopicSlug(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {topics.map((topic) => (
              <option key={topic.slug} value={topic.slug}>
                {topic.name}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={startNewLesson}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            New Lesson
          </button>
        </div>
      </header>

      {err && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {err}
        </p>
      )}

      {success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {success}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4">
            <h2 className="font-bold">
              {selectedTopicName} · {level}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {lessons.length} lesson{lessons.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {loadingList ? (
            <p className="text-sm text-slate-500">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
              No lessons yet. Create the first lesson for this topic and level.
            </div>
          ) : (
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {lessons.map((lesson) => {
                const active = editingSlug === lesson.slug;

                return (
                  <button
                    key={lesson.slug}
                    type="button"
                    onClick={() => startEditLesson(lesson.slug)}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",
                      active
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-slate-200 hover:border-violet-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{lesson.slug}</p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        #{lesson.order}
                      </span>
                    </div>

                    {lesson.summary && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {lesson.summary}
                      </p>
                    )}

                    <p className="mt-3 text-[11px] text-slate-400">
                      Last edited: {formatDate(lesson.updated_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">
                {editingSlug ? "Edit Lesson" : "Create Lesson"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {editingSlug
                  ? `Editing ${editingSlug}`
                  : "Fill the form below to create a new lesson."}
              </p>
            </div>

            {editingSlug && (
              <button
                type="button"
                onClick={() => deleteLesson(editingSlug)}
                className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:hover:bg-red-950/30"
              >
                Delete Lesson
              </button>
            )}
          </div>

          <form onSubmit={saveLesson} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => onChangeField("title", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Variables in Python"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => onChangeField("slug", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="python-variables"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Topic</label>
                <select
                  value={form.topic_slug || topicSlug}
                  onChange={(e) => onChangeField("topic_slug", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                >
                  {topics.map((topic) => (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => onChangeField("level", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                >
                  {LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => onChangeField("order", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Summary</label>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(e) => onChangeField("summary", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Short explanation shown on lesson cards."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Tags comma-separated
              </label>
              <input
                value={form.tags}
                onChange={(e) => onChangeField("tags", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="python, basics, variables"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Content Markdown</label>
                <textarea
                  rows={16}
                  value={form.content_markdown}
                  onChange={(e) => onChangeField("content_markdown", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Write the 60-second explanation here..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Preview</label>
                <div className="max-h-[430px] overflow-auto rounded-xl border border-slate-300 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {form.content_markdown || "_Preview will appear here._"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Code Blocks</h3>
                  <p className="text-xs text-slate-500">
                    Add optional snippets for programming lessons.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addCodeBlock}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Add Block
                </button>
              </div>

              {form.code_blocks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
                  No code blocks added.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.code_blocks.map((block, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <input
                          value={block.language || ""}
                          onChange={(e) =>
                            updateCodeBlock(index, "language", e.target.value)
                          }
                          className="w-40 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
                          placeholder="python"
                        />

                        <button
                          type="button"
                          onClick={() => removeCodeBlock(index)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <textarea
                        rows={5}
                        value={block.snippet || ""}
                        onChange={(e) =>
                          updateCodeBlock(index, "snippet", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                        placeholder="print('Hello LearnPulse')"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingSlug ? "Save Changes" : "Create Lesson"}
              </button>

              <button
                type="button"
                onClick={startNewLesson}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
