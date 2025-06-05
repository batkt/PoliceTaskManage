import { User } from './user.types';

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface UploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

export interface VoiceRecordProps {
  onUploadComplete?: (response: UploadResponse) => void;
  onUploadError?: (error: string) => void;
  maxDuration?: number; // in seconds
  uploadEndpoint?: string;
  className?: string;
}

export interface UploadedFile {
  _id: string;
  originalName: string;
  filename: string;
  duration: number;
  timestamp: string;
  type: 'voice';
  size: number;
  mimetype: string;
  url: string;
  uploadedBy: User;
  createdAt: string;
}
export interface RecordingFile {
  id: string;
  name: string;
  duration: number;
  timestamp: Date;
  type: 'voice' | 'file';
  size?: number;
  mimeType?: string;
  uploadedBy: User;
  uploadedAt: Date;
}
