"use client";

import { useState } from "react";
import { useLabel, useLabelTasks } from "@/hooks/useLabels";
import { LabelHeader } from "./LabelHeader";
import { TaskGrid } from "./TaskGrid";
import { LabelPageSkeleton } from "./LabelPageSkeleton";

interface LabelContentProps {
  id: string;
}

export function LabelContent({ id }: LabelContentProps) {
  const [page, setPage] = useState(1);

  const { data: label, isLoading: labelLoading, error: labelError } = useLabel(id);

  const {
    data: tasksRes,
    isLoading: tasksLoading,
    error: tasksError,
  } = useLabelTasks(id, { page, limit: 20 });

  if (labelLoading) return <LabelPageSkeleton />;

  if (labelError || !label?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-destructive">Failed to load label.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LabelHeader
        name={label.data.name}
        color={label.data.color}
        taskCount={label.data._count.tasks}
      />

      {tasksLoading && !tasksRes ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-border bg-muted"
            />
          ))}
        </div>
      ) : tasksError ? (
        <p className="text-sm text-destructive">Failed to load tasks.</p>
      ) : tasksRes?.data && tasksRes?.pagination ? (
        <TaskGrid
          tasks={tasksRes.data}
          pagination={tasksRes.pagination}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}