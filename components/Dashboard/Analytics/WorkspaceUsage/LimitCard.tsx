import { CheckCircle2, AlertTriangle, Infinity } from "lucide-react";

export interface LimitCardProps {
  icon: React.ElementType;
  label: string;
  current: number;
  max: number | null; // null = unlimited
  unit: string;
  percentage: number;
}

export function LimitCard({ icon: Icon, label, current, max, unit, percentage }: LimitCardProps) {
  const isUnlimited = max === null;
  const isCritical = !isUnlimited && percentage >= 90;
  const isWarning = !isUnlimited && percentage >= 75 && !isCritical;

  const barColor = isCritical
    ? "bg-red-500"
    : isWarning
    ? "bg-orange-500"
    : isUnlimited
    ? "bg-blue-400"
    : "bg-blue-500";

  const borderColor = isCritical
    ? "border-red-200 dark:border-red-900"
    : isWarning
    ? "border-orange-200 dark:border-orange-900"
    : "border-border";

  const bgColor = isCritical
    ? "bg-red-50/50 dark:bg-red-950/20"
    : isWarning
    ? "bg-orange-50/50 dark:bg-orange-950/20"
    : "bg-card";

  return (
    <div className={`rounded-xl sm:rounded-2xl border-2 p-3.5 sm:p-5 transition-all ${borderColor} ${bgColor}`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${
              isCritical
                ? "bg-red-100 dark:bg-red-900/30"
                : isWarning
                ? "bg-orange-100 dark:bg-orange-900/30"
                : "bg-muted"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Current usage</p>
          </div>
        </div>
        {(isCritical || isWarning) && (
          <AlertTriangle
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              isCritical
                ? "text-red-500"
                : "text-orange-500"
            }`}
          />
        )}
        {isUnlimited && (
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
        )}
      </div>

      <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden mb-2 sm:mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: isUnlimited ? "30%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-foreground">
          {current}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {isUnlimited ? (
            <>
              <Infinity className="w-3 h-3" /> <span className="hidden sm:inline">Unlimited</span><span className="sm:hidden">∞</span>
            </>
          ) : (
            `/ ${max} ${unit}`
          )}
        </span>
      </div>

      {!isUnlimited && (
        <p
          className={`text-xs font-medium mt-1.5 sm:mt-2 ${
            isCritical
              ? "text-red-600 dark:text-red-400"
              : isWarning
              ? "text-orange-600 dark:text-orange-400"
              : "text-muted-foreground"
          }`}
        >
          {percentage.toFixed(0)}% used
        </p>
      )}
    </div>
  );
}