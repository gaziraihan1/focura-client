// constants/billing-success.constants.ts
import {
  Zap,
  Building2,
  Users,
  HardDrive,
  FolderOpen,
  BarChart2,
  Shield,
  Headphones,
} from 'lucide-react';
import type { PlanMeta, GainedFeature } from '@/types/billing.success.types';

export const PLAN_META: Record<string, PlanMeta> = {
  FREE: {
    label: 'Free',
    icon: null,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    features: {
      members: '5 members',
      storage: '1 GB storage',
      projects: '3 projects',
      meetings: '10 meetings/mo',
      analytics: false,
      api: false,
      support: false,
    },
  },
  PRO: {
    label: 'Pro',
    icon: Zap,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    features: {
      members: '25 members',
      storage: '10 GB storage',
      projects: 'Unlimited projects',
      meetings: 'Unlimited meetings',
      analytics: true,
      api: false,
      support: false,
    },
  },
  BUSINESS: {
    label: 'Business',
    icon: Building2,
    color: 'text-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    features: {
      members: 'Unlimited members',
      storage: '100 GB storage',
      projects: 'Unlimited projects',
      meetings: 'Unlimited meetings',
      analytics: true,
      api: true,
      support: true,
    },
  },
} as const;

export const GAINED_FEATURES: Record<string, GainedFeature[]> = {
  'FREE→PRO': [
    {
      icon: Users,
      label: '5× more members',
      detail: 'Grow your team from 5 to 25 members',
    },
    {
      icon: HardDrive,
      label: '10× more storage',
      detail: 'From 1 GB to 10 GB for your files',
    },
    {
      icon: FolderOpen,
      label: 'Unlimited projects',
      detail: 'No more 3-project cap holding you back',
    },
    {
      icon: Zap,
      label: 'Unlimited meetings',
      detail: 'Hold as many meetings as you need',
    },
    {
      icon: BarChart2,
      label: 'Analytics dashboard',
      detail: 'Track DAU, activity, and workspace growth',
    },
  ],
  'FREE→BUSINESS': [
    {
      icon: Users,
      label: 'Unlimited members',
      detail: 'Scale your team without limits',
    },
    {
      icon: HardDrive,
      label: '100 GB storage',
      detail: '100× more storage than Free',
    },
    {
      icon: FolderOpen,
      label: 'Unlimited projects',
      detail: 'No more 3-project cap holding you back',
    },
    {
      icon: Zap,
      label: 'Unlimited meetings',
      detail: 'Hold as many meetings as you need',
    },
    {
      icon: BarChart2,
      label: 'Advanced analytics',
      detail: 'Full reporting and workspace insights',
    },
    {
      icon: Shield,
      label: 'API access',
      detail: 'Integrate Focura into your own tools',
    },
    {
      icon: Headphones,
      label: 'Priority support',
      detail: 'Skip the queue — dedicated support channel',
    },
  ],
  'PRO→BUSINESS': [
    {
      icon: Users,
      label: 'Unlimited members',
      detail: 'From 25 to unlimited team members',
    },
    {
      icon: HardDrive,
      label: '100 GB storage',
      detail: '10× more storage than Pro',
    },
    {
      icon: Shield,
      label: 'API access',
      detail: 'Integrate Focura into your own tools',
    },
    {
      icon: Headphones,
      label: 'Priority support',
      detail: 'Skip the queue — dedicated support channel',
    },
  ],
};