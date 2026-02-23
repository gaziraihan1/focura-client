// lib/file-utils.ts

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  return '📁';
}

export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('word') || 
      mimeType.includes('sheet') || mimeType.includes('presentation')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archive';
  return 'other';
}

export function getFileCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    image: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
    video: 'text-red-600 dark:text-red-400 bg-red-500/10',
    audio: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
    pdf: 'text-red-600 dark:text-red-400 bg-red-500/10',
    document: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
    archive: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    other: 'text-gray-600 dark:text-gray-400 bg-gray-500/10',
  };
  return colors[category] || colors.other;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 30) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function canPreview(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.includes('pdf') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/')
  );
}
