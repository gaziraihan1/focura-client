// constants/announcement-editor.constants.ts
import { Bold, Italic, Code2, Link2, CornerDownLeft } from 'lucide-react';
import type { EditorTool } from '@/types/announcement.types';

export const EDITOR_TOOLS: readonly EditorTool[] = [
  {
    id: 'bold',
    icon: Bold,
    label: 'Bold  **text**',
    wrap: ['**', '**'],
    sample: 'bold text',
  },
  {
    id: 'italic',
    icon: Italic,
    label: 'Italic  //text//',
    wrap: ['//', '//'],
    sample: 'italic text',
  },
  {
    id: 'mono',
    icon: Code2,
    label: 'Mono  $$text$$',
    wrap: ['$$', '$$'],
    sample: 'code',
  },
  {
    id: 'link',
    icon: Link2,
    label: 'Link  {url|label}',
    wrap: ['{', '|label}'],
    sample: 'https://example.com',
  },
  {
    id: 'break',
    icon: CornerDownLeft,
    label: 'New line  >',
    insert: '>',
    wrap: null,
    sample: '',
  },
] as const;

export const CHARACTER_LIMITS = {
  WARNING: 7000,
  DANGER: 9000,
  MAX: 10000,
} as const;