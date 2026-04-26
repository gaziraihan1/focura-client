import { Target, Lightbulb, Users } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Clarity Over Chaos",
    body: "Most teams don't fail because they lack tools — they fail because their tools add noise instead of removing it. Focura is built around the principle that every feature must reduce cognitive load, not add to it.",
  },
  {
    icon: Lightbulb,
    title: "Protect Deep Work",
    body: "Shallow busyness is the enemy of meaningful progress. Focura ships with built-in Focus Sessions (Pomodoro, deep work, custom) so your team can carve out uninterrupted time in a world of constant pings.",
  },
  {
    icon: Users,
    title: "Built for Real Teams",
    body: "Not solo todo lists. Focura is workspace-first — with role-based access, real-time collaboration via SSE, team analytics, and activity feeds that keep everyone aligned without micromanagement.",
  },
];

export const AboutMission = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
      {/* Label */}
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
        Why Focura Exists
      </p>

      {/* Mission statement */}
      <div className="max-w-3xl mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight mb-5">
          The modern team is overloaded.
          <br />
          <span className="text-neutral-400 dark:text-neutral-500">
            Focura is the answer.
          </span>
        </h2>
        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Scattered tasks. Siloed projects. Endless context-switching.
          Productivity tools promised to fix these problems but instead became
          part of them. Focura was built from scratch to address this — a
          focused, opinionated platform that helps teams see what matters, work
          on it without interruption, and track meaningful progress.
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-shadow">
              <Icon
                className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-300"
                strokeWidth={1.8}
              />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};