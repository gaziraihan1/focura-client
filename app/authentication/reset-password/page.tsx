"use client";

import { Suspense } from "react";
import { ResetPasswordLoadingFallback } from "@/components/auth/reset-password/ResetPasswordLoadingFallback";
import { ResetPasswordContent } from "@/components/auth/reset-password/ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}