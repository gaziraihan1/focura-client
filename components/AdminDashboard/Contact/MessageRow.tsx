import { formatCategory, formatDate } from "@/app/(dashboard-pages)/admin-dashboard/contact/page";
import { CATEGORY_CLASSES, STATUS_CLASSES } from "@/constants/adminContact.constants";
import { ContactMessage } from "@/hooks/useContactMessage";

export function MessageRow({
  message,
  onClick,
}: {
  message: ContactMessage;
  onClick: () => void;
}) {
  const isUnread = message.status === "UNREAD";

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer hover:bg-accent/50 transition-colors border-b border-border last:border-none"
    >
      {/* Sender */}
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <span
            className={`shrink-0 w-1.5 h-1.5 rounded-full transition-colors ${
              isUnread ? "bg-primary" : "bg-transparent"
            }`}
          />
          <div className="min-w-0">
            <p
              className={`text-sm truncate max-w-40 transition-colors group-hover:text-primary ${
                isUnread ? "font-semibold text-foreground" : "font-medium text-foreground"
              }`}
            >
              {message.name}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-40 mt-0.5">
              {message.email}
            </p>
          </div>
        </div>
      </td>

      {/* Subject */}
      <td className="py-3.5 px-5 hidden md:table-cell">
        <p
          className={`text-sm truncate max-w-65 ${
            isUnread ? "font-medium text-foreground" : "text-muted-foreground"
          }`}
        >
          {message.subject}
        </p>
      </td>

      {/* Category */}
      <td className="py-3.5 px-5 hidden lg:table-cell">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${CATEGORY_CLASSES[message.category]}`}
        >
          {formatCategory(message.category)}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-5">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_CLASSES[message.status]}`}
        >
          {message.status.charAt(0) + message.status.slice(1).toLowerCase()}
        </span>
      </td>

      {/* Date */}
      <td className="py-3.5 px-5 hidden sm:table-cell">
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(message.createdAt)}
        </p>
      </td>

      {/* ID */}
      <td className="py-3.5 px-5 hidden xl:table-cell">
        <code className="text-[10px] font-mono text-muted-foreground truncate max-w-25 block">
          {message.id}
        </code>
      </td>
    </tr>
  );
}