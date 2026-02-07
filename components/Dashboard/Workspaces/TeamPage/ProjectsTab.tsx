'use client';

import React, { useState, useMemo } from 'react';
import { Search, FolderOpen } from 'lucide-react';
import { ProjectCard }          from './ProjectCard';
import { ProjectMembersPanel }  from './ProjectMembersPanel';
import { ProjectSummary } from '@/hooks/useTeamPage';
import { EmptyState } from './EmptyState';
import { ProjectRoleOption } from './RoleDropdown';
// import { EmptyState }           from '../Shared/EmptyState';
// import { ProjectRoleOption }    from '../Shared/RoleDropdown';
// import { ProjectSummary }       from '../hooks/useTeamPage';

// ─── filter chip options ─────────────────────────────────────────────────────
const STATUS_CHIPS: { label: string; value: string | null }[] = [
  { label: 'All',       value: null },
  { label: 'Planning', value: 'PLANNING' },
  { label: 'Active',   value: 'ACTIVE' },
  { label: 'On Hold',  value: 'ON_HOLD' },
  { label: 'Done',     value: 'COMPLETED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

interface ProjectsTabProps {
  projects: ProjectSummary[];
  currentUserId: string | null;
  canManage: boolean;
  onProjectMemberRoleChange: (projectId: string, memberId: string, role: ProjectRoleOption) => void;
}

export function ProjectsTab({
  projects,
  currentUserId,
  canManage,
  onProjectMemberRoleChange,
}: ProjectsTabProps) {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  /** which project card is currently expanded */
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = projects;
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [projects, statusFilter, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* ── search + status chips ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-lg border border-border bg-background text-foreground pl-9 pr-3 py-2 text-sm
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_CHIPS.map((chip) => {
            const active = statusFilter === chip.value;
            return (
              <button
                key={chip.label}
                onClick={() => setStatusFilter(chip.value)}
                className={[
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150',
                  active
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-muted-foreground',
                ].join(' ')}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── project grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : project.id)}
              >
                {/* members panel — only render when expanded */}
                {isExpanded && (
                  <ProjectMembersPanel
                    projectId={project.id}
                    currentUserId={currentUserId}
                    canManage={canManage}
                    onRoleChange={onProjectMemberRoleChange}
                  />
                )}
              </ProjectCard>
            );
          })}
        </div>
      )}

      {/* footer count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}