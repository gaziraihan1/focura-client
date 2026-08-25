import { TaskDescription } from "./TaskDescription";
import { TaskTimeDetails } from "./TaskTimeDetails";
import { TaskPeopleSection } from "./TaskPeopleSection";
import { TaskProjectSection } from "./TaskProjectSection";
import { TaskActivityStats } from "./TaskActivityStats";
import { TaskPlanSection } from "./TaskPlanSection";
import { TaskFocusSection } from "./TaskFocusSection";

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

interface Milestone {
  id: string;
  title: string;
  status?: string | null;
  progress?: number | null;
}

interface Sprint {
  id: string;
  name: string;
}

interface Recurrence {
  id: string;
  pattern: string;
  interval: number;
  days?: number[] | null;
  endsAt?: string | null;
}

interface TaskModalContentProps {
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  createdAt: string;
  updatedAt?: string | null;
  timeProgress?: number | null;
  isOverdue: boolean;
  createdBy: TaskUser;
  assignees: Assignee[];
  project?: Project | null;
  commentsCount: number;
  subtasksCount: number;
  filesCount: number;
  milestone?: Milestone | null;
  sprint?: Sprint | null;
  recurrence?: Recurrence | null;
  energyType?: string | null;
  focusRequired?: boolean | null;
  focusLevel?: number | null;
  distractionCost?: number | null;
}

export function TaskModalContent({
  description,
  startDate,
  dueDate,
  estimatedHours,
  createdAt,
  updatedAt,
  timeProgress,
  isOverdue,
  createdBy,
  assignees,
  project,
  commentsCount,
  subtasksCount,
  filesCount,
  milestone,
  sprint,
  recurrence,
  energyType,
  focusRequired,
  focusLevel,
  distractionCost,
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
          updatedAt={updatedAt}
          timeProgress={timeProgress}
          isOverdue={isOverdue}
        />

        <TaskPlanSection milestone={milestone} sprint={sprint} recurrence={recurrence} />

        <TaskFocusSection
          energyType={energyType}
          focusRequired={focusRequired}
          focusLevel={focusLevel}
          distractionCost={distractionCost}
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
