// frontend/src/lib/auth/logout.ts
import { signOut, getSession } from "next-auth/react";
import { stopBackgroundRefresh } from "@/lib/axios";

export async function logout(logoutAll = false): Promise<void> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    // Per FRONTEND_AUTH_GUIDE.md §6: logout accepts an optional Bearer token
    // (best-effort) and always returns 200. We attach it so the backend can
    // revoke the access token JTI. No cookies are sent (withCredentials:false).
    const session = await getSession();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.backendToken) {
      headers["Authorization"] = `Bearer ${session.backendToken}`;
    }
    await fetch(`${backendUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers,
      body: JSON.stringify({ logoutAll }),
    });
  } catch (err) {
    console.warn("⚠️ Backend logout failed:", err);
  }
  stopBackgroundRefresh();
  await signOut({ callbackUrl: "/authentication/login", redirect: true });
}
