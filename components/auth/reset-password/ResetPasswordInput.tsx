"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

interface ResetPasswordInputProps {
  name: "password" | "confirmPassword";
  placeholder: string;
  register: UseFormRegister<ResetPasswordForm>;
  errors: FieldErrors<ResetPasswordForm>;
  disabled: boolean;
}

export function ResetPasswordInput({
  name,
  placeholder,
  register,
  errors,
  disabled,
}: ResetPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-3.5 text-foreground/50" size={18} />
      <input
        {...register(name)}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-3 pl-10 pr-10 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
          error ? "border-red-500" : "border-border"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        className="absolute right-3 top-3.5 text-foreground/50 hover:text-foreground transition"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
}