"use client";
import { m as motion } from "framer-motion";
import { AuthFormHeader } from "./AuthForm/AuthFormHeader";
import { AuthFormFields } from "./AuthForm/AuthFormFields";
import { AuthFormButtons } from "./AuthForm/AuthFormButtons";
import { AuthFormFooter } from "./AuthForm/AuthFormFooter";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AlertCircle } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isGoogleLoading,
    isLoading,
    onSubmit,
    handleGoogle,
    formError,
    clearFormError,
  } = useAuthForm({ mode });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
    >
      {/* Decorative corner brackets */}
      <span className="pointer-events-none absolute -top-px -left-px h-8 w-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
      <span className="pointer-events-none absolute -top-px -right-px h-8 w-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />

      {/* Ambient glow blob */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-primary/5 scale-110" />

      <div className="w-full p-10 rounded-2xl bg-card border border-border/60 shadow-2xl shadow-black/40">
        <AuthFormHeader mode={mode} />

        {/* Form-level error summary */}
        {formError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
        <AuthFormFooter mode={mode} onModeChange={onModeChange} />
      </div>
    </motion.div>
  );
}