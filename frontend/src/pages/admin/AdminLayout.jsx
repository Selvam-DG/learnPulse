import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../../api";

export default function AdminLayout() {
  const location = useLocation();
  const isLoggedIn = api.isAdminLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const navClass = ({ isActive }) =>
    [
      "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-violet-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    ].join(" ");

  return (
    <div className="min-h-[75vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid min-h-[75vh] grid-cols-1 lg:grid-cols-[270px,1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 lg:border-b-0 lg:border-r">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
              LearnPulse
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Admin Panel
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage topics, lessons, and learning content.
            </p>
          </div>

          <nav className="space-y-2">
            <NavLink to="/admin" end className={navClass}>
              <span>Dashboard</span>
              <span>⌘</span>
            </NavLink>

            <NavLink to="/admin/topics" className={navClass}>
              <span>Topics</span>
              <span>📚</span>
            </NavLink>

            <NavLink to="/admin/lessons" className={navClass}>
              <span>Lessons</span>
              <span>✍️</span>
            </NavLink>
            <NavLink to="/admin/suggestions" className={navClass}>
              <span>Suggestions</span>
              <span>💡</span>
            </NavLink>

            <NavLink to="/" className={navClass}>
              <span>Go to Home</span>
              <span>↗</span>
            </NavLink>
          </nav>

          <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Admin mode active
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Changes here update the public LearnPulse content.
            </p>
          </div>

          <button
            type="button"
            onClick={api.adminLogout}
            className="mt-5 w-full rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Logout
          </button>
        </aside>

        <section className="min-w-0 bg-white p-5 dark:bg-slate-950 sm:p-7">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
