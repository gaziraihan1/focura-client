"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, Shield, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const twoFactorSchema = z.object({
  password: z.string().min(1, "Password is required"),
  totpCode: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const onSubmit = async (values: TwoFactorFormData) => {
    if (!email) {
      toast.error("Session expired. Please sign in again.");
      router.push("/authentication/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: values.password,
        totpCode: values.totpCode,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid verification code. Please try again.");
        return;
      }

      if (result?.ok) {
        toast.success("Verified successfully! Welcome back.");
        router.push("/authentication/success");
      }
    } catch (err) {
      console.error("2FA verification error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <span className="pointer-events-none absolute -top-px -left-px h-8 w-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
          <span className="pointer-events-none absolute -top-px -right-px h-8 w-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
          <span className="pointer-events-none absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
          <span className="pointer-events-none absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-primary/5 blur-3xl scale-110" />
          <div className="w-full p-10 rounded-2xl bg-card/80 backdrop-blur-2xl border border-border/60 shadow-2xl shadow-black/40 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Missing email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              No email was provided. Please sign in again.
            </p>
            <Link
              href="/authentication/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Decorative corner brackets */}
        <span className="pointer-events-none absolute -top-px -left-px h-8 w-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
        <span className="pointer-events-none absolute -top-px -right-px h-8 w-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
        <span className="pointer-events-none absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
        <span className="pointer-events-none absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />

        {/* Ambient glow blob */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-primary/5 blur-3xl scale-110" />

        <div className="w-full p-10 rounded-2xl bg-card/80 backdrop-blur-2xl border border-border/60 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80">
              Two-factor authentication
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
              Verify your
              <span className="text-primary"> identity</span>
            </h1>
            <p className="text-sm text-muted-foreground pt-1">
              Enter your password and the 6-digit code from your authenticator app.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {/* Email display (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground/80 uppercase">
                Account
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground/80">
                <Shield size={16} className="text-primary/60 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground/80 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
                />
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  {...register("password")}
                  className={`
                    w-full pl-11 pr-4 py-3 rounded-xl text-sm
                    bg-transparent border
                    placeholder:text-muted-foreground/40
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                    transition-all duration-200
                    ${errors.password ? "border-destructive/70 focus:ring-destructive/30 focus:border-destructive" : "border-border/70"}
                  `}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive/80 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* TOTP Code field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground/80 uppercase">
                Authentication code
              </label>
              <div className="relative">
                <Shield
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  {...register("totpCode")}
                  autoComplete="one-time-code"
                  className={`
                    w-full pl-11 pr-4 py-3 rounded-xl text-sm tracking-[0.3em] text-center font-mono text-lg
                    bg-transparent border
                    placeholder:text-muted-foreground/40
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                    transition-all duration-200
                    ${errors.totpCode ? "border-destructive/70 focus:ring-destructive/30 focus:border-destructive" : "border-border/70"}
                  `}
                />
              </div>
              {errors.totpCode && (
                <p className="text-xs text-destructive/80 mt-1">{errors.totpCode.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group relative w-full py-3 rounded-xl
                  bg-primary text-primary-foreground text-sm font-semibold tracking-wide
                  overflow-hidden transition-all duration-200
                  hover:brightness-110 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  shadow-md shadow-primary/30
                "
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/15 to-transparent" />
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                Verify & sign in
              </button>
            </div>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/authentication/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense>
      <TwoFactorContent />
    </Suspense>
  );
}
