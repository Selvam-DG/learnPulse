import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.adminLogin(form);
      navigate("/admin");
    } catch (e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
          LearnPulse Admin
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Login to manage topics, lessons, and revision content.
        </p>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Username
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-violet-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-violet-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login to Admin"}
        </button>

        <Link
          to="/"
          className="mt-5 inline-block text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          ← Back to Home
        </Link>
      </form>
    </section>
  );
}
