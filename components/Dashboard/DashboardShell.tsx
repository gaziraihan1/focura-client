"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";

function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authentication/login");
      return;
    }
    if (status === "authenticated" && !session?.backendToken) {
      signOut({ callbackUrl: "/authentication/login" });
    }
  }, [status, session?.backendToken, router]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching,
  } = useUserProfile();

  const segments        = pathname.split("/").filter(Boolean);
  const isWorkspaceRoute = segments[0] === "dashboard" && segments[1] === "workspaces";
  const thirdSegment    = segments[2];
  const hideLayout      =
    isWorkspaceRoute && thirdSegment && thirdSegment !== "new-workspace";

  const isHardBlocking =
    status === "loading" ||
    (isProfileLoading && !profile);

  if (isHardBlocking) return <FullPageSpinner />;

  if (status === "unauthenticated" || !profile) return <FullPageSpinner />;

  if (hideLayout) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background scroll-smooth overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 min-w-0">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={profile}
          isRefreshing={isFetching && !!profile}
        />
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