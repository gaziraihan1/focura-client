export function NotificationsLoadingState() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 rounded-xl bg-muted animate-pulse h-24" />
      ))}
    </>
  );
}