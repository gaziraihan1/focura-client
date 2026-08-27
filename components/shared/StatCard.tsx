import { cn } from "@/lib/utils";

type StatCardVariant = "accent" | "row" | "muted" | "outline";

interface StatCardProps {
  /**
   * Visual variant:
   * - "accent"  (default): card with icon chip top-right and colored value
   * - "row":     horizontal icon-left layout used by the admin dashboard
   * - "muted":   muted background with icon+label row, used by the calendar sidebar
   * - "outline": bordered card with small colored icon, used by project details
   */
  variant?: StatCardVariant;
  /** Icon node/component. For "row"/"outline" pass a component type (rendered with fixed sizing); otherwise a React node. */
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  label: string;
  value?: number | string;
  /** "accent" only: background classes for the icon chip, e.g. "bg-blue-500/10" */
  accentBg?: string;
  /** "accent" only: text color classes for the value, e.g. "text-blue-500" */
  accentText?: string;
  /** "row" only: background/color classes for the icon container */
  className?: string;
  /** "row" only: format numeric values with toLocaleString (default: true) */
  formatValue?: boolean;
  /** "muted": color classes for the icon+label row; "outline": color classes for the icon only */
  color?: string;
}

export function StatCard({
  variant = "accent",
  icon,
  label,
  value,
  accentBg = "",
  accentText = "",
  className,
  formatValue = true,
  color,
}: StatCardProps) {
  const iconNode = icon as React.ReactNode;
  switch (variant) {
    case "row": {
      const Icon = icon as unknown as React.ComponentType<{ className?: string }>;
      return (
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
          <div className={cn("p-2.5 rounded-lg", className)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {typeof value === "number" && formatValue
                ? value.toLocaleString()
                : value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      );
    }

    case "muted":
      return (
        <div className="bg-muted rounded-lg p-3">
          <div className={cn("flex items-center gap-2 mb-1", color)}>
            {iconNode}
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      );

    case "outline": {
      const Icon = icon as unknown as React.ComponentType<{ className?: string }>;
      return (
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn("w-4 h-4", color)} />
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      );
    }

    default:
      return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
          {/* subtle gradient wash in the top-right corner */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-current" />

          <div className="flex items-start justify-between relative">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <p className={`mt-1.5 text-2xl font-bold ${accentText}`}>
                {value}
              </p>
            </div>

            <div className={`rounded-xl p-2.5 ${accentBg}`}>{iconNode}</div>
          </div>
        </div>
      );
  }
}

export default StatCard;
