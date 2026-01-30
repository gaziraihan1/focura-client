import { Activity, FolderKanban, Users, LucideIcon } from "lucide-react";

interface Tab {
  id: "overview" | "projects" | "members";
  label: string;
  icon: LucideIcon;
}

interface WorkspaceTabNavigationProps {
  activeTab: "overview" | "projects" | "members";
  onTabChange: (tab: "overview" | "projects" | "members") => void;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "members", label: "Members", icon: Users },
];

export function WorkspaceTabNavigation({
  activeTab,
  onTabChange,
}: WorkspaceTabNavigationProps) {
  return (
    <div className="border-b border-border -mx-3 sm:mx-0">
      <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide px-3 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition whitespace-nowrap text-sm sm:text-base ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}