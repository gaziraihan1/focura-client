"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubtaskProgress }   from "./SubtaskProgress";
import { SubtaskForm }       from "./SubtaskForm";
import { SubtaskList }       from "./SubtaskList";
import { SubtaskEmptyState } from "./SubtaskEmptyState";
import {
  useSubtasks,
  useSubtaskStats,
  useCreateSubtask,
  useUpdateSubtask,
  useUpdateSubtaskStatus,
  useDeleteSubtask,
} from "@/hooks/useSubtasks";
import { CreateSubtaskDto, SubtaskStatus, UpdateSubtaskDto } from "@/types/subtasks.types";

interface SubtaskSectionProps {
  parentTaskId:  string;
  currentUserId: string;
  isAssignee:    boolean;
}

export function SubtaskSection({
  parentTaskId,
  currentUserId,
  isAssignee,
}: SubtaskSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showForm,   setShowForm]   = useState(false);

  // ── Data
  const { data: subtasks = [], isLoading } = useSubtasks(parentTaskId);
  const { data: stats }                    = useSubtaskStats(parentTaskId);

  // ── Mutations
  const createSubtask       = useCreateSubtask(parentTaskId);
  const updateSubtask       = useUpdateSubtask(parentTaskId);
  const updateSubtaskStatus = useUpdateSubtaskStatus(parentTaskId);
  const deleteSubtask       = useDeleteSubtask(parentTaskId);

  const total = subtasks.length;
  const done  = subtasks.filter((s) => s.status === "COMPLETED").length;

  // ── Handlers passed to child components
  const handleCreate = async (data: CreateSubtaskDto) => {
    await createSubtask.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (subtaskId: string, data: UpdateSubtaskDto) => {
    await updateSubtask.mutateAsync({ subtaskId, data });
  };

  const handleStatusChange = async (subtaskId: string, status: SubtaskStatus) => {
    await updateSubtaskStatus.mutateAsync({ subtaskId, status });
  };

  const handleDelete = async (subtaskId: string) => {
    await deleteSubtask.mutateAsync(subtaskId);
  };

  const canAdd = isAssignee;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="flex items-center gap-2.5 flex-1 min-w-0"
        >
          <ListTodo className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-semibold text-foreground">Subtasks</span>

          {total > 0 && (
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tabular-nums">
                {total}
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                <span className="font-medium text-emerald-500">{done}</span>
                /{total} done
              </span>
            </div>
          )}

          <motion.span
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            className="ml-1 text-muted-foreground"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>

        {canAdd && !showForm && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => { setShowForm(true); setIsExpanded(true); }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "border border-transparent hover:border-border transition-all duration-150",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        )}
      </div>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-1">

              {/* Progress — only when subtasks exist */}
              {stats && total > 0 && (
                <SubtaskProgress stats={stats} />
              )}

              {/* Create form */}
              <AnimatePresence>
                {showForm && (
                  <div className="pb-2">
                    <SubtaskForm
                      onSubmit={handleCreate}
                      onCancel={() => setShowForm(false)}
                      isLoading={createSubtask.isPending}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Loading */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : total === 0 && !showForm ? (
                <SubtaskEmptyState
                  canAdd={canAdd}
                  onAdd={() => setShowForm(true)}
                />
              ) : (
                <SubtaskList
                  subtasks={subtasks}
                  currentUserId={currentUserId}
                  isAssignee={isAssignee}
                  onStatusChange={handleStatusChange}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}