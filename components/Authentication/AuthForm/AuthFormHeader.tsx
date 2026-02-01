interface AuthFormHeaderProps {
  mode: "login" | "register";
}

export function AuthFormHeader({ mode }: AuthFormHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground text-center">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </h1>
      <p className="text-foreground/60 text-center mt-2">
        {mode === "login" ? "Login to continue" : "Join Focura for free"}
      </p>
    </>
  );
}