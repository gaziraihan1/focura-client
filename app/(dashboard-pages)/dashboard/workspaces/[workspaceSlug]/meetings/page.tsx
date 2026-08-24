'use client';

import { Plus } from 'lucide-react';

import { MeetingFilters } from '@/components/Dashboard/Workspaces/Meeting/MeetingFilters';
import { MeetingEmptyState } from '@/components/Dashboard/Workspaces/Meeting/MeetingEmptyState';
import { MeetingFormModal } from '@/components/Dashboard/Workspaces/Meeting/MeetingInformModal';
import { MeetingCard } from '@/components/Dashboard/Workspaces/Meeting/MeetingCard';
import { MeetingDetailModal } from '@/components/Dashboard/Workspaces/Meeting/MeetingDetailModal';
import { MeetingGridSkeleton } from '@/components/Dashboard/Workspaces/Meeting/MeetingGridSkeleton';
import { ErrorState } from '@/components/Dashboard/Workspaces/Meeting/ErrorState';
import { ConfirmModal } from '@/components/Shared/ConfirmModal';
import { useMeetingPage } from '@/hooks/useMeetingPage';
import { useWorkspaceSlug } from '@/hooks/useRouteParams';

export default function MeetingsPage() {
  const workspaceSlug = useWorkspaceSlug();

  const controller = useMeetingPage({workspaceSlug})

  if (controller.roleLoading || !controller.workspaceId) return <PageSkeleton />;

  const pendingAction = controller.confirmAction;

  return (
    <div className="flex h-full flex-col justify-center 2xl:max-w-7xl mx-auto">
      <header className="border-b bg-background px-2 sm:px-4 py-4">
        <div className="flex items-center flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Meetings</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {controller.isAdminOrOwner ? 'Schedule and manage team meetings' : 'Meetings available to you'}
            </p>
          </div>
          {controller.isAdminOrOwner && (
            <button
              onClick={controller.openCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New meeting</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="border-b bg-background px-2 sm:px-4 lg:px-0 py-3 ">
        <MeetingFilters
          activeStatus={controller.activeStatus}
          onStatusChange={controller.setActiveStatus}
          upcoming={controller.upcoming}
          onUpcomingChange={controller.setUpcoming}
          total={controller.total}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-2 sm:px-6 lg:px-0 py-5">
        {controller.isLoading ? (
          <MeetingGridSkeleton />
        ) : controller.error ? (
          <ErrorState onRetry={() => controller.refetch()} />
        ) : controller.meetings.length === 0 ? (
          <MeetingEmptyState
            isAdmin={controller.isAdminOrOwner}
            hasFilters={controller.hasFilters}
            onCreateClick={controller.openCreate}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {controller.meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                isAdmin={controller.isAdminOrOwner}
                currentUserId={controller.userId ?? ''}
                onClick={controller.openDetail}
                onEdit={controller.isAdminOrOwner ? controller.openEdit : undefined}
                onCancel={controller.isAdminOrOwner ? controller.handleCancel : undefined}
                onDelete={controller.isAdminOrOwner ? controller.handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </main>

      <MeetingFormModal
        open={controller.formOpen}
        onClose={() => { controller.setFormOpen(false); controller.setEditingMeeting(null); }}
        onSubmit={controller.handleFormSubmit}
        isPending={controller.formIsPending}
        error={controller.formError}
        members={controller.members}
        currentUserId={controller.userId ?? ''}
        editingMeeting={controller.editingMeeting}
      />

      <MeetingDetailModal
        meeting={controller.detailMeeting}
        open={controller.detailOpen}
        onClose={() => controller.setDetailOpen(false)}
        isAdmin={controller.isAdminOrOwner}
        currentUserId={controller.userId ?? ''}
        onEdit={controller.isAdminOrOwner ? controller.openEdit : undefined}
        onCancel={controller.isAdminOrOwner ? controller.handleCancel : undefined}
      />

      <ConfirmModal
        isOpen={!!pendingAction}
        onClose={() => controller.setConfirmAction(null)}
        onConfirm={controller.handleConfirmAction}
        title={pendingAction?.type === 'cancel' ? 'Cancel meeting' : 'Delete meeting'}
        message={
          pendingAction
            ? pendingAction.type === 'cancel'
              ? `Cancel "${pendingAction.meeting.title}"? Attendees will be notified that this meeting is no longer happening.`
              : `Delete "${pendingAction.meeting.title}"? This will permanently remove the meeting and cannot be undone.`
            : ''
        }
        confirmText={pendingAction?.type === 'cancel' ? 'Cancel meeting' : 'Delete'}
        variant="danger"
        isLoading={controller.cancelIsPending || controller.deleteIsPending}
      />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="flex h-full flex-col animate-pulse">
      <div className="border-b px-6 py-4"><div className="h-5 w-32 rounded bg-muted" /></div>
      <div className="px-6 py-5"><MeetingGridSkeleton /></div>
    </div>
  );
}
