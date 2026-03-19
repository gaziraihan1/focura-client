export type SubtaskStatus   = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type SubtaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export interface SubtaskUser {
  id:    string;
  name:  string;
  email: string;
  image: string | null;
}

export interface SubtaskAssignee {
  user: SubtaskUser;
}

export interface Subtask {
  id:             string;
  title:          string;
  description:    string | null;
  status:         SubtaskStatus;
  priority:       SubtaskPriority;
  dueDate:        string | null;
  estimatedHours: number | null;
  depth:          number;
  parentId:       string;
  createdById:    string;
  workspaceId:    string | null;
  createdAt:      string;
  updatedAt:      string;
  createdBy:      SubtaskUser;
  assignees:      SubtaskAssignee[];
  _count: {
    comments: number;
    files:    number;
  };
}

export interface SubtaskStats {
  total:          number;
  completed:      number;
  inProgress:     number;
  todo:           number;
  completionRate: number;
}

export interface CreateSubtaskDto {
  title:          string;
  description?:   string;
  status?:        SubtaskStatus;
  priority?:      SubtaskPriority;
  dueDate?:       string;
  estimatedHours?: number;
  assigneeIds?:   string[];
}

export interface UpdateSubtaskDto {
  title?:         string;
  description?:   string;
  status?:        SubtaskStatus;
  priority?:      SubtaskPriority;
  dueDate?:       string | null;
  estimatedHours?: number;
}

