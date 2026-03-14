import { Brain, Zap, AlertCircle, Clock, Users } from "lucide-react";

export const INTENT_OPTIONS = [
  {
    value: "EXECUTION",
    label: "Execution",
    icon: Zap,
    description: "Build, implement, or do hands-on work",
    activeClass: "border-blue-500 bg-blue-500/10 text-blue-500",
  },
  {
    value: "PLANNING",
    label: "Planning",
    icon: Brain,
    description: "Think, design, or organize",
    activeClass: "border-purple-500 bg-purple-500/10 text-purple-500",
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: AlertCircle,
    description: "Validate, QA, or inspect work",
    activeClass: "border-green-500 bg-green-500/10 text-green-500",
  },
  {
    value: "LEARNING",
    label: "Learning",
    icon: Clock,
    description: "Study or research",
    activeClass: "border-amber-500 bg-amber-500/10 text-amber-500",
  },
  {
    value: "COMMUNICATION",
    label: "Communication",
    icon: Users,
    description: "Meetings or discussions",
    activeClass: "border-pink-500 bg-pink-500/10 text-pink-500",
  },
] as const;

export const ENERGY_OPTIONS = [
  {
    value: "LOW",
    label: "Low",
    className: "border-green-500 bg-green-500/10 text-green-500",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    className: "border-blue-500 bg-blue-500/10 text-blue-500",
  },
  {
    value: "HIGH",
    label: "High",
    className: "border-red-500 bg-red-500/10 text-red-500",
  },
] as const;

export const PRIORITY_COLORS = {
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
} as const;