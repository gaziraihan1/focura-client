import { memo } from "react";
import { Button } from "@/components/ui/Button";

interface KanbanInsightsButtonProps {
  showInsights: boolean;
  onToggle: () => void;
}

export const KanbanInsightsButton = memo(function KanbanInsightsButton({
  showInsights,
  onToggle,
}: KanbanInsightsButtonProps) {
  if (showInsights) return null;

  return (
    <Button
      variant="outline"
      onClick={onToggle}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:bg-card transition-colors text-sm font-medium z-10"
    >
      Show Insights
    </Button>
  );
});