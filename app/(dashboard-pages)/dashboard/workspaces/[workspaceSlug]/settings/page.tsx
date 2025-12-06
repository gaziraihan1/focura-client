// app/dashboard/[workspaceSlug]/settings/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Mail,
//   Shield,
  Crown,
  X,
  UserPlus,
} from "lucide-react";
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
import { useSession } from "next-auth/react";

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

export default function WorkspaceSettingsPage() {
  const params = useParams();
//   const router = useRouter();
  const { data: session } = useSession();
  const slug = params.workspaceSlug as string;

  const [activeTab, setActiveTab] = useState<"general" | "members" | "danger">("general");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hooks
  const { data: workspace } = useWorkspace(slug);
  const { data: members = [] } = useWorkspaceMembers(workspace?.id || "");
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();
  const leaveWorkspace = useLeaveWorkspace();

  const [formData, setFormData] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
    color: workspace?.color || PREDEFINED_COLORS[0],
    isPublic: workspace?.isPublic || false,
    allowInvites: workspace?.allowInvites || true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleUpdateRole = async (memberId: string, role: "ADMIN" | "MEMBER" | "GUEST") => {
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

  if (!workspace) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace preferences and team
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "general", label: "General", icon: Save },
          { id: "members", label: "Members", icon: Users },
          { id: "danger", label: "Danger Zone", icon: AlertCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-xl bg-card border border-border p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={!isAdmin}
                className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                  errors.name ? "border-red-500" : "border-border"
                } disabled:opacity-50`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                disabled={!isAdmin}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none resize-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Workspace Color
              </label>
              <div className="flex flex-wrap gap-3">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      isAdmin && setFormData((prev) => ({ ...prev, color }))
                    }
                    disabled={!isAdmin}
                    className={`w-10 h-10 rounded-lg transition-all disabled:opacity-50 ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-primary scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    isAdmin &&
                    setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
                  }
                  disabled={!isAdmin}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <div>
                  <p className="font-medium text-foreground">Public workspace</p>
                  <p className="text-sm text-muted-foreground">
                    Anyone with the link can view this workspace
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowInvites}
                  onChange={(e) =>
                    isAdmin &&
                    setFormData((prev) => ({
                      ...prev,
                      allowInvites: e.target.checked,
                    }))
                  }
                  disabled={!isAdmin}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <div>
                  <p className="font-medium text-foreground">Allow invitations</p>
                  <p className="text-sm text-muted-foreground">
                    Members can invite others to this workspace
                  </p>
                </div>
              </label>
            </div>

            {isAdmin && (
              <button
                onClick={handleSaveGeneral}
                disabled={updateWorkspace.isPending}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {updateWorkspace.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {isAdmin && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
              >
                <UserPlus size={18} />
                Invite Member
              </button>
            </div>
          )}

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users size={20} />
                Team Members ({members.length})
              </h3>
            </div>

            <div className="divide-y divide-border">
              {members.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {member.user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground flex items-center gap-2">
                        {member.user.name}
                        {member.role === "OWNER" && (
                          <Crown size={14} className="text-yellow-500" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {member.role !== "OWNER" && isAdmin ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.id, e.target.value as any)
                        }
                        className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:ring-2 ring-primary outline-none"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="GUEST">Guest</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                        {member.role}
                      </span>
                    )}

                    {member.role !== "OWNER" && isAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removeMember.isPending}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === "danger" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-1">
                  Danger Zone
                </h3>
                <p className="text-sm text-red-500/80">
                  These actions are irreversible. Please be careful.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {!isOwner && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                  <div>
                    <p className="font-medium text-foreground">Leave Workspace</p>
                    <p className="text-sm text-muted-foreground">
                      Remove yourself from this workspace
                    </p>
                  </div>
                  <button
                    onClick={handleLeave}
                    disabled={leaveWorkspace.isPending}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    Leave
                  </button>
                </div>
              )}

              {isOwner && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                  <div>
                    <p className="font-medium text-foreground">Delete Workspace</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this workspace and all its data
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-card rounded-xl border border-border w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Invite Team Member
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviteMember.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteMember.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Mail size={18} />
                  )}
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-card rounded-xl border border-border w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Delete Workspace?
              </h3>
            </div>

            <p className="text-muted-foreground mb-6">
              This will permanently delete <strong>{workspace?.name}</strong> and
              all its projects, tasks, and data. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteWorkspace.isPending}
                className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteWorkspace.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete Permanently
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}