import Image from 'next/image';

interface Assignee {
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface TeamTaskAssigneesProps {
  assignees: Assignee[];
}

export function TeamTaskAssignees({ assignees }: TeamTaskAssigneesProps) {
  const visibleAssignees = assignees.slice(0, 4);
  const remainingCount = assignees.length - 4;

  return (
    <div className="flex -space-x-1.5">
      {visibleAssignees.map((assignee) => (
        <div
          key={assignee.user.id}
          title={assignee.user.name}
          className="
            w-6 h-6 rounded-full border-2 border-card
            bg-primary/20 flex items-center justify-center
            text-[10px] font-bold text-primary
            ring-1 ring-primary/10 overflow-hidden
          "
        >
          {assignee.user.image ? (
            <Image
              src={assignee.user.image}
              alt={assignee.user.name}
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          ) : (
            assignee.user.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}