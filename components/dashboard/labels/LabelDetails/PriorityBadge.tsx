import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowUp, AlertCircle, Minus } from "lucide-react";

const priorityConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  urgent: {
    label: "Urgent",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  high: {
    label: "High",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: <ArrowUp className="h-3 w-3" />,
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    icon: <ArrowRight className="h-3 w-3" />,
  },
  low: {
    label: "Low",
    className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    icon: <ArrowDown className="h-3 w-3" />,
  },
  no_priority: {
    label: "No Priority",
    className: "bg-muted text-muted-foreground",
    icon: <Minus className="h-3 w-3" />,
  },
};

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority.toLowerCase()] ?? {
    label: priority,
    className: "bg-muted text-muted-foreground",
    icon: <Minus className="h-3 w-3" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}