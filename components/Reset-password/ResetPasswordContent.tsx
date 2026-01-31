"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { InvalidResetTokenState } from "./InvalidResetTokenState";
import { ResetPasswordPageHeader } from "./ResetPasswordPageHeader";
import { ResetPasswordPageAlerts } from "./ResetPasswordPageAlerts";
import { ResetPasswordPageForm } from "./ResetPasswordPageForm";
import { ResetPasswordPageFooter } from "./ResetPasswordPageFooter";
import { useResetPasswordPage } from "@/hooks/useResetPasswordPage";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    success,
    onSubmit,
  } = useResetPasswordPage({ token });

  if (!token) {
    return <InvalidResetTokenState />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg"
      >
        <ResetPasswordPageHeader />

        <ResetPasswordPageAlerts error={error} success={success} />

        <ResetPasswordPageForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          success={success}
          onSubmit={handleSubmit(onSubmit)}
        />

        <ResetPasswordPageFooter />
      </motion.div>
    </section>
  );
}