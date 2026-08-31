import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export default async function AuthenticationPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(session.twoFactorPending ? "/authentication/2fa" : "/dashboard");
  } else {
    redirect("/authentication/login");
  }
}