import { Menu } from "lucide-react";

interface MobileTopBarProps {
  projectName: string | undefined;
  currentLabel: string | undefined;
  projectColor: string;
  onOpen: () => void;
}

export function MobileTopBar({ projectName, currentLabel, projectColor, onOpen }: MobileTopBarProps) {
  return (
    <div className="lg:hidden flex items-center gap-3 px-3 py-2.5 bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-30">
      <button
        onClick={onOpen}
        className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
      >
        <Menu size={16} />
      </button>

      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ backgroundColor: projectColor }}
        >
          {projectName?.charAt(0).toUpperCase() ?? "P"}
        </div>
        <span className="text-sm font-semibold text-foreground truncate">
          {projectName ?? "Project"}
        </span>
        {currentLabel && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <span className="opacity-30">/</span>
            {currentLabel}
          </span>
        )}
      </div>
    </div>
  );
}
