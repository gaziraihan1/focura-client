import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceProjectsErrorState() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Unable to load workspace projects
      </h2>
      <p className="text-muted-foreground mb-6">
        This workspace doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <button
        onClick={() => router.push("/dashboard/workspaces")}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Back to Workspaces
      </button>
    </div>
  );
}