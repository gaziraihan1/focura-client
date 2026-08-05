"use client";

import { useState, useEffect } from "react";
import { toggleTheme, getCurrentTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setTheme(getCurrentTheme());
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
