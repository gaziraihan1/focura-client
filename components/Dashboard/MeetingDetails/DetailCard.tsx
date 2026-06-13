import { cn } from "@/lib/utils";

export function DetailCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-(--shadow-card)",
        className
      )}
    >
      {children}
    </div>
  );
}