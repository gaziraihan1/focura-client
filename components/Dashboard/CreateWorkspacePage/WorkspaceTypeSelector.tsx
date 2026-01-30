import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const WORKSPACE_TYPES = [
  {
    id: "personal",
    icon: "👤",
    title: "Personal",
    description: "For individual work and personal projects",
  },
  {
    id: "team",
    icon: "👥",
    title: "Team",
    description: "Collaborate with your team members",
  },
  {
    id: "company",
    icon: "🏢",
    title: "Company",
    description: "For entire organization",
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
      className="rounded-xl bg-card border border-border p-6"
    >
      <label className="block text-sm font-medium text-foreground mb-4">
        <Sparkles size={16} className="inline mr-2" />
        Workspace Type
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WORKSPACE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeSelect(type.id)}
            className={`p-4 rounded-xl border-2 transition text-left ${
              selectedType === type.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-3xl mb-2">{type.icon}</div>
            <h3 className="font-semibold text-foreground mb-1">
              {type.title}
            </h3>
            <p className="text-xs text-muted-foreground">{type.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}