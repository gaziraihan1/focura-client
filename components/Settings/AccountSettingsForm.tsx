'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, Camera, ExternalLink } from 'lucide-react';
import { useUserProfile, useInvalidateProfile } from '@/hooks/useUserProfile';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export function AccountSettingsForm() {
  const { data: profile, isLoading } = useUserProfile();
  const invalidateProfile = useInvalidateProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setTimezone(profile.timezone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/v1/user/profile', { name, bio, timezone });
      invalidateProfile();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Picture */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Profile Picture</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your avatar across Focura
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-semibold text-foreground">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Basic Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your personal details and display name
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                disabled
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm opacity-60"
              />
              <span className="text-xs text-muted-foreground">Cannot be changed</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Select timezone</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Shanghai">China (CST)</option>
              <option value="Asia/Tokyo">Japan (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Connected Accounts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage linked accounts and OAuth providers
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#4285F4]">G</span>
              </div>
              <div>
                <p className="text-sm font-medium">Google</p>
                <p className="text-xs text-muted-foreground">OAuth provider</p>
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Connected</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
