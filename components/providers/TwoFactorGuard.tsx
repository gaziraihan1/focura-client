"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Global guard that redirects authenticated users with a pending 2FA
 * verification to `/authentication/2fa`. Without this, users who sign
 * in via Google OAuth land on the public landing page (`/`) because
 * NextAuth's default redirect goes there, and they get stuck because
 * only DashboardShell (used in `/dashboard/*`) had the redirect logic.
 */
export default function TwoFactorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // Already on the 2FA page — let it handle its own logic
    if (pathname.startsWith("/authentication/2fa")) return;

    // Authenticated but 2FA not yet completed → redirect to 2FA
    if (status === "authenticated" && session?.twoFactorPending) {
      router.replace("/authentication/2fa");
      return;
    }
  }, [status, session?.twoFactorPending, pathname, router]);

  return <>{children}</>;
}
