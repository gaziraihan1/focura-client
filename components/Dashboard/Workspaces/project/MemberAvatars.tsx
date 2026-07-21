import Image from "next/image";

export function MemberAvatars({
  members,
  max = 5,
}: {
  members: Array<{ user?: { name?: string; image?: string | null } | null; userId?: string }>;
  max?: number;
}) {
  const visible = members.slice(0, max);
  const rest = members.length - max;

  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div
          key={m.userId ?? i}
          className="w-7 h-7 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] font-bold text-foreground -ml-2 first:ml-0 ring-1 ring-border overflow-hidden"
          title={m.user?.name ?? "Member"}
        >
          {m.user?.image ? (
            <Image
              src={m.user.image}
              alt={m.user.name ?? ""}
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          ) : (
            (m.user?.name?.charAt(0) ?? "?").toUpperCase()
          )}
        </div>
      ))}
      {rest > 0 && (
        <div className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground -ml-2">
          +{rest}
        </div>
      )}
    </div>
  );
}