// components/TaskActivity/ActivityIcon.tsx
import {
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  Users,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

const ICON_MAP = {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Users,
  MessageSquare,
  AlertCircle,
  Circle,
};

interface ActivityIconProps {
  iconName: string;
  className?: string;
}

export function ActivityIcon({ iconName, className = 'h-4 w-4' }: ActivityIconProps) {
  const Icon = ICON_MAP[iconName as keyof typeof ICON_MAP] || Circle;
  return <Icon className={className} />;
}