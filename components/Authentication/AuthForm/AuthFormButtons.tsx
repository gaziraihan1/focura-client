import { Loader2, Chrome } from "lucide-react";

interface AuthFormButtonsProps {
  mode: "login" | "register";
  isLoading: boolean;
  isSubmitting: boolean;
  isGoogleLoading: boolean;
  onGoogleClick: () => void;
}

export function AuthFormButtons({
  mode,
  isLoading,
  isSubmitting,
  isGoogleLoading,
  onGoogleClick,
}: AuthFormButtonsProps) {
  return (
    <>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={18} />}
        {mode === "login" ? "Login" : "Register"}
      </button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative bg-background/40 px-4">
          <span className="text-foreground/50 text-sm">or</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={onGoogleClick}
        className="w-full py-3 rounded-xl bg-background text-foreground border border-border hover:bg-primary/10 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Chrome size={18} />
        )}
        Continue with Google
      </button>
    </>
  );
}