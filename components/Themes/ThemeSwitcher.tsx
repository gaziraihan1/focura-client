"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-secondary w-9 h-9" aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-all flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}