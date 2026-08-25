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
    <div className="space-y-1">
      <div
        className={`
          group relative flex items-center rounded-xl
          bg-background/60 border
          transition-all duration-200
          focus-within:border-primary/70 focus-within:bg-background/80 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]
          ${error ? "border-destructive/70 shadow-[0_0_0_3px_hsl(var(--destructive)/0.10)]" : "border-border/70"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Left icon */}
        <Icon
          size={15}
          className="absolute left-3.5 text-muted-foreground/60 group-focus-within:text-primary/70 transition-colors duration-200"
        />

        <input
          {...register(name)}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full py-3 pl-10 bg-transparent text-sm text-foreground
            placeholder:text-muted-foreground/50 outline-none
            ${isPassword ? "pr-10" : "pr-4"}
            ${disabled ? "cursor-not-allowed" : ""}
          `}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={disabled}
            className="absolute right-3.5 text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive ml-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
          {error.message as string}
        </p>
      )}
    </div>
  );
}