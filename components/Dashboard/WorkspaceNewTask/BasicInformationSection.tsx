import { motion } from "framer-motion";
import { AlertCircle, FileText, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
}

interface BasicInformationSectionProps {
  title: string;
  description?: string ;
  projectId?: string | null;
  projects: Project[];
  projectsLoading: boolean;
  errors: Record<string, string>;
  workspaceSlug: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onProjectChange: (projectId: string) => void;
}

export function BasicInformationSection({
  title,
  description,
  projectId,
  projects,
  projectsLoading,
  errors,
  workspaceSlug,
  onTitleChange,
  onDescriptionChange,
  onProjectChange,
}: BasicInformationSectionProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Basic Information
        </h3>
      </div>

      {/* Task Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
            errors.title ? "border-red-500" : "border-border"
          }`}
          placeholder="Enter task title..."
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition"
          placeholder="Add a detailed description..."
        />
      </div>

      {/* Project Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <FileText size={16} className="inline mr-2" />
          Project <span className="text-red-500">*</span>
        </label>
        {projectsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={16} />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              No projects available. Create a project first.
            </p>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/workspaces/${workspaceSlug}/projects/new-project`
                )
              }
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <>
            <select
              value={projectId || ""}
              onChange={(e) => onProjectChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                errors.projectId ? "border-red-500" : "border-border"
              }`}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.projectId}
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}