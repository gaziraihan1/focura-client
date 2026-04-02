import { cn } from '@/lib/utils';
import { EDITOR_TOOLS } from '@/constants/announcement.constants';
import type { EditorTool } from '@/types/announcement.types';

interface EditorToolbarProps {
  disabled: boolean;
  onApplyFormat: (tool: EditorTool) => void;
}

export function EditorToolbar({ disabled, onApplyFormat }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/50 border border-border/60 w-fit">
      {EDITOR_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            disabled={disabled}
            onClick={() => onApplyFormat(tool)}
            title={tool.label}
            className={cn(
              'p-1.5 rounded-md text-muted-foreground',
              'hover:text-foreground hover:bg-background',
              'transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        );
      })}

      <div className="h-4 w-px bg-border mx-1" />
      <span className="text-[10px] text-muted-foreground/60 px-1 font-mono select-none hidden sm:block">
        **b** //i// $$mono$$ &#x7B;url&#x7D; &gt;
      </span>
    </div>
  );
}