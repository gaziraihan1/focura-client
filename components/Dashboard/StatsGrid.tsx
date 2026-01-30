import { LucideIcon } from "lucide-react";

type StatItem = {
    name: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;

}
interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="p-6 rounded-xl bg-card border hover:shadow-lg transition"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor} flex justify-center items-center`}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
