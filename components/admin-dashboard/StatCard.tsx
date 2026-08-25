import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export function StatCard({ icon: Icon, label, value, className }: {
  icon: typeof Users; label: string; value: number; className?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
      <div className={cn('p-2.5 rounded-lg', className)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
