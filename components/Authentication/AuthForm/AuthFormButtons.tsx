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
    <div className="space-y-3 pt-2">
      {/* Primary CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          group relative w-full py-3 rounded-xl
          bg-primary text-primary-foreground text-sm font-semibold tracking-wide
          overflow-hidden transition-all duration-200
          hover:brightness-110 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          shadow-md shadow-primary/30
        "
      >
        {/* Shimmer sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/15 to-transparent" />
        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[11px] tracking-widest uppercase text-muted-foreground/60 font-medium">or</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onGoogleClick}
        className="
          group w-full py-3 rounded-xl
          bg-transparent text-foreground text-sm font-medium
          border border-border/70
          hover:border-primary/40 hover:bg-primary/5
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2.5
        "
      >
        {isGoogleLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Chrome size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-150" />
        )}
        Continue with Google
      </button>
    </div>
  );
}