/**
 * Announce a message to screen readers via the live announcer region.
 * Use this for dynamic content changes that aren't visually obvious:
 * - Task created/deleted/completed
 * - Member invited/removed
 * - Data loaded
 * - Errors occurred
 */
export function announce(message: string, priority: "polite" | "assertive" = "polite") {
  if (typeof document === "undefined") return;

  const announcer = document.getElementById("toast-announcer");
  if (!announcer) return;

  // Clear then set to ensure screen readers pick up the change
  announcer.textContent = "";
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}

/**
 * Announce an assertive (interrupting) message to screen readers.
 * Use for errors, critical warnings, or time-sensitive information.
 */
export function announceError(message: string) {
  announce(message, "assertive");
}
