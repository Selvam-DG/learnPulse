import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Suggest from "./pages/Suggest";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UseDarkMode from "./hooks/UseDarkMode";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminTopics from "./pages/admin/AdminTopics";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminSuggestions from "./pages/admin/AdminSuggestions";

export default function App() {
  const [dark, setDark] = UseDarkMode();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar dark={dark} setDark={setDark} />

      <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:topicSlug" element={<Learn />} />
          <Route path="/suggest" element={<Suggest />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="topics" element={<AdminTopics />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="suggestions" element={<AdminSuggestions />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
