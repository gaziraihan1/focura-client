"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function SidebarToggle({
  collapsed,
  onToggle,
  className = "",
}: SidebarToggleProps) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      className={`shrink-0 p-2 rounded-lg hover:bg-accent transition text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}