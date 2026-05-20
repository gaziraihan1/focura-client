import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
export type ContactCategory =
  | "GENERAL"
  | "BILLING"
  | "TECHNICAL"
  | "FEATURE_REQUEST"
  | "BUG_REPORT"
  | "OTHER";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: ContactCategory;
  status: ContactStatus;
  createdAt: string;
  message: string
}

export interface ContactMessagesResponse {
  success: boolean;
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseContactMessagesOptions {
  page?: number;
  limit?: number;
  status?: ContactStatus;
  category?: ContactCategory;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const contactKeys = {
  all: (opts: UseContactMessagesOptions) =>
    ["contact-messages", opts] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useContactMessages(opts: UseContactMessagesOptions = {}) {
  const { page = 1, limit = 20, status, category } = opts;

  return useQuery({
    queryKey: contactKeys.all({ page, limit, status, category }),
    queryFn: async (): Promise<ContactMessagesResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      });

      const res = await api.get<ContactMessagesResponse>(
        `/api/v1/contact?${params.toString()}`
      );
      return res?.data ?? { success: false, messages: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    },
    staleTime: 60 * 1000,
  });
}