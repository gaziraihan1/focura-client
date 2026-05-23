import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthFormInput } from "./AuthFormInput";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  name: string;
}

type AuthFormData = LoginFormData | RegisterFormData;

interface AuthFormFieldsProps {
  mode: "login" | "register";
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors<AuthFormData>;
  isLoading: boolean;
}

export function AuthFormFields({ mode, register, errors, isLoading }: AuthFormFieldsProps) {
  return (
    <div className="space-y-3">
      {mode === "register" && (
        <AuthFormInput<RegisterFormData>
          name="name"
          placeholder="Full name"
          icon={User}
          register={register as UseFormRegister<RegisterFormData>}
          errors={errors as FieldErrors<RegisterFormData>}
          disabled={isLoading}
        />
      )}

      <AuthFormInput<AuthFormData>
        name="email"
        type="email"
        placeholder="Email address"
        icon={Mail}
        register={register}
        errors={errors}
        disabled={isLoading}
      />

      <AuthFormInput<AuthFormData>
        name="password"
        type="password"
        placeholder="Password"
        icon={Lock}
        register={register}
        errors={errors}
        disabled={isLoading}
      />

      {mode === "login" && (
        <div className="flex justify-end">
          <Link
            href="/authentication/forgot-password"
            className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}
    </div>
  );
}