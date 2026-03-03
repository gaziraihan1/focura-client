import { TrendingDown, TrendingUp } from "lucide-react";

export interface GrowthMetricProps {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
}

export function GrowthMetric({ label, value, change, icon: Icon }: GrowthMetricProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
      <div
        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${
          isPositive
            ? "bg-green-100 dark:bg-green-900/30"
            : isNeutral
            ? "bg-muted"
            : "bg-red-100 dark:bg-red-900/30"
        }`}
      >
        <Icon
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : isNeutral
              ? "text-muted-foreground"
              : "text-red-600 dark:text-red-400"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
      <div
        className={`flex items-center gap-0.5 text-xs font-semibold ${
          isPositive
            ? "text-green-600 dark:text-green-400"
            : isNeutral
            ? "text-muted-foreground"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {isPositive && <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        {!isPositive && !isNeutral && <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        {isPositive ? "+" : ""}
        {change}%
      </div>
    </div>
  );
}
