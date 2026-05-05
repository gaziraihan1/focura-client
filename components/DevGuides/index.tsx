import { COLOR_MAP } from "@/lib/devGuides";
import type { ReactNode } from "react";

export { OverviewSection, SetupSection } from "./OverviewSetup";
export { FrontendArchSection, BackendArchSection } from "./ArchSection";
export { AuthSection, ApiLayerSection, DatabaseSection, CachingSection, RealtimeSection } from "./TechSection";
export { AddingFeatureSection, TestingSection, EnvVarsSection, ConventionsSection } from "./WorkflowSection";

export function SectionH({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-foreground mb-3 mt-7 first:mt-0 uppercase tracking-widest">
      {children}
    </h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>;
}

export function InfoCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
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

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3.5 mb-4">
      <span className="text-blue-500 text-sm mt-0.5 shrink-0">💡</span>
      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{children}</p>
    </div>
  );
}

export function Warn({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 mb-4">
      <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠️</span>
      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{children}</p>
    </div>
  );
}

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="mb-4">
      {label && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border border-b-0 rounded-t-lg">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
      )}
      <pre className={`bg-muted border border-border text-xs font-mono leading-relaxed p-4 overflow-x-auto ${label ? "rounded-b-lg rounded-tr-lg" : "rounded-lg"}`}>
        <code className="text-foreground">{children}</code>
      </pre>
    </div>
  );
}

export function IC({ children }: { children: ReactNode }) {
  return (
    <code className="text-xs bg-muted border border-border px-1.5 py-0.5 rounded font-mono text-foreground">
      {children}
    </code>
  );
}

export function Badge({ children, color = "slate" }: { children: ReactNode; color?: string }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.slate;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${c.pill}`}>
      {children}
    </span>
  );
}

export function Step({ num, title, desc }: { num: number; title: string; desc: ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
        {num}
      </div>
      <div className="pb-5 border-b border-border flex-1 last:border-0 last:pb-0">
        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
        <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

export function StepList({ steps }: { steps: Array<{ title: string; desc: ReactNode }> }) {
  return (
    <div className="flex flex-col gap-0 mb-5">
      {steps.map((s, i) => <Step key={i} num={i + 1} title={s.title} desc={s.desc} />)}
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i < rows.length - 1 ? "border-b border-border" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-sm text-muted-foreground font-mono">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FileTree({ children }: { children: string }) {
  return (
    <pre className="bg-muted border border-border rounded-xl p-4 text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto mb-4">
      {children}
    </pre>
  );
}

export function DividerLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function RowList({ items }: { items: Array<{ label: string; desc: string }> }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-4">
      {items.map(({ label, desc }, i) => (
        <div key={label} className={`flex items-start gap-3 px-4 py-3 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
          <span className="text-xs font-mono text-muted-foreground shrink-0 w-44 mt-0.5 truncate">{label}</span>
          <span className="text-sm text-muted-foreground">{desc}</span>
        </div>
      ))}
    </div>
  );
}