// components/AdminUserDetail/LoadingState.tsx

export function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 rounded-xl bg-muted animate-pulse" />
      <div className="h-32 rounded-xl bg-muted animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}