export function NotificationLoadingState() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border-b border-border animate-pulse">
          <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-muted rounded w-full mb-2"></div>
          <div className="h-2 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </>
  );
}