export const MIME_TYPES = {
  // Images
  'image/jpeg': { icon: '🖼️', category: 'image', color: 'text-blue-600' },
  'image/jpg': { icon: '🖼️', category: 'image', color: 'text-blue-600' },
  'image/png': { icon: '🖼️', category: 'image', color: 'text-blue-600' },
  'image/gif': { icon: '🖼️', category: 'image', color: 'text-blue-600' },
  'image/webp': { icon: '🖼️', category: 'image', color: 'text-blue-600' },
  'image/svg+xml': { icon: '🖼️', category: 'image', color: 'text-blue-600' },

  // Documents
  'application/pdf': {
    icon: '📄',
    category: 'document',
    color: 'text-red-600',
  },
  'application/msword': {
    icon: '📝',
    category: 'document',
    color: 'text-blue-700',
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    icon: '📝',
    category: 'document',
    color: 'text-blue-700',
  },
  'application/vnd.ms-excel': {
    icon: '📊',
    category: 'spreadsheet',
    color: 'text-green-600',
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    icon: '📊',
    category: 'spreadsheet',
    color: 'text-green-600',
  },
  'application/vnd.ms-powerpoint': {
    icon: '📈',
    category: 'presentation',
    color: 'text-orange-600',
  },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    icon: '📈',
    category: 'presentation',
    color: 'text-orange-600',
  },

  // Text
  'text/plain': { icon: '📄', category: 'text', color: 'text-gray-600' },
  'text/csv': { icon: '📊', category: 'spreadsheet', color: 'text-green-600' },
  'application/rtf': {
    icon: '📝',
    category: 'document',
    color: 'text-blue-700',
  },

  // Audio
  'audio/mpeg': { icon: '🎵', category: 'audio', color: 'text-purple-600' },
  'audio/mp3': { icon: '🎵', category: 'audio', color: 'text-purple-600' },
  'audio/wav': { icon: '🎵', category: 'audio', color: 'text-purple-600' },
  'audio/webm': { icon: '🎙️', category: 'audio', color: 'text-purple-600' },
  'audio/ogg': { icon: '🎵', category: 'audio', color: 'text-purple-600' },
  'audio/mp4': { icon: '🎵', category: 'audio', color: 'text-purple-600' },

  // Video
  'video/mp4': { icon: '🎬', category: 'video', color: 'text-indigo-600' },
  'video/webm': { icon: '🎬', category: 'video', color: 'text-indigo-600' },
  'video/avi': { icon: '🎬', category: 'video', color: 'text-indigo-600' },

  // Archives
  'application/zip': {
    icon: '🗜️',
    category: 'archive',
    color: 'text-yellow-600',
  },
  'application/x-rar-compressed': {
    icon: '🗜️',
    category: 'archive',
    color: 'text-yellow-600',
  },
  'application/x-7z-compressed': {
    icon: '🗜️',
    category: 'archive',
    color: 'text-yellow-600',
  },

  // Default
  'application/octet-stream': {
    icon: '📎',
    category: 'unknown',
    color: 'text-muted-foreground',
  },
} as const;

export function getFileInfo(mimeType: string) {
  return (
    MIME_TYPES[mimeType as keyof typeof MIME_TYPES] ||
    MIME_TYPES['application/octet-stream']
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  );
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
