export const themeScript = `
(function() {
  try {
    const storageTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme =
      storageTheme || (systemDark ? "dark" : "light");

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  } catch (_) {}
})();
`;

export function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}