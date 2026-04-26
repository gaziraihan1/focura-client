import Link from "next/link";
import { GitPullRequest, BookOpen, Heart, ExternalLink } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Fork the repo",
    detail: "Fork gaziraihan1/focura-client on GitHub and clone your fork locally.",
    code: "git clone https://github.com/gaziraihan1/focura-client.git",
  },
  {
    step: "02",
    title: "Create a feature branch",
    detail: "Keep changes focused — one branch per feature or fix.",
    code: "git checkout -b feature/your-feature-name",
  },
  {
    step: "03",
    title: "Follow the conventions",
    detail: "TypeScript strict mode, Tailwind v4 utilities (shrink-0 not flex-shrink-0), clear commit messages.",
    code: "npm run lint && npm run dev",
  },
  {
    step: "04",
    title: "Open a Pull Request",
    detail: "Describe your changes clearly, reference related issues, and wait for review.",
    code: "git push origin feature/your-feature-name",
  },
];

const resources = [
  {
    icon: BookOpen,
    label: "ARCHITECTURE.md",
    description: "System design decisions and data flow documentation.",
    href: "https://github.com/gaziraihan1/focura-client/blob/main/ARCHITECTURE.md",
  },
  {
    icon: GitPullRequest,
    label: "CONTRIBUTING.md",
    description: "Full guidelines for contributing code, tests, and docs.",
    href: "https://github.com/gaziraihan1/focura-client/blob/main/CONTRIBUTING.md",
  },
  {
    icon: Heart,
    label: "CODE_OF_CONDUCT.md",
    description: "Our community standards for respectful collaboration.",
    href: "https://github.com/gaziraihan1/focura-client/blob/main/CODE_OF_CONDUCT.md",
  },
  {
    icon: ExternalLink,
    label: "Backend Repository",
    description: "The Express + Node.js + Prisma API powering Focura.",
    href: "https://github.com/gaziraihan1/focura-backend",
  },
];

export const AboutOpenSource = () => {
  return (
    <section className="border-t border-neutral-100 dark:border-neutral-800/60">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        {/* Label */}
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          Open Contribution
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Source-available.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              Contributions welcome.
            </span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed md:text-right">
            Focura is source-available under a custom license. We welcome
            contributions, bug reports, and feature discussions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — contribution steps */}
          <div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-5">
              How to Contribute
            </p>
            <div className="space-y-3">
              {steps.map(({ step, title, detail, code }) => (
                <div
                  key={step}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 text-xs font-bold font-mono text-neutral-300 dark:text-neutral-600 mt-0.5">
                      {step}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {detail}
                      </p>
                    </div>
                  </div>
                  <div className="ml-7">
                    <code className="block text-[11px] font-mono text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 overflow-x-auto">
                      {code}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — resource links */}
          <div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-5">
              Documentation &amp; Resources
            </p>
            <div className="space-y-3">
              {resources.map(({ icon: Icon, label, description, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all group"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                    <Icon
                      className="w-4 h-4 text-neutral-600 dark:text-neutral-300"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-50 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-0.5">
                      {description}
                    </p>
                  </div>
                  <ExternalLink
                    className="shrink-0 w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors mt-1"
                    strokeWidth={1.8}
                  />
                </Link>
              ))}
            </div>

            {/* Security note */}
            <div className="mt-4 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3.5">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong className="font-semibold">Security vulnerabilities</strong> should
                never be reported as public GitHub issues. Email{" "}
                <a
                  href="mailto:focurabusiness@gmail.com"
                  className="underline underline-offset-2 font-medium"
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