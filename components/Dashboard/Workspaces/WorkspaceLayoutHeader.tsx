import ThemeSwitcher from "@/components/Themes/ThemeSwitcher";
import { Menu, Search } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";



interface WorkspaceLayoutHeaderProps {
  session: Session | null;
  onSidebarOpen: () => void;
  onSwitcherOpen: () => void;
}

export function WorkspaceLayoutHeader({
  session,
  onSidebarOpen,
  onSwitcherOpen,
}: WorkspaceLayoutHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 bg-card border-b border-border">
      {/* Mobile Menu Button */}
      <button
        onClick={onSidebarOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-accent transition"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 min-w-50 max-w-md relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          type="text"
          placeholder="Search or press Cmd+K"
          onClick={onSwitcherOpen}
          readOnly
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground cursor-pointer hover:bg-accent transition"
        />
      </div>

      {/* User Avatar */}
      <div className="flex items-center gap-3">
          {
            session?.user.image ? 
            (
              <Image src={session.user.image} alt="User" width={32}
               height={32} />
            )
            :
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          }
      </div>
      <ThemeSwitcher />
    </header>
  );
}