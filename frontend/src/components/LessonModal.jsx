// src/components/LessonModal.jsx
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism.css";

export default function LessonModal({ slug, fetcher, onClose }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!slug) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [slug]);

  // Timer + data loading
  useEffect(() => {
    let timer;

    if (slug) {
      setElapsed(0);
      setData(null);
      setErr("");
      setCopiedIndex(null);
      setLoading(true);

      timer = setInterval(() => setElapsed((e) => e + 1), 1000);

      fetcher(slug)
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch((e) => {
          setErr(e.message || "Failed to load lesson");
          setLoading(false);
        });
    }

    return () => clearInterval(timer);
  }, [slug, fetcher]);

  // Syntax highlight when data changes
  useEffect(() => {
    if (data) Prism.highlightAll();
  }, [data]);

  // ESC key closes modal
  useEffect(() => {
    if (!slug) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [slug, onClose]);

  if (!slug) return null;

  const codeBlocks = Array.isArray(data?.code_blocks) ? data.code_blocks : [];
  const tags = Array.isArray(data?.tags) ? data.tags : [];

  const handleCopy = async (snippet, index) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
              LearnPulse Lesson
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
              {loading ? "Loading lesson..." : data?.title || "Lesson"}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              ⏱ {elapsed}s · designed for quick understanding and revision
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close ✕
          </button>
        </div>

        {/* Scrollable modal content only */}
        <div className="overflow-y-auto px-5 py-5">
          {err && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
              {err}
            </p>
          )}

          {loading && !err && (
            <div className="space-y-3">
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          )}

          {!loading && data && (
            <>
              {/* Summary */}
              {data.summary && (
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/40">
                  <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">
                    Quick Summary
                  </p>
                  <p className="mt-1 text-sm leading-6 text-violet-700 dark:text-violet-300">
                    {data.summary}
                  </p>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Markdown content */}
              <div className="prose prose-sm mt-5 max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0">
                <ReactMarkdown>
                  {data.content_markdown || "No lesson content available."}
                </ReactMarkdown>
              </div>

              {/* Code blocks */}
              {codeBlocks.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Practice Snippets
                  </h3>

                  {codeBlocks.map((block, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-100"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
                        <span>{block.language || "code"}</span>

                        <button
                          type="button"
                          onClick={() => handleCopy(block.snippet, index)}
                          className="rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                        >
                          {copiedIndex === index ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      <pre className={`language-${block.language || "python"} m-0 p-4`}>
                        <code className={`language-${block.language || "python"}`}>
                          {block.snippet}
                        </code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <span>Press Esc to close this lesson.</span>
          <button
            type="button"
            onClick={onClose}
            className="font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Back to topics
          </button>
        </div>
      </div>
    </div>
  );
}
