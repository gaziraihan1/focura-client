import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceDetailErrorState() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4">
      <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        Workspace not found
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-6">
        This workspace doesn&apos;t exist or you don&apos;t have access to it
      </p>
      <button
        onClick={() => router.push("/dashboard/workspaces")}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm sm:text-base"
      >
        Back to Workspaces
      </button>
    </div>
  );
}