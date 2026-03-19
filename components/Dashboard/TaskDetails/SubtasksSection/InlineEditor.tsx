"use client"
import { cn } from '@/lib/utils';
import  { motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react';
export function InlineEditor({
  value,
  onChange,
  onSave,
  onCancel,
  isLoading,
}: {
  value:     string;
  onChange:  (v: string) => void;
  onSave:    () => void;
  onCancel:  () => void;
  isLoading: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); onSave(); }
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={200}
        className={cn(
          "flex-1 min-w-0 bg-background border border-ring rounded-md px-2 py-0.5",
          "text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50",
        )}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="p-1 rounded text-emerald-500 hover:bg-emerald-500/10 transition-colors shrink-0"
      >
        {isLoading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Check className="w-3.5 h-3.5" />
        }
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onCancel}
        className="p-1 rounded text-muted-foreground hover:bg-muted transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}