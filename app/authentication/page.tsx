import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { Suspense } from "react";
import { AuthPage } from "@/components/auth/AuthPage";

export default async function AuthenticationPage() {
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
