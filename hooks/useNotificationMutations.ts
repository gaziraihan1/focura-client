import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  NotificationsResponse,
  UnreadCountResponse,
} from "@/types/notification.types";
import { notificationKeys } from "./notificationKeys";

export function useMarkAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(
        `/api/v1/notifications/${notificationId}/read`
      );
      return response?.data;
    },
    onSuccess: (_, notificationId) => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        notificationKeys.list(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) =>
                n.id === notificationId
                  ? { ...n, read: true, readAt: new Date().toISOString() }
                  : n
              ),
            })),
          };
        }
      );
      qc.setQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
        (old) => ({ count: Math.max(0, (old?.count ?? 1) - 1) })
      );
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch("/api/v1/notifications/read-all");
      return response?.data;
    },
    onSuccess: () => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        notificationKeys.list(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => ({
                ...n,
                read: true,
                readAt: new Date().toISOString(),
              })),
            })),
          };
        }
      );
      qc.setQueryData<UnreadCountResponse>(notificationKeys.unreadCount(), {
        count: 0,
      });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.delete(`/api/v1/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: (notificationId) => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        notificationKeys.list(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => n.id !== notificationId),
            })),
          };
        }
      );
      qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

export function useDeleteAllRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/v1/notifications/read/all");
      return response?.data;
    },
    onSuccess: () => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        notificationKeys.list(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => !n.read),
            })),
          };
        }
      );
    },
  });
}
