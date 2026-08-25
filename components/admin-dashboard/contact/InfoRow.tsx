export function InfoRow({
  icon,
  label,
  value,
  isEmail,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isEmail?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
        {icon}
        {label}
      </span>
      {isEmail ? (
        <a
          href={`mailto:${value}`}
          className="text-sm text-primary hover:underline underline-offset-2 truncate"
        >
          {value}
        </a>
      ) : (
        <span
          className={`text-sm text-foreground truncate ${
            mono ? "font-mono text-xs text-muted-foreground" : ""
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
