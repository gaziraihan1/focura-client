'use client';

import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <SharedEmptyState
      icon={icon}
      title={title}
      description={description || ''}
    />
  );
}
