'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Task,
  TaskDetail,
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
import { Textarea } from '@/components/ui/textarea';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CalendarIcon,
  PlusIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
} from 'lucide-react';
import { isOverdue } from '@/lib/utils';
import StatusBadge from './status-badge';
import PriorityBadge from './priority-badge';
import { format } from 'date-fns';
import { useUsers } from '@/context/user-context';
import { Label } from '../ui/label';
import { getTaskDetail } from '@/lib/service/task';
import { useAuth } from '@/context/auth-context';
import { FileUploader } from '../file-uploader';
import { FieldTypes } from '@/lib/types/form.types';
import { attachFile, removeFile } from '@/ssr/actions/task';
import { UploadedFile } from '@/lib/types/file.types';

interface TaskDetailModalProps {
  taskId: string;
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
  taskId,
  open,
  onOpenChange,
  handleStatusChange,
}: TaskDetailModalProps) {
  const { users } = useUsers();
  const { accessToken, authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<TaskDetail>();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [newNote, setNewNote] = useState('');

  const fetchTaskDetail = useCallback(async () => {
    setLoading(true);
    if (taskId) {
      const res = await getTaskDetail(taskId, accessToken);
      if (res.code === 200) {
        setDetailData(res.data);
        setFiles(res.data?.files || []);
      }
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    fetchTaskDetail();
  }, [fetchTaskDetail]);

  const addNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      content: newNote,
      createdBy: '1', // Current user
      createdAt: new Date(),
    };

    setNewNote('');
  };

  if (!detailData) {
    return '';
  }

  function diffLists(
    oldList: UploadedFile[],
    newList: UploadedFile[]
  ): {
    added: UploadedFile[];
    removed: UploadedFile[];
  } {
    const added = newList.filter(
      (item) => !oldList.map((it) => it._id).includes(item._id)
    );
    const removed = oldList.filter(
      (item) => !newList.map((it) => it._id).includes(item._id)
    );

    return { added, removed };
  }

  const handleFileUploadChange = async (_files: UploadedFile[]) => {
    const { added, removed } = diffLists(files || [], _files || []);
    setFiles(_files);
    const fileRes = await attachFile({
      taskId: detailData._id,
      fileIds: added.map((f) => f._id),
    });

    const fileRes2 = await removeFile({
      taskId: detailData._id,
      fileIds: removed.map((f) => f._id),
    });
  };

  const isMeAssigner = detailData.assignee?._id === authUser?._id;
  const overdue = isOverdue(new Date(detailData?.dueDate || ''));

  const isEditAccess = () => {
    if (!detailData) {
      return false;
    }

    if (!authUser) {
      return false;
    }

    if (
      [TaskStatus.COMPLETED, TaskStatus.REVIEWED].includes(detailData?.status)
    ) {
      // Task guitsetgeed dussan tolowt baigaa
      return false;
    }

    if (detailData?.assignee?._id === authUser._id) {
      return true;
    }

    if (['super-admin', 'admin'].includes(authUser?.role)) {
      return true;
    }

    return false;
  };

  const renderUsers = (ids: string[]) => {
    const userData = users.filter((u) => ids.includes(u._id));
    return (
      <div className="flex gap-x-2 gap-4 flex-wrap">
        {userData?.map((user) => {
          return (
            <div
              key={`formValue_${user._id}`}
              className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={detailData.assignee?.profileImageUrl} />
                <AvatarFallback className="text-xs bg-background">
                  {detailData.assignee?.givenname?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{detailData.assignee?.givenname}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFormValue = (item: Record<string, any>) => {
    if (item.type === FieldTypes.USER_SELECT) {
      return item?.value ? renderUsers([item.value]) : '';
    }
    if (item.type === FieldTypes.MULTI_USER_SELECT) {
      return item?.value?.length > 0 ? renderUsers(item.value) : '';
    }
    if (item.type === FieldTypes.DATE) {
      return (
        <p className="text-sm text-muted-foreground">
          {item?.value ? format(new Date(item.value), 'yyyy-MM-dd') : ''}
        </p>
      );
    }
    return <p className="text-sm text-muted-foreground">{item.value}</p>;
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2 text-start">
                {detailData?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={detailData?.status} />
                <PriorityBadge priority={detailData?.priority} />
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

        <Tabs defaultValue="overview" className="w-full pb-6 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
            <TabsTrigger disabled={loading} value="files">
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
                    {detailData?.description}
                  </p>
                </div>

                {detailData?.formValues?.map((item, index) => {
                  return (
                    <div className="space-y-4" key={`${item.label}_${index}`}>
                      <Label className="text-sm font-medium">
                        {item.label}
                      </Label>
                      {renderFormValue(item)}
                    </div>
                  );
                })}

                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    Хариуцсан алба хаагчид
                  </Label>
                  <div className="flex gap-x-2 gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={detailData.assignee?.profileImageUrl}
                        />
                        <AvatarFallback className="text-xs bg-background">
                          {detailData.assignee?.givenname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {detailData.assignee?.givenname}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Хугацаа</Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <div className="flex gap-6 items-center text-sm">
                      <div>
                        {format(new Date(detailData.startDate), 'yyyy-MM-dd')}
                      </div>
                      -
                      <div>
                        {format(new Date(detailData.dueDate), 'yyyy-MM-dd')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Үүсгэгч</Label>
                  <div className="flex gap-x-2 gap-4 flex-wrap">
                    {users.map((user) => {
                      if (user._id === detailData.createdBy._id) {
                        return (
                          <div
                            key={user._id}
                            className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={detailData.createdBy?.profileImageUrl}
                              />
                              <AvatarFallback className="text-xs bg-background">
                                {user.givenname?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.givenname}</span>
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
              <h3 className="text-lg font-medium">Файлууд</h3>
            </div>
            <FileUploader
              value={files || []}
              onChange={handleFileUploadChange}
              isEdit={isEditAccess()}
            />
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
          {isMeAssigner ? (
            <>
              {[TaskStatus.PENDING, TaskStatus.ACTIVE].includes(
                detailData.status
              ) ? (
                <Button
                  onClick={async () => {
                    setLoading(true);
                    await handleStatusChange({
                      status: TaskStatus.IN_PROGRESS,
                      taskId: detailData._id,
                    });
                    setLoading(false);
                  }}
                >
                  Хийж эхлэх
                </Button>
              ) : null}
              {detailData.status === TaskStatus.IN_PROGRESS ? (
                <Button
                  className="bg-green-500 text-foreground hover:bg-green-600"
                  onClick={async () => {
                    setLoading(true);
                    await handleStatusChange({
                      status: TaskStatus.COMPLETED,
                      taskId: detailData._id,
                    });
                    setLoading(false);
                  }}
                >
                  Дуусгах
                </Button>
              ) : null}
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
