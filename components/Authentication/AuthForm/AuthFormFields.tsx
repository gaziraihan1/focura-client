import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthFormInput } from "./AuthFormInput";

// Define the exact form data types
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

export function AuthFormFields({
  mode,
  register,
  errors,
  isLoading,
}: AuthFormFieldsProps) {
  return (
    <>
      {mode === "register" && (
        <AuthFormInput<RegisterFormData>
          name="name"
          placeholder="Full Name"
          icon={User}
          register={register as UseFormRegister<RegisterFormData>}
          errors={errors as FieldErrors<RegisterFormData>}
          disabled={isLoading}
        />
      )}

      <AuthFormInput<AuthFormData>
        name="email"
        type="email"
        placeholder="Email Address"
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
        <div className="text-right -mt-2">
          <Link
            href="/authentication/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}
    </>
  );
}