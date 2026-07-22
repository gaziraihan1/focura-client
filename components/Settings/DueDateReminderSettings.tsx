"use client";

import { useState } from "react";
import { Clock, Bell, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { announce } from "@/lib/a11y";

interface DueDateReminderSettingsProps {
  initialSettings?: {
    enabled: boolean;
    hoursBeforeDue: number[];
  };
}

const REMINDER_OPTIONS = [
  { label: "1 hour before", hours: 1 },
  { label: "3 hours before", hours: 3 },
  { label: "6 hours before", hours: 6 },
  { label: "12 hours before", hours: 12 },
  { label: "24 hours before", hours: 24 },
  { label: "3 days before", hours: 72 },
  { label: "1 week before", hours: 168 },
];

export function DueDateReminderSettings({
  initialSettings = { enabled: true, hoursBeforeDue: [3, 6] },
}: DueDateReminderSettingsProps) {
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [selectedHours, setSelectedHours] = useState<number[]>(
    initialSettings.hoursBeforeDue
  );
  const [saving, setSaving] = useState(false);

  const toggleHour = (hours: number) => {
    setSelectedHours((prev) =>
      prev.includes(hours)
        ? prev.filter((h) => h !== hours)
        : [...prev, hours].sort((a, b) => a - b)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/v1/user/notifications", {
        taskDueSoon: enabled,
        dueDateReminderHours: selectedHours,
      });
      toast.success("Reminder settings saved");
      announce("Due date reminder settings saved");
    } catch {
      toast.error("Failed to save settings");
      announce("Failed to save reminder settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
          <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Due Date Reminders
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get notified before your tasks are due
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Enable reminders
            </p>
            <p className="text-xs text-muted-foreground">
              Receive notifications for upcoming task deadlines
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              enabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Reminder intervals */}
        {enabled && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Remind me
            </p>
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_OPTIONS.map(({ label, hours }) => {
                const isSelected = selectedHours.includes(hours);
                return (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => toggleHour(hours)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              You&apos;ll receive a notification at each selected interval before a
              task&apos;s due date. Completed tasks will not trigger reminders.
            </p>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
