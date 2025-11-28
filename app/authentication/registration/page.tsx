import AuthForm from "@/components/Authentication/AuthForm";

export default function RegisterPage() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
        <AuthForm mode="register" />
      </section>
    </>
  );
}
