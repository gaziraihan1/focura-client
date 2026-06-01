export function StatusBar({
  completed,
  inProgress,
  total,
  accentColor,
}: {
  completed: number;
  inProgress: number;
  total: number;
  accentColor: string;
}) {
  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
  const todoPct = Math.max(0, 100 - completedPct - inProgressPct);

  const segments = [
    { pct: completedPct, color: accentColor, label: "Done" },
    { pct: inProgressPct, color: "#f59e0b", label: "In Progress" },
    { pct: todoPct, color: "var(--border)", label: "Todo" },
  ];

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
        {segments.map((s, i) =>
          s.pct > 0 ? (
            <div
              key={i}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="transition-all duration-700"
            />
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: "Completed", value: completed, color: accentColor },
          { label: "In Progress", value: inProgress, color: "#f59e0b" },
          { label: "Todo", value: total - completed - inProgress, color: "var(--muted-foreground)" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className="text-xs font-semibold text-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}