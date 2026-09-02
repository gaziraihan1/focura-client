import Link from "next/link";

interface AuthFormFooterProps {
  mode: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export function AuthFormFooter({ mode, onModeChange }: AuthFormFooterProps) {
  const targetMode = mode === "login" ? "register" : "login";
  const href = mode === "login"
    ? "/authentication/registration"
    : "/authentication/login";

  return (
    <p className="text-center text-xs text-muted-foreground mt-7">
      {mode === "login" ? "No account yet?" : "Already have an account?"}
      {" "}
      {onModeChange ? (
        <button
          type="button"
          onClick={() => onModeChange(targetMode)}
          className="text-primary font-semibold hover:underline underline-offset-2 transition-colors duration-150"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </button>
      ) : (
        <Link
          href={href}
          className="text-primary font-semibold hover:underline underline-offset-2 transition-colors duration-150"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      )}
    </p>
  );
}