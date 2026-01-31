import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function InvalidResetTokenState() {
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