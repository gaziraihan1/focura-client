import React, { useState } from 'react';
import { 
  Plus, 
  X,
  Tag,
} from 'lucide-react';
import {
  useLabels,
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
  Label,
  CreateLabelDto,
  UpdateLabelDto,
} from '@/hooks/useLabels';
import LabelItem from './LabelItem';
import LabelForm from './LabelForm';
import { useWorkspaceRoleCheck } from '@/hooks/useWorkspace';
import { useSession } from 'next-auth/react';

interface LabelManagerProps {
  workspaceId?: string;
  onClose?: () => void;
}

export function LabelManager({ workspaceId, onClose }: LabelManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Label | null>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const { canManage } = useWorkspaceRoleCheck(workspaceId);
  
  const { data: labels = [], isLoading } = useLabels(workspaceId);
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();

  const canEditLabel = (label: Label) => {
    if (canManage) return true;
    return label.createdById === userId;
  };

  const canDeleteLabel = (label: Label) => {
    if (canManage) return true;
    return label.createdById === userId;
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (labelId: string) => {
    setEditingId(labelId);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSaveNew = (data: CreateLabelDto) => {
    const labelData = {
      ...data,
      workspaceId: workspaceId || undefined,
    };

    createLabel.mutate(labelData, {
      onSuccess: () => {
        setIsCreating(false);
      },
      onError: (error) => {
        console.error('Failed to create label:', error);
        const message = (error as any)?.response?.data?.message || 'Failed to create label';
        alert(message);
      },
    });
  };

  const handleSaveEdit = (labelId: string, data: UpdateLabelDto) => {
    updateLabel.mutate(
      { id: labelId, data },
      {
        onSuccess: () => {
          setEditingId(null);
        },
        onError: (error) => {
          console.error('Failed to update label:', error);
          const message = (error as any)?.response?.data?.message || 'Failed to update label';
          alert(message);
        },
      }
    );
  };

  const handleDeleteClick = (label: Label) => {
    setDeleteConfirm(label);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    deleteLabel.mutate(deleteConfirm.id, {
      onSuccess: () => {
        setDeleteConfirm(null);
      },
      onError: (error) => {
        console.error('Failed to delete label:', error);
        const message = (error as any)?.response?.data?.message || 'Failed to delete label';
        alert(message);
        setDeleteConfirm(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Manage Labels
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Label</span>
          </button>
        )}

        {isCreating && (
          <LabelForm
            workspaceId={workspaceId}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            isSaving={createLabel.isPending}
          />
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading labels...
          </div>
        ) : labels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No labels yet</p>
            <p className="text-sm">Create your first label to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {labels.map((label) => (
              <div key={label.id}>
                {editingId === label.id ? (
                  <LabelForm
                    label={label}
                    workspaceId={workspaceId}
                    onSave={(data) => handleSaveEdit(label.id, data)}
                    onCancel={handleCancel}
                    isSaving={updateLabel.isPending}
                  />
                ) : (
                  <LabelItem
                    label={label}
                    onEdit={canEditLabel(label) ? () => handleEdit(label.id) : undefined}
                    onDelete={canDeleteLabel(label) ? () => handleDeleteClick(label) : undefined}
                    isDeleting={deleteLabel.isPending}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={handleDeleteCancel}
        >
          <div 
            className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Delete Label
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: deleteConfirm.color }}
                  />
                  <span className="font-medium text-foreground">
                    {deleteConfirm.name}
                  </span>
                </div>
                {deleteConfirm.description && (
                  <p className="text-sm text-muted-foreground ml-6">
                    {deleteConfirm.description}
                  </p>
                )}
              </div>

              {deleteConfirm._count && deleteConfirm._count.tasks > 0 ? (
                <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ This label is used in{' '}
                    <strong>{deleteConfirm._count.tasks}</strong>{' '}
                    {deleteConfirm._count.tasks === 1 ? 'task' : 'tasks'}.
                    It will be removed from all tasks.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Are you sure you want to delete this label?
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLabel.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLabel.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLabel.isPending ? 'Deleting...' : 'Delete Label'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}