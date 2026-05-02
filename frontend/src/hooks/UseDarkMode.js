import { useEffect, useState } from "react";

export default function UseDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "dark") return true;
    if (stored === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark];
}
