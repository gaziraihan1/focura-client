import { Loader2 } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ResetPasswordInput } from "./ResetPasswordInput";

interface ResetPasswordPageFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isSubmitting: boolean;
  success: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordPageForm({
  register,
  errors,
  isSubmitting,
  success,
  onSubmit,
}: ResetPasswordPageFormProps) {
  const isDisabled = isSubmitting || success;

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <ResetPasswordInput
        name="password"
        placeholder="New Password"
        register={register}
        errors={errors}
        disabled={isDisabled}
      />

      <ResetPasswordInput
        name="confirmPassword"
        placeholder="Confirm Password"
        register={register}
        errors={errors}
        disabled={isDisabled}
      />

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={18} />}
        Reset Password
      </button>
    </form>
  );
}