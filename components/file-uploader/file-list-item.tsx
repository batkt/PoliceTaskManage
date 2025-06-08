import React, { useRef, useState } from 'react';
import { FileIconComponent } from './file-icon';
import { UploadedFile } from '@/lib/types/file.types';
import { formatFileSize, getFileInfo } from '@/lib/file.utils';
import { formatDateFull } from '@/lib/utils';
import { Button } from '../ui/button';
import { Download, Eye, Pause, Play, TrashIcon } from 'lucide-react';
import { ImagePreviewModal } from '../image-preview-modal';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const FileListItem = ({
  file,
  isEdit = false,
  onlyRead = false,
  removeFile,
}: {
  file: UploadedFile;
  isEdit?: boolean;
  onlyRead?: boolean;
  removeFile?: (fileId: string) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    alt: string;
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('Play error:', err);
      });
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const getProxyUrl = (url: string) => {
    const foundIndex = url.search('/uploads/');
    return url.substring(foundIndex);
  };

  const handleImageClick = (image: {
    src: string;
    title: string;
    alt: string;
  }) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const fileInfo = file.mimetype ? getFileInfo(file.mimetype) : null;

  return (
    <div
      key={file._id}
      className="flex items-center justify-between px-3 py-2 text-xs bg-muted border rounded-md group"
    >
      {/* Left side - File info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <FileIconComponent
          mimeType={file.mimetype}
          className="w-4 h-4 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium text-foreground">
            {file.originalName}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {file.mimetype === 'audio/webm' && file.duration > 0 && (
              <span>{formatTime(file.duration)}</span>
            )}
            {file.size && <span>{formatFileSize(file.size)}</span>}
            {fileInfo && (
              <>
                <span>•</span>
                <span className={`capitalize ${fileInfo.color}`}>
                  {fileInfo.category}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - User and date info */}
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-foreground font-medium">
              {file.uploadedBy.givenname}
            </span>
          </div>
          <div className="text-gray-500 font-mono text-xs">
            {formatDateFull(file.createdAt)}
          </div>
        </div>
        {file.mimetype === 'audio/webm' || fileInfo?.category === 'audio' ? (
          <>
            <audio ref={audioRef} className="hidden" onEnded={handleAudioEnded}>
              <source src={getProxyUrl(file.url)} type="audio/webm" />
            </audio>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0 flex-shrink-0"
              onClick={isPlaying ? pauseAudio : playAudio}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isPlaying ? 'Зогсоох' : 'Тоглуулах'}
              </span>
            </Button>
          </>
        ) : !isEdit && fileInfo?.category === 'image' ? (
          <div>
            <Button
              variant={'ghost'}
              size="icon"
              className="h-8 w-8 p-0 flex-shrink-0"
              onClick={() =>
                handleImageClick({
                  src: getProxyUrl(file.url),
                  title: file.originalName,
                  alt: `${file.originalName} is view`,
                })
              }
            >
              <Eye className="h-4 w-4" />
            </Button>

            {selectedImage && (
              <ImagePreviewModal
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                src={selectedImage.src || '/placeholder.svg'}
                alt={selectedImage.alt}
                title={selectedImage.title}
              />
            )}
          </div>
        ) : (
          <a
            href={getProxyUrl(file.url)}
            download
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-500/20 dark:hover:bg-background/30 rounded-sm"
          >
            <Download className="h-4 w-4" />
          </a>
        )}
        {!onlyRead && isEdit && (
          <button
            type="button"
            onClick={() => removeFile?.(file._id)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
          >
            <TrashIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileListItem;
