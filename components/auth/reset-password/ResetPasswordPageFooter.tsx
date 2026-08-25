import Link from "next/link";

export function ResetPasswordPageFooter() {
  return (
    <p className="text-center text-foreground/60 mt-6 text-sm">
      Remember your password?
      <Link
        href="/authentication/login"
        className="text-primary ml-1 font-medium hover:underline"
      >
        Login
      </Link>
    </p>
  );
}