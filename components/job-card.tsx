'use client';

import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Play, Pause, MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobRegistrationDialog } from '@/components/job-registration-dialog';

export type JobCardProps = {
  id: string;
  title: string;
  status:
    | 'planned'
    | 'assigned'
    | 'checking'
    | 'completed'
    | 'cancelled'
    | 'in_progress';
  startDate: string;
  endDate: string;
  assignees: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  type?: string;
  system?: string;
  description?: string;
  isUrgent?: boolean;
  audioUrl?: string;
};

export function JobCard({
  id,
  title,
  status,
  startDate,
  endDate,
  assignees,
  type,
  system,
  description,
  isUrgent,
  audioUrl,
}: JobCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const statusMap: Record<
    string,
    {
      label: string;
      variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'success';
    }
  > = {
    planned: { label: 'Эхлээгүй', variant: 'outline' },
    assigned: { label: 'Хуваарилагдсан', variant: 'default' },
    in_progress: { label: 'Хийгдэж буй', variant: 'default' },
    checking: { label: 'Шалгаж буй', variant: 'secondary' },
    completed: { label: 'Дууссан', variant: 'success' },
    cancelled: { label: 'Цуцалсан', variant: 'destructive' },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: 'default',
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Card className="overflow-hidden bg-card dark:bg-slate-800 border dark:border-slate-700">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          onEnded={handleAudioEnded}
        />
      )}
      <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={variant}>{label}</Badge>
              <span className="text-xs text-muted-foreground truncate">
                {id}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 ml-2"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Цэс нээх</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
              ID хуулах
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <JobRegistrationDialog
              editJob={{
                id,
                title,
                status,
                startDate,
                endDate,
                assignees,
                type,
                system,
                description,
                isUrgent,
                audioUrl,
              }}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Засах
              </DropdownMenuItem>
            </JobRegistrationDialog>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Устгах
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">
        <div className="mb-4 flex justify-between text-sm">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Эхлэх огноо</p>
            <p className="truncate font-medium">
              {format(new Date(startDate), 'yyyy/MM/dd')}
            </p>
          </div>
          <div className="text-right min-w-0">
            <p className="text-xs text-muted-foreground">Дуусах огноо</p>
            <p className="truncate font-medium">
              {format(new Date(endDate), 'yyyy/MM/dd')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {assignees.slice(0, 4).map((assignee, index) => (
              <Avatar
                key={assignee.id}
                className={cn(
                  'h-8 w-8 border-2 border-background dark:border-slate-800',
                  `bg-${assignee.color}-500`
                )}
              >
                <AvatarFallback
                  className={cn(
                    `bg-${assignee.color}-500 text-white font-medium`
                  )}
                >
                  {assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {assignees.length > 4 && (
              <Avatar className="h-8 w-8 border-2 border-background dark:border-slate-800 bg-muted">
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  +{assignees.length - 4}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          {audioUrl && (
            <Button
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
          )}
        </div>
      </div>
    </Card>
  );
}
