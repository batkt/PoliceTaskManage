import { getFileInfo } from '@/lib/file.utils';
import { FileIcon, MicIcon } from 'lucide-react';

interface FileIconComponentProps {
  mimeType?: string;
  className?: string;
}

export function FileIconComponent({
  mimeType,
  className = 'w-4 h-4',
}: FileIconComponentProps) {
  if (mimeType === 'audio/webm') {
    return <MicIcon className={`${className} text-blue-500`} />;
  }

  if (!mimeType) {
    return <FileIcon className={`${className} text-gray-500`} />;
  }

  const fileInfo = getFileInfo(mimeType);

  return (
    <div
      className={`${className} flex items-center justify-center text-sm ${fileInfo.color}`}
    >
      {fileInfo.icon}
    </div>
  );
}
