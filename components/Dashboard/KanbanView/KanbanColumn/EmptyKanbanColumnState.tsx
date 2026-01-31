interface EmptyKanbanColumnProps {
  isBlocked: boolean;
  columnId: string;
}

export default function EmptyKanbanColumnState({
  isBlocked,
  columnId,
}: EmptyKanbanColumnProps) {
  return (
    <div className="text-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm">
      {isBlocked ? (
        <>
          <div className="font-medium text-green-600 dark:text-green-400 mb-1">
            No blocked tasks
          </div>
          <div>Flow is healthy</div>
        </>
      ) : columnId === "done" ? (
        <>
          <div className="font-medium mb-1">Execution complete</div>
          <div>Nothing finished yet</div>
        </>
      ) : (
        <>
          <div className="font-medium mb-1">No tasks here</div>
          <div>
            {columnId === "backlog"
              ? "Add tasks to get started"
              : "Flow is healthy"}
          </div>
        </>
      )}
    </div>
  );
}
