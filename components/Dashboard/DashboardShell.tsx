"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useSession, signOut } from "next-auth/react";

interface UserProfile {
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
    plan: string;
    maxStorage: number;
  }>;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { status, data: session } = useSession();

  const handleAuthFailure = useCallback(() => {
    signOut({ callbackUrl: "/authentication/login" });
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get<{ user: UserProfile }>("/api/user/profile");
      if (response?.data) {
        setProfile(response.data.user);
      } else {
        // api.get returned undefined — axios error handler already called signOut,
        // but we force redirect here as a safety net
        handleAuthFailure();
      }
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const status = error?.response?.status;

      const isAuthError =
        status === 401 ||
        status === 403 ||
        code === "NO_TOKEN" ||
        code === "INVALID_TOKEN" ||
        code === "TOKEN_EXPIRED" ||
        code === "TOKEN_INVALID" ||
        code === "USER_NOT_FOUND" ||
        code === "EMAIL_NOT_VERIFIED";

      if (isAuthError) {
        handleAuthFailure();
      } else {
        console.error("Failed to fetch profile:", error);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthFailure]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/authentication/login");
      return;
    }

    // Session exists but backendToken is missing or empty
    if (status === "authenticated" && !session?.backendToken) {
      handleAuthFailure();
      return;
    }

    fetchProfile();
  }, [status, session?.backendToken, fetchProfile, router, handleAuthFailure]);

  const segments = pathname.split("/").filter(Boolean);
  const isWorkspaceRoute =
    segments[0] === "dashboard" && segments[1] === "workspaces";
  const thirdSegment = segments[2];
  const hideLayout =
    isWorkspaceRoute && thirdSegment && thirdSegment !== "new-workspace";

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Don't render dashboard content at all if there's no profile
  // (covers the moment between auth failure detection and redirect completing)
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 min-w-0">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} user={profile} />
        <main className="flex-1 p-5 lg:py-8 lg:px-5">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}