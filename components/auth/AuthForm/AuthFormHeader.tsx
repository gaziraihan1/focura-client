interface AuthFormHeaderProps {
  mode: "login" | "register";
}

export function AuthFormHeader({ mode }: AuthFormHeaderProps) {
  return (
    <div className="space-y-1">
      {/* Eyebrow label */}
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80">
        {mode === "login" ? "Welcome back" : "Get started"}
      </p>

      {/* Large display heading */}
      <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
        {mode === "login" ? (
          <>
            Sign in to
            <span className="text-primary"> Focura</span>
          </>
        ) : (
          <>
            Create your 
            <span className="text-primary"> account</span>
          </>
        )}
      </h1>

      <p className="text-sm text-muted-foreground pt-1">
        {mode === "login"
          ? "Enter your credentials to continue."
          : "Join Focura for free — no credit card required."}
      </p>
    </div>
  );
}