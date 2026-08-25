import { ProfileStatsCard } from "./ProfileStatsCard";
import { ProfileStorageCard } from "./ProfileStorageCard";
import { ProfilePlanCard } from "./ProfilePlanCard";

interface StorageData {
  total: number;
  used: number;
  remaining: number;
}

interface Workspace {
  id: string;
  plan: string;
  maxStorage: number;
  slug: string
}

interface ProfileSidebarProps {
  role: string;
  createdAt: string;
  storage: StorageData | null;
  ownedWorkspaces?: Workspace[];
  lastPasswordChange?: string | null;
}

export function ProfileSidebar({
  role,
  createdAt,
  storage,
  ownedWorkspaces,
  lastPasswordChange,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      <ProfileStatsCard
        role={role}
        createdAt={createdAt}
        lastPasswordChange={lastPasswordChange ?? null}
      />
      <ProfileStorageCard storage={storage} />
      <ProfilePlanCard ownedWorkspaces={ownedWorkspaces} />
    </div>
  );
}