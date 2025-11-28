import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthForm from "@/components/Authentication/AuthForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <>

      <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
        <AuthForm mode="login" />
      </section>
    </>
  );
}
