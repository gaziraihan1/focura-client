import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  label: string;
  ratio: number;
  overCapacity: boolean;
  emphasis: boolean;
}

export function ComparisonCard({
  label,
  ratio,
  overCapacity,
  emphasis,
}: ComparisonCardProps) {
  const pct = Math.min(ratio * 100, 200);
  const barColor =
    ratio > 1
      ? "bg-gradient-to-r from-amber-400 to-amber-500"
      : ratio > 0.8
        ? "bg-primary"
        : "bg-emerald-500";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex flex-col items-center",
        emphasis
          ? "border-primary/30 bg-primary/3"
          : "border-border bg-background",
      )}
    >
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <p
        className={cn(
          "text-3xl font-bold",
          ratio > 1
            ? "text-amber-600 dark:text-amber-400"
            : "text-foreground",
        )}
      >
        {(ratio * 100).toFixed(0)}
        <span className="text-sm font-normal text-muted-foreground">%</span>
      </p>
      <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {overCapacity && (
        <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5 font-medium">
          Over capacity
        </span>
      )}
    </div>
  );
}
