interface Props {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, hint, children }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </label>
      {children}
    </div>
  );
}