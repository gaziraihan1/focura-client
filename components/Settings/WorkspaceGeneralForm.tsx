'use client';

import { useState, useEffect } from 'react';
import { Settings2, Save, Loader2 } from 'lucide-react';
import { useWorkspace, useUpdateWorkspace } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';

const PREDEFINED_COLORS = [
  '#667eea', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
];

interface WorkspaceGeneralFormProps {
  workspaceSlug: string;
}

export function WorkspaceGeneralForm({ workspaceSlug }: WorkspaceGeneralFormProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const updateWorkspace = useUpdateWorkspace();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PREDEFINED_COLORS[0]);
  const [isPublic, setIsPublic] = useState(false);
  const [allowInvites, setAllowInvites] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || '');
      setDescription(workspace.description || '');
      setColor(workspace.color || PREDEFINED_COLORS[0]);
      setIsPublic(workspace.isPublic || false);
      setAllowInvites(workspace.allowInvites ?? true);
    }
  }, [workspace]);

  const handleSave = async () => {
    if (!workspace) return;
    if (!name.trim()) {
      toast.error('Workspace name is required');
      return;
    }
    setSaving(true);
    try {
      await updateWorkspace.mutateAsync({
        id: workspace.id,
        data: { name, description, color, isPublic },
      });
      toast.success('Workspace settings saved');
    } catch {
      toast.error('Failed to save workspace settings');
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
      {/* Basic Info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">General Settings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Basic workspace configuration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              placeholder="My Workspace"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm resize-none"
              placeholder="What is this workspace for?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-3">
              Workspace Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <div>
              <p className="text-sm font-medium">Public workspace</p>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can view this workspace
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowInvites}
              onChange={(e) => setAllowInvites(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <div>
              <p className="text-sm font-medium">Allow invitations</p>
              <p className="text-xs text-muted-foreground">
                Members can invite others to this workspace
              </p>
            </div>
          </label>
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
