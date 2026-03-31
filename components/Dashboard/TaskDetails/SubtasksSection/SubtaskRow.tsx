"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/Shared/Avatar";
import { Subtask, SubtaskStatus, UpdateSubtaskDto } from "@/types/subtasks.types";
import { StatusButton } from "./StatusButton";
import { InlineEditor } from "./InlineEditor";


const PRIORITY_DOT: Record<string, string> = {
  URGENT: "bg-red-600",
  HIGH:   "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW:    "bg-muted-foreground/40",
};


interface SubtaskRowProps {
  subtask:       Subtask;
  currentUserId: string;
  isAssignee:    boolean;
  onStatusChange: (subtaskId: string, status: SubtaskStatus) => Promise<void>;
  onUpdate:       (subtaskId: string, data: UpdateSubtaskDto) => Promise<void>;
  onDelete:       (subtaskId: string) => Promise<void>;
}

export function SubtaskRow({
  subtask,
  currentUserId,
  isAssignee,
  onStatusChange,
  onUpdate,
  onDelete,
}: SubtaskRowProps) {
  const [isEditing, setIsEditing]   = useState(false);
  const [editTitle, setEditTitle]   = useState(subtask.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = subtask.createdById === currentUserId;
  const isDone    = subtask.status === "COMPLETED";
  const canEdit   = isCreator;
  const canChangeStatus = isAssignee || isCreator;

  const handleStatusChange = async (next: SubtaskStatus) => {
    if (!canChangeStatus) return;
    setIsUpdating(true);
    try {
      await onStatusChange(subtask.id, next);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditStart = () => {
    setEditTitle(subtask.title);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) { setIsEditing(false); return; }
    if (trimmed === subtask.title) { setIsEditing(false); return; }
    setIsUpdating(true);
    try {
      await onUpdate(subtask.id, { title: trimmed });
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(subtask.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative flex items-start gap-3 px-3 py-2.5 rounded-lg border border-transparent",
        "hover:bg-muted/50 hover:border-border/60 transition-all duration-150",
        isDone && "opacity-60",
      )}
    >
      {/* Drag handle — visual only */}
      <div className="mt-0.5 md:opacity-0 group-hover:opacity-25 transition-opacity shrink-0">
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </div>

      {/* Status toggle */}
      <div className="mt-0.5 shrink-0">
        <StatusButton
          status={subtask.status}
          onChange={handleStatusChange}
          disabled={!canChangeStatus || isUpdating}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {isEditing ? (
          <InlineEditor
            value={editTitle}
            onChange={setEditTitle}
            onSave={handleEditSave}
            onCancel={() => setIsEditing(false)}
            isLoading={isUpdating}
          />
        ) : (
          <div className="flex items-start gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm text-foreground leading-snug wrap-break-word",
                isDone && "line-through text-muted-foreground",
              )}
            >
              {subtask.title}
            </span>
            {/* Priority dot */}
            <span
              className={cn(
                "mt-1 w-2 h-2 rounded-full shrink-0",
                PRIORITY_DOT[subtask.priority] ?? "bg-muted-foreground/40",
              )}
              title={subtask.priority}
            />
          </div>
        )}

        {/* Meta row */}
        {!isEditing && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Avatar
                name={subtask.createdBy.name}
                image={subtask.createdBy.image}
                size="sm"
              />
              <span className="text-[11px] text-muted-foreground">
                {subtask.createdBy.name}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/40">·</span>
            <span className="text-[11px] text-muted-foreground">
              {new Date(subtask.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day:   "numeric",
              })}
            </span>
            {subtask.dueDate && (
              <>
                <span className="text-[11px] text-muted-foreground/40">·</span>
                <span className="text-[11px] text-muted-foreground">
                  Due{" "}
                  {new Date(subtask.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day:   "numeric",
                  })}
                </span>
              </>
            )}
            {/* Assignee avatars */}
            {subtask.assignees.length > 0 && (
              <div className="flex items-center -space-x-1 ml-1">
                {subtask.assignees.slice(0, 3).map((a) => (
                  <Avatar
                    key={a.user.id}
                    name={a.user.name}
                    image={a.user.image}
                    size="sm"
                  />
                ))}
                {subtask.assignees.length > 3 && (
                  <span className="text-[10px] text-muted-foreground ml-1">
                    +{subtask.assignees.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions — visible on hover, creator only */}
      {!isEditing && (
        <div className={cn(
          "flex items-center gap-0.5 shrink-0 mt-0.5",
          "md:opacity-0 group-hover:opacity-100 transition-opacity duration-150",
        )}>
          {canEdit && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={handleEditStart}
              disabled={isUpdating || isDeleting}
              title="Edit subtask"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </motion.button>
          )}
          {canEdit && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete subtask"
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              {isDeleting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />
              }
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}