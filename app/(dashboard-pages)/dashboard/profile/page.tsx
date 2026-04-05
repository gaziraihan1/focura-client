"use client";

import { ProfilePageHeader } from "@/components/Dashboard/Profile/ProfilePageHeader";
import { ProfileInformationCard } from "@/components/Dashboard/Profile/ProfileInformationCard";
import { ProfileSidebar } from "@/components/Dashboard/Profile/ProfileSidebar";
import { ProfileLoadingState } from "@/components/Dashboard/Profile/ProfileLoadingState";
import { useProfilePage } from "@/hooks/useProfilePage";

export default function ProfilePage() {
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
  console.log(profile)

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
        </div>

        <ProfileSidebar
          role={profile.role}
          createdAt={profile.createdAt}
          storage={storage}
          ownedWorkspaces={profile.ownedWorkspaces}
        />
      </div>
    </div>
  );
}