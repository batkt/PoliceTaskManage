'use client';

import { useState } from 'react';
import type { User } from '@/lib/types/user.types';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskStatusChangeType,
} from '@/lib/types/task.types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CalendarIcon,
  FileIcon,
  PlusIcon,
  UserIcon,
  ClockIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  PaperclipIcon,
  DownloadIcon,
  TrashIcon,
} from 'lucide-react';
import { isOverdue } from '@/lib/utils';
import StatusBadge from './status-badge';
import PriorityBadge from './priority-badge';
import { format } from 'date-fns';
import { useUsers } from '@/context/user-context';
import { Label } from '../ui/label';

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleStatusChange: (data: TaskStatusChangeType) => Promise<void>;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  handleStatusChange,
}: TaskDetailModalProps) {
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newNote, setNewNote] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(task.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(task.endDate)
  );

  const assignedUsers = users.filter((user) =>
    [editedTask.assigner].map((u) => u._id).includes(user._id)
  );
  const overdue = isOverdue(new Date(editedTask.endDate));

  const handleSave = () => {
    // const updatedTask = {
    //   ...editedTask,
    //   startDate,
    //   endDate,
    //   updatedAt: new Date(),
    // };
    // onTaskUpdate(updatedTask);
    // onOpenChange(false);
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      content: newNote,
      createdBy: '1', // Current user
      createdAt: new Date(),
    };

    // setEditedTask((prev) => ({
    //   ...prev,
    //   notes: [...prev.notes, note],
    // }));
    setNewNote('');
  };

  const removeUser = (userId: string) => {
    // setEditedTask((prev) => ({
    //   ...prev,
    //   assignedUsers: prev.assignedUsers.filter((id) => id !== userId),
    // }));
  };

  const addUser = (userId: string) => {
    // if (!editedTask.assignedUsers.includes(userId)) {
    //   setEditedTask((prev) => ({
    //     ...prev,
    //     assignedUsers: [...prev.assignedUsers, userId],
    //   }));
    // }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {editedTask.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={editedTask.status} />
                <PriorityBadge priority={editedTask.priority} />
                {overdue && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangleIcon className="h-3 w-3" />
                    Хугацаа хэтэрсэн
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
            <TabsTrigger disabled={true} value="files">
              Файлууд
            </TabsTrigger>
            <TabsTrigger disabled={true} value="notes">
              Тэмдэглэл
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div>
              {/* Left Column */}
              <div className="space-y-6 mt-8">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Тайлбар</Label>
                  <p className="text-sm text-muted-foreground">
                    {editedTask?.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    Хариуцсан алба хаагчид
                  </Label>
                  <div className="flex gap-x-2 gap-4 flex-wrap">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              'https://cdn.dribbble.com/users/14095940/avatars/normal/e584c0a059b6c7c4f4c23852153e5521.png?1669730203'
                            }
                          />
                          <AvatarFallback className="text-xs">
                            {user.givenname
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.givenname}</span>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeUser(user._id)}
                        >
                          ×
                        </Button> */}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Хугацаа</Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <div className="flex gap-6 items-center text-sm">
                      <div>2025-10-23</div>-<div>2025-10-23</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Үүсгэгч</Label>
                  <div className="flex gap-x-2 gap-4 flex-wrap">
                    {users.map((user) => {
                      if (user._id === editedTask.createdBy._id) {
                        return (
                          <div
                            key={user._id}
                            className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  'https://cdn.dribbble.com/users/14095940/avatars/normal/e584c0a059b6c7c4f4c23852153e5521.png?1669730203'
                                }
                              />
                              <AvatarFallback className="text-xs">
                                {user.givenname
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.givenname}</span>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removeUser(user._id)}
                            >
                              ×
                            </Button> */}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Attachments</h3>
              <Button size="sm" className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Upload File
              </Button>
            </div>
            <div className="grid gap-3">
              {[
                {
                  id: '2',
                  size: '123kb',
                  uploadedBy: '23423423',
                  name: 'Test-Хавсралт.pdf',
                  uploadedAt: '2025-06-02',
                },
              ].map((file) => {
                const uploader = users.find((u) => u._id === file.uploadedBy);
                return (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded">
                            <FileIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.size} • Uploaded by {uploader?.givenname} on{' '}
                              {format(new Date(file.uploadedAt), 'yyyy-MM-dd')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {[0].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <PaperclipIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No files attached</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1"
                />
                <Button onClick={addNote} disabled={!newNote.trim()}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  {
                    id: '2',
                    size: '123kb',
                    createdBy: '23423423',
                    name: 'Test-Хавсралт.pdf',
                    createdAt: '2025-06-02',
                    content:
                      'Хэрвээ чи task model дээр ямар нэгэн custom method, validation, hook ашиглаж байвал save() ашиглах нь илүү найдвартай байдаг.',
                  },
                ].map((note) => {
                  const author = users.find((u) => u._id === note.createdBy);
                  return (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="text-xs">
                              {author?.givenname
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {author?.givenname}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(note.createdAt), 'yyyy-MM-dd')}
                              </span>
                            </div>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {[0].length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquareIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notes yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* <TabsContent value="activity" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Activity timeline coming soon</p>
            </div>
          </TabsContent> */}
        </Tabs>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant={'secondary'}>Хаах</Button>
          </DialogClose>
          {['pending', 'active'].includes(task.status) ? (
            <Button
              onClick={async () => {
                setLoading(true);
                await handleStatusChange({
                  status: 'processing',
                  taskId: task._id,
                });
                setLoading(false);
              }}
            >
              Эхлүүлэх
            </Button>
          ) : null}
          {task.status !== 'completed' ? (
            <Button
              className="bg-green-500 text-foreground hover:bg-green-600"
              onClick={async () => {
                setLoading(true);
                await handleStatusChange({
                  status: 'completed',
                  taskId: task._id,
                });
                setLoading(false);
              }}
            >
              Дуусгах
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
