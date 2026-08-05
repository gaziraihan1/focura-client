'use client';

import { useState, useEffect, useReducer } from 'react';
import { Settings2, Save, Loader2 } from 'lucide-react';
import { useWorkspace, useUpdateWorkspace, type Workspace } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';

const PREDEFINED_COLORS = [
  '#667eea', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
];

interface WorkspaceFormState {
  name: string;
  description: string;
  color: string;
  isPublic: boolean;
  allowInvites: boolean;
}

type WorkspaceFormAction =
  | { type: 'load'; workspace: Workspace }
  | { type: 'setName'; value: string }
  | { type: 'setDescription'; value: string }
  | { type: 'setColor'; value: string }
  | { type: 'setIsPublic'; value: boolean }
  | { type: 'setAllowInvites'; value: boolean };

function formReducer(state: WorkspaceFormState, action: WorkspaceFormAction): WorkspaceFormState {
  switch (action.type) {
    case 'load':
      return {
        name: action.workspace.name || '',
        description: action.workspace.description || '',
        color: action.workspace.color || PREDEFINED_COLORS[0],
        isPublic: action.workspace.isPublic || false,
        allowInvites: action.workspace.allowInvites ?? true,
      };
    case 'setName':
      return { ...state, name: action.value };
    case 'setDescription':
      return { ...state, description: action.value };
    case 'setColor':
      return { ...state, color: action.value };
    case 'setIsPublic':
      return { ...state, isPublic: action.value };
    case 'setAllowInvites':
      return { ...state, allowInvites: action.value };
    default:
      return state;
  }
}

interface WorkspaceGeneralFormProps {
  workspaceSlug: string;
}

export function WorkspaceGeneralForm({ workspaceSlug }: WorkspaceGeneralFormProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const updateWorkspace = useUpdateWorkspace();
  const [form, dispatch] = useReducer(formReducer, {
    name: '',
    description: '',
    color: PREDEFINED_COLORS[0],
    isPublic: false,
    allowInvites: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace) {
      dispatch({ type: 'load', workspace });
    }
  }, [workspace]);

  const handleSave = async () => {
    if (!workspace) return;
    if (!form.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }
    setSaving(true);
    try {
      await updateWorkspace.mutateAsync({
        id: workspace.id,
        data: { name: form.name, description: form.description, color: form.color, isPublic: form.isPublic },
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
              value={form.name}
              onChange={(e) => dispatch({ type: 'setName', value: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              placeholder="My Workspace"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => dispatch({ type: 'setDescription', value: e.target.value })}
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
                  onClick={() => dispatch({ type: 'setColor', value: c })}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
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
              checked={form.isPublic}
              onChange={(e) => dispatch({ type: 'setIsPublic', value: e.target.checked })}
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
              checked={form.allowInvites}
              onChange={(e) => dispatch({ type: 'setAllowInvites', value: e.target.checked })}
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
