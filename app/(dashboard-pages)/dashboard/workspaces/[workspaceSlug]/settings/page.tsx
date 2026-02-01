"use client";

import { useParams } from "next/navigation";
import { MembersSettingsTab } from "@/components/Dashboard/Workspaces/WorkspaceSettings/MembersSettingsTab";
import { DangerZoneTab } from "@/components/Dashboard/Workspaces/WorkspaceSettings/DangerZoneTab";
import { DeleteWorkspaceModal } from "@/components/Dashboard/Workspaces/WorkspaceSettings/DeleteWorkspaceModal";
import { useWorkspaceSettings } from "@/hooks/useWorkspaceSettings";
import { WorkspaceSettingsHeader } from "@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsHeader";
import { WorkspaceSettingsTabs } from "@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspacesSettingsTabs";
import { GeneralSettingsTab } from "@/components/Dashboard/Workspaces/WorkspaceSettings/GeneralSettingsTab";
import { WorkspaceInviteMemberModal } from "@/components/Dashboard/Workspaces/WorkspaceSettings/WorkspaceInviteMemberModal";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const slug = params.workspaceSlug as string;

  const {
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
    isOwner,
    isAdmin,
    updateFormField,
    handleSaveGeneral,
    handleInvite,
    handleRemoveMember,
    handleUpdateRole,
    handleDelete,
    handleLeave,
    mutations,
  } = useWorkspaceSettings({ slug });

  if (!workspace) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WorkspaceSettingsHeader />

      <WorkspaceSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "general" && (
        <GeneralSettingsTab
          formData={formData}
          errors={errors}
          isAdmin={isAdmin}
          isUpdating={mutations.updateWorkspace.isPending}
          onUpdateField={updateFormField}
          onSave={handleSaveGeneral}
        />
      )}

      {activeTab === "members" && (
        <MembersSettingsTab
          members={members}
          isAdmin={isAdmin}
          isRemovingMember={mutations.removeMember.isPending}
          onInviteClick={() => setShowInviteModal(true)}
          onRemoveMember={handleRemoveMember}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {activeTab === "danger" && (
        <DangerZoneTab
          isOwner={isOwner}
          isLeavingWorkspace={mutations.leaveWorkspace.isPending}
          onLeaveWorkspace={handleLeave}
          onDeleteWorkspace={() => setShowDeleteModal(true)}
        />
      )}

      <WorkspaceInviteMemberModal
        isOpen={showInviteModal}
        email={inviteEmail}
        role={inviteRole}
        isInviting={mutations.inviteMember.isPending}
        onEmailChange={setInviteEmail}
        onRoleChange={setInviteRole}
        onInvite={handleInvite}
        onClose={() => setShowInviteModal(false)}
      />

      <DeleteWorkspaceModal
        isOpen={showDeleteModal}
        workspaceName={workspace.name}
        isDeleting={mutations.deleteWorkspace.isPending}
        onDelete={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}