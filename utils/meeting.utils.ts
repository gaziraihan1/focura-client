import type { MeetingStatus, MeetingVisibility } from "@/types/meeting.types";

export function formatMeetingDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMeetingTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatMeetingDuration(
  startIso: string,
  endIso: string,
): string {
  const diffMs = new Date(endIso).getTime() - new Date(startIso).getTime();
  const totalMins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function isMeetingLive(startIso: string, endIso: string): boolean {
  const now = Date.now();
  return (
    now >= new Date(startIso).getTime() && now <= new Date(endIso).getTime()
  );
}

export function toLocalInputDatetime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInputDatetime(local: string): string {
  return new Date(local).toISOString();
}

export const STATUS_LABELS: Record<MeetingStatus, string> = {
  SCHEDULED: "Scheduled",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<MeetingStatus, string> = {
  SCHEDULED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  ONGOING: "bg-green-500/15 text-green-600 dark:text-green-400",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export const VISIBILITY_LABELS: Record<MeetingVisibility, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
};
