"use client";

import { ProfilePageHeader } from "@/components/dashboard/profile/ProfilePageHeader";
import { ProfileInformationCard } from "@/components/dashboard/profile/ProfileInformationCard";
import { ProfileSidebar } from "@/components/dashboard/profile/ProfileSidebar";
import { ProfileLoadingState } from "@/components/dashboard/profile/ProfileLoadingState";
import { ProfileSecurityCard } from "@/components/dashboard/profile/ProfileSecurityCard";
import { DataExportCard } from "@/components/settings/DataExportCard";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
import { useProfilePage } from "@/hooks/useProfilePage";
import { useSecuritySettings } from "@/hooks/useSecurity";

export function ProfilePageContent() {
  const {
    profile,
    storage,
    isEditing,
    loading,
    saving,
    uploading,
    formData,
    setIsEditing,
    handleImageUpload,
    handleSave,
    handleCancel,
    handleFormChange,
  } = useProfilePage();
  const { data: securitySettings } = useSecuritySettings();

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProfilePageHeader
        isEditing={isEditing}
        isSaving={saving}
        onEdit={() => setIsEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileInformationCard
            isEditing={isEditing}
            isUploading={uploading}
            formData={formData}
            email={profile.email}
            onFormChange={handleFormChange}
            onImageUpload={handleImageUpload}
          />

          <ProfileSecurityCard />
        </div>

        <ProfileSidebar
          role={profile.role}
          createdAt={profile.createdAt}
          storage={storage}
          ownedWorkspaces={profile.ownedWorkspaces}
          lastPasswordChange={securitySettings?.lastPasswordChange ?? null}
        />
      </div>

      <DataExportCard />
      <DeleteAccountCard />
    </div>
  );
}
