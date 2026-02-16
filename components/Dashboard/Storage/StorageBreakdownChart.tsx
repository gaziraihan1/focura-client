'use client';

import { motion } from 'framer-motion';
import { FileText, Folder, FolderOpen } from 'lucide-react';
import { StorageBreakdown } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface StorageBreakdownChartProps {
  breakdown: StorageBreakdown;
}

export function StorageBreakdownChart({ breakdown }: StorageBreakdownChartProps) {
  const { attachments, workspaceFiles, projectFiles, total } = breakdown;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <h2 className="text-lg font-semibold mb-6">Storage Breakdown</h2>

      <div className="space-y-6">
        {/* Stacked Progress Bar */}
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`h-full ${item.color}`}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Breakdown Items */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${item.color} bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors`}>
                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatStorageSize(item.value)}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
              
              {/* Individual Progress Bar */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Storage</span>
            <span className="text-lg font-semibold">{formatStorageSize(total)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}