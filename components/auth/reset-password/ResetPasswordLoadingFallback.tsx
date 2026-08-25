import { Loader2 } from "lucide-react";

export function ResetPasswordLoadingFallback() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
    </section>
  );
}