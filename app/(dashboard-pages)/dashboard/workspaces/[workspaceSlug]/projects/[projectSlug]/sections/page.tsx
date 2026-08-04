"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Columns } from "lucide-react";
import SectionList from "@/components/Dashboard/ProjectDetails/SectionList";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

export default function ProjectSectionsPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params?.projectSlug as string;
  const workspaceSlug = params?.workspaceSlug as string;
  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;
  const { data: project } = useProjectDetailsBySlug(projectSlug);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Columns size={16} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Sections</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Organize your project into logical sections with colors and descriptions.
        </p>
        {project?.id && <SectionList projectId={project.id} tasksBaseHref={base} />}
        {!project?.id && (
          <p className="text-sm text-muted-foreground italic py-4">Loading project...</p>
        )}
      </div>

      <div className="text-center py-4">
        <button
          onClick={() => router.push(base)}
          className="text-xs text-primary font-semibold hover:underline"
        >
          Go to project overview
        </button>
      </div>
    </div>
  );
}
