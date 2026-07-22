"use client";

import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

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
      <SharedEmptyState
        icon={ListTodo}
        title="No subtasks yet"
        description={
          canAdd
            ? "Break this task into smaller pieces to track progress."
            : "Subtasks will appear here once created."
        }
        action={
          canAdd
            ? { label: "Add first subtask", onClick: onAdd }
            : undefined
        }
      />
    </motion.div>
  );
}
