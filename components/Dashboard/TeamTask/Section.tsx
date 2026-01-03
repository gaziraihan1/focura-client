export function Section({
  title,
  children,
  highlight,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2
        className={`text-sm font-semibold ${
          highlight ? "text-destructive" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
