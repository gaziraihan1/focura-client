"use client";

import { AnimatePresence } from "framer-motion";
import { SubtaskRow } from "./SubtaskRow";
import { Subtask, SubtaskStatus, UpdateSubtaskDto } from "@/types/subtasks.types";

interface SubtaskListProps {
  subtasks:       Subtask[];
  currentUserId:  string;
  isAssignee:     boolean;
  onStatusChange: (subtaskId: string, status: SubtaskStatus) => Promise<void>;
  onUpdate:       (subtaskId: string, data: UpdateSubtaskDto) => Promise<void>;
  onDelete:       (subtaskId: string) => Promise<void>;
}

export function SubtaskList({
  subtasks,
  currentUserId,
  isAssignee,
  onStatusChange,
  onUpdate,
  onDelete,
}: SubtaskListProps) {
  return (
    <div className="space-y-0.5">
      <AnimatePresence mode="popLayout">
        {subtasks.map((subtask) => (
          <SubtaskRow
            key={subtask.id}
            subtask={subtask}
            currentUserId={currentUserId}
            isAssignee={isAssignee}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}