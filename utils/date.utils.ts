// Single source of truth for shared date formatting. Feature-specific
// formatting (e.g. relative due dates, chart axes) stays in its own utils;
// these cover the common calendar/date renderings used across features.

export type DateLike = string | Date | null | undefined;

function toDate(value: DateLike): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const mediumFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const longFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

const weekdayUtcFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

/** "Jan 5, 2026". Missing or invalid input renders as an em dash. */
export function formatDateMedium(value: DateLike): string {
  const date = toDate(value);
  return date ? mediumFormat.format(date) : "\u2014";
}

/** "January 5, 2026". Missing or invalid input renders as an em dash. */
export function formatDateLong(value: DateLike): string {
  const date = toDate(value);
  return date ? longFormat.format(date) : "\u2014";
}

/** "Monday, January 5, 2026" pinned to UTC (for timezone-stable meetings). */
export function formatDateWeekdayUtc(value: DateLike): string {
  const date = toDate(value);
  return date ? weekdayUtcFormat.format(date) : "";
}
