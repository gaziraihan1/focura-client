import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface InsightCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  valueColor?: string;
  subtitle?: ReactNode;
  progressBar?: {
    percentage: number;
    color: string;
  };
}

export function InsightCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  valueColor = 'text-2xl font-bold',
  subtitle,
  progressBar,
}: InsightCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`mt-1 ${valueColor}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {progressBar && (
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${progressBar.color} rounded-full transition-all duration-500`}
              style={{ width: `${progressBar.percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}