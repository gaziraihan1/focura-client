import { Users, User } from "lucide-react";
import UserAvatar from "./UserAvatar";

interface TaskUser {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
}

interface Assignee {
  user: TaskUser;
}

interface TaskPeopleSectionProps {
  createdBy: TaskUser;
  assignees: Assignee[];
}

export function TaskPeopleSection({
  createdBy,
  assignees,
}: TaskPeopleSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">People</h3>
      </div>
      <div className="space-y-3 pl-6">
        {/* Creator */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Created by</div>
          <div className="flex items-center gap-2">
            <UserAvatar name={createdBy.name} image={createdBy.image} />
            <span className="text-sm font-medium text-foreground">
              {createdBy.name}
            </span>
          </div>
        </div>

        {/* Assignees */}
        {assignees.length > 0 ? (
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              Assigned to
            </div>
            <div className="flex flex-wrap gap-2">
              {assignees.map((assignee) => (
                <div
                  key={assignee.user.id}
                  className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                >
                  <UserAvatar
                    name={assignee.user.name}
                    image={assignee.user.image}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {assignee.user.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600 font-medium">
              Personal Task
            </span>
          </div>
        )}
      </div>
    </div>
  );
}