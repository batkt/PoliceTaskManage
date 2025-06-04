'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  Memo,
  Task,
  TaskStatusChangeType,
  WorkGroup,
} from '@/lib/types/task.types';
import { getMemoTask, getWorkGroupTask } from '@/lib/service/task';
import PriorityBadge from './priority-badge';
import StatusBadge from './status-badge';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  handleStatusChange: (data: TaskStatusChangeType) => Promise<void>;
}

const TaskDetailDialog: FC<TaskDetailDialogProps> = ({
  open,
  onClose,
  task,
  handleStatusChange,
}) => {
  const [memo, setMemo] = useState<Memo | undefined>();
  const [workgroup, setWorkgroup] = useState<WorkGroup | undefined>();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchMemo = useCallback(async (taskId: string) => {
    const res = await getMemoTask(taskId, accessToken);

    if (res.code === 200) {
      setMemo(res.data);
    }
  }, []);

  const fetchWorkGroup = useCallback(async (taskId: string) => {
    const res = await getWorkGroupTask(taskId, accessToken);
    console.log('------------ workgroup -------- ', res.data);
    if (res.code === 200) {
      console.log('------------ workgroup -------- ', res.data);
      setWorkgroup(res.data);
    }
  }, []);

  useEffect(() => {
    console.log('chi yr n amid baina uu?', task);
    if (task.type === 'memo') {
      fetchMemo(task._id);
    } else if (task.type === 'work-group') {
      fetchWorkGroup(task._id);
    }
  }, [fetchWorkGroup, fetchMemo, task]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto p-6">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task?.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-6">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="flex items-center gap-4">
                <span>Эхлэх огноо:</span>
                <span>
                  {task.startDate
                    ? format(new Date(task.startDate), 'yyyy-MM-dd')
                    : 'Байхгүй'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>Дуусах огноо:</span>
                <span>
                  {task.endDate
                    ? format(new Date(task.endDate), 'yyyy-MM-dd')
                    : 'Байхгүй'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                Төлөв: <StatusBadge status={task.status} />
              </div>
              <div className="flex items-center gap-4">
                Зэрэглэл: <PriorityBadge priority={task.priority} />
              </div>
              <div className="flex items-center gap-4">
                <span>Үүсгэсэн:</span>
                <span>{task.createdBy?.givenname || 'Тодорхойгүй'}</span>
              </div>
            </div>

            {task.type === 'memo' && memo && (
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-4">
                  <span>Бичгийн дугаар:</span>
                  <span>{memo.documentNumber || '-'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Тэмдэглэгээ:</span> <span>{memo.marking || '-'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Тэмдэглэгээний огноо:</span>
                  <span>
                    {memo.markingDate
                      ? format(new Date(memo.markingDate), 'yyyy-MM-dd')
                      : '-'}
                  </span>
                </div>
                {memo.markingVoiceUrl && (
                  <audio controls src={memo.markingVoiceUrl} className="mt-2" />
                )}
              </div>
            )}

            {task.type === 'workgroup' && workgroup && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Ажлын хэсэг</h3>
                <div>
                  Нэр: <b>{workgroup.name}</b>
                </div>
                <div>
                  Ахлагч: <b>{workgroup.leader?.givenname || 'Тодорхойгүй'}</b>
                </div>
                <div>Гишүүд:</div>
                <ul className="list-disc list-inside ml-4">
                  {workgroup.members.map((member) => (
                    <li key={member._id}>{member.givenname}</li>
                  ))}
                </ul>
                <div>
                  Тэмдэглэгээ: <b>{workgroup.marking || 'Байхгүй'}</b>
                </div>
                <div>
                  Тэмдэглэгээний огноо:{' '}
                  <b>
                    {workgroup.markingDate
                      ? format(new Date(workgroup.markingDate), 'yyyy-MM-dd')
                      : 'Байхгүй'}
                  </b>
                </div>
                {workgroup.markingVoiceUrl && (
                  <audio
                    controls
                    src={workgroup.markingVoiceUrl}
                    className="mt-2"
                  />
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose>
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
              className="bg-green-500 text-foreground"
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
};

export default TaskDetailDialog;
