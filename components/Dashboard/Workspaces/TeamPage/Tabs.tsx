import { ProjectSummary, WorkspaceMemberRow } from "@/hooks/useTeamPage";
import React from "react";

type Tab = {
  id: "members" | "projects";
  label: string;
};

interface TabsProps {
  tabs: Tab[];
  activeTab: "members" | "projects";
  onActiveTab: (v: "members" | "projects") => void;
  members: WorkspaceMemberRow[];
  projects: ProjectSummary[];
}

export default function Tabs({
  tabs,
  activeTab,
  onActiveTab,
  members,
  projects,
}: TabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onActiveTab(tab.id)}
            className={[
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150",
              "border-b-2",
              active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
            <span
              className={[
                "ml-1.5 inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5",
                active
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {tab.id === "members" ? members.length : projects.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
