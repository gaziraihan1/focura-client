import { Lightbulb, Keyboard, Tag, RefreshCw } from 'lucide-react';

const tips = [
  {
    icon: Lightbulb,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Workspaces = Teams',
    text: 'Keep teams or clients separate. Each workspace has its own projects, members, and billing.',
  },
  {
    icon: Tag,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    title: 'Label everything',
    text: 'Labels and priorities make filtering a breeze. Tag tasks before you assign them.',
  },
  {
    icon: RefreshCw,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    title: 'Daily tasks reset',
    text: 'Primary tasks carry over each morning. Secondary ones refresh — so you start fresh.',
  },
  {
    icon: Keyboard,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    title: '⌘K power move',
    text: 'Press ⌘K anywhere to switch workspaces, jump to a project, or find anything fast.',
  },
];

export function FocuraTips() {
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Tips to get more done</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${tip.bg}`}>
                <Icon size={14} className={tip.color} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">{tip.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}