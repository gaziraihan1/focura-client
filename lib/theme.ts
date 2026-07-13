function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value};path=/;max-age=${days * 86400};SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

export const themeScript = `
(function() {
  try {
    var t = localStorage.getItem("theme") || (document.cookie.match(new RegExp("(?:^|;\\\\s*)theme=([^;]*)")) || [])[1] || null;
    var s = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = t || (s ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (_) {}
})();
`;

export function toggleTheme() {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";

  localStorage.setItem("theme", theme);
  setCookie("theme", theme);
}

export function getCurrentTheme() {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}