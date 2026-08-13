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
      <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading dashboard">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" aria-hidden="true" />
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
      const loginUrl = `/authentication/login?callbackUrl=${encodeURIComponent(
        pathname
      )}`;
      // Session/auth status only exists client-side via async useSession.
      // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
      router.replace(loginUrl);
      return;
    }

    // Google sign-in with 2FA: the session exists but has no backend tokens
    // yet — route to the 2FA page instead of treating it as a dead session.
    if (status === "authenticated" && session?.twoFactorPending) {
      // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
      router.replace("/authentication/2fa");
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
  }, [status, session?.backendToken, session?.twoFactorPending, router, pathname]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching,
  } = useUserProfile();

  const segments = pathname.split("/").filter(Boolean);
  const isWorkspaceRoute =
    segments[0] === "dashboard" && segments[1] === "workspaces";
  const thirdSegment = segments[2];
  // Static root pages under /dashboard/workspaces keep the global dashboard
  // shell. Only real workspace routes ([workspaceSlug]) hide it — those render
  // their own full-screen workspace layout (see [workspaceSlug]/layout.tsx).
  const WORKSPACE_ROOT_PAGES = ["new-workspace", "browse"];
  const hideLayout =
    isWorkspaceRoute &&
    !!thirdSegment &&
    !WORKSPACE_ROOT_PAGES.includes(thirdSegment);

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
        <div role="presentation"
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

        <main id="main-content" className="flex-1 px-4 py-5 lg:px-6 lg:py-7 max-w-screen-2xl w-full mx-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}