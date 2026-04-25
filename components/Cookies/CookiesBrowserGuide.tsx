import { ExternalLink } from "lucide-react";

const browsers = [
  {
    name: "Google Chrome",
    shortcut: "chrome://settings/cookies",
    steps: "Settings → Privacy and security → Third-party cookies",
    url: "https://support.google.com/chrome/answer/95647",
  },
  {
    name: "Mozilla Firefox",
    shortcut: "about:preferences#privacy",
    steps: "Preferences → Privacy & Security → Cookies and Site Data",
    url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
  },
  {
    name: "Apple Safari",
    shortcut: "Safari → Settings",
    steps: "Settings → Privacy → Manage Website Data",
    url: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac",
  },
  {
    name: "Microsoft Edge",
    shortcut: "edge://settings/privacy",
    steps: "Settings → Cookies and site permissions → Manage and delete cookies",
    url: "https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge",
  },
];

export const CookiesBrowserGuide = () => {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {browsers.map(({ name, shortcut, steps, url }) => (
        <div
          key={name}
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 space-y-2"
        >
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {name}
          </p>
          <p className="text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 rounded-lg px-2.5 py-1.5">
            {shortcut}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {steps}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
          >
            Official guide
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      ))}
    </div>
  );
};