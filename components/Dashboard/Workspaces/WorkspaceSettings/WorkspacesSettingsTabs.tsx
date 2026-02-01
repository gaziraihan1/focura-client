import { Save, Users, AlertCircle } from "lucide-react";
import { TabType } from "@/hooks/useWorkspaceSettings";

interface WorkspaceSettingsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS = [
  { id: "general" as const, label: "General", icon: Save },
  { id: "members" as const, label: "Members", icon: Users },
  { id: "danger" as const, label: "Danger Zone", icon: AlertCircle },
];

export function WorkspaceSettingsTabs({
  activeTab,
  onTabChange,
}: WorkspaceSettingsTabsProps) {
  return (
    <div className="flex gap-2 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}