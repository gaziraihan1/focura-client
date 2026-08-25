import { User, Users, MessageSquare, Paperclip } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type User = {
    id: string;
    name: string;
    image?: string | undefined
}
interface Assignee {
  user: User
}

interface KanbanCardFooterProps {
  assignees: Assignee[];
  commentsCount: number;
  filesCount: number;
  dueDate?: string | null;
  isOverdue: boolean;
}

export function KanbanCardFooter({
  assignees,
  commentsCount,
  filesCount,
  dueDate,
  isOverdue,
}: KanbanCardFooterProps) {
  return (
    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {assignees.length === 0 ? (
          <>
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unassigned</span>
          </>
        ) : (
          <>
            <Users className="w-3.5 h-3.5" />
            <span>{assignees.length}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
        {commentsCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{commentsCount}</span>
          </div>
        )}

        {filesCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            <Paperclip className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{filesCount}</span>
          </div>
        )}

        {dueDate && (
          <div
            className={cn(
              "text-[10px] sm:text-xs",
              isOverdue && "text-destructive font-medium",
            )}
          >
            {format(parseISO(dueDate), "MMM d")}
          </div>
        )}
      </div>
    </div>
  );
}
