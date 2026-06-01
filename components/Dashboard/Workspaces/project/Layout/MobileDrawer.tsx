import { SidebarContent, SidebarContentProps } from "./SidebarContent";
import { X } from "lucide-react"

interface MobileDrawerProps extends SidebarContentProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose, ...contentProps }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Panel */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
          "bg-card border-r border-border shadow-2xl",
          "transform transition-transform duration-200 ease-out",
          "lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>

        <SidebarContent {...contentProps} onNavClick={onClose} />
      </div>
    </>
  );
}
