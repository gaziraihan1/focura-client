import { Users } from "lucide-react";
import Image from "next/image";

interface ProjectMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface ProjectCardMembersProps {
  members: ProjectMember[];
  totalMembers: number;
}

export function ProjectCardMembers({ members, totalMembers }: ProjectCardMembersProps) {
  if (members.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users size={14} />
        <span>No members</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className="flex -space-x-2">
        {members.slice(0, 3).map((member, idx) => (
          <div
            key={member.user.id}
            className="relative"
            style={{ zIndex: 3 - idx }}
          >
            {member.user.image ? (
              <Image
                width={24}
                height={24}
                src={member.user.image}
                alt={member.user.name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-card"
              />
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium">
                {member.user.name.charAt(0)}
              </div>
            )}
          </div>
        ))}
      </div>
      {totalMembers > 3 && (
        <span className="text-xs text-muted-foreground ml-1">
          +{totalMembers - 3}
        </span>
      )}
    </div>
  );
}