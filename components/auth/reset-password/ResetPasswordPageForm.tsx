import { Loader2 } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { ResetPasswordInput } from "./ResetPasswordInput";

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

interface ResetPasswordPageFormProps {
  register: UseFormRegister<ResetPasswordForm>;
  errors: FieldErrors<ResetPasswordForm>;
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

      <Button
        type="submit"
        variant="primary"
        disabled={isDisabled}
        className="w-full py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={18} />}
        Reset Password
      </Button>
    </form>
  );
}