interface DashboardHeaderProps {
  userName?: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const firstName = userName?.split(" ")[0] ?? "User";

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="text-muted-foreground mt-2">
        Here&apos;s what&apos;s happening with your projects today.
      </p>
    </div>
  );
}
