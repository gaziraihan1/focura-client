interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentBg: string;
  accentText: string;
}


export default function StatCard({ icon, label, value, accentBg, accentText }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* subtle gradient wash in the top-right corner */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-current" />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-bold ${accentText}`}>{value}</p>
        </div>

        <div className={`rounded-xl p-2.5 ${accentBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
