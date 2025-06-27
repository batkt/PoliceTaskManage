'use client';

import { TaskStatus } from '@/lib/types/task.types';
import React, { useState } from 'react';
import StatusBadge from './status-badge';
import PriorityBadge from './priority-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangleIcon,
  ArrowRightLeft,
  MessageSquareIcon,
} from 'lucide-react';

import { formatDateFull, isOverdue } from '@/lib/utils';
import { format } from 'date-fns';
import { Label } from '../ui/label';
import { useAuth } from '@/context/auth-context';
import { FileUploader } from '../file-uploader';
import { FieldTypes } from '@/lib/types/form.types';
import { attachFile, removeFile } from '@/ssr/actions/task';
import { UploadedFile } from '@/lib/types/file.types';
import { useTasks } from '@/context/task-context';
import CreateNoteInput from '../note/create-note-input';
import AuditModal from '../audit/audit-modal';
import AuditResult from '../audit/audit-result';
import { Audit } from '@/lib/types/audit.types';
import { Activity } from '@/lib/types/activity.types';
import AssignModal from './assign-modal';

const TaskDetail = ({
  auditData,
  activities,
}: {
  auditData: Audit[] | null;
  activities: Activity[] | null;
}) => {
  const { authUser } = useAuth();
  const { detailData, handleChangeStatus, notes, addNote, users } = useTasks();
  const [files, setFiles] = useState<UploadedFile[]>(detailData?.files || []);

  const [loading, setLoading] = useState(false);
  const [isOpenAuditModal, setIsOpenAuditModal] = useState(false);
  const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);

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
    if (added?.length > 0) {
      const fileRes = await attachFile({
        taskId: detailData._id,
        fileIds: added.map((f) => f._id),
      });
    }

    if (removed?.length > 0) {
      const fileRes2 = await removeFile({
        taskId: detailData._id,
        fileIds: removed.map((f) => f._id),
      });
    }
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
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="text-xs bg-background">
                  {user?.givenname?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user?.givenname}</span>
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

  if (!detailData) {
    return null;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {detailData?.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={detailData?.status} />
            <PriorityBadge priority={detailData?.priority} />
          </div>
        </div>
        <div>
          {isMeAssigner ? (
            <>
              {TaskStatus.COMPLETED === detailData.status &&
              ['super-admin', 'admin'].includes(authUser?.role) &&
              authUser?._id !== detailData?.assignee?._id ? (
                <Button
                  onClick={async () => {
                    setIsOpenAuditModal(true);
                  }}
                >
                  Хянах
                </Button>
              ) : null}
              {[TaskStatus.PENDING, TaskStatus.ACTIVE].includes(
                detailData.status
              ) ? (
                <Button
                  onClick={async () => {
                    setLoading(true);
                    await handleChangeStatus({
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
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={async () => {
                    setLoading(true);
                    await handleChangeStatus({
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
        </div>
      </div>

      {isOpenAuditModal ? (
        <AuditModal
          taskId={detailData._id}
          open={isOpenAuditModal}
          onOpenChange={setIsOpenAuditModal}
        />
      ) : null}

      {isOpenAssignModal ? (
        <AssignModal
          task={detailData}
          currentUser={detailData.assignee}
          open={isOpenAssignModal}
          onOpenChange={setIsOpenAssignModal}
        />
      ) : null}
      <Tabs defaultValue="overview" className="w-full pb-6 pt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
          <TabsTrigger disabled={loading} value="files">
            Файлууд
          </TabsTrigger>
          <TabsTrigger disabled={loading} value="notes">
            Тэмдэглэл
          </TabsTrigger>
          <TabsTrigger disabled={loading} value="activity">
            Түүх
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Тайлбар</Label>
                <p className="text-sm text-muted-foreground">
                  {detailData?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Хариуцсан алба хаагч
                </Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={detailData.assignee?.profileImageUrl} />
                      <AvatarFallback className="text-xs bg-background">
                        {detailData.assignee?.givenname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {detailData.assignee?.givenname}
                    </span>
                  </div>

                  {[TaskStatus.ACTIVE, TaskStatus.PENDING].includes(
                    detailData.status
                  ) &&
                  (['super-admin', 'admin'].includes(authUser?.role || '') ||
                    authUser?._id === detailData?.assignee?._id) ? (
                    <Button
                      className="flex h-8 text-sm px-2 max-md:w-8 overflow-hidden text-left max-md:justify-start"
                      type="button"
                      onClick={() => {
                        setIsOpenAssignModal(true);
                      }}
                    >
                      <ArrowRightLeft className="size-5" /> Хуваарилах
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium">Хугацаа</Label>
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
                <div className="flex gap-6 items-center text-sm">
                  <div className="text-muted-foreground">
                    Эхлэх:{' '}
                    {format(new Date(detailData.startDate), 'yyyy-MM-dd')}
                  </div>
                </div>
                <div className="flex gap-2 items-center text-sm">
                  <div className="text-muted-foreground">
                    Дуусах: {format(new Date(detailData.dueDate), 'yyyy-MM-dd')}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Үүсгэгч</Label>
                <div className="flex gap-x-2 gap-4 flex-wrap">
                  <div
                    key={detailData.createdBy._id}
                    className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={detailData.createdBy?.profileImageUrl}
                      />
                      <AvatarFallback className="text-xs bg-background">
                        {detailData.createdBy.givenname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {detailData.createdBy.givenname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {detailData?.formValues?.map((item, index) => {
                return (
                  <div className="space-y-1" key={`${item.label}_${index}`}>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    {renderFormValue(item)}
                  </div>
                );
              })}

              <AuditResult data={auditData} />
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
            <CreateNoteInput taskId={detailData._id} onSave={addNote} />
            <Separator />
            <div className="space-y-3">
              {notes.map((note) => {
                return (
                  <div
                    key={note._id}
                    className="p-4 rounded-lg bg-white border"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={note.createdBy?.profileImageUrl} />
                        <AvatarFallback className="text-xs">
                          {note.createdBy?.givenname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold">
                            {note?.createdBy?.givenname}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDateFull(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {notes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquareIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Тэмдэглэл байхгүй</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {activities?.map((item) => {
              return (
                <div key={item._id} className="p-4 rounded-lg bg-white border">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item?.userId?.profileImageUrl} />
                          <AvatarFallback className="text-xs bg-background">
                            {item?.userId?.givenname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-sm font-semibold">
                        {item?.userId?.givenname}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateFull(item?.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm mt-3">{item?.message}</div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetail;
