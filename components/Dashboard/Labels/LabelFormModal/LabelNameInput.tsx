interface LabelNameInputProps {
  value: string;
  error?: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
}

export function LabelNameInput({
  value,
  error,
  isSubmitting,
  onChange,
}: LabelNameInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Name <span className="text-destructive">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Bug, Feature, High Priority"
        className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground placeholder:text-muted-foreground ${
          error ? "border-destructive" : "border-input"
        }`}
        maxLength={50}
        disabled={isSubmitting}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}