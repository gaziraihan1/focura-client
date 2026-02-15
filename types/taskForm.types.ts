import { CreateTaskDto } from "@/hooks/useTask";

export type CreateTaskFormData = Required<
  Pick<CreateTaskDto, "title" | "status" | "priority" | "assigneeIds">
> &
  Pick<
    CreateTaskDto,
    | "description"
    | "dueDate"
    | "estimatedHours"
    | "intent"
    | "labelIds"
  > & {
    focusLevel: number;
    focusRequired: boolean;
    energyType: "LOW" | "MEDIUM" | "HIGH";
    distractionCost: number;
  };

export interface ProjectMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface CreateTaskModalProps {
  projectId: string;
  workspaceId: string;
  projectMembers: ProjectMember[];
  onClose: () => void;
}

export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type Intent = "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";


export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
export type EnergyType = "LOW" | "MEDIUM" | "HIGH";
export type TaskIntent = "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";

export interface ProjectMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface CreateTaskModalProps {
  projectId: string;
  workspaceId: string;
  projectMembers: ProjectMember[];
  onClose: () => void;
}