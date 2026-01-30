interface KanbanInsightsButtonProps {
  showInsights: boolean;
  onToggle: () => void;
}

export function KanbanInsightsButton({
  showInsights,
  onToggle,
}: KanbanInsightsButtonProps) {
  if (showInsights) return null;

  return (
    <button
      onClick={onToggle}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium z-10"
    >
      Show Insights
    </button>
  );
}