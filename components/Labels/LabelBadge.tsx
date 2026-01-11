import { Label } from "@/hooks/useLabels";
import { cn } from "@/lib/utils";
import { Tag, X } from "lucide-react";

interface LabelBadgeProps {
  label: Label;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function LabelBadge({
  label,
  onRemove,
  size = 'md',
  className,
}: LabelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        className
      )}
      style={{
        backgroundColor: `${label.color}20`,
        color: label.color,
        border: `1px solid ${label.color}40`,
      }}
    >
      <Tag className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      <span>{label.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
        >
          <X className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        </button>
      )}
    </span>
  );
}
