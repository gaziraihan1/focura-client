'use client';

import { FileText, Image as Img, Film, Music, Archive, HardDrive } from 'lucide-react';
import { FileTypeStat } from '@/hooks/useFileManagement';
import { formatFileSize } from '@/utils/file.utils';

interface FileTypeStatsProps {
  stats: FileTypeStat[];
}

export function FileTypeStats({ stats }: FileTypeStatsProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'images':
        return <Img className="w-5 h-5" />;
      case 'videos':
        return <Film className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'documents':
      case 'pdfs':
        return <FileText className="w-5 h-5" />;
      case 'archives':
        return <Archive className="w-5 h-5" />;
      default:
        return <HardDrive className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'images':
        return 'text-purple-600 dark:text-purple-400 bg-purple-500/10';
      case 'videos':
        return 'text-red-600 dark:text-red-400 bg-red-500/10';
      case 'audio':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
      case 'documents':
      case 'pdfs':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
      case 'archives':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-500/10';
    }
  };

  const totalFiles = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalSize = stats.reduce((sum, stat) => sum + stat.sizeMB, 0);

  if (stats.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Storage Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Total Card */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">{totalFiles}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Files</p>
          <p className="text-sm font-medium text-primary mt-1">
            {formatFileSize(totalSize * 1024 * 1024)}
          </p>
        </div>

        {/* Type Cards */}
        {stats.map((stat) => (
          <div key={stat.type} className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${getColor(stat.type)}`}>
                {getIcon(stat.type)}
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.type}</p>
            <p className="text-sm font-medium mt-1">
              {formatFileSize(stat.sizeMB * 1024 * 1024)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}