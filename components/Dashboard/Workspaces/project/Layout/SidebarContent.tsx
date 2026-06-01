import { ProjectNavItem } from "./useProjectNav";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface SidebarContentProps {
  nav: ProjectNavItem[];
  pathname: string;
  projectName: string | undefined;
  projectColor: string;
  workspaceSlug: string;
  onNavClick?: () => void;
}

export function SidebarContent({
  nav,
  pathname,
  projectName,
  projectColor,
  workspaceSlug,
  onNavClick,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full select-none">

      {/* Back */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href={`/dashboard/workspaces/${workspaceSlug}/projects`}
          onClick={onNavClick}
          className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
        >
          <ChevronLeft
            size={11}
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          All Projects
        </Link>
      </div>

      {/* Project identity block */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-accent/40">
          {/* Color swatch / avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ring-1 ring-black/5"
            style={{ backgroundColor: projectColor }}
          >
            {projectName?.charAt(0).toUpperCase() ?? "P"}
          </div>
          <div className="min-w-0 flex-1">
            {projectName ? (
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {projectName}
              </p>
            ) : (
              <div className="h-3.5 w-24 bg-muted animate-pulse rounded mb-1" />
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">
              Project
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 mb-3 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
          Menu
        </p>

        {nav.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavClick}
              className={[
                "group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent",
              ].join(" ")}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-foreground/40" />
              )}

              <Icon
                size={15}
                className={[
                  "shrink-0 transition-transform duration-150",
                  !active && "group-hover:scale-110",
                ].join(" ")}
              />
              <span className="truncate">{item.label}</span>

              {item.badge && (
                <span
                  className={[
                    "ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom footer */}
      <div className="px-3 py-3 mt-2">
        <div className="px-2 py-2 rounded-lg bg-accent/30 text-center">
          <p className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-widest">
            Project Workspace
          </p>
        </div>
      </div>
    </div>
  );
}