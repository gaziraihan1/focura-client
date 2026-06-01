import { LogOut, UserMinus, ChevronDown, Check } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { ProjectRole } from "@/hooks/useProjects";
import React, { useState } from "react"

export function RoleDropdown({
  current,
  memberId,
  canManage,
  isSelf,
  onChangeRole,
  onRemove,
}: {
  current: ProjectRole;
  memberId: string;
  canManage: boolean;
  isSelf: boolean;
  onChangeRole: (id: string, role: ProjectRole) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = React.useRef<HTMLButtonElement>(null);
 
  const roles: ProjectRole[] = ["MANAGER", "COLLABORATOR", "VIEWER"];
 
  const handleOpen = () => {
    if (!canManage) return;
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top:   rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };
 
  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={!canManage}
        className={[
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all",
          canManage
            ? "border-border hover:border-primary/30 hover:bg-accent cursor-pointer"
            : "border-transparent cursor-default opacity-70",
        ].join(" ")}
      >
        <RoleBadge role={current} />
        {canManage && <ChevronDown size={11} className="text-muted-foreground" />}
      </button>
 
      {open && (
        <>
          {/* Full-screen backdrop */}
          <div className="fixed inset-0 z-9998" onClick={() => setOpen(false)} />
 
          {/* Portalled dropdown — fixed so it escapes overflow:hidden parents */}
          <div
            style={{ top: coords.top, right: coords.right }}
            className="fixed z-9999 w-44 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="p-1.5 space-y-0.5">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => { onChangeRole(memberId, r); setOpen(false); }}
                  className={[
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors",
                    r === current
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-accent",
                  ].join(" ")}
                >
                  <RoleBadge role={r} />
                  {r === current && <Check size={11} className="text-primary" />}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-1.5">
              <button
                onClick={() => { onRemove(memberId); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium"
              >
                {isSelf ? <LogOut size={12} /> : <UserMinus size={12} />}
                {isSelf ? "Leave project" : "Remove member"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}