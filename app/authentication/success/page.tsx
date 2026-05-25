"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    setTimeout(() => {
      router.push(callbackUrl);
    }, 500);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin mx-auto text-primary" size={48} />
        <h2 className="text-xl font-semibold text-foreground">Success! Redirecting...</h2>
      </div>
    </div>
  );
}