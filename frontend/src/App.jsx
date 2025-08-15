import { Route, Routes, NavLink } from "react-router-dom";
import Home from './pages/Home';
import Learn from './pages/Learn';
import Suggest from './pages/Suggest';
import UseDarkMode from "./hooks/UseDarkMode";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const [dark, setDark] = UseDarkMode();
  console.log(dark);
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar dark={dark} setDark={setDark} />
      <main className="min-h-screen mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={ < Home/>} />
          <Route path="/learn/:topicSlug" element={ < Learn/>} />
          <Route path="/suggest" element={ < Suggest/>} />
          <Route path="*" element={ <div >Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
};
