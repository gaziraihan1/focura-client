import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <div className={cn('flex items-center gap-2 mb-1', color)}>
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}