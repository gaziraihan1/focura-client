import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthPage } from "@/components/auth/AuthPage";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(session.twoFactorPending ? "/authentication/2fa" : "/dashboard");
  }
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
