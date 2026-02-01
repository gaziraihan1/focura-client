import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  useWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useWorkspaceMembers,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
  useLeaveWorkspace,
} from "@/hooks/useWorkspace";

const PREDEFINED_COLORS = [
  "#667eea",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
type TabType = "general" | "members" | "danger";

interface WorkspaceForm {
  name: string;
  description: string;
  color: string;
  isPublic: boolean;
  allowInvites: boolean;
}

interface UseWorkspaceSettingsProps {
  slug: string;
}

export function useWorkspaceSettings({ slug }: UseWorkspaceSettingsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("MEMBER");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: workspace } = useWorkspace(slug);
  const { data: members = [] } = useWorkspaceMembers(workspace?.id || "");
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();
  const leaveWorkspace = useLeaveWorkspace();

  const initialFormData = useMemo<WorkspaceForm>(() => {
    if (workspace) {
      return {
        name: workspace.name || "",
        description: workspace.description || "",
        color: workspace.color || PREDEFINED_COLORS[0],
        isPublic: workspace.isPublic || false,
        allowInvites: workspace.allowInvites || true,
      };
    }
    return {
      name: "",
      description: "",
      color: PREDEFINED_COLORS[0],
      isPublic: false,
      allowInvites: true,
    };
  }, [workspace]);

  const [formData, setFormData] = useState<WorkspaceForm>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [lastWorkspaceId, setLastWorkspaceId] = useState<string | null>(null);
  if (workspace?.id && workspace.id !== lastWorkspaceId) {
    setLastWorkspaceId(workspace.id);
    setFormData(initialFormData);
  }

  const currentMember = members.find((m) => m.user.id === session?.user?.id);
  const isOwner = currentMember?.role === "OWNER";
  const isAdmin = currentMember?.role === "ADMIN" || isOwner;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveGeneral = async () => {
    if (!validateForm() || !workspace) return;

    try {
      await updateWorkspace.mutateAsync({
        id: workspace.id,
        data: formData,
      });
    } catch (error) {
      console.error("Update workspace error:", error);
    }
  };

  const handleInvite = async () => {
    if (!workspace || !inviteEmail) return;

    try {
      await inviteMember.mutateAsync({
        workspaceId: workspace.id,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (error) {
      console.error("Invite error:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspace || !confirm("Remove this member?")) return;

    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.id,
        memberId,
      });
    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  const handleUpdateRole = async (memberId: string, role: WorkspaceRole) => {
    if (!workspace) return;

    try {
      await updateMemberRole.mutateAsync({
        workspaceId: workspace.id,
        memberId,
        role,
      });
    } catch (error) {
      console.error("Update role error:", error);
    }
  };

  const handleDelete = async () => {
    if (!workspace) return;

    try {
      await deleteWorkspace.mutateAsync(workspace.id);
    } catch (error) {
      console.error("Delete workspace error:", error);
    }
  };

  const handleLeave = async () => {
    if (!workspace || !confirm("Leave this workspace?")) return;

    try {
      await leaveWorkspace.mutateAsync(workspace.id);
    } catch (error) {
      console.error("Leave workspace error:", error);
    }
  };

  const updateFormField = <K extends keyof WorkspaceForm>(
    field: K,
    value: WorkspaceForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return {
    workspace,
    members,
    formData,
    errors,
    activeTab,
    setActiveTab,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    showInviteModal,
    setShowInviteModal,
    showDeleteModal,
    setShowDeleteModal,
    currentMember,
    isOwner,
    isAdmin,
    updateFormField,
    handleSaveGeneral,
    handleInvite,
    handleRemoveMember,
    handleUpdateRole,
    handleDelete,
    handleLeave,
    mutations: {
      updateWorkspace,
      deleteWorkspace,
      inviteMember,
      removeMember,
      leaveWorkspace,
    },
  };
}

export { PREDEFINED_COLORS };
export type { WorkspaceForm, WorkspaceRole, TabType };