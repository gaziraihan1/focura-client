interface LabelPreviewProps {
  name: string;
  color: string;
}

export function LabelPreview({ name, color }: LabelPreviewProps) {
  return (
    <div className="pt-4 border-t border-border">
      <label className="block text-sm font-medium text-foreground mb-2">
        Preview
      </label>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-muted">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-foreground">
          {name.trim() || "Label name"}
        </span>
      </div>
    </div>
  );
}