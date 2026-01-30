import React from "react";
import { Task } from "@/hooks/useTask";
import { KanbanSort } from "@/hooks/useKanbanPage";
import { MobileColumnNavigator } from "./KanbanBoard/MobileColumnNavigator";
import { KanbanBoardLoadingState } from "./KanbanBoard/KanbanBoardLoadingState";
import { KanbanColumnsContainer } from "./KanbanBoard/KanbanColumnsContainer";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";

interface KanbanBoardProps {
  tasks: Task[];
  sort: KanbanSort;
  enforceWIP: boolean;
  focusMode: boolean;
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export function KanbanBoard({
  tasks,
  sort,
  enforceWIP,
  focusMode,
  onTaskClick,
  isLoading,
}: KanbanBoardProps) {
  const kanban = useKanbanBoard({ tasks, sort, focusMode });

  if (isLoading) {
    return <KanbanBoardLoadingState />;
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {kanban.isMobile && (
        <MobileColumnNavigator
          currentColumnIndex={kanban.currentColumnIndex}
          onPrevious={kanban.handlePreviousColumn}
          onNext={kanban.handleNextColumn}
        />
      )}

      <KanbanColumnsContainer
        visibleColumns={kanban.visibleColumns}
        sortedTasksByColumn={kanban.sortedTasksByColumn}
        columnStats={kanban.columnStats}
        enforceWIP={enforceWIP}
        isMobile={kanban.isMobile}
        onTaskClick={onTaskClick}
      />
    </div>
  );
}