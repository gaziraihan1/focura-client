import { motion } from "framer-motion";
import { ReactNode } from "react";

interface VerifyEmailContainerProps {
  children: ReactNode;
}

export function VerifyEmailContainer({ children }: VerifyEmailContainerProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg text-center"
      >
        {children}
      </motion.div>
    </section>
  );
}