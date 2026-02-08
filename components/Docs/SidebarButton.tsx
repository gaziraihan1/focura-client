import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

interface SidebarButtonProps {
  onMenuOpen: (v: boolean) => void;
  isMobileMenuOpen: boolean;
}

export default function SidebarButton({
  onMenuOpen,
  isMobileMenuOpen,
}: SidebarButtonProps) {
  return (
    <button
      onClick={() => onMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden fixed left-4 top-18 z-50 p-2.5 bg-background border border-border rounded-md shadow-lg hover:bg-accent transition-colors"
      aria-label="Toggle documentation menu"
    >
      {isMobileMenuOpen ? (
        <ChevronsLeft className="h-5 w-5 text-foreground" />
      ) : (
        <ChevronsRight className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
}
