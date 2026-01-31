"use client";

import { Suspense } from "react";
import VerifyEmailContent from "@/components/VerifyEmail/VerifyEmailContent";
import { Loader2 } from "lucide-react";



export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </section>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}