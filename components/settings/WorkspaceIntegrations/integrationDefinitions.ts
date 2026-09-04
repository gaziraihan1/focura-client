import { Github, MessageSquare, Calendar, Trello } from 'lucide-react';
import type { IntegrationDefinition } from './types';

export const WORKSPACE_INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests with workspace tasks',
    icon: Github,
    color: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    features: [
      'Link PRs to workspace tasks',
      'Auto-close tasks on PR merge',
      'Sync issues as tasks',
      'Track commit history per project',
      'Create branches from tasks',
    ],
    category: 'development',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post task updates and receive notifications in team channels',
    icon: MessageSquare,
    color: 'bg-[#4A154B]/10',
    textColor: 'text-[#4A154B] dark:text-[#E01E5A]',
    features: [
      'Post task updates to channels',
      'Create tasks from messages',
      'Receive notifications',
      'Slash commands for quick actions',
      'Daily standup summaries',
    ],
    category: 'communication',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync project deadlines, milestones, and meetings',
    icon: Calendar,
    color: 'bg-[#4285F4]/10',
    textColor: 'text-[#4285F4]',
    features: [
      'Sync project deadlines',
      'Create events for meetings',
      'View tasks in calendar',
      'Automatic reminders',
      'Team availability sync',
    ],
    category: 'productivity',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Import boards and lists into Gablura projects',
    icon: Trello,
    color: 'bg-[#0079BF]/10',
    textColor: 'text-[#0079BF]',
    features: [
      'Import Trello boards',
      'Sync cards as tasks',
      'Map lists to sections',
      'Preserve labels and due dates',
      'Two-way sync option',
    ],
    category: 'project-management',
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  development: 'Development',
  communication: 'Communication',
  productivity: 'Productivity',
  'project-management': 'Project Management',
};
