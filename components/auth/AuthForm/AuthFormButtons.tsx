import { Loader2, Chrome } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="group relative w-full py-3 rounded-xl text-sm font-semibold tracking-wide overflow-hidden"
      >
        {/* Shimmer sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/15 to-transparent" />
        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[11px] tracking-widest uppercase text-muted-foreground/60 font-medium">or</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={onGoogleClick}
        className="group w-full py-3 rounded-xl text-sm font-medium"
      >
        {isGoogleLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Chrome size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-150" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}