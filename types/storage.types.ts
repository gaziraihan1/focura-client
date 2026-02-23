import { LargestFile } from '@/hooks/useStorage';

export interface LargestFilesTableProps {
  files: LargestFile[];
  workspaceId: string;
  isAdmin: boolean;
}

export type FilterType = 'all' | 'images' | 'videos' | 'pdfs' | 'documents' | 'other';

export interface FilterOption {
  value: FilterType;
  label: string;
}