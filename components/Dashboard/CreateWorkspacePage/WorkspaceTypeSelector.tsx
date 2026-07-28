import { motion } from 'framer-motion';
import { User, Users, Building2, Check } from 'lucide-react';
import type { ElementType } from 'react';

interface WorkspaceType {
  id: string;
  icon: ElementType;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const WORKSPACE_TYPES: WorkspaceType[] = [
  {
    id: 'personal',
    icon: User,
    title: 'Personal',
    description: 'For individual work and personal projects',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'team',
    icon: Users,
    title: 'Team',
    description: 'Collaborate with your team members',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'company',
    icon: Building2,
    title: 'Company',
    description: 'For entire organization',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
];

interface WorkspaceTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

export function WorkspaceTypeSelector({
  selectedType,
  onTypeSelect,
}: WorkspaceTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <label className="text-sm font-semibold text-foreground">
          What kind of workspace?
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WORKSPACE_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onTypeSelect(type.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                  : 'border-border hover:border-primary/30 hover:bg-accent/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type.iconBg}`}>
                  <Icon size={18} className={type.iconColor} />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}
                >
                  {isSelected && <Check size={12} className="text-primary-foreground" strokeWidth={3} />}
                </div>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-0.5">{type.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}