// components/Dashboard/TaskDetails/TaskDetailsSkeleton.tsx
export default function TaskDetailsSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-8 bg-muted rounded-lg w-2/3" />

      {/* Meta row */}
      <div className="flex gap-3">
        <div className="h-6 w-20 bg-muted rounded-full" />
        <div className="h-6 w-20 bg-muted rounded-full" />
        <div className="h-6 w-24 bg-muted rounded-full" />
      </div>

      {/* Description block */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>

      {/* Assignees */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-8 h-8 bg-muted rounded-full" />
        ))}
      </div>

      {/* Comments placeholder */}
      <div className="border border-border rounded-xl p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-24" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}