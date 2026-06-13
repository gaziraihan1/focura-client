export function MeetingDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-6 py-8 max-w-4xl mx-auto w-full">
      {/* Back button */}
      <div className="h-8 w-24 rounded-lg bg-muted" />
      {/* Header card */}
      <div className="rounded-2xl bg-muted h-52" />
      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-muted h-36 md:col-span-2" />
        <div className="rounded-xl bg-muted h-36" />
      </div>
      {/* Attendees */}
      <div className="rounded-xl bg-muted h-44" />
    </div>
  );
}