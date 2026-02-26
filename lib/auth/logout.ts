// frontend/src/lib/auth/logout.ts
import { signOut } from "next-auth/react";

export async function logout(logoutAll = false): Promise<void> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoutAll }),
    });
  } catch (err) { console.warn("⚠️ Backend logout failed:", err); }
  await signOut({ callbackUrl: "/authentication/login", redirect: true });
}
