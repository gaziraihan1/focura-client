import { Intent, Priority } from "@/types/taskForm.types";
import {
  Brain,
  Zap,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";

export const INTENT_OPTIONS = [
  {
    value: "EXECUTION" as Intent,
    label: "Execution",
    icon: Zap,
    description: "Build, implement, or do hands-on work",
    activeClass: "border-blue-500 bg-blue-500/10 text-blue-500",
  },
  {
    value: "PLANNING" as Intent,
    label: "Planning",
    icon: Brain,
    description: "Think, design, or organize",
    activeClass: "border-purple-500 bg-purple-500/10 text-purple-500",
  },
  {
    value: "REVIEW" as Intent,
    label: "Review",
    icon: AlertCircle,
    description: "Validate, QA, or inspect work",
    activeClass: "border-green-500 bg-green-500/10 text-green-500",
  },
  {
    value: "LEARNING" as Intent,
    label: "Learning",
    icon: Clock,
    description: "Study or research",
    activeClass: "border-amber-500 bg-amber-500/10 text-amber-500",
  },
  {
    value: "COMMUNICATION" as Intent,
    label: "Communication",
    icon: Users,
    description: "Meetings or discussions",
    activeClass: "border-pink-500 bg-pink-500/10 text-pink-500",
  },
] as const;

export const PRIORITY_COLORS: Record<Priority, string> = {
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
};

export const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  priority: "MEDIUM" as Priority,
  status: "TODO" as const,
  dueDate: "",
  estimatedHours: undefined,
  assigneeIds: [],
  labelIds: [],
  intent: "EXECUTION" as Intent,
  energyType: "MEDIUM" as const,
  focusRequired: false,
  focusLevel: 3,
  distractionCost: 1,
};