import { Suspense } from "react";
import { AuthPage } from "@/components/auth/AuthPage";

export default function RegistrationPage() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
