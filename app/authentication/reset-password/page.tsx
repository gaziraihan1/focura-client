"use client";

import { Suspense } from "react";
import { ResetPasswordLoadingFallback } from "@/components/Reset-password/ResetPasswordLoadingFallback";
import { ResetPasswordContent } from "@/components/Reset-password/ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}