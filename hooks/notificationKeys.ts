export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"],
  unreadCount: () => [...notificationKeys.all, "unread-count"],
};
