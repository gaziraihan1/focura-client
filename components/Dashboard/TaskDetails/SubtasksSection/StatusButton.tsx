"use client"
import {motion} from 'framer-motion'
import { SubtaskStatus } from "@/types/subtasks.types";
import { AlertCircle, CheckCircle2, Circle, X } from "lucide-react";
import { cn } from '@/lib/utils';
const STATUS_CONFIG: Record<
  SubtaskStatus,
  { icon: typeof Circle; className: string; label: string; next: SubtaskStatus }
> = {
  TODO:        { icon: Circle,       className: "text-muted-foreground", label: "To do",       next: "IN_PROGRESS" },
  IN_PROGRESS: { icon: AlertCircle,  className: "text-blue-500",         label: "In progress", next: "COMPLETED"   },
  COMPLETED:   { icon: CheckCircle2, className: "text-emerald-500",      label: "Completed",   next: "TODO"        },
  CANCELLED:   { icon: X,            className: "text-muted-foreground", label: "Cancelled",   next: "TODO"        },
};

export function StatusButton({
  status,
  onChange,
  disabled,
}: {
  status:   SubtaskStatus;
  onChange: (next: SubtaskStatus) => void;
  disabled: boolean;
}) {
  const config = STATUS_CONFIG[status];
  const Icon   = config.icon;

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      type="button"
      onClick={() => !disabled && onChange(config.next)}
      disabled={disabled}
      title={`Status: ${config.label} — click to advance`}
      className={cn(
        "shrink-0 transition-colors duration-150 rounded-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        config.className,
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
    </motion.button>
  );
}