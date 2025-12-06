"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Camera,
  Loader2,
  Save,
  X,
  HardDrive,
  Crown,
  Check,
} from "lucide-react";
import Image from "next/image";
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

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    timezone: "",
    image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);


  console.log(session)
const fetchProfile = async () => {
  try {
    const response = await api.get<{
      user: UserProfile;
      storage: StorageData;
    }>('/api/user/profile');
    
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
  } finally {
    setLoading(false);
  }
};

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "profile");

    const response = await api.upload<{ url: string }>('/api/upload', formData);

    if (response.data?.url) {
      const saveResponse = await api.put('/api/user/profile', { image: response.data.url });
      if (saveResponse.success) {
        setFormData((prev) => ({ ...prev, image: response.data!.url }));
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
    const response = await api.put<{ user: UserProfile }>('/api/user/profile', formData);

    if (response.data?.user) {
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successul")
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

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "FREE":
        return "bg-gray-500/10 text-gray-500";
      case "PRO":
        return "bg-blue-500/10 text-blue-500";
      case "BUSINESS":
        return "bg-purple-500/10 text-purple-500";
      case "ENTERPRISE":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const storagePercentage = storage
    ? (storage.used / storage.total) * 100
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-6">
              Profile Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt={formData.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-muted-foreground" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                      >
                        {uploading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Camera size={16} />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-foreground">{profile.name}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border">
                  <Mail size={18} className="text-muted-foreground" />
                  <p className="text-foreground">{profile.email}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-foreground">
                    {profile.bio || "No bio added yet"}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Timezone
                </label>
                {isEditing ? (
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">
                      Eastern Time (ET)
                    </option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Dhaka">Dhaka (BST)</option>
                  </select>
                ) : (
                  <p className="text-foreground">{profile.timezone}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Stats & Info */}
        <div className="space-y-6">
          {/* Role Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-semibold text-foreground capitalize">
                  {profile.role.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Storage</h3>
              <HardDrive size={20} className="text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium text-foreground">
                  {storage ? (storage.used / 1024).toFixed(2) : 0} GB
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-foreground">
                  {storage ? (storage.total / 1024).toFixed(2) : 0} GB
                </span>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {storage
                    ? `${((storage.remaining / storage.total) * 100).toFixed(
                        1
                      )}% remaining`
                    : "0% remaining"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Current Plan</h3>
              <Crown size={20} className="text-primary" />
            </div>

            {profile?.ownedWorkspaces?.length > 0 ? (
              <div className="space-y-3">
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getPlanBadgeColor(
                    profile.ownedWorkspaces[0].plan
                  )}`}
                >
                  {profile.ownedWorkspaces[0].plan}
                </span>

                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500" />
                    <span className="text-muted-foreground">
                      Up to 5 team members
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500" />
                    <span className="text-muted-foreground">
                      {(profile.ownedWorkspaces[0].maxStorage / 1024).toFixed(
                        0
                      )}{" "}
                      GB storage
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-500" />
                    <span className="text-muted-foreground">
                      Unlimited projects
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition text-sm font-medium">
                  Upgrade Plan
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No workspace plan active
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}