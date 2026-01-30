import { ArrowLeft, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorkspaceHeaderProps {
  workspaceName: string;
  workspaceSlug: string | undefined;
  workspaceLogo?: string;
  workspaceColor?: string;
  workspacePlan: string;
  workspaceDescription?: string;
  canCreateProjects: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

const getPlanBadge = (plan: string) => {
  const badges: Record<string, { color: string; label: string }> = {
    FREE: { color: "bg-gray-500/10 text-gray-500", label: "Free" },
    PRO: { color: "bg-blue-500/10 text-blue-500", label: "Pro" },
    BUSINESS: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
    ENTERPRISE: { color: "bg-orange-500/10 text-orange-500", label: "Enterprise" },
  };
  return badges[plan] || badges.FREE;
};

export function WorkspaceHeader({
  workspaceName,
  workspaceSlug,
  workspaceLogo,
  workspaceColor,
  workspacePlan,
  workspaceDescription,
  canCreateProjects,
  isAdmin,
  isOwner,
}: WorkspaceHeaderProps) {
  const router = useRouter();
  const planBadge = getPlanBadge(workspacePlan);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => router.push("/dashboard/workspaces")}
          className="p-2 rounded-lg hover:bg-accent transition shrink-0"
          aria-label="Back to workspaces"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-white shadow-lg shrink-0"
            style={{ backgroundColor: workspaceColor || "#667eea" }}
          >
            {workspaceLogo || workspaceName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                {workspaceName}
              </h1>
              <span
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium shrink-0 ${planBadge.color}`}
              >
                {planBadge.label}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              /{workspaceSlug}
            </p>
          </div>
        </div>
      </div>

      {workspaceDescription && (
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none pl-11 sm:pl-0 sm:ml-0">
          {workspaceDescription}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {canCreateProjects && (
          <button
            onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}/projects/new-project`)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">New Project</span>
            <span className="xs:hidden">New Project</span>
          </button>
        )}

        {(isAdmin || isOwner) && (
          <Link href={`/dashboard/workspaces/${workspaceSlug}/settings`} className="shrink-0">
            <button 
              className="p-2 rounded-lg hover:bg-accent transition"
              aria-label="Settings"
            >
              <Settings size={20} className="text-muted-foreground" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}