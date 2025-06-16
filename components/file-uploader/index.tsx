'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  MicIcon,
  Square,
  Upload,
  FileIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadedFile } from '@/lib/types/file.types';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { fileUpload } from '@/lib/service/file';
import { FieldError } from 'react-hook-form';
import FileListItem from './file-list-item';

interface FileUploaderProps {
  onChange?: (files: UploadedFile[]) => void;
  value: UploadedFile[];
  maxDuration?: number;
  warningTime?: number;
  showFileList?: boolean;
  className?: string;
  fileList?: UploadedFile[];
  error?: FieldError;
  onlyRead?: boolean;
  isEdit?: boolean;
}

export function FileUploader({
  onChange,
  value = [],
  maxDuration = 300, // 2 minutes
  warningTime = 240, // Warning at 1:40
  showFileList = true,
  onlyRead = false,
  isEdit = true,
  className = '',
  error,
}: FileUploaderProps) {
  // Recording state
  const [state, setState] = useState<
    'idle' | 'recording' | 'recorded' | 'uploading'
  >('idle');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(0);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const { accessToken } = useAuth();
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setState('recorded');
        setShowWarning(false);
      };

      mediaRecorder.start();
      setState('recording');
      setCurrentTime(0);

      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;

          // Show warning near max time
          if (newTime >= warningTime && newTime < maxDuration) {
            setShowWarning(true);
          }

          // Auto-stop at max duration
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }

          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.log('Recording failed:', error);
      toast({
        title: 'Микрофон ашиглах боломжгүй байна',
        description:
          'Микрофоноо ашиглах зөвшөөрөл олгох эсвэл төхөөрөмжөө шалгана уу.',
        variant: 'destructive',
      });
      //   onUploadError?.('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const uploadRecording = async () => {
    if (!audioBlob) return;

    setState('uploading');
    try {
      const formData = new FormData();
      const fileName = `voice-${Date.now()}.webm`;
      formData.append('file', audioBlob, fileName);
      formData.append('duration', currentTime.toString());

      const response = await fileUpload(formData, accessToken);

      if (response.code === 200) {
        onChange?.([response.data, ...value]);
        reset();
      } else {
        throw response?.message;
      }
    } catch (error) {
      setState('recorded');
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);
    try {
      const file = event.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fileUpload(formData, accessToken);

        if (response.code === 200) {
          onChange?.([response.data, ...value]);
          reset();
        } else {
          throw response?.message;
        }
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setState('idle');
    setCurrentTime(0);
    setAudioBlob(null);
    setShowWarning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const removeFile = (id: string) => {
    onChange?.(value.filter((file) => file._id !== id));
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className={cn('space-y-3', className)}>
      {/* File List */}
      {showFileList ? (
        value.length > 0 ? (
          <div className="space-y-2">
            {!onlyRead && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">
                  Файлын тоо ({value.length})
                </span>
              </div>
            )}

            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {value.map((file) => {
                return (
                  <FileListItem
                    key={file._id}
                    file={file}
                    isEdit={isEdit}
                    removeFile={removeFile}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'mt-2 p-4 border border-dashed border-muted-foreground/20 rounded-md text-center',
              error ? 'border-destructive' : 'border-muted-foreground/20'
            )}
          >
            <p className="text-sm text-muted-foreground">
              Файл оруулаагүй байна
            </p>
          </div>
        )
      ) : null}

      {error ? (
        <span className="text-sm font-medium text-destructive">
          {error.message}
        </span>
      ) : null}

      {/* Recording Status Display */}
      {state === 'recording' && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted border rounded-md">
          <div className="flex items-center gap-2">
            {/* Recording Animation */}
            <div className="flex items-center gap-1">
              <div
                className="w-1 h-3 bg-red-500 rounded animate-pulse"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="w-1 h-4 bg-red-500 rounded animate-pulse"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-1 h-2 bg-red-500 rounded animate-pulse"
                style={{ animationDelay: '300ms' }}
              />
              <div
                className="w-1 h-4 bg-red-500 rounded animate-pulse"
                style={{ animationDelay: '450ms' }}
              />
              <div
                className="w-1 h-3 bg-red-500 rounded animate-pulse"
                style={{ animationDelay: '600ms' }}
              />
            </div>
            <span
              className={`text-sm font-mono ${
                showWarning ? 'text-orange-600' : 'text-foreground'
              }`}
            >
              Бичиж байна {formatTime(currentTime)}
            </span>
            {showWarning && (
              <AlertTriangleIcon className="w-4 h-4 text-orange-500 animate-pulse" />
            )}
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
          >
            <Square className="w-3 h-3" />
            Зогсоох
          </button>
        </div>
      )}

      {/* Recorded Status Display */}
      {state === 'recorded' && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted border rounded-md">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm">Бичигдсэн {formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={uploadRecording}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
            >
              <Upload className="w-3 h-3" />
              Хуулах
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs font-medium transition-colors"
            >
              Болих
            </button>
          </div>
        </div>
      )}

      {/* Uploading Status Display */}
      {(state === 'uploading' || uploading) && (
        <div className="flex items-center justify-center px-3 py-2 bg-muted border rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700">Файлыг хуулж байна...</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {state === 'idle' && isEdit && (
        <>
          <div className="flex gap-2">
            {/* Record Voice Button */}
            <Button type="button" onClick={startRecording} className="flex-1">
              <MicIcon className="w-4 h-4" />
              Хоолой бичих
            </Button>

            {/* File Upload Button */}
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
            >
              <FileIcon className="w-4 h-4" />
              Файл сонгох
            </Button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="audio/*,image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.zip,.rar,.7z"
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            {formatTime(maxDuration)} хүртэлх бичлэг • PDF, Word, Excel, Зураг,
            Дуу
          </div>
        </>
      )}
    </div>
  );
}
