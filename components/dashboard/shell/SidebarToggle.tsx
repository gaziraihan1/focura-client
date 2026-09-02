"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      className={`shrink-0 p-2 rounded-lg text-foreground ${className}`}
    >
      <Icon size={18} />
    </Button>
  );
}