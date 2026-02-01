import { useForgetPasswordPage } from "@/hooks/useForgetPasswordPage";
import { Loader2, Mail } from "lucide-react";
import React from "react";

export default function PasswordResetForm() {
  const { register, handleSubmit, onSubmit, isSubmitting, success, errors } =
    useForgetPasswordPage();
  return (
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
  );
}
