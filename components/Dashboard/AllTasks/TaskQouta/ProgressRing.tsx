export function ProgressRing({
  used,
  limit,
  size = 56,
  strokeWidth = 5,
  isUnlimited = false,
}: {
  used: number;
  limit: number | null;
  size?: number;
  strokeWidth?: number;
  isUnlimited?: boolean;
}) {
  const r   = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = !isUnlimited && limit ? Math.min(used / limit, 1) : 0;

  const color =
    isUnlimited ? "stroke-chart-2"
    : pct >= 0.9 ? "stroke-destructive"
    : pct >= 0.7 ? "stroke-chart-5"
    : "stroke-primary";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-border"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={isUnlimited ? 0 : circ * (1 - pct)}
        strokeLinecap="round"
        className={`${color} transition-all duration-700 ease-out`}
      />
    </svg>
  );
}