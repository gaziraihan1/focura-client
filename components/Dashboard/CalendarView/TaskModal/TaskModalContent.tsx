import { TaskDescription } from "./TaskDescription";
import { TaskTimeDetails } from "./TaskTimeDetails";
import { TaskPeopleSection } from "./TaskPeopleSection";
import { TaskProjectSection } from "./TaskProjectSection";
import { TaskActivityStats } from "./TaskActivityStats";

interface TaskUser {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
}

interface Assignee {
  user: TaskUser;
}

interface Project {
  id: string;
  name: string;
  color: string;
  workspace: {
    id: string;
    name: string;
  };
}

interface TaskModalContentProps {
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  createdAt: string;
  isOverdue: boolean;
  createdBy: TaskUser;
  assignees: Assignee[];
  project?: Project | null;
  commentsCount: number;
  subtasksCount: number;
  filesCount: number;
}

export function TaskModalContent({
  description,
  startDate,
  dueDate,
  estimatedHours,
  createdAt,
  isOverdue,
  createdBy,
  assignees,
  project,
  commentsCount,
  subtasksCount,
  filesCount,
}: TaskModalContentProps) {
  return (
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-hide">
      <div className="space-y-6">
        <TaskDescription description={description} />

        <TaskTimeDetails
          startDate={startDate}
          dueDate={dueDate}
          estimatedHours={estimatedHours}
          createdAt={createdAt}
          isOverdue={isOverdue}
        />

        <TaskPeopleSection createdBy={createdBy} assignees={assignees} />

        <TaskProjectSection project={project} />

        <TaskActivityStats
          commentsCount={commentsCount}
          subtasksCount={subtasksCount}
          filesCount={filesCount}
        />
      </div>
    </div>
  );
}