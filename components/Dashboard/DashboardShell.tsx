"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

import { useUserProfile } from "@/hooks/useUserProfile";

function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-xs text-muted-foreground animate-pulse">Loading…</p>
      </div>
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      console.log("🔴 DashboardShell: Unauthenticated - redirecting to login");
      router.replace("/authentication/login");
      return;
    }

    if (status === "authenticated") {
      const hasBackendToken =
        !!session?.backendToken && session.backendToken.length > 10;

      if (!hasBackendToken) {
        console.error(
          "🔴 DashboardShell: Authenticated but no valid backend token - forcing logout",
          {
            hasBackendToken: !!session?.backendToken,
            tokenLength: session?.backendToken?.length || 0,
          }
        );
        signOut({ callbackUrl: "/authentication/login" });
      }
    }
  }, [status, session?.backendToken, router]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching,
  } = useUserProfile();

  const segments = pathname.split("/").filter(Boolean);
  const isWorkspaceRoute =
    segments[0] === "dashboard" && segments[1] === "workspaces";
  const thirdSegment = segments[2];
  const hideLayout =
    isWorkspaceRoute && thirdSegment && thirdSegment !== "new-workspace";

  if (status === "loading") return <FullPageSpinner />;

  if (
    status === "unauthenticated" ||
    !session?.backendToken ||
    session.backendToken.length < 10
  ) {
    return null;
  }

  if (hideLayout) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={profile}
          isLoadingProfile={isProfileLoading && !profile}
          isRefreshing={isFetching && !!profile}
        />

        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-7 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}