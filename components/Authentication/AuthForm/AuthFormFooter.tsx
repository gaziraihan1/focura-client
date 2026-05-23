import Link from "next/link";

interface AuthFormFooterProps {
  mode: "login" | "register";
}

export function AuthFormFooter({ mode }: AuthFormFooterProps) {
  return (
    <p className="text-center text-xs text-muted-foreground mt-7">
      {mode === "login" ? "No account yet?" : "Already have an account?"}
      {" "}
      <Link
        href={
          mode === "login"
            ? "/authentication/registration"
            : "/authentication/login"
        }
        className="text-primary font-semibold hover:underline underline-offset-2 transition-colors duration-150"
      >
        {mode === "login" ? "Create one" : "Sign in"}
      </Link>
    </p>
  );
}