"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  Search,
  Calendar,
  Flag,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Plus,
  Crown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useProjects, Project } from "@/hooks/useProjects";

const statusColors: Record<string, string> = {
  PLANNING: "bg-purple-500/10 text-purple-500",
  ACTIVE: "bg-green-500/10 text-green-500",
  ON_HOLD: "bg-orange-500/10 text-orange-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
  ARCHIVED: "bg-gray-500/10 text-gray-500",
};

const priorityColors: Record<string, string> = {
  URGENT: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-blue-500",
  LOW: "text-green-500",
};

const formatDate = (date?: string | null) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString();
};

export default function WorkspaceProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const workspaceSlug = params.workspaceSlug as string;

  const { data: workspace, isLoading: workspaceLoading, isError: workspaceError } = useWorkspace(workspaceSlug);
  const { data: projects = [], isLoading: projectsLoading, isError: projectsError } = useProjects(workspace?.id);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  if (workspaceLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (workspaceError || projectsError || !workspace) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Unable to load workspace projects</h2>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Browse projects in {workspace.name}
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}/projects/new-project`)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-card border border-border p-4">
        <div className="flex items-center gap-3">
          <Search className="text-muted-foreground" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or description..."
            className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none"
          />
        </div>
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? "No projects match your search" : "No projects yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try a different search" : "Create your first project to get started"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}/projects/new-project`)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project: Project) => {
            const joined =
              project.isMember ||
              project.members?.some((m) => m.user?.id === session?.user?.id);

            return (
              <Link key={project.id} href={`/dashboard/workspaces/${workspaceSlug}/projects/${project.id}`}>
                <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition cursor-pointer h-full flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-foreground"
                        style={{ backgroundColor: `${project.color || "#667eea"}20` }}
                      >
                        <FolderKanban
                          size={20}
                          style={{ color: project.color || "#667eea" }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {project.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[project.status] || "bg-muted text-foreground"
                          }`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      )}
                      {joined && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          Joined
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {project.priority && (
                      <span className="flex items-center gap-1">
                        <Flag size={14} className={priorityColors[project.priority] || ""} />
                        {project.priority}
                      </span>
                    )}
                    {project.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Due {formatDate(project.dueDate)}
                      </span>
                    )}
                    {project.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Starts {formatDate(project.startDate)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <FolderKanban size={16} className="text-muted-foreground" />
                      {(project._count?.tasks ?? 0)} tasks
                    </span>
                    <span className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      {(project._count?.members ?? project.members?.length ?? 0)} members
                    </span>
                  </div>

                  {project.members && project.members.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {project.members.slice(0, 3).map((member) => (
                        <span
                          key={member.user.id}
                          className="px-2 py-1 rounded-full bg-muted text-foreground flex items-center gap-1"
                        >
                          {member.role === "MANAGER" && <Crown size={12} className="text-yellow-500" />}
                          {member.user.name}
                        </span>
                      ))}
                      {project.members.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-muted text-foreground">
                          +{project.members.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
