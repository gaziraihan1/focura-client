"use client";

import { motion } from "framer-motion";
import { ListTodo, Plus } from "lucide-react";

interface SubtaskEmptyStateProps {
  canAdd: boolean;
  onAdd:  () => void;
}

export function SubtaskEmptyState({ canAdd, onAdd }: SubtaskEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <ListTodo className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No subtasks yet</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-50">
        {canAdd
          ? "Break this task into smaller pieces to track progress."
          : "Subtasks will appear here once created."}
      </p>
      {canAdd && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onAdd}
          className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add first subtask
        </motion.button>
      )}
    </motion.div>
  );
}