'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, FolderKanban } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ProjectMember, useProjects } from '@/hooks/useProjects';
import { useWorkspaceProjectsPage } from '@/hooks/useProjectsPage';
import { ProjectData } from '@/types/project.types';

export default function ProjectDropdown() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const {
    workspace,
    currentUserId,
    canCreateProjects,
  } = useWorkspaceProjectsPage({ workspaceSlug });

  const { data: projects } = useProjects(workspace?.id);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
      >
        <FolderKanban className="h-4 w-4 text-muted-foreground" />
        <span>Projects</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute min-[400px]:right-0 mt-2 w-64 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg z-50 animate-in fade-in-0 zoom-in-95">

          <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
            Your Projects
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {projects?.map((project: ProjectData) => {
              const joined = project?.members?.some(
                (m: ProjectMember) => m.user?.id === currentUserId
              );

              const haveAccess = joined || canCreateProjects;

              const handleClick = (e: React.MouseEvent) => {
                if (!haveAccess) {
                  e.preventDefault();
                  toast.error('You are not a member of this project');
                }
              };

              return (
                <Link
                  key={project.id}
                  href={`/dashboard/workspaces/${workspaceSlug}/projects/${project.slug}`}
                  onClick={handleClick}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors
                    ${haveAccess 
                      ? 'hover:bg-accent hover:text-accent-foreground'
                      : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  {project.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}