"use client";

import { LogOut, UserMinus, ChevronDown, Check } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { ProjectRole } from "@/hooks/useProjects";
import React, { useState, useRef, useEffect } from "react"

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
 
  const roles: ProjectRole[] = ["MANAGER", "COLLABORATOR", "VIEWER"];
  const allItems = [...roles, isSelf ? "LEAVE" : "REMOVE"];
 
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
    setActiveIndex(-1);
  };

  // Focus first item on open
  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector<HTMLElement>("[role='menuitem']");
      first?.focus();
    }
  }, [open]);
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    const menuItems = menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']");
    if (!menuItems?.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % menuItems.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(menuItems.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
        break;
    }
  };

  // Move focus when activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll<HTMLElement>("[role='menuitem']");
      items[activeIndex]?.focus();
    }
  }, [activeIndex]);
 
  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={!canManage}
        aria-haspopup="menu"
        aria-expanded={open}
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
            ref={menuRef}
            role="menu"
            aria-label="Role options"
            style={{ top: coords.top, right: coords.right }}
            className="fixed z-9999 w-44 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="p-1.5 space-y-0.5">
              {roles.map((r, i) => (
                <button
                  key={r}
                  role="menuitem"
                  tabIndex={activeIndex === i ? 0 : -1}
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
                role="menuitem"
                tabIndex={activeIndex === roles.length ? 0 : -1}
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
