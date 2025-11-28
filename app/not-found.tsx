"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 md:w-28 md:h-28 text-primary/40" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => router.back()}
            className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            href="/"
            className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 bg-liear-to-r from-primary/0 via-primary/20 to-primary/0 rounded-full"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          <p>Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              href="/dashboard"
              className="text-primary hover:underline transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/authentication/login"
              className="text-primary hover:underline transition-colors"
            >
              Login
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/"
              className="text-primary hover:underline transition-colors"
            >
              Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}