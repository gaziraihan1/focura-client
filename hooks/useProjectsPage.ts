import toast from "react-hot-toast";
import { useWorkspace, useWorkspaceRole } from "@/hooks/useWorkspace";
import { CreateProjectDto, ProjectDetails, useCreateProject } from "@/hooks/useProjects";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useProjects } from "@/hooks/useProjects";
import { useAllUserProjects } from "@/hooks/useProjects";
import {
  ViewMode,
  ProjectFilters,
  ProjectData,
  WorkspaceData,
} from "@/types/project.types";

// In useProjectsPage hook
export function useProjectsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({
    status: "all",
    priority: "all",
    workspace: "all",
  });

  const { data: projects = [], isLoading, isError } = useAllUserProjects();

  // Extract unique workspaces from projects - Use workspace.slug directly
  const workspaces = useMemo<WorkspaceData[]>(() => {
    const uniqueWorkspaces = new Map<string, WorkspaceData>();
    projects.forEach((project: ProjectData) => {
      if (project.workspace) {
        uniqueWorkspaces.set(project.workspace.id, {
          id: project.workspace.id,
          name: project.workspace.name,
          slug: project.workspace.slug,
        });
      }
    });
    return Array.from(uniqueWorkspaces.values());
  }, [projects]);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project: ProjectData) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.workspace?.name.toLowerCase().includes(query)
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (project: ProjectData) => project.status === filters.status
      );
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter(
        (project: ProjectData) => project.priority === filters.priority
      );
    }

    if (filters.workspace !== "all") {
      filtered = filtered.filter(
        (project: ProjectData) => project.workspace?.id === filters.workspace
      );
    }

    return filtered;
  }, [projects, searchQuery, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p: ProjectData) => p.status === "ACTIVE")
      .length;
    const completed = projects.filter(
      (p: ProjectData) => p.status === "COMPLETED"
    ).length;
    const totalTasks = projects.reduce(
      (sum: number, p: ProjectData) =>
        sum + (p._count?.tasks || p.stats?.totalTasks || 0),
      0
    );

    return { total, active, completed, totalTasks };
  }, [projects]);

  // Calculate active filters count
  const activeFiltersCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.workspace !== "all",
  ].filter(Boolean).length;

  const hasSearchOrFilters =
    searchQuery.trim() !== "" || activeFiltersCount > 0;

  // Check if user is a member of the project
  const checkProjectAccess = (project: ProjectData): boolean => {
    const currentUserId = session?.user?.id;
    
    if (!currentUserId) return false;
    
    // Check if user is workspace owner (they have access to all projects)
    if (project.workspace?.ownerId === currentUserId) {
      return true;
    }
    
    // Check if user is a member of the project
    const isProjectMember = project.members?.some(
      (member) => member.userId === currentUserId
    );
    
    // Check if user is admin of the project (from isAdmin flag)
    const isProjectAdmin = project.isAdmin;
    
    return isProjectMember || isProjectAdmin || false;
  };

  const handleProjectClick = (project: ProjectData) => {
  // Check if user has access to the project
  const hasAccess = checkProjectAccess(project);
  
  if (!hasAccess) {
    setShowAccessDeniedModal(true);
    return;
  }

  if (project.workspace?.slug) {
    router.push(
      `/dashboard/workspaces/${project.workspace.slug}/projects/${project.id}`
    );
  } else {
    // Fallback to projects without workspace
    router.push(`/dashboard/projects/${project.id}`);
  }
};

  const handleNewProject = () => {
    router.push("/dashboard/workspaces");
  };

  const handleBrowseWorkspaces = () => {
    router.push("/dashboard/workspaces");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCloseAccessDeniedModal = () => {
    setShowAccessDeniedModal(false);
  };

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    projects,
    isLoading,
    isError,
    workspaces,
    filteredProjects,
    stats,
    activeFiltersCount,
    hasSearchOrFilters,
    showAccessDeniedModal,
    handleProjectClick,
    handleNewProject,
    handleBrowseWorkspaces,
    handleRetry,
    handleCloseAccessDeniedModal,
    checkProjectAccess,
  };
}

type ProjectForm = Omit<CreateProjectDto, "workspaceId">;

const validateHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

interface UseWorkspaceNewProjectPageProps {
  workspaceSlug: string;
}

export function useWorkspaceNewProjectPage({
  workspaceSlug,
}: UseWorkspaceNewProjectPageProps) {
  const router = useRouter();

  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceSlug);
  const createProject = useCreateProject();

  const {
    canCreateProjects,
    isLoading: roleLoading,
    hasAccess,
    canManageWorkspace
  } = useWorkspaceRole(workspace?.id);

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    color: "#667eea",
    icon: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSubmitting = createProject.isPending;
  const isLoading = workspaceLoading || roleLoading;

  // Handle access control redirects
  useEffect(() => {
    if (!isLoading && workspace) {
      if (!hasAccess) {
        toast.error("You don't have access to this workspace");
        router.push("/dashboard/workspaces");
        return;
      }

      if (!canCreateProjects) {
        toast.error("You don't have permission to create projects");
        router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
        return;
      }
    }
  }, [
    isLoading,
    workspace,
    hasAccess,
    canCreateProjects,
    canManageWorkspace,
    router,
    workspaceSlug,
  ]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) {
      next.name = "Name is required";
    }
    if (form.name.length > 100) {
      next.name = "Name must be <= 100 characters";
    }
    if (form.color && !validateHex(form.color)) {
      next.color = "Use hex color like #667eea";
    }
    if (form.startDate && form.dueDate) {
      if (new Date(form.startDate) > new Date(form.dueDate)) {
        next.dueDate = "Due date must be after start date";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspace) {
      toast.error("Workspace not found");
      return;
    }

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      await createProject.mutateAsync({
        ...form,
        workspaceId: workspace.id,
      });
      router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
    } catch (error) {
      console.error("Create project error", error);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
  };

  const updateField = <K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return {
    workspace,
    hasAccess,
    canCreateProjects,
    form,
    errors,
    isLoading,
    isSubmitting,
    workspaceSlug,
    handleSubmit,
    handleCancel,
    updateField,
    canManageWorkspace
  };
}


interface UseWorkspaceProjectsPageProps {
  workspaceSlug: string;
}

export function useWorkspaceProjectsPage({
  workspaceSlug,
}: UseWorkspaceProjectsPageProps) {
  const { data: session } = useSession();

  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError: workspaceError,
  } = useWorkspace(workspaceSlug);

  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects(workspace?.id);

  const { canCreateProjects, canManageWorkspace } = useWorkspaceRole(workspace?.id);

  const [searchQuery, setSearchQuery] = useState("");

  const projects = useMemo(() => {
    if (!projectsData) return [];
    if (Array.isArray(projectsData)) return projectsData;
    return (projectsData as { data?: ProjectDetails[] }).data || [];
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project: { name: string; description?: string | null }) =>
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const isLoading = workspaceLoading || projectsLoading;
  const hasError = workspaceError || projectsError || !workspace;

  return {
    workspace,
    projects: filteredProjects,
    searchQuery,
    setSearchQuery,
    canCreateProjects,
    isLoading,
    hasError,
    workspaceSlug,
    currentUserId: session?.user?.id,
    projectsData,
    canManageWorkspace
  };
}