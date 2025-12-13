import React, { useState } from 'react';
import { X, Users, Loader2, AlertCircle } from 'lucide-react';
import { CreateTaskDto, useCreateTask } from '@/hooks/useTask';
import Image from 'next/image';

interface CreateTaskModalProps {
  projectId: string;
  projectMembers: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }>;
  onClose: () => void;
}
type CreateTaskFormData = Required<
  Pick<
    CreateTaskDto,
    'title' | 'status' | 'priority' | 'assigneeIds'
  >
> &
  Pick<CreateTaskDto, 'description' | 'dueDate'>;


export default function CreateTaskModal({ projectId, projectMembers, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();
 const [formData, setFormData] = useState<CreateTaskFormData>({
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
  dueDate: '',
  assigneeIds: [],
});


  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter(id => id !== userId)
        : [...prev.assigneeIds, userId],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    createTask.mutate(
      {
        ...formData,
        projectId,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const priorityColors: Record<string, string> = {
    URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    LOW: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-2xl w-full mx-4 border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                errors.title ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              rows={3}
              placeholder="Enter task description"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const).map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-3 py-2 rounded-lg border transition text-sm font-medium ${
                    formData.priority === priority
                      ? priorityColors[priority]
                      : 'border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Users size={16} className="inline mr-2" />
              Assign to Members
            </label>
            {projectMembers.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projectMembers.map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAssignee(member.userId)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                      formData.assigneeIds.includes(member.userId)
                        ? 'bg-primary/10 border-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                      {member.user.image ? (
                        <Image
                        width={32}
                        height={32}
                          src={member.user.image}
                          alt={member.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        member.user.name.charAt(0)
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-foreground">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">{member.user.email}</p>
                    </div>
                    {formData.assigneeIds.includes(member.userId) && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No project members available</p>
            )}
          </div>

          {/* Selected Assignees Count */}
          {formData.assigneeIds.length > 0 && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-primary">
                {formData.assigneeIds.length} member{formData.assigneeIds.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createTask.isPending || !formData.title.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}