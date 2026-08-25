export function Section({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-5 sm:p-6 space-y-5",
        danger
          ? "border-destructive/30 bg-destructive/3"
          : "border-border bg-card",
      ].join(" ")}
    >
      <div className="pb-4 border-b border-border">
        <h3
          className={`text-sm font-bold ${danger ? "text-destructive" : "text-foreground"}`}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}