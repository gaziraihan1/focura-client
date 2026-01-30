import { NotificationItem } from "./NotificationItem";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
  sender?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onNotificationDelete: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onNotificationClick,
  onNotificationDelete,
}: NotificationsListProps) {
  return (
    <>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onDelete={() => onNotificationDelete(notification.id)}
        />
      ))}
    </>
  );
}