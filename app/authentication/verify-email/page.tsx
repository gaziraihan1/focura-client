"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => {
            router.push("/authentication/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verifying Your Email
            </h1>
            <p className="text-foreground/60">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-foreground/60 mb-6">{message}</p>
            <p className="text-sm text-foreground/50">
              Redirecting to login page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-foreground/60 mb-6">{message}</p>
            <Link
              href="/authentication/login"
              className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </>
        )}
      </motion.div>
    </section>
  );
}

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