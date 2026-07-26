import { Github, Tag } from 'lucide-react';

interface GitHubLabelsProps {
  labels: string[];
}

const LABEL_COLORS: Record<string, string> = {
  bug: 'bg-red-500/10 text-red-500 border-red-500/20',
  enhancement: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  feature: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  documentation: 'bg-green-500/10 text-green-500 border-green-500/20',
  'good first issue': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'help wanted': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'high priority': 'bg-red-500/10 text-red-500 border-red-500/20',
  'low priority': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  question: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  wontfix: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  duplicate: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

function getLabelColor(label: string): string {
  const normalizedLabel = label.toLowerCase();
  return LABEL_COLORS[normalizedLabel] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
}

export function GitHubLabels({ labels }: GitHubLabelsProps) {
  if (!labels || labels.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Github size={16} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1.5">Labels</p>
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getLabelColor(label)}`}
            >
              <Tag size={8} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
