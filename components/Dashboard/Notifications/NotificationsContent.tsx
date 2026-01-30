import { NotificationsLoadingState } from "./NotificationsLoadingState";
import { NotificationsEmptyState } from "./NotificationsEmptyState";
import { NotificationsList } from "./NotificationsList";
import { LoadMoreButton } from "./LoadMoreButton";
import { EndOfListMessage } from "./EndOfListMessage";

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

interface NotificationsContentProps {
  notifications: Notification[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onNotificationClick: (notification: Notification) => void;
  onNotificationDelete: (id: string) => void;
  onLoadMore: () => void;
}

export function NotificationsContent({
  notifications,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onNotificationClick,
  onNotificationDelete,
  onLoadMore,
}: NotificationsContentProps) {
  return (
    <div className="space-y-3">
      {isLoading && <NotificationsLoadingState />}

      {!isLoading && notifications.length === 0 && <NotificationsEmptyState />}

      {!isLoading && notifications.length > 0 && (
        <>
          <NotificationsList
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onNotificationDelete={onNotificationDelete}
          />

          <LoadMoreButton
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={onLoadMore}
          />

          <EndOfListMessage
            show={notifications.length > 0 && !hasNextPage}
          />
        </>
      )}
    </div>
  );
}