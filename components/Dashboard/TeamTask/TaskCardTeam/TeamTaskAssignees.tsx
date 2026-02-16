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
  const visibleAssignees = assignees.slice(0, 3);
  const remainingCount = assignees.length - 3;

  return (
    <div className="flex -space-x-2">
      {visibleAssignees.map((assignee) => (
        <div
          key={assignee.user.id}
          className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium"
          title={assignee.user.name}
        >
          {assignee.user.image ? (
            <Image
              src={assignee.user.image}
              alt={assignee.user.name}
              width={20}
              height={20}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            assignee.user.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}