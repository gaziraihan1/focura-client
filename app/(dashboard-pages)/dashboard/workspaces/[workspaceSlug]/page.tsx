"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings,
  Users,
  FolderKanban,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Crown,
  Shield,
  UserCircle,
  Activity,
  LucideIcon,
  Mail,
  X,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  useWorkspace,
  useWorkspaceStats,
  useWorkspaceMembers,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/useWorkspace";
import { format } from "date-fns";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.workspaceSlug as string;

  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "members">("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");

  const { data: workspace, isLoading, isError } = useWorkspace(slug);
  const { data: stats } = useWorkspaceStats(workspace?.id || "");
  const { data: members = [] } = useWorkspaceMembers(workspace?.id || "");

  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  const currentMember = members.find((m) => m.user.id === session?.user?.id);
  const currentUserRole = currentMember?.role;
  const isOwner = currentUserRole === "OWNER";
  const isAdmin = currentUserRole === "ADMIN" || isOwner;

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { icon: LucideIcon; color: string; label: string }> = {
      OWNER: { icon: Crown, color: "bg-yellow-500/10 text-yellow-500", label: "Owner" },
      ADMIN: { icon: Shield, color: "bg-purple-500/10 text-purple-500", label: "Admin" },
      MEMBER: { icon: UserCircle, color: "bg-blue-500/10 text-blue-500", label: "Member" },
      GUEST: { icon: UserCircle, color: "bg-gray-500/10 text-gray-500", label: "Guest" },
    };
    return badges[role] || badges.MEMBER;
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      FREE: { color: "bg-gray-500/10 text-gray-500", label: "Free" },
      PRO: { color: "bg-blue-500/10 text-blue-500", label: "Pro" },
      BUSINESS: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
      ENTERPRISE: { color: "bg-orange-500/10 text-orange-500", label: "Enterprise" },
    };
    return badges[plan] || badges.FREE;
  };

  const handleInvite = async () => {
    if (!workspace || !inviteEmail) return;

    try {
      await inviteMember.mutateAsync({
        workspaceId: workspace.id,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (error) {
      console.error("Invite error:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspace || !confirm("Remove this member?")) return;

    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.id,
        memberId,
      });
    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  const handleUpdateRole = async (memberId: string, role: "ADMIN" | "MEMBER" | "GUEST") => {
    if (!workspace) return;

    try {
      await updateMemberRole.mutateAsync({
        workspaceId: workspace.id,
        memberId,
        role,
      });
    } catch (error) {
      console.error("Update role error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Workspace not found</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          This workspace doesn&apos;t exist or you don&apos;t have access to it
        </p>
        <button
          onClick={() => router.push("/dashboard/workspaces")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm sm:text-base"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-0 pb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/dashboard/workspaces")}
            className="p-2 rounded-lg hover:bg-accent transition shrink-0"
            aria-label="Back to workspaces"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-white shadow-lg shrink-0"
              style={{ backgroundColor: workspace.color || "#667eea" }}
            >
              {workspace.logo || workspace.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  {workspace.name}
                </h1>
                <span
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium shrink-0 ${
                    getPlanBadge(workspace.plan).color
                  }`}
                >
                  {getPlanBadge(workspace.plan).label}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                /{workspace.workspaceSlug}
              </p>
            </div>
          </div>
        </div>

        {workspace.description && (
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none pl-11 sm:pl-0 sm:ml-0">
            {workspace.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push(`/dashboard/workspaces/${slug}/projects/new-project`)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">New Project</span>
            <span className="xs:hidden">New Project</span>
          </button>

          {isAdmin && (
            <Link href={`/dashboard/workspaces/${slug}/settings`} className="shrink-0">
              <button 
                className="p-2 rounded-lg hover:bg-accent transition"
                aria-label="Settings"
              >
                <Settings size={20} className="text-muted-foreground" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                <FolderKanban className="text-blue-500" size={16} />
              </div>
              <TrendingUp className="text-muted-foreground" size={12} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
              {stats.totalProjects}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="text-green-500" size={16} />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {stats.completionRate}%
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
              {stats.completedTasks}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10">
                <Clock className="text-orange-500" size={16} />
              </div>
              <AlertCircle className="text-orange-500" size={12} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
              {stats.overdueTasks}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Overdue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
                <Users className="text-purple-500" size={16} />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {workspace.maxMembers} max
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
              {stats.totalMembers}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Members</p>
          </motion.div>
        </div>
      )}

      <div className="border-b border-border -mx-3 sm:mx-0">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide px-3 sm:px-0">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "projects", label: "Projects", icon: FolderKanban },
            { id: "members", label: "Members", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "projects" | "members")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity size={14} className="text-primary sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-foreground truncate">
                        Activity item {i}
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Information
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm text-muted-foreground">Owner</span>
                    <span className="text-xs sm:text-sm text-foreground font-medium truncate max-w-[60%] text-right">
                      {workspace.owner.name || workspace.owner.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm text-muted-foreground">Created</span>
                    <span className="text-xs sm:text-sm text-foreground font-medium">
                      {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm text-muted-foreground">Visibility</span>
                    <span className="text-xs sm:text-sm text-foreground font-medium">
                      {workspace.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Storage
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Used Storage</span>
                      <span className="text-xs sm:text-sm text-foreground font-medium">
                        0 MB / {workspace.maxStorage} MB
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="text-center py-8 sm:py-12 rounded-lg sm:rounded-xl bg-card border border-border">
            <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              Create your first project to get started
            </p>
            <button
              onClick={() => router.push(`/dashboard/workspaces/${slug}/projects/new-project`)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm sm:text-base"
            >
              Create Project
            </button>
          </div>
        )}

        {activeTab === "members" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {isAdmin && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm sm:text-base"
                >
                  <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">Invite Member</span>
                  <span className="xs:hidden">Invite</span>
                </button>
              </div>
            )}

            <div className="rounded-lg sm:rounded-xl bg-card border border-border overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users size={18} className="sm:w-5 sm:h-5" />
                  Team Members ({members.length})
                </h3>
              </div>

              <div className="divide-y divide-border">
                {members.map((member) => {
                  const roleBadge = getRoleBadge(member.role);
                  const RoleIcon = roleBadge.icon;

                  return (
                    <div 
                      key={member.id} 
                      className="p-3 sm:p-4 lg:p-6"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          {member.user.image ? (
                            <Image
                              width={40}
                              height={40}
                              src={member.user.image}
                              alt={member.user.name || "User"}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                              {member.user.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2 truncate">
                              <span className="truncate">{member.user.name || "Anonymous"}</span>
                              {member.role === "OWNER" && (
                                <Crown size={12} className="text-yellow-500 shrink-0 sm:w-3.5 sm:h-3.5" />
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {member.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {member.role !== "OWNER" && isAdmin ? (
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleUpdateRole(member.id, e.target.value as "ADMIN" | "MEMBER" | "GUEST")
                              }
                              disabled={updateMemberRole.isPending}
                              className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-background border border-border text-xs sm:text-sm text-foreground focus:ring-2 ring-primary outline-none disabled:opacity-50"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MEMBER">Member</option>
                              <option value="GUEST">Guest</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 ${roleBadge.color}`}
                            >
                              <RoleIcon size={12} />
                              <span className="hidden xs:inline">{roleBadge.label}</span>
                            </span>
                          )}

                          {member.role !== "OWNER" && isAdmin && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={removeMember.isPending}
                              className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition disabled:opacity-50"
                              aria-label="Remove member"
                            >
                              <X size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invite Modal - Responsive */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-card rounded-lg sm:rounded-xl border border-border w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
              Invite Team Member
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-background border border-border text-sm sm:text-base text-foreground focus:ring-2 ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER" | "GUEST")}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-background border border-border text-sm sm:text-base text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-full sm:w-auto px-4 py-2 sm:py-3 rounded-lg border border-border hover:bg-accent transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviteMember.isPending}
                  className="w-full sm:flex-1 px-4 py-2 sm:py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {inviteMember.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}