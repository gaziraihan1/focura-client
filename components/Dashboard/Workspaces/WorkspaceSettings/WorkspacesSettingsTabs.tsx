import { useRef, useCallback } from "react";
import { Save, Users, AlertCircle, Globe } from "lucide-react";
import { TabType } from "@/hooks/useWorkspaceSettings";

interface WorkspaceSettingsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; icon: typeof Save }[] = [
  { id: "general", label: "General", icon: Save },
  { id: "members", label: "Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "danger", label: "Danger Zone", icon: AlertCircle },
];

const TAB_IDS = TABS.map((t) => t.id);

export function WorkspaceSettingsTabs({
  activeTab,
  onTabChange,
}: WorkspaceSettingsTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TAB_IDS.indexOf(activeTab);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % TAB_IDS.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + TAB_IDS.length) % TAB_IDS.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = TAB_IDS.length - 1;
          break;
        default:
          return;
      }

      const nextTab = TAB_IDS[nextIndex];
      onTabChange(nextTab);
      // Focus the new tab button
      const tabButton = tabListRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab="${nextTab}"]`
      );
      tabButton?.focus();
    },
    [activeTab, onTabChange]
  );

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Workspace settings"
      className="flex flex-wrap gap-2 border-b border-border"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            data-tab={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
