import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  timezone?: string;
  role: string;
  createdAt: string;
  ownedWorkspaces: Array<{
    id: string;
    plan: string;
    maxStorage: number;
  }>;
}

interface StorageData {
  total: number;
  used: number;
  remaining: number;
}

interface FormData {
  name: string;
  bio: string;
  timezone: string;
  image: string;
}

export function useProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    timezone: "",
    image: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get<{
        user: UserProfile;
        storage: StorageData;
      }>("/api/user/profile");

      if (response.data) {
        setProfile(response.data.user);
        setStorage(response.data.storage);
        setFormData({
          name: response.data.user.name || "",
          bio: response.data.user.bio || "",
          timezone: response.data.user.timezone || "UTC",
          image: response.data.user.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("uploadType", "profile");

      const uploadResponse = await api.upload<{ url: string }>(
        "/api/upload",
        uploadFormData
      );

      if (uploadResponse.data?.url) {
        const saveResponse = await api.put<{ user: UserProfile }>(
          "/api/user/profile",
          {
            image: uploadResponse.data.url,
          }
        );

        if (saveResponse.data?.user) {
          setFormData((prev) => ({ ...prev, image: uploadResponse.data!.url }));
          setProfile(saveResponse.data.user);
          toast.success("Profile picture updated successfully");
        }
      }
    } catch (error) {
      console.error("Upload + save error:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await api.put<{ user: UserProfile }>(
        "/api/user/profile",
        formData
      );

      if (response.data?.user) {
        setProfile(response.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        timezone: profile.timezone || "UTC",
        image: profile.image || "",
      });
    }
    setIsEditing(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
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
  };
}