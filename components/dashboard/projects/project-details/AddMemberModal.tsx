import { useState } from "react";
import { X } from 'lucide-react';
import { useAddProjectMember } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';


interface AddMemberModalProps {
  projectId: string;
  workspaceMembers: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }>;
  existingMemberIds: string[];
  onClose: () => void;
}

export default function AddMemberModal({ 
  projectId, 
  workspaceMembers, 
  existingMemberIds,
  onClose 
}: AddMemberModalProps) {
  const addMember = useAddProjectMember();
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('COLLABORATOR');

  // Filter out users who are already project members
  const existingMemberSet = new Set(existingMemberIds);
  const availableMembers = workspaceMembers.filter(
    member => !existingMemberSet.has(member.userId)
  );

  const handleSubmit = () => {
    if (!selectedUser) return;

    addMember.mutate(
      {
        projectId,
        data: {
          userId: selectedUser,
          role: role as 'MANAGER' | 'COLLABORATOR' | 'VIEWER',
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 max-w-md w-full mx-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Add Member</h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="rounded-lg" aria-label="Close">
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="fld-23">Select User</label>
            {availableMembers.length > 0 ? (
              <select id="fld-23"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              >
                <option value="">Choose a user...</option>
                {availableMembers.map(member => (
                  <option key={member.userId} value={member.userId}>
                    {member.user.name} ({member.user.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                All workspace members are already in this project
              </p>
            )}
          </div>

          {availableMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="fld-24">Role</label>
              <select id="fld-24"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              >
                <option value="MANAGER">Manager</option>
                <option value="COLLABORATOR">Collaborator</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Cancel
            </Button>
            {availableMembers.length > 0 && (
              <Button
                onClick={handleSubmit}
                disabled={addMember.isPending || !selectedUser}
                loading={addMember.isPending}
                className="flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Add Member
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}