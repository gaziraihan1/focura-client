import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, AppError } from "@/lib/axios";
import { signOut, useSession } from "next-auth/react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  timezone?: string;
  role: string;
  createdAt: string;
  ownedWorkspaces: Array<{
    id: string;
    name: string;
    plan: string;
    maxStorage: number;
  }>;
}

export const profileKeys = {
  me: ["profile", "me"] as const,
};

const AUTH_ERROR_CODES = new Set([
  "NO_TOKEN", "INVALID_TOKEN", "TOKEN_EXPIRED",
  "TOKEN_INVALID", "USER_NOT_FOUND", "EMAIL_NOT_VERIFIED",
]);

export function useUserProfile() {
  const { status, data: session } = useSession();
  const isReady = status === "authenticated" && !!session?.backendToken;

  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get<{ user: UserProfile }>("/api/user/profile");
      const user = response?.data?.user;
      if (!user) throw new Error("No profile returned");
      return user;
    },
    enabled: isReady,
    staleTime: 10 * 60 * 1000,   // treat as fresh for 10 min — no refetch on nav
    gcTime:    30 * 60 * 1000,  // keep in cache for 30 min
    retry: (failureCount, error: AppError) => {
      const code   = error?.response?.data?.code;
      const status = error?.response?.status;
      // Don't retry auth errors — sign out immediately
      if (AUTH_ERROR_CODES.has(code!) || status === 401 || status === 403) {
        signOut({ callbackUrl: "/authentication/login" });
        return false;
      }
      return failureCount < 2;
    },
  });
}

/** Call this after a profile update to refresh the cache. */
export function useInvalidateProfile() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: profileKeys.me });
}