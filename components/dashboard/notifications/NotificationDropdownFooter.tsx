import Link from "next/link";

interface NotificationDropdownFooterProps {
  onClose: () => void;
}

export function NotificationDropdownFooter({
  onClose,
}: NotificationDropdownFooterProps) {
  return (
    <div className="p-3 text-center border-t border-border">
      <Link
        href="/dashboard/notifications"
        className="text-sm text-primary hover:underline font-medium"
        onClick={onClose}
      >
        View all notifications
      </Link>
    </div>
  );
}