'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

// ─── Workspace role options ─────────────────────────────────────────────────
export type WorkspaceRoleOption = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
const WORKSPACE_OPTIONS: { value: WorkspaceRoleOption; label: string }[] = [
  { value: 'OWNER',  label: 'Owner' },
  { value: 'ADMIN',  label: 'Admin' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'GUEST',  label: 'Guest' },
];

// ─── Project role options ────────────────────────────────────────────────────
export type ProjectRoleOption = 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
const PROJECT_OPTIONS: { value: ProjectRoleOption; label: string }[] = [
  { value: 'MANAGER',      label: 'Manager' },
  { value: 'COLLABORATOR', label: 'Collaborator' },
  { value: 'VIEWER',       label: 'Viewer' },
];

// ─── Shared props ────────────────────────────────────────────────────────────
interface BaseProps {
  /** Prevent interaction (e.g. current user row, or the only OWNER) */
  disabled?: boolean;
  /** Tooltip shown on disabled state */
  disabledReason?: string;
}

// ─── Workspace variant ──────────────────────────────────────────────────────
export interface WorkspaceRoleDropdownProps extends BaseProps {
  variant: 'workspace';
  currentRole: WorkspaceRoleOption;
  onChange: (role: WorkspaceRoleOption) => void;
}

// ─── Project variant ─────────────────────────────────────────────────────────
export interface ProjectRoleDropdownProps extends BaseProps {
  variant: 'project';
  currentRole: ProjectRoleOption;
  onChange: (role: ProjectRoleOption) => void;
}

export type RoleDropdownProps = WorkspaceRoleDropdownProps | ProjectRoleDropdownProps;

export function RoleDropdown(props: RoleDropdownProps) {
  const { disabled = false, disabledReason } = props;

  const options = props.variant === 'workspace' ? WORKSPACE_OPTIONS : PROJECT_OPTIONS;
  const currentRole = props.currentRole as string;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.variant === 'workspace') {
      (props.onChange as (r: WorkspaceRoleOption) => void)(e.target.value as WorkspaceRoleOption);
    } else {
      (props.onChange as (r: ProjectRoleOption) => void)(e.target.value as ProjectRoleOption);
    }
  };

  return (
    <div className="relative" title={disabled && disabledReason ? disabledReason : undefined}>
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={disabled}
        className={[
          'appearance-none',
          'w-full min-w-[120px]',
          'rounded-lg border border-border bg-background text-foreground',
          'pl-3 pr-8 py-1.5 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          'transition-colors duration-150',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-muted-foreground cursor-pointer',
        ].join(' ')}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${
          disabled ? 'opacity-50' : ''
        }`}
        strokeWidth={2}
      />
    </div>
  );
}