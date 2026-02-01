"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ErrorState from "@/components/ForgetPassword/ErrorState";
import { useForgetPasswordPage } from "@/hooks/useForgetPasswordPage";
import SuccessState from "@/components/ForgetPassword/SuccessState";
import PasswordResetForm from "@/components/ForgetPassword/PasswordResetForm";

export default function ForgotPasswordPage() {

  const {error, success} = useForgetPasswordPage()
  

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
          <ErrorState error={error} />
        )}

        {success && (
          <SuccessState />
        )}

        <PasswordResetForm />

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