import { toggleTheme, getCurrentTheme } from "@/lib/theme";
import { describe, beforeEach, it, expect } from "vitest";

describe("theme", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    delete (window as unknown as Record<string, unknown>).matchMedia;
  });

  it("getCurrentTheme returns light when no dark class", () => {
    expect(getCurrentTheme()).toBe("light");
  });

  it("getCurrentTheme returns dark when class is set", () => {
    document.documentElement.classList.add("dark");
    expect(getCurrentTheme()).toBe("dark");
  });

  it("toggleTheme toggles dark class and persists to localStorage", () => {
    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
