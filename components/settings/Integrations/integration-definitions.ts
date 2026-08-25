import { IntegrationDefinition } from './index';
import { Github, MessageSquare, Calendar, Trello } from 'lucide-react';

export const AVAILABLE_INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests with your tasks',
    icon: Github,
    color: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    features: [
      'Link PRs to tasks',
      'Auto-close tasks on PR merge',
      'Sync issues as tasks',
      'Track commit history',
    ],
    oauthScopes: ['repo', 'read:user'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and update tasks directly from Slack',
    icon: MessageSquare,
    color: 'bg-[#4A154B]/10',
    textColor: 'text-[#4A154B] dark:text-[#E01E5A]',
    features: [
      'Post task updates to channels',
      'Create tasks from messages',
      'Receive notifications',
      'Slash commands',
    ],
    oauthScopes: ['channels:read', 'chat:write', 'commands'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync tasks and deadlines with your calendar',
    icon: Calendar,
    color: 'bg-[#4285F4]/10',
    textColor: 'text-[#4285F4]',
    features: [
      'Sync task deadlines',
      'Create events for meetings',
      'View tasks in calendar',
      'Automatic reminders',
    ],
    oauthScopes: ['calendar.events', 'calendar.readonly'],
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Import boards and lists into Focura projects',
    icon: Trello,
    color: 'bg-[#0079BF]/10',
    textColor: 'text-[#0079BF]',
    features: [
      'Import Trello boards',
      'Sync cards as tasks',
      'Map lists to sections',
      'Preserve labels and due dates',
    ],
    oauthScopes: ['read', 'write'],
  },
];
