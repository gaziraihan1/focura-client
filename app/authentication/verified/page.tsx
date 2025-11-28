"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500" size={64} />

        <h1 className="mt-6 text-3xl font-bold text-heading">
          Email Verified Successfully!
        </h1>

        <p className="mt-3 text-foreground/70">
          Your account is now active. You can log in and start using Focura.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
