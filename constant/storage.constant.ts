import { StorageBreakdown } from "@/hooks/useStorage";
import { FilterOption } from "@/types/storage.types";
import { Building2, Crown, FileText, Folder, FolderOpen, Zap } from "lucide-react";
interface StorageBreakdownProps {
    breakdown: StorageBreakdown
}
export function storageBreakdown ({breakdown}: StorageBreakdownProps) {

    const {attachments, total, projectFiles, workspaceFiles} = breakdown
    const data = [
       {
         label: 'Task Attachments',
         value: attachments,
         percentage: total > 0 ? Math.round((attachments / total) * 100) : 0,
         color: 'bg-blue-500',
         icon: FileText,
         description: 'Files attached to tasks',
       },
       {
         label: 'Project Files',
         value: projectFiles,
         percentage: total > 0 ? Math.round((projectFiles / total) * 100) : 0,
         color: 'bg-purple-500',
         icon: FolderOpen,
         description: 'Files in projects',
       },
       {
         label: 'Workspace Files',
         value: workspaceFiles,
         percentage: total > 0 ? Math.round((workspaceFiles / total) * 100) : 0,
         color: 'bg-green-500',
         icon: Folder,
         description: 'General workspace files',
       },
     ];
     return {data}
}


export const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Files' },
  { value: 'images', label: 'Images' },
  { value: 'videos', label: 'Videos' },
  { value: 'pdfs', label: 'PDFs' },
  { value: 'documents', label: 'Documents' },
  { value: 'other', label: 'Other' },
];

export const plans = [
    {
      name: 'FREE',
      icon: Building2,
      description: 'For small teams getting started',
    },
    {
      name: 'PRO',
      icon: Zap,
      description: 'For growing teams and projects',
      popular: true,
    },
    {
      name: 'BUSINESS',
      icon: Crown,
      description: 'For established organizations',
    },
    {
      name: 'ENTERPRISE',
      icon: Crown,
      description: 'For large-scale operations',
    },
  ];