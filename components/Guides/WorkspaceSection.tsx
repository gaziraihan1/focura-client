import { InfoCard, SectionH, StepList, Tip } from "../ui";

const STEPS = [
  {
    title: "Sign in to Focura",
    desc: "Log in with your account. First-time users are prompted to create a workspace right after signup.",
  },
  {
    title: "Enter a workspace name",
    desc: "Choose a name that represents your team or organization. This will be visible to all members.",
  },
  {
    title: "You're in",
    desc: "Your workspace is ready. You'll land on the dashboard where you can start creating projects and inviting people.",
  },
];

export function WorkspaceSection() {
  return (
    <div>
      <InfoCard icon="⬡" title="What is a workspace?">
        A workspace is your team&apos;s home in Focura. It holds all your projects, members, settings,
        and activity. Everyone on your team works inside the same workspace.
      </InfoCard>

      <SectionH>Creating a workspace</SectionH>
      <StepList steps={STEPS} />

      <Tip>
        The person who creates a workspace automatically becomes its <strong>Owner</strong> with full
        administrative control.
      </Tip>

      <SectionH>Workspace settings</SectionH>
      <InfoCard icon="⚙️" title="What you can configure">
        Go to{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">Settings</code> to update
        the workspace name, manage billing, configure notifications, view activity logs, and control
        member access. Only Owners and Admins can access most settings.
      </InfoCard>
    </div>
  );
}