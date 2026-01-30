import { Task } from "@/hooks/useTask";
import { ColumnConfig } from "@/hooks/useKanbanBoard";
import { KanbanColumn } from "../KanbanColumn";

interface ColumnStats {
  count: number;
  avgDays: number;
  isBottleneck: boolean;
}

interface KanbanColumnsContainerProps {
  visibleColumns: ColumnConfig[];
  sortedTasksByColumn: Map<string, Task[]>;
  columnStats: Map<string, ColumnStats>;
  enforceWIP: boolean;
  isMobile: boolean;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumnsContainer({
  visibleColumns,
  sortedTasksByColumn,
  columnStats,
  enforceWIP,
  isMobile,
  onTaskClick,
}: KanbanColumnsContainerProps) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div
        className={`h-full flex gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 ${
          isMobile ? "" : "min-w-max"
        }`}
      >
        {visibleColumns.map((column) => {
          const tasks = sortedTasksByColumn.get(column.id) || [];
          const stats = columnStats.get(column.id)!;

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks}
              stats={stats}
              enforceWIP={enforceWIP}
              onTaskClick={onTaskClick}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
}