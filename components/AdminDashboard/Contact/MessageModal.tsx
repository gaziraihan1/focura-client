import { formatCategory, formatDate } from "@/app/(dashboard-pages)/admin-dashboard/contact/page";
import { ContactMessage } from "@/hooks/useContactMessage";
import { Calendar, Hash, Mail, Tag, User, X } from "lucide-react";
import { InfoRow } from "./InfoRow";
import { CATEGORY_CLASSES, STATUS_CLASSES } from "@/constants/adminContact.constants";

export function MessageModal({
  message,
  onClose,
}: {
  message: ContactMessage;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card text-card-foreground rounded-xl shadow-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">
              {message.subject}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(message.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender info grid */}
        <div className="p-6 border-b border-border bg-muted/40 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoRow
            icon={<User className="w-3.5 h-3.5" />}
            label="Name"
            value={message.name}
          />
          <InfoRow
            icon={<Mail className="w-3.5 h-3.5" />}
            label="Email"
            value={message.email}
            isEmail
          />
          <InfoRow
            icon={<Hash className="w-3.5 h-3.5" />}
            label="Message ID"
            value={message.id}
            mono
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Status
            </span>
            <span
              className={`inline-flex w-fit items-center px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_CLASSES[message.status]}`}
            >
              {message.status.charAt(0) + message.status.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Category
            </span>
            <span
              className={`inline-flex w-fit items-center px-2.5 py-1 rounded-md text-xs font-semibold ${CATEGORY_CLASSES[message.category]}`}
            >
              {formatCategory(message.category)}
            </span>
          </div>
        </div>

        {/* Subject / body */}
        <div className="p-6">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
            Subject
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {message.subject}
          </p>
          <div className="mt-5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-4 py-3 border border-border leading-relaxed">
            
          <p>
            Message: {message.message}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
