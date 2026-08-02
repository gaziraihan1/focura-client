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
  keywords: [
    "focura about",
    "focura team",
    "productivity platform",
    "workspace management",
    "nextjs saas",
  ],
  openGraph: {
    title: "About Focura – Focus Smarter. Manage Workspaces, Projects & Teams",
    description:
      "Meet the stack, architecture, and founder behind Focura. A modern productivity platform built with Next.js 16, React 19, TypeScript, and Tailwind v4.",
    url: "https://focura-client.vercel.app/about",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Focura – Focus Smarter. Manage Workspaces, Projects & Teams",
    description:
      "Meet the stack, architecture, and founder behind Focura. Next.js 16 · React 19 · TypeScript · Tailwind v4.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/about",
  },
};

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