'use client';

import React from 'react';

type Role =
  | 'OWNER'
  | 'ADMIN'
  | 'MEMBER'
  | 'GUEST'
  | 'MANAGER'
  | 'COLLABORATOR'
  | 'VIEWER';

const ROLE_STYLES: Record<Role, string> = {
  OWNER:         'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  ADMIN:         'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  MEMBER:        'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  GUEST:         'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  MANAGER:       'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  COLLABORATOR:  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  VIEWER:        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const ROLE_LABELS: Record<Role, string> = {
  OWNER:         'Owner',
  ADMIN:         'Admin',
  MEMBER:        'Member',
  GUEST:         'Guest',
  MANAGER:       'Manager',
  COLLABORATOR:  'Collaborator',
  VIEWER:        'Viewer',
};

interface RoleBadgeProps {
  role: Role;
  /** Make badge slightly smaller */
  compact?: boolean;
}

export function RoleBadge({ role, compact = false }: RoleBadgeProps) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.MEMBER;
  const label = ROLE_LABELS[role] ?? role;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${style} ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      {label}
    </span>
  );
}