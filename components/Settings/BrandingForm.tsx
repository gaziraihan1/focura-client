'use client';

import { useState, useEffect } from 'react';
import { Brush, Save, Loader2 } from 'lucide-react';
import { useWorkspace, useUpdateWorkspace } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';

interface BrandingFormProps {
  workspaceSlug: string;
}

const BRAND_COLORS = [
  '#667eea', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
  '#0EA5E9', '#84CC16', '#F97316', '#6366F1',
];

export function BrandingForm({ workspaceSlug }: BrandingFormProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const updateWorkspace = useUpdateWorkspace();
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace?.color) {
      setBrandColor(workspace.color);
    }
  }, [workspace]);

  const handleSave = async () => {
    if (!workspace) return;
    setSaving(true);
    try {
      await updateWorkspace.mutateAsync({
        id: workspace.id,
        data: { color: brandColor },
      });
      toast.success('Branding updated');
    } catch {
      toast.error('Failed to update branding');
    } finally {
      setSaving(false);
    }
  };

  if (!workspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Brand Color */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10">
            <Brush className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Brand Color</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Primary color used across workspace UI elements
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {BRAND_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setBrandColor(color)}
              className={`w-10 h-10 rounded-xl transition-all ${
                brandColor === color
                  ? 'ring-2 ring-offset-2 ring-primary scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl border border-border bg-background">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: brandColor }}
            >
              {workspace.name?.charAt(0)?.toUpperCase() || 'W'}
            </div>
            <div>
              <p className="text-sm font-semibold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
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
          {saving ? 'Saving...' : 'Save Branding'}
        </button>
      </div>
    </div>
  );
}
