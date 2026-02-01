import Link from "next/link";

interface AuthFormFooterProps {
  mode: "login" | "register";
}

export function AuthFormFooter({ mode }: AuthFormFooterProps) {
  return (
    <p className="text-center text-foreground/60 mt-6 text-sm">
      {mode === "login"
        ? "Don't have an account?"
        : "Already have an account?"}
      <Link
        href={
          mode === "login"
            ? "/authentication/registration"
            : "/authentication/login"
        }
        className="text-primary ml-1 font-medium hover:underline"
      >
        {mode === "login" ? "Register" : "Login"}
      </Link>
    </p>
  );
}