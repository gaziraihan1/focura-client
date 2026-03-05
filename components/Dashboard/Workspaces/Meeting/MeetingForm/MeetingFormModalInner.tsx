import { X, Loader2 } from 'lucide-react';
import { useMeetingForm } from '@/hooks/useMeetingForm';
import { VisibilityPicker } from './VisibilityPicker';
import { AttendeePicker } from './AttendeePicker';
import { FormField } from './FormField';
import { Props } from '../MeetingInformModal';


export function MeetingFormModalInner({
  onClose,
  onSubmit,
  isPending,
  error,
  members,
  currentUserId,
  editingMeeting,
}: Props) {
  const {
    form, setField, toggleAttendee,
    memberSearch, setMemberSearch,
    validationError, handleSubmit,
  } = useMeetingForm({ editingMeeting, onSubmit });

  const isEditing    = !!editingMeeting;
  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-2xl max-h-[95dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border bg-card shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEditing ? 'Edit Meeting' : 'New Meeting'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="divide-y divide-border">
          {/* Basic info */}
          <section className="space-y-4 px-5 py-5">
            <FormField label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g. Weekly team sync"
                className="input-base"
                maxLength={200}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="What's this meeting about?"
                rows={3}
                className="input-base resize-none"
                maxLength={2000}
              />
            </FormField>
          </section>

          <section className="space-y-4 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start">
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setField('startTime', e.target.value)}
                  className="input-base"
                />
              </FormField>
              <FormField label="End">
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setField('endTime', e.target.value)}
                  className="input-base"
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-4 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</p>
            <FormField label="Meeting link" hint="Zoom, Google Meet, Teams, etc.">
              <input
                type="url"
                value={form.link}
                onChange={(e) => setField('link', e.target.value)}
                placeholder="https://meet.google.com/..."
                className="input-base"
              />
            </FormField>
            <FormField label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="Conference room A, building 2..."
                className="input-base"
                maxLength={300}
              />
            </FormField>
          </section>

          <section className="px-5 py-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</p>
            <VisibilityPicker
              value={form.visibility}
              onChange={(v) => setField('visibility', v)}
            />
          </section>

          <section className="px-5 py-5">
            <AttendeePicker
              attendeeIds={form.attendeeIds}
              members={members}
              currentUserId={currentUserId}
              search={memberSearch}
              onSearchChange={setMemberSearch}
              onToggle={toggleAttendee}
              required={form.visibility === 'PRIVATE'}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-card px-5 py-4 flex flex-col gap-2">
          {displayError && (
            <p className="text-xs text-destructive text-center">{displayError}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? 'Save changes' : 'Create meeting'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-base {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base:focus { border-color: var(--ring); }
        .input-base::placeholder { color: var(--muted-foreground); }
      `}</style>
    </div>
  );
}