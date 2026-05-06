"use client";

import { useState } from "react";
import { toggleTheme, getCurrentTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => getCurrentTheme());

  const handleToggle = () => {
    toggleTheme();
    setTheme(getCurrentTheme());
  };

  return (
    <button onClick={handleToggle}>
      {theme === "dark" ? <Sun size={18}/> : <Moon size={18} />}
    </button>
  );
}