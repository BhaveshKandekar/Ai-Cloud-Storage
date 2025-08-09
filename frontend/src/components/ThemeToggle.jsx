import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
