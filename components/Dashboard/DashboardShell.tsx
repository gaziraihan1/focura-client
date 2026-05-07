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
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
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

  // IMPROVED: Single effect with better logging and token validation
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
          },
        );

        signOut({
          callbackUrl: "/authentication/login",
        });
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

  /**
   * Only block for auth loading.
   */
  if (status === "loading") {
    return <FullPageSpinner />;
  }

  /**
   * Redirect handled in effect - don't render anything
   */
  if (
    status === "unauthenticated" ||
    !session?.backendToken ||
    session.backendToken.length < 10
  ) {
    return null;
  }

  /**
   * Hide shell layout for specific routes.
   */
  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background scroll-smooth">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 lg:pl-64">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          user={profile}
          isLoadingProfile={isProfileLoading && !profile}
          isRefreshing={isFetching && !!profile}
        />

        <main className="flex-1 p-5 lg:px-5 lg:py-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
