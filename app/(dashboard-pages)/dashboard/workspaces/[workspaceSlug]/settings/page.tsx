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

function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-3 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 rounded bg-muted" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="rounded-xl bg-card border border-border p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>
        ))}
        <div className="h-10 w-32 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const slug = params.workspaceSlug as string;

  const {
    workspace,
    members,
    formData,
    initialFormData,
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

  if (!workspace) return <SettingsSkeleton />;

  return (
    <div className="max-w-4xl mx-auto p-3 space-y-6">
      <WorkspaceSettingsHeader />

      <WorkspaceSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "general" && (
        <div
          role="tabpanel"
          id="tabpanel-general"
          aria-labelledby="tab-general"
        >
          <GeneralSettingsTab
            formData={formData}
            initialData={initialFormData}
            errors={errors}
            isAdmin={isAdmin}
            isUpdating={mutations.updateWorkspace.isPending}
            onUpdateField={updateFormField}
            onSave={handleSaveGeneral}
          />
        </div>
      )}

      {activeTab === "members" && (
        <div
          role="tabpanel"
          id="tabpanel-members"
          aria-labelledby="tab-members"
        >
          <MembersSettingsTab
            members={members}
            isAdmin={isAdmin}
            isRemovingMember={mutations.removeMember.isPending}
            onInviteClick={() => setShowInviteModal(true)}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateRole}
          />
        </div>
      )}

      {activeTab === "danger" && (
        <div
          role="tabpanel"
          id="tabpanel-danger"
          aria-labelledby="tab-danger"
        >
          <DangerZoneTab
            isOwner={isOwner}
            isLeavingWorkspace={mutations.leaveWorkspace.isPending}
            onLeaveWorkspace={handleLeave}
            onDeleteWorkspace={() => setShowDeleteModal(true)}
          />
        </div>
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
        key={showDeleteModal ? "open" : "closed"}
        isOpen={showDeleteModal}
        workspaceName={workspace.name}
        isDeleting={mutations.deleteWorkspace.isPending}
        onDelete={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
