import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function isAdminLoggedIn() {
  return Boolean(
    localStorage.getItem("adminAccessToken") || localStorage.getItem("adminToken")
  );
}

export default function Navbar({ dark, setDark }) {
  const location = useLocation();
  const [adminLoggedIn, setAdminLoggedIn] = useState(isAdminLoggedIn());

  useEffect(() => {
    setAdminLoggedIn(isAdminLoggedIn());
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminToken");
    setAdminLoggedIn(false);
    window.location.href = "/";
  }

  const linkClass = ({ isActive }) =>
    [
      "rounded-xl px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-extrabold text-white">
            LP
          </span>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Learn<span className="text-violet-600 dark:text-violet-400">Pulse</span>
            </p>
            <p className="-mt-1 hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
              Fast concepts. Clear revision.
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/learn" className={linkClass}>
            Learn
          </NavLink>

          <NavLink to="/suggest" className={linkClass}>
            Suggest
          </NavLink>

          {adminLoggedIn && (
            <NavLink to="/admin" className={linkClass}>
              Admin Dashboard
            </NavLink>
          )}

          <button
            onClick={() => setDark((value) => !value)}
            className="ml-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            type="button"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {adminLoggedIn && (
            <button
              onClick={logout}
              className="ml-1 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
              type="button"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
