interface ColorOption {
  name: string;
  value: string;
}

interface LabelColorPickerProps {
  selectedColor: string;
  colors: ColorOption[];
  error?: string;
  isSubmitting: boolean;
  onColorSelect: (color: string) => void;
}

export function LabelColorPicker({
  selectedColor,
  colors,
  error,
  isSubmitting,
  onColorSelect,
}: LabelColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Color <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-9 gap-2">
        {colors.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onColorSelect(preset.value)}
            className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
              selectedColor === preset.value
                ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110"
                : "hover:ring-2 hover:ring-ring/50"
            }`}
            style={{ backgroundColor: preset.value }}
            title={preset.name}
            disabled={isSubmitting}
          />
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}