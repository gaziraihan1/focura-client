import { Command, Plus } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  workspaceSlug?: string;
  color?: string | null;
  logo?: string | null;
  _count: {
    members: number;
    projects: number;
  };
}

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  allWorkspaces: Workspace[];
  currentSlug: string;
  onClose: () => void;
  onWorkspaceSwitch: (slug: string) => void;
  onCreateWorkspace: () => void;
}

export function WorkspaceSwitcherModal({
  isOpen,
  allWorkspaces,
  currentSlug,
  onClose,
  onWorkspaceSwitch,
  onCreateWorkspace,
}: WorkspaceSwitcherModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Command size={14} />
            <span>Quick switch workspace</span>
          </div>
          <input
            type="text"
            placeholder="Search workspaces..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground outline-none focus:ring-2 ring-primary"
          />
        </div>

        <div className="overflow-y-auto max-h-64">
          {allWorkspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => onWorkspaceSwitch(ws.slug)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition ${
                ws.workspaceSlug === currentSlug || ws.slug === currentSlug
                  ? "bg-accent"
                  : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: ws.color || "#667eea" }}
              >
                {ws.logo || ws.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{ws.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ws._count.members} members · {ws._count.projects} projects
                </p>
              </div>
            </button>
          ))}

          <button
            onClick={onCreateWorkspace}
            className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-accent transition border-t border-border"
          >
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-primary flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="font-medium">Create new workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}