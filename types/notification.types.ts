export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface NotificationsResponse {
  items: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface NotificationPreferences {
  browserNotifications: boolean;
  soundEnabled: boolean;
}

export const EMPTY_PAGE: NotificationsResponse = {
  items: [],
  nextCursor: null,
  hasMore: false,
};

export const TASK_NOTIFICATION_TYPES = [
  "TASK_DUE_SOON",
  "TASK_OVERDUE",
  "DEADLINE_REMINDER",
  "TASK_ASSIGNED",
  "TASK_COMPLETED",
] as const;
