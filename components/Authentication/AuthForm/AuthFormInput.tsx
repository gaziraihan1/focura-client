"use client";

import { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";

interface AuthFormInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  type?: string;
  placeholder: string;
  icon: LucideIcon;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  disabled: boolean;
}

export function AuthFormInput<TFieldValues extends FieldValues>({
  name,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  errors,
  disabled,
}: AuthFormInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 text-foreground/50" size={18} />
      <input
        {...register(name)}
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-3 pl-10 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
          isPassword ? "pr-10" : "pr-4"
        } ${error ? "border-red-500" : "border-border"} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute right-3 top-3.5 text-foreground/50 hover:text-foreground transition"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
}