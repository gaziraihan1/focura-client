import type { Metadata } from "next";
import { AboutHero } from "@/components/About/AboutHero";
import { AboutMission } from "@/components/About/AboutMission";
import { AboutFeatures } from "@/components/About/AboutFeatures";
import { AboutStack } from "@/components/About/AboutStack";
import { AboutArchitecture } from "@/components/About/AboutArchitecture";
import { AboutFounder } from "@/components/About/AboutFounder";
import { AboutValues } from "@/components/About/AboutValues";
import { AboutOpenSource } from "@/components/About/AboutOpenSource";
import { AboutCTA } from "@/components/About/AboutCTA";
export const metadata: Metadata = {
  title: "About | Focura",
  description:
    "Learn about Focura — a modern productivity and collaboration SaaS built with Next.js 16, React 19, TypeScript, and Tailwind v4. Built by Mohammad Raihan Gazi.",
  openGraph: {
    title: "About Focura",
    description:
      "Focus Smarter. Manage Workspaces, Projects & Teams. Meet the stack, architecture, and founder behind Focura.",
    url: "https://focura-client.vercel.app/about",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Focura",
    description:
      "Focus Smarter. Manage Workspaces, Projects & Teams. Next.js 16 · React 19 · TypeScript · Tailwind v4.",
  },
};

/**
 * /about — Public page
 *
 * Sections (all server components except where noted):
 * 1. AboutHero          — tagline, version badge, live stats, CTAs
 * 2. AboutMission       — the problem Focura solves + 3 core pillars
 * 3. AboutFeatures      — 8 feature areas from the real README
 * 4. AboutStack         — full tech stack with versions, grouped by category
 * 5. AboutArchitecture  — 3-layer diagram + request lifecycle + SSE + auth flow
 * 6. AboutFounder       — Mohammad Raihan Gazi, profile card, repo stats
 * 7. AboutValues        — 6 engineering principles baked into the codebase
 * 8. AboutOpenSource    — contribution guide + documentation resource links
 * 9. AboutCTA           — final call-to-action with live app + GitHub + contact
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AboutHero />
      <AboutMission />
      <AboutFeatures />
      <AboutStack />
      <AboutArchitecture />
      <AboutFounder />
      <AboutValues />
      <AboutOpenSource />
      <AboutCTA />
    </div>
  );
};

export default AboutPage;