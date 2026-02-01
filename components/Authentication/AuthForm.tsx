"use client";

import { motion } from "framer-motion";
import ErrorState from "../ForgetPassword/ErrorState";
import { AuthFormHeader } from "./AuthForm/AuthFormHeader";
import { AuthFormFields } from "./AuthForm/AuthFormFields";
import { AuthFormButtons } from "./AuthForm/AuthFormButtons";
import { AuthFormFooter } from "./AuthForm/AuthFormFooter";
import { useAuthForm } from "@/hooks/useAuthForm";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    isGoogleLoading,
    isLoading,
    onSubmit,
    handleGoogle,
  } = useAuthForm({ mode });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg"
    >
      <AuthFormHeader mode={mode} />

      {error && <ErrorState error={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <AuthFormFields
          mode={mode}
          register={register}
          errors={errors}
          isLoading={isLoading}
        />

        <AuthFormButtons
          mode={mode}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          isGoogleLoading={isGoogleLoading}
          onGoogleClick={handleGoogle}
        />
      </form>

      <AuthFormFooter mode={mode} />
    </motion.div>
  );
}