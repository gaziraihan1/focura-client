'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Loader2, FolderKanban } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

interface NotificationPreferences {
  emailNotifications: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  taskComments: boolean;
  taskDueSoon: boolean;
  taskOverdue: boolean;
  mentions: boolean;
  workspaceInvites: boolean;
  projectUpdates: boolean;
  weeklyDigest: boolean;
  projectDueSoon: boolean;
  projectOverdue: boolean;
  projectAutoArchived: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  emailNotifications: true,
  taskAssigned: true,
  taskCompleted: true,
  taskComments: true,
  taskDueSoon: true,
  taskOverdue: true,
  mentions: true,
  workspaceInvites: true,
  projectUpdates: true,
  weeklyDigest: false,
  projectDueSoon: true,
  projectOverdue: true,
  projectAutoArchived: true,
};

export function NotificationsSettingsForm() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const result = await api.get<NotificationPreferences>('/api/v1/user/notifications', { showErrorToast: false });
        if (result?.success && result.data) {
          setPrefs(result.data);
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const togglePref = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/v1/user/notifications', prefs);
      toast.success('Notification preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Email Notifications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control which notifications are sent to your email
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.emailNotifications}
            onChange={() => togglePref('emailNotifications')}
            className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
          />
          <div>
            <p className="text-sm font-medium">Enable email notifications</p>
            <p className="text-xs text-muted-foreground">
              Receive email alerts for important updates
            </p>
          </div>
        </label>
      </div>

      {/* Task Notifications */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Task Notifications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get notified about task activity
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'taskAssigned' as const, label: 'Task assigned to you', desc: 'When someone assigns you a task' },
            { key: 'taskCompleted' as const, label: 'Task completed', desc: 'When a task you created or are assigned to is completed' },
            { key: 'taskComments' as const, label: 'New comments', desc: 'When someone comments on your tasks' },
            { key: 'taskDueSoon' as const, label: 'Due date reminders', desc: 'Reminders when tasks are due soon (e.g., 3h, 6h before)' },
            { key: 'taskOverdue' as const, label: 'Overdue alerts', desc: 'Alerts when tasks pass their due date without completion' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Project Notifications */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
            <FolderKanban className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Project Notifications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get notified about project deadlines and status changes
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'projectDueSoon' as const, label: 'Project due date reminders', desc: 'When a project you manage or own is due within 7 days' },
            { key: 'projectOverdue' as const, label: 'Project overdue alerts', desc: 'When a project passes its due date without completion' },
            { key: 'projectAutoArchived' as const, label: 'Auto-archive notifications', desc: 'When a project is automatically archived due to inaction' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Social Notifications */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Social & Workspace</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notifications about team activity
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'mentions' as const, label: 'Mentions', desc: 'When someone mentions you in a comment or task' },
            { key: 'workspaceInvites' as const, label: 'Workspace invites', desc: 'When you receive a workspace invitation' },
            { key: 'projectUpdates' as const, label: 'Project updates', desc: 'Major changes to projects you belong to' },
            { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your weekly activity' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
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
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
