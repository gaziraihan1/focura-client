"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/axios";

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

  
const fetchProfile = useCallback(async () => {
  try {
    const response = await api.get<{ user: UserProfile }>("/api/user/profile");
    if (response.data) {
      setProfile(response.data.user);
    }
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      router.replace("/authentication/login");
    } else {
      console.error("Failed to fetch profile:", error);
      router.replace("/authentication/login");
    }
  } finally {
    setIsLoading(false);
  }
}, [router]);

useEffect(() => {
  fetchProfile();
}, [fetchProfile]);

  const segments = pathname.split("/").filter(Boolean);
  const isWorkspaceRoute = segments[0] === "dashboard" && segments[1] === "workspaces";
  const thirdSegment = segments[2];
  const hideLayout = isWorkspaceRoute && thirdSegment && thirdSegment !== "new-workspace";

  // Show nothing while checking auth to prevent flash of protected content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) return null;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
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