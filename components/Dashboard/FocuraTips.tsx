export function FocuraTips() {
  const tips = [
    { color: "bg-blue-500", text: "Use workspaces to separate teams or clients. Each has its own members, projects, and billing." },
    { color: "bg-green-500", text: "Labels and priorities make filtering fast. Tag tasks before assigning them to keep things tidy." },
    { color: "bg-pink-500", text: "Daily tasks auto-refresh each morning. Primary tasks carry over; secondary ones reset." },
    { color: "bg-orange-500", text: "Press ⌘K anywhere to switch workspaces or jump to a project instantly." },
  ];

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="text-sm font-medium mb-4">Getting the most out of Focura</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-0 divide-y sm:divide-y-0">
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-3 py-3 sm:py-0">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tip.color}`} />
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}