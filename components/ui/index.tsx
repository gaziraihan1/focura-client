import { COLOR_MAP } from "@/constants/guides.constants";
import type { ReactNode } from "react";

// ── Step ─────────────────────────────────────────────────────────────────────

interface StepProps {
  num: number;
  title: string;
  desc: string;
}

export function Step({ num, title, desc }: StepProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
        {num}
      </div>
      <div className="pb-5 border-b border-border flex-1 last:border-0 last:pb-0">
        <p className="text-sm font-medium text-foreground mb-0.5">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── InfoCard ──────────────────────────────────────────────────────────────────

interface InfoCardProps {
  icon: string;
  title: string;
  children: ReactNode;
}

export function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

// ── Tip ───────────────────────────────────────────────────────────────────────

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3.5 mb-3">
      <span className="text-blue-500 text-sm mt-0.5 shrink-0">💡</span>
      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{children}</p>
    </div>
  );
}

// ── Warn ──────────────────────────────────────────────────────────────────────

export function Warn({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 mb-3">
      <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠️</span>
      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{children}</p>
    </div>
  );
}

// ── SectionH ─────────────────────────────────────────────────────────────────

export function SectionH({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground mb-3 mt-6 first:mt-0 uppercase tracking-wider">
      {children}
    </h3>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

export function Badge({ children, color = "slate" }: BadgeProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.slate;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${c.pill}`}>
      {children}
    </span>
  );
}

// ── FeatureRow ────────────────────────────────────────────────────────────────

export function FeatureRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0">
      <span className="text-emerald-500 text-xs mt-0.5 shrink-0">✓</span>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

// ── StepList ──────────────────────────────────────────────────────────────────
// Convenience wrapper so sections don't need the mb-6 div boilerplate

interface StepListProps {
  steps: Array<{ title: string; desc: string }>;
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="flex flex-col gap-0 mb-6">
      {steps.map((s, i) => (
        <Step key={i} num={i + 1} title={s.title} desc={s.desc} />
      ))}
    </div>
  );
}

// ── FeatureList ───────────────────────────────────────────────────────────────

export function FeatureList({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-4">
      {items.map((item) => (
        <FeatureRow key={item}>{item}</FeatureRow>
      ))}
    </div>
  );
}