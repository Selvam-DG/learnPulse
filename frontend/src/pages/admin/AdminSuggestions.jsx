import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";

const STATUSES = ["all", "new", "reviewing", "added", "rejected"];

function formatDate(value) {
  if (!value) return "Unknown";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Invalid date";
  }
}

function statusClass(status) {
  const base = "rounded-full px-2.5 py-0.5 text-xs font-semibold";

  if (status === "added") {
    return `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300`;
  }

  if (status === "rejected") {
    return `${base} bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300`;
  }

  if (status === "reviewing") {
    return `${base} bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300`;
  }

  return `${base} bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300`;
}

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const counts = useMemo(() => {
    return suggestions.reduce(
      (acc, item) => {
        acc.all += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {
        all: 0,
        new: 0,
        reviewing: 0,
        added: 0,
        rejected: 0,
      }
    );
  }, [suggestions]);

  async function loadSuggestions(status = activeStatus) {
    try {
      setLoading(true);
      setErr("");

      const data = await api.getSuggestions(status);
      const items = data.items || [];

      setSuggestions(items);

      if (selected) {
        const freshSelected = items.find((item) => item.id === selected.id);
        setSelected(freshSelected || null);
        setForm(freshSelected || null);
      }
    } catch (e) {
      setErr(e.message || "Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuggestions(activeStatus);
  }, [activeStatus]);

  function chooseSuggestion(item) {
    setSelected(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      topic: item.topic || "",
      message: item.message || "",
      status: item.status || "new",
      admin_note: item.admin_note || "",
    });
    setErr("");
    setSuccess("");
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSuggestion(e) {
    e.preventDefault();

    if (!selected || !form) return;

    try {
      setErr("");
      setSuccess("");

      const updated = await api.updateSuggestion(selected.id, form);

      setSelected(updated);
      setForm({
        name: updated.name || "",
        email: updated.email || "",
        topic: updated.topic || "",
        message: updated.message || "",
        status: updated.status || "new",
        admin_note: updated.admin_note || "",
      });

      await loadSuggestions(activeStatus);
      setSuccess("Suggestion updated successfully.");
    } catch (e) {
      setErr(e.message || "Failed to update suggestion");
    }
  }

  async function quickStatus(item, status) {
    try {
      setErr("");
      setSuccess("");

      await api.updateSuggestion(item.id, { status });
      await loadSuggestions(activeStatus);

      if (selected?.id === item.id) {
        const updated = {
          ...selected,
          status,
        };

        setSelected(updated);
        setForm((current) => ({
          ...current,
          status,
        }));
      }

      setSuccess(`Suggestion marked as ${status}.`);
    } catch (e) {
      setErr(e.message || "Failed to update status");
    }
  }

  async function deleteSuggestion(id) {
    if (!confirm("Delete this suggestion permanently?")) return;

    try {
      setErr("");
      setSuccess("");

      await api.deleteSuggestion(id);

      if (selected?.id === id) {
        setSelected(null);
        setForm(null);
      }

      await loadSuggestions(activeStatus);
      setSuccess("Suggestion deleted.");
    } catch (e) {
      setErr(e.message || "Failed to delete suggestion");
    }
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Community roadmap
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">Suggested Topics</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review user suggestions, mark them as added or rejected, and edit details.
          </p>
        </div>

        <button
          onClick={() => loadSuggestions(activeStatus)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Refresh
        </button>
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

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveStatus(status)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              activeStatus === status
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-slate-300 text-slate-600 hover:border-violet-400 dark:border-slate-700 dark:text-slate-300",
            ].join(" ")}
          >
            {status} ({counts[status] || 0})
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[430px,1fr]">
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4">
            <h2 className="font-bold">Suggestion Queue</h2>
            <p className="mt-1 text-xs text-slate-500">
              Click a suggestion to view and edit it.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading suggestions...</p>
          ) : suggestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
              No suggestions found for this filter.
            </div>
          ) : (
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {suggestions.map((item) => {
                const active = selected?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseSuggestion(item)}
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
                          {item.topic}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.name || "Anonymous"} · {item.email}
                        </p>
                      </div>

                      <span className={statusClass(item.status || "new")}>
                        {item.status || "new"}
                      </span>
                    </div>

                    {item.message && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                        {item.message}
                      </p>
                    )}

                    <p className="mt-3 text-[11px] text-slate-400">
                      Submitted: {formatDate(item.created_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          {!selected || !form ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center dark:border-slate-700">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Select a suggestion
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a suggestion from the queue to review or update it.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={saveSuggestion} className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold">Review Suggestion</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Submitted: {formatDate(selected.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last updated: {formatDate(selected.updated_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteSuggestion(selected.id)}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:hover:bg-red-950/30"
                >
                  Delete
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Topic</label>
                <input
                  value={form.topic}
                  onChange={(e) => updateField("topic", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Admin note</label>
                <textarea
                  rows={3}
                  value={form.admin_note}
                  onChange={(e) => updateField("admin_note", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Optional internal note..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2">
                  {["new", "reviewing", "added", "rejected"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateField("status", status)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        form.status === status
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300",
                      ].join(" ")}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => quickStatus(selected, "added")}
                  className="rounded-xl border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                  Mark Added
                </button>

                <button
                  type="button"
                  onClick={() => quickStatus(selected, "rejected")}
                  className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                >
                  Reject
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
