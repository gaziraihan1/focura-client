"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubtaskPriority, CreateSubtaskDto } from "@/types/subtasks.types";

const PRIORITIES: { value: SubtaskPriority; label: string; dot: string; className: string }[] = [
  { value: "LOW",    label: "Low",    dot: "bg-muted-foreground/60", className: "text-muted-foreground bg-muted" },
  { value: "MEDIUM", label: "Medium", dot: "bg-amber-500",           className: "text-amber-600 bg-amber-500/10" },
  { value: "HIGH",   label: "High",   dot: "bg-red-500",             className: "text-red-500 bg-red-500/10" },
];

interface SubtaskFormProps {
  onSubmit:  (data: CreateSubtaskDto) => Promise<void>;
  onCancel:  () => void;
  isLoading: boolean;
}

export function SubtaskForm({ onSubmit, onCancel, isLoading }: SubtaskFormProps) {
  const [title, setTitle]       = useState("");
  const [priority, setPriority] = useState<SubtaskPriority>("MEDIUM");
  const inputRef                = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed || isLoading) return;
    await onSubmit({ title: trimmed, priority });
    setTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
    if (e.key === "Escape") onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="rounded-lg border border-border bg-background/80 backdrop-blur-sm p-3 space-y-3"
    >
      <input
        ref={inputRef}
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Subtask title…"
        maxLength={200}
        disabled={isLoading}
        className={cn(
          "w-full bg-transparent text-sm text-foreground",
          "placeholder:text-muted-foreground/50 focus:outline-none",
          "border-b border-border pb-1.5",
          "disabled:opacity-50",
        )}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Priority pills */}
        <div className="flex items-center gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-150",
                priority === p.value
                  ? p.className + " ring-1 ring-current/30"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "transition-all duration-150",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {isLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Check className="w-3.5 h-3.5" />
            }
            Add subtask
          </motion.button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/50">
        Press{" "}
        <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Enter</kbd>
        {" "}to save ·{" "}
        <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Esc</kbd>
        {" "}to cancel
      </p>
    </motion.div>
  );
}