// src/pages/Learn.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import TopicPills from "../components/TopicPills";
import LevelTabs from "../components/LevelTabs";
import SearchBox from "../components/SearchBox";
import LessonCard from "../components/LessonCard";
import LessonModal from "../components/LessonModal";

export default function Learn() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [activeLevel, setActiveLevel] = useState("basics");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState(null);
  const [err, setErr] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Load topics
  useEffect(() => {
    setLoadingTopics(true);
    api
      .getTopics()
      .then((data) => {
        setTopics(data || []);
        setLoadingTopics(false);
      })
      .catch((e) => {
        setErr(e.message || "Failed to load topics");
        setLoadingTopics(false);
      });
  }, []);

  // Ensure we have a topic selected
  useEffect(() => {
    if (!topicSlug && topics.length > 0) {
      navigate(`/learn/${topics[0].slug}`, { replace: true });
    }
  }, [topicSlug, topics, navigate]);

  // Load lessons whenever topic or level changes
  useEffect(() => {
    if (!topicSlug) return;
    setErr("");
    setItems([]);
    setLoadingLessons(true);

    api
      .getLessonsByTopic(topicSlug, activeLevel)
      .then((list) => {
        setItems(Array.isArray(list) ? list : []);
        setLoadingLessons(false);
      })
      .catch((e) => {
        setErr(e.message || "Failed to load lessons");
        setLoadingLessons(false);
      });
  }, [topicSlug, activeLevel]);

  const topic = topics.find((t) => t.slug === topicSlug);
  const levels = topic?.levels || ["basics", "intermediate", "advanced"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) || (i.summary || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const showEmptyState = !loadingLessons && filtered.length === 0 && !err;

  return (
    <section className="grid gap-6">
      {/* Topic selector */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Learn in Quick Bursts</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pick a topic, choose a level, and skim focused lesson cards with code
              snippets where relevant.
            </p>
          </div>
        </div>

        {loadingTopics ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        ) : (
          <TopicPills topics={topics} />
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left rail */}
        <aside className="w-full md:w-64 md:flex-shrink-0 space-y-4">
          <div>
            <h2 className="font-semibold">Levels</h2>
            <LevelTabs levels={levels} active={activeLevel} onChange={setActiveLevel} />
          </div>
          <div>
            <h2 className="font-semibold mb-1">Search</h2>
            <SearchBox value={query} onChange={setQuery} />
          </div>

          {topic && (
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <p>
                Topic:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {topic.name}
                </span>
              </p>
              <p>Lessons loaded: {items.length}</p>
            </div>
          )}
        </aside>

        {/* Content area */}
        <div className="flex-1">
          {err && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
              {err}
            </p>
          )}

          {loadingLessons ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-1 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-4 h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p className="font-medium">No lessons found</p>
              <p className="mt-1">Try a different level, topic, or search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((l) => (
                <LessonCard key={l.slug} item={l} onOpen={setOpenSlug} />
              ))}
            </div>
          )}
        </div>
      </div>

      <LessonModal
        slug={openSlug}
        fetcher={api.getLesson}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
