import { Lock } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ResetPasswordInputProps {
  name: "password" | "confirmPassword";
  placeholder: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled: boolean;
}

export function ResetPasswordInput({
  name,
  placeholder,
  register,
  errors,
  disabled,
}: ResetPasswordInputProps) {
  const error = errors[name];

  return (
    <div className="relative">
      <Lock
        className="absolute left-3 top-3.5 text-foreground/50"
        size={18}
      />
      <input
        {...register(name)}
        type="password"
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
          error ? "border-red-500" : "border-border"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
}