import { FeatureList, InfoCard, SectionH, StepList, Tip, Warn } from "../ui";

// ── Focus Mode ────────────────────────────────────────────────────────────────

const FOCUS_STEPS = [
  { title: "Open a task", desc: "Navigate to any task you want to work on." },
  {
    title: 'Click "Start Focus Session"',
    desc: "Activates Focus Mode for that task. The persistent banner appears at the top of every page.",
  },
  {
    title: "Work on your task",
    desc: "Navigate freely through Focura — the banner follows you across pages so you never lose context.",
  },
  {
    title: "End the session",
    desc: 'Click "End Session" in the banner when you\'re done. Your session stats are saved automatically.',
  },
];

export function FocusSection() {
  return (
    <div>
      <InfoCard icon="◐" title="What is Focus Mode?">
        Focus Mode lets you lock in on a single task during a timed work session. A banner stays at
        the top of the screen as you navigate Focura, keeping your active task visible and
        front-of-mind.
      </InfoCard>

      <SectionH>Starting a focus session</SectionH>
      <StepList steps={FOCUS_STEPS} />

      <SectionH>Focus stats</SectionH>
      <InfoCard icon="📊" title="Track your deep work over time">
        Focura tracks your focus sessions over time. View total focus time, sessions completed, and
        daily averages in your personal stats dashboard. Stats refresh every 30 seconds during an
        active session.
      </InfoCard>

      <Tip>
        Focus Mode works across all pages — you can check other tasks, read announcements, or reply
        to comments without losing your active session.
      </Tip>
    </div>
  );
}

// ── Meetings ──────────────────────────────────────────────────────────────────

const MEETING_STEPS = [
  { title: "Open Meetings", desc: "Navigate to the Meetings section from the sidebar." },
  {
    title: "Create a new meeting",
    desc: 'Click "New Meeting" and fill in the title, date, time, and agenda.',
  },
  {
    title: "Add participants",
    desc: "Select the workspace members who should attend. They'll receive a Focura notification about the scheduled meeting.",
  },
];

const MEETING_FEATURES = [
  "Participants are notified via Focura when a meeting is scheduled",
  "Meetings link back to the relevant project for easy context switching",
  "View upcoming and past meetings in a chronological list",
  "Meeting notifications include a direct link using the workspace slug",
];

export function MeetingsSection() {
  return (
    <div>
      <InfoCard icon="◇" title="What are meetings?">
        The Meetings module lets you schedule and track team meetings directly in Focura. Meetings
        attach to workspaces or projects so context is always close to your work.
      </InfoCard>

      <SectionH>Scheduling a meeting</SectionH>
      <StepList steps={MEETING_STEPS} />

      <SectionH>What you get</SectionH>
      <FeatureList items={MEETING_FEATURES} />
    </div>
  );
}

// ── Feature Voting ────────────────────────────────────────────────────────────

const VOTING_STEPS = [
  {
    title: "Go to Feature Voting",
    desc: "Find the Feature Voting section in the workspace navigation.",
  },
  {
    title: "Submit your idea",
    desc: "Write a clear title and description for the feature or improvement you're proposing.",
  },
  {
    title: "Gather votes",
    desc: "Other team members can vote for your request. Vote counts update instantly so results feel real-time.",
  },
];

const VOTING_TIPS = [
  "Be specific in your request — the clearer the idea, the more votes it tends to attract",
  "Vote on others' ideas to help surface what matters most to the team",
  "Admins track the most-voted items when planning upcoming work",
];

export function VotingSection() {
  return (
    <div>
      <InfoCard icon="▲" title="What is Feature Voting?">
        Feature Voting lets team members propose ideas and vote on them. It helps leadership
        prioritize what to build next based on real team input — not guesswork.
      </InfoCard>

      <SectionH>Submitting a feature request</SectionH>
      <StepList steps={VOTING_STEPS} />

      <Tip>
        Admins can mark items as &quot;Planned&quot; or &quot;Completed&quot; once acted on, keeping
        the voting board clean and up to date.
      </Tip>

      <SectionH>Voting tips</SectionH>
      <FeatureList items={VOTING_TIPS} />
    </div>
  );
}

// ── Billing ───────────────────────────────────────────────────────────────────

const BILLING_STEPS = [
  {
    title: "Open Settings → Billing",
    desc: "Only the workspace Owner has access to this page.",
  },
  {
    title: "Select a new plan",
    desc: "Review the available plans and click the one you want to switch to.",
  },
  {
    title: "Confirm the change",
    desc: "Billing is handled securely via Stripe. Your new plan takes effect immediately and your invoice is prorated.",
  },
];

export function BillingSection() {
  return (
    <div>
      <InfoCard icon="◆" title="Accessing billing">
        Only the workspace Owner can access billing settings. Go to{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">Settings → Billing</code>{" "}
        to view your current plan, manage payment methods, and see past invoices.
      </InfoCard>

      <SectionH>Changing your plan</SectionH>
      <StepList steps={BILLING_STEPS} />

      <Warn>
        Downgrading may reduce the number of projects or members your workspace can have. Review
        limits carefully before confirming a downgrade.
      </Warn>

      <SectionH>Invoices</SectionH>
      <InfoCard icon="🧾" title="Download past invoices">
        All past invoices are listed in the Billing section. Click any invoice to download a PDF
        copy for your records. Invoices are generated automatically at the start of each billing
        cycle.
      </InfoCard>
    </div>
  );
}