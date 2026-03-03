import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  change: number;
  accentColor: string;
  bgColor: string;
}

function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8 mt-3">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-blue-500 opacity-40"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  label,
  count,
  change,
  accentColor,
  bgColor,
}: FeatureCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-sm hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${bgColor}`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentColor}`} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          ) : (
            <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-0.5 sm:mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{count.toLocaleString()}</p>
      <MiniBar data={[40, 55, 65, 70, 75, 85, 90]} />
    </div>
  );
}