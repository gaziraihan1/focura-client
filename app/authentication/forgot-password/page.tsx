"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema) as any,
  });

  const onSubmit = async (values: Record<string, string>) => {
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg"
      >
        <Link
          href="/authentication/login"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition mb-6"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-foreground text-center">
          Forgot Password?
        </h1>

        <p className="text-foreground/60 text-center mt-2">
          Enter your email and we&apos;ll send you a reset link
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
            <p className="text-green-500 text-sm">
              Password reset link sent! Check your email.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-foreground/50"
              size={18}
            />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              disabled={isSubmitting || success}
              className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
                errors.email ? "border-red-500" : "border-border"
              } ${isSubmitting || success ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            Send Reset Link
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