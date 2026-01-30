interface LabelDescriptionInputProps {
  value: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
}

export function LabelDescriptionInput({
  value,
  isSubmitting,
  onChange,
}: LabelDescriptionInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Description{" "}
        <span className="text-muted-foreground text-xs">(Optional)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a description for this label..."
        rows={3}
        className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground placeholder:text-muted-foreground resize-none"
        disabled={isSubmitting}
      />
    </div>
  );
}