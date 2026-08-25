import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { AdminLayoutShell } from "./AdminLayoutShell";

// Server-side authorization boundary for every /admin-dashboard/* route.
// Layered defense (in order): proxy.ts edge JWT/role check → THIS layout →
// backend `requireFocuraAdmin` on /api/v1/admin/*. AdminLayoutShell's own
// client redirect remains UX polish only.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/authentication/login");

  const role = session.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/dashboard");

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
