import { cn } from "@/lib/utils";
import type {  MeetingStatus } from "@/types/meeting.types";
import { CalendarClock, CheckCircle2, Radio, XCircle } from "lucide-react";
const statusConfig: Record<
  MeetingStatus,
  { label: string; icon: React.ElementType; classes: string; dot: string }
> = {
  SCHEDULED: {
    label: "Scheduled",
    icon: CalendarClock,
    classes:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  ONGOING: {
    label: "Ongoing",
    icon: Radio,
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    classes:
      "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    classes:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
};

export function StatusBadge({ status }: { status: MeetingStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        cfg.classes
      )}
    >
      {status === "ONGOING" ? (
        /* Pulsing dot for live meetings */
        <span className="relative flex size-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              cfg.dot
            )}
          />
          <span className={cn("relative inline-flex size-2 rounded-full", cfg.dot)} />
        </span>
      ) : (
        <Icon className="size-3.5 shrink-0" />
      )}
      {cfg.label}
    </span>
  );
}