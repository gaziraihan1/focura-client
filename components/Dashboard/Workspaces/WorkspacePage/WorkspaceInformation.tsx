import { format } from 'date-fns';
import { User, Calendar, Globe, Lock } from 'lucide-react';

interface WorkspaceInformationProps {
    name: string | null;
    email?: string;
    createdAt: string;
    isPublic: boolean;
}

export default function WorkspaceInformation({name, email, createdAt, isPublic}: WorkspaceInformationProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Information</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <User size={14} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Owner</p>
            <p className="text-sm font-medium text-foreground truncate">
              {name || email || 'Unknown'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Calendar size={14} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Created</p>
            <p className="text-sm font-medium text-foreground">
              {format(new Date(createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            {isPublic ? (
              <Globe size={14} className="text-muted-foreground" />
            ) : (
              <Lock size={14} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Visibility</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {isPublic ? 'Public' : 'Private'}
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isPublic
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isPublic ? 'Visible to everyone' : 'Members only'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
