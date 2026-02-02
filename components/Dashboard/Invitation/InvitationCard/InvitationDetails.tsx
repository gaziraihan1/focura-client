import { Clock, Mail, Shield } from "lucide-react";
import { Invitation } from "../InvitationCard";

interface InvitationDetailsProps {
  invitation: Invitation;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "OWNER":
      return "bg-primary/10 text-primary border-primary/20";
    case "ADMIN":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "MEMBER":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    case "GUEST":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function InvitationDetails({
  invitation,
}: InvitationDetailsProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
        <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-0.5">
            Invited Email
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {invitation.email}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
        <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-2">Your Role</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
              invitation.role,
            )}`}
          >
            {invitation.role}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
        <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-0.5">Expires</p>
          <p className="text-sm text-muted-foreground">
            {new Date(invitation.expiresAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
