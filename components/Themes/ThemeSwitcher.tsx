"use client";

import { useThemeContext } from "@/context/providers/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 
        rounded-lg 
        bg-secondary 
        text-secondary-foreground 
        hover:bg-accent 
        transition-all
        flex items-center justify-center
      "
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
