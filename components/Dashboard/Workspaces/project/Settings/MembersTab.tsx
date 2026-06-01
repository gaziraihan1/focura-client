import AddMemberModal from "@/components/Dashboard/ProjectDetails/AddMemberModal";
import { RoleDropdown } from "./RoleDropdown";
import { Loader2, Users, Search, UserPlus } from "lucide-react";
import { Avatar } from "./Avatar";
import { ProjectDetails, useUpdateProjectMemberRole,ProjectRole, ProjectMember, useRemoveProjectMember } from "@/hooks/useProjects";
import { useState, useMemo, useCallback } from "react"
import { useTeamMembers } from "@/hooks/useTeam";

function roleWeight(role: ProjectRole) {
  return role === "MANAGER" ? 0 : role === "COLLABORATOR" ? 1 : 2;
}
export function MembersTab({
  project,
  canManage,
  userId,
}: {
  project?: ProjectDetails;
  canManage: boolean;
  userId: string | undefined;
}) {
  const [search,     setSearch]     = useState("");
  const [removing,   setRemoving]   = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false)

 const members = useMemo<ProjectMember[]>(
  () => project?.members ?? [],
  [project?.members]
);
  const updateProjectMember = useUpdateProjectMemberRole()
  const { data: workspaceMembers = [] } = useTeamMembers(project?.workspaceId || undefined);

  const sorted = useMemo(() => {
    return [...members].sort((a, b) => roleWeight(a.role) - roleWeight(b.role));
  }, [members]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (m) =>
        m.user?.name?.toLowerCase().includes(q) ||
        m.user?.email?.toLowerCase().includes(q)
    );
  }, [sorted, search]);

  const handleChangeRole = useCallback(async (memberId: string, role: ProjectRole) => {
    setRoleChanging(memberId);
    try {
      if(!memberId || !role || !project?.id) return
      await updateProjectMember.mutateAsync({
      projectId: project.id,
      memberId: memberId,
      role: role ,
    });
    } finally {
      setRoleChanging(null);
    }
  }, [project?.id, updateProjectMember]);
  const removeProjectMember = useRemoveProjectMember()

  const handleRemove = useCallback(async (memberId: string) => {
    if (!project?.id) return;
    setRemoving(memberId);
    try {
      await removeProjectMember.mutateAsync({ projectId: project.id, memberId });
    } finally {
      setRemoving(null);
    }
  }, [project?.id, removeProjectMember]);

  const managerCount = members.filter((m) => m.role === "MANAGER").length;

  return (
    <div className="space-y-5">
 
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: members.length,                          color: "text-foreground" },
          { label: "Managers", value: managerCount,                             color: "text-violet-600 dark:text-violet-400" },
          { label: "Members",  value: members.length - managerCount, color: "text-blue-600 dark:text-blue-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card px-4 py-3 text-center"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 font-semibold">
              {s.label}
            </p>
          </div>
        ))}
      </div>
 
      {/* Search + Add Member */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground
                       placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>
        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        )}
      </div>
 
      {/* Member list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center">
            <Users size={28} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              {search ? "No members match your search." : "No members yet."}
            </p>
          </div>
        ) : (
          filtered.map((m) => {
            const isSelf  = m.userId === userId || m.user?.id === userId;
            const loading = removing === m.userId || roleChanging === m.userId;
 
            return (
              <div
                key={m.userId}
                className={[
                  "flex items-center gap-3 px-4 py-3.5 transition-colors",
                  loading ? "opacity-50" : "hover:bg-muted/20",
                ].join(" ")}
              >
                {/* Avatar */}
                <Avatar
                  name={m.user?.name}
                  image={m.user?.image}
                  size="md"
                  color={
                    m.role === "MANAGER"      ? "#8b5cf620" :
                    m.role === "COLLABORATOR" ? "#3b82f620" : undefined
                  }
                />
 
                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {m.user?.name ?? "Unknown"}
                    </p>
                    {isSelf && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  {m.user?.email && (
                    <p className="text-[11px] text-muted-foreground truncate">{m.user.email}</p>
                  )}
                </div>
 
                {/* Loading spinner or role dropdown */}
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                ) : (
                  <RoleDropdown
                    current={m.role}
                    memberId={m.userId}  // target user's userId — backend uses composite key projectId_userId
                    canManage={canManage && (!isSelf || m.role !== "MANAGER")}
                    isSelf={isSelf}
                    onChangeRole={handleChangeRole}
                    onRemove={handleRemove}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
 
      {!canManage && (
        <p className="text-xs text-center text-muted-foreground">
          Only project managers and workspace admins can manage members.
        </p>
      )}
 
      {/* Add Member Modal */}
      {showAddModal && project?.id && (
        <AddMemberModal
          projectId={project.id}
          workspaceMembers={workspaceMembers.map((m) => ({
            id:     m.id,
            userId: m.id,
            user:   { id: m.id, name: m.name, email: m.email ?? "", image: m.image ?? undefined },
          }))}
          existingMemberIds={members.map((m) => m.userId)}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}