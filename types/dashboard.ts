import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  name: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export type TaskPriority = "High" | "Medium" | "Low";

export interface RecentTask {
  id: number;
  title: string;
  project: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
}

export type EventType = "Meeting" | "Deadline";

export interface UpcomingEvent {
  id: number;
  title: string;
  time: string;
  type: EventType;
}
