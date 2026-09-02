"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "./AuthForm";

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    router.replace(`/authentication?mode=${newMode}`, { scroll: false });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <AuthForm mode={mode} onModeChange={handleModeChange} />
    </section>
  );
}
