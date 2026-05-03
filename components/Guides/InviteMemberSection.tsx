import { FeatureList, InfoCard, SectionH, StepList, Tip, Warn } from "../ui";

// ── Inviting Members ──────────────────────────────────────────────────────────

const INVITE_STEPS = [
  {
    title: "Go to Settings → Members",
    desc: "Only Owners and Admins can access the Members settings page.",
  },
  {
    title: 'Click "Invite Member"',
    desc: "Opens the invitation form where you enter the recipient's email address.",
  },
  {
    title: "Select a role",
    desc: "Choose between Admin and Member. The role determines what the person can do once they join. You can change it later.",
  },
  {
    title: "Send the invite",
    desc: "Focura sends an email with a join link. The invite is valid until the person accepts it.",
  },
  {
    title: "Member joins",
    desc: "Once they click the link and sign in (or sign up), they're added to your workspace automatically.",
  },
];

const INVITE_FEATURES = [
  "Pending invites are listed separately so you can track who hasn't joined yet",
  "You can resend an invite if the original email was missed",
  "Cancel a pending invite at any time before it's accepted",
  "Invited members receive workspace notifications as soon as they join",
];

export function InviteMembersSection() {
  return (
    <div>
      <InfoCard icon="✉️" title="How workspace invitations work">
        Inviting someone to your workspace gives them access to all projects they&apos;re assigned to,
        the announcements feed, and the tools available at their role level. They don&apos;t need an
        existing Focura account — they can sign up when they accept the invite.
      </InfoCard>

      <SectionH>Inviting a member step by step</SectionH>
      <StepList steps={INVITE_STEPS} />

      <Tip>
        New members only see projects they&apos;ve been explicitly assigned to. Make sure to add them to
        the relevant projects after they join.
      </Tip>

      <SectionH>Managing pending invites</SectionH>
      <FeatureList items={INVITE_FEATURES} />

      <SectionH>Removing a member</SectionH>
      <InfoCard icon="🚪" title="Removing access">
        Go to <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">Settings → Members</code>,
        find the member, and select <strong>Remove</strong>. They lose access to the workspace
        immediately. Their past task contributions and comments remain intact in the history.
      </InfoCard>

      <Warn>
        Removing a member does not automatically reassign their open tasks. Review and reassign any
        in-progress work before removing someone from the workspace.
      </Warn>
    </div>
  );
}
