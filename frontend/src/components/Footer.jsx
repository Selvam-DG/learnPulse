import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-200">LearnPulse</p>
          <p className="mt-1">
            © {new Date().getFullYear()} LearnPulse — Fast Concepts. Clear Insights.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400">
            Home
          </Link>

          <Link to="/learn" className="hover:text-violet-600 dark:hover:text-violet-400">
            Learn
          </Link>

          <Link
            to="/suggest"
            className="hover:text-violet-600 dark:hover:text-violet-400"
          >
            Suggest Topic
          </Link>
        </div>
      </div>
    </footer>
  );
}
