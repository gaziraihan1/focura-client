import AuthFormSkeleton from "@/components/auth/AuthFormSkeleton";

export default function LoginLoading() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <AuthFormSkeleton />
    </section>
  );
}
