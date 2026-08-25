import { Bell } from "lucide-react";

interface NotificationBellButtonProps {
  badge: string | number | null;
  onClick: () => void;
}

export function NotificationBellButton({
  badge,
  onClick,
}: NotificationBellButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-accent transition"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-foreground" />

      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
          {badge}
        </span>
      )}
    </button>
  );
}