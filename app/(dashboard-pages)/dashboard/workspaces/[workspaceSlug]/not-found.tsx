import Link from "next/link";

export default function WorkspaceNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-8 text-center">
        <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Workspace Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This workspace doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard/workspaces"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
          >
            View Workspaces
          </Link>
          <Link
            href="/dashboard/workspaces/new-workspace"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border hover:bg-accent transition font-medium"
          >
            Create Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
