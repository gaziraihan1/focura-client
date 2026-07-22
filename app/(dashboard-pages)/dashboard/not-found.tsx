import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-8 text-center">
        <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
