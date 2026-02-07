'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useWorkspace } from '@/hooks/useWorkspace';
import LabelManagementMain from '@/components/Dashboard/Labels/LabelManagementMain';

export default function LabelsPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspace(workspaceSlug);

    if (isWorkspaceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Workspace not found
          </h2>
          <p className="text-muted-foreground mb-4">
            The workspace you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard/workspaces"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Workspaces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <LabelManagementMain
      workspaceId={workspace.id} 
      workspaceSlug={workspace.slug || workspaceSlug} 
    />
  );
}