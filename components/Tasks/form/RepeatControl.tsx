// components/Tasks/form/RepeatControl.tsx
import { Minus, Plus, Repeat, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecurrencePattern } from "@/hooks/useTask";

export interface RepeatValue {
  pattern: "NONE" | RecurrencePattern;
  interval: number;
  days: number[];
  endsAt: string;
}

export const EMPTY_REPEAT: RepeatValue = {
  pattern: "NONE",
  interval: 1,
  days: [],
  endsAt: "",
};

const PATTERN_OPTIONS: { value: RepeatValue["pattern"]; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "CUSTOM", label: "Custom" },
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]; // index 0 = Sunday

const UNIT_LABEL: Record<RepeatValue["pattern"], string> = {
  NONE: "day",
  DAILY: "day",
  WEEKLY: "week",
  MONTHLY: "month",
  CUSTOM: "day",
};

function summarize(value: RepeatValue): string {
  if (value.pattern === "NONE") return "Does not repeat";
  const unit = UNIT_LABEL[value.pattern];
  const every = `Every ${value.interval} ${unit}${value.interval > 1 ? "s" : ""}`;
  if (value.pattern === "WEEKLY" && value.days.length > 0) {
    const dayNames = value.days
      .slice()
      .sort((a, b) => a - b)
      .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
      .join(", ");
    return `${every} · ${dayNames}`;
  }
  return every;
}

interface RepeatControlProps {
  value: RepeatValue;
  onChange: (value: RepeatValue) => void;
}

export function RepeatControl({ value, onChange }: RepeatControlProps) {
  const isActive = value.pattern !== "NONE";
  const showWeekdays = value.pattern === "WEEKLY" || value.pattern === "CUSTOM";

  const toggleDay = (day: number) => {
    const next = value.days.includes(day)
      ? value.days.filter((d) => d !== day)
      : [...value.days, day];
    onChange({ ...value, days: next });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Repeat className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Repeat</span>
        <span className="ml-auto text-xs text-muted-foreground truncate">
          {summarize(value)}
        </span>
      </div>

      {/* Pattern selector */}
      <div className="flex flex-wrap gap-1.5">
        {PATTERN_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange({
                ...value,
                pattern: option.value,
                days:
                  option.value === "NONE" ? [] : value.days,
              })
            }
            aria-pressed={value.pattern === option.value}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              value.pattern === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isActive && (
        <>
          {/* Interval stepper */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Every</span>
            <button
              type="button"
              onClick={() =>
                onChange({ ...value, interval: Math.max(1, value.interval - 1) })
              }
              disabled={value.interval <= 1}
              aria-label="Decrease repeat interval"
              className="p-1.5 rounded-md border border-border hover:bg-accent transition disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {value.interval}
            </span>
            <button
              type="button"
              onClick={() =>
                onChange({ ...value, interval: Math.min(365, value.interval + 1) })
              }
              aria-label="Increase repeat interval"
              className="p-1.5 rounded-md border border-border hover:bg-accent transition"
            >
              <Plus className="size-3.5" />
            </button>
            <span className="text-xs text-muted-foreground">
              {UNIT_LABEL[value.pattern]}
              {value.interval > 1 ? "s" : ""}
            </span>
            {value.pattern !== "NONE" && (
              <button
                type="button"
                onClick={() => onChange({ ...EMPTY_REPEAT, days: [] })}
                className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
                aria-label="Remove repeat"
                title="Remove repeat"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>

          {/* Weekday picker (weekly / custom) */}
          {showWeekdays && (
            <div className="flex flex-wrap items-center gap-1.5">
              {WEEKDAY_LABELS.map((label, day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={value.days.includes(day)}
                  aria-label={`Repeat on ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}`}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium border transition-colors",
                    value.days.includes(day)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Optional end date */}
          <div className="flex items-center gap-3">
            <label htmlFor="repeat-ends-at" className="text-xs text-muted-foreground">
              Ends
            </label>
            <input
              id="repeat-ends-at"
              type="date"
              value={value.endsAt}
              onChange={(e) => onChange({ ...value, endsAt: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {value.endsAt && (
              <button
                type="button"
                onClick={() => onChange({ ...value, endsAt: "" })}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
                aria-label="Clear end date"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
