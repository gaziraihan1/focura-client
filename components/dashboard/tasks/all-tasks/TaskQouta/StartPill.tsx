export function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg bg-muted/60 min-w-18">
      <span className="text-[11px] font-medium text-muted-foreground leading-none">{label}</span>
      <span className="text-base font-semibold text-foreground leading-tight tabular-nums">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground leading-none">{sub}</span>}
    </div>
  );
}