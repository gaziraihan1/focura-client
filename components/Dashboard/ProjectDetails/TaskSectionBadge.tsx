'use client';

// Resolves a task's section (if any) from the project's sections and renders
// the section badge. Used on the task details page, where only the task
// (with projectId + sectionId) is available.

import { useProjectSections } from '@/hooks/useProjectFeatures';
import { SectionBadge } from './SectionBadge';

interface TaskSectionBadgeProps {
  task: { projectId?: string | null; sectionId?: string | null };
}

export function TaskSectionBadge({ task }: TaskSectionBadgeProps) {
  const { data: sections } = useProjectSections(task.projectId ?? undefined);
  const section = task.sectionId && sections ? sections.find((s) => s.id === task.sectionId) : undefined;

  if (!section) return null;
  return (
    <div className="mt-2">
      <SectionBadge name={section.name} color={section.color} />
    </div>
  );
}
