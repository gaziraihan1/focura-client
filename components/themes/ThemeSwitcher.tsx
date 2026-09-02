"use client";

import { useState } from "react";
import { toggleTheme, getCurrentTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => getCurrentTheme());

  const handleToggle = () => {
    toggleTheme();
    setTheme(getCurrentTheme());
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
