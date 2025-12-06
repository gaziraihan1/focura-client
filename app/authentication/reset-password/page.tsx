"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema) as any,
  });

  const onSubmit = async (values: Record<string, string>) => {
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/authentication/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  if (!token) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg text-center"
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-foreground/60 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/authentication/forgot-password"
            className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Request New Link
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg"
      >
        <h1 className="text-3xl font-bold text-foreground text-center">
          Reset Password
        </h1>

        <p className="text-foreground/60 text-center mt-2">
          Enter your new password
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-red-500 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
          >
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-green-500 text-sm font-medium">
                Password reset successfully!
              </p>
              <p className="text-green-500/80 text-xs mt-1">
                Redirecting to login...
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-foreground/50"
              size={18}
            />
            <input
              {...register("password")}
              type="password"
              placeholder="New Password"
              disabled={isSubmitting || success}
              className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
                errors.password ? "border-red-500" : "border-border"
              } ${isSubmitting || success ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-foreground/50"
              size={18}
            />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              disabled={isSubmitting || success}
              className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
                errors.confirmPassword ? "border-red-500" : "border-border"
              } ${isSubmitting || success ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            Reset Password
          </button>
        </form>

        <p className="text-center text-foreground/60 mt-6 text-sm">
          Remember your password?
          <Link
            href="/authentication/login"
            className="text-primary ml-1 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </section>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}