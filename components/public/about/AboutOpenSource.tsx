import Link from "next/link";
import {
  GitPullRequest,
  BookOpen,
  Heart,
  ExternalLink,
  GitFork,
  GitBranch,
  Terminal,
  FlaskConical,
  Rocket,
  Server,
  ScrollText,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: GitFork,
    title: "Fork the repo",
    detail: "Fork gaziraihan1/gablura-client on GitHub and clone your fork locally.",
    code: "git clone https://github.com/gaziraihan1/gablura-client.git",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "Branch from dev",
    detail:
      "Active development happens on the dev branch — always branch from it and open pull requests against it.",
    code: "git checkout -b feature/your-feature-name dev",
  },
  {
    step: "03",
    icon: Terminal,
    title: "Set up locally",
    detail:
      "Install dependencies, create .env.local from the example, and run the dev server (the backend API runs on :5000).",
    code: "npm install && cp .env.example .env.local && npm run dev",
  },
  {
    step: "04",
    icon: FlaskConical,
    title: "Test & lint",
    detail:
      "Run the quality gates before pushing: ESLint, the Vitest suite (with MSW-mocked API), and the TypeScript typecheck.",
    code: "npm run lint && npm run test:run && npx tsc --noEmit",
  },
  {
    step: "05",
    icon: Rocket,
    title: "Open a Pull Request",
    detail:
      "Push your branch to your fork, then open a PR against dev — describe what changed, how you tested it, and add screenshots for UI work.",
    code: "git push origin feature/your-feature-name",
  },
];

const resources = [
  {
    icon: BookOpen,
    label: "ARCHITECTURE.md",
    description: "System design decisions, data flow, and design patterns.",
    href: "https://github.com/gaziraihan1/gablura-client/blob/main/ARCHITECTURE.md",
  },
  {
    icon: GitPullRequest,
    label: "CONTRIBUTING.md",
    description:
      "Full guidelines for the client: setup, test conventions, and review process.",
    href: "https://github.com/gaziraihan1/gablura-client/blob/main/CONTRIBUTING.md",
  },
  {
    icon: Server,
    label: "Backend Repository",
    description: "The Express + Node.js + Prisma API powering Gablura.",
    href: "https://github.com/gaziraihan1/gablura-backend",
  },
  {
    icon: ScrollText,
    label: "Backend CONTRIBUTING.md",
    description:
      "Backend contribution guide — module architecture, cron jobs, and testing.",
    href: "https://github.com/gaziraihan1/gablura-backend/blob/main/CONTRIBUTING.md",
  },
  {
    icon: Heart,
    label: "CODE_OF_CONDUCT.md",
    description: "Our community standards for respectful collaboration.",
    href: "https://github.com/gaziraihan1/gablura-client/blob/main/CODE_OF_CONDUCT.md",
  },
];

export const AboutOpenSource = () => {
  return (
    <section className="border-t">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Label */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Open Contribution
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Source-available.
            <br />
            <span className="text-muted-foreground">
              Contributions welcome.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
            Gablura is source-available under a custom license. We welcome
            contributions, bug reports, and feature discussions across both the
            client and the backend API.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — contribution steps */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground mb-5">
              How to Contribute
            </p>
            <div className="space-y-3">
              {steps.map(({ step, icon: Icon, title, detail, code }) => (
                <div
                  key={step}
                  className="rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 "
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon
                        className="w-4 h-4 text-muted-foreground"
                        strokeWidth={1.8}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">
                          {title}
                        </p>
                        <span className="shrink-0 text-[10px] font-bold font-mono text-muted-foreground">
                          {step}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {detail}
                      </p>
                    </div>
                  </div>
                  <div className="ml-11">
                    <code className="block text-[11px] font-mono text-foreground bg-muted border rounded-lg px-3 py-2 overflow-x-auto w-full break-all">
                      {code}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — resource links */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground mb-5">
              Documentation &amp; Resources
            </p>
            <div className="space-y-3">
              {resources.map(({ icon: Icon, label, description, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-colors group"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <Icon
                      className="w-4 h-4 text-foreground"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {description}
                    </p>
                  </div>
                  <ExternalLink
                    className="shrink-0 w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-1"
                    strokeWidth={1.8}
                  />
                </Link>
              ))}
            </div>

            {/* Security note */}
            <div className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3.5">
              <p className="text-xs text-destructive leading-relaxed">
                <strong className="font-semibold">Security vulnerabilities</strong> should
                never be reported as public GitHub issues. Email{" "}
                <a
                  href="mailto:focurabusiness@gmail.com"
                  className="underline underline-offset-2 font-medium break-all"
                >
                  focurabusiness@gmail.com
                </a>{" "}
                for responsible disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};