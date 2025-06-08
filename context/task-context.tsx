'use client';

import { TaskDetailModal } from '@/components/task/task-detail-modal';
import { useToast } from '@/hooks/use-toast';
import { TaskStatusChangeType } from '@/lib/types/task.types';
import { changeStatusAction } from '@/ssr/actions/task';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TaskContextType {
  openTaskDetailModal: (id: string) => void;
  handleChangeStatus: (data: TaskStatusChangeType) => void;
}
const TaskContext = createContext<TaskContextType | null>(null);

const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isOpenTaskDetailModal, setIsOpenTaskDetailModal] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  const openTaskDetailModal = (id: string) => {
    setSelectedTaskId(id);
    setIsOpenTaskDetailModal(true);
  };

  const handleChangeStatus = async (data: TaskStatusChangeType) => {
    const res = await changeStatusAction(data, pathname);

    if (res.code === 200) {
      let text = 'Төлөвлөгөөг амжилттай эхлүүллээ';
      if (data.status === 'completed') {
        text = 'Төлөвлөгөөг амжилттай гүйцэтгэж дууслаа';
      }
      toast({
        variant: 'success',
        title: 'Амжилттай.',
        description: text,
      });
      setIsOpenTaskDetailModal(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Алдаа гарлаа.',
        description: res.message || 'Системийн алдаа',
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        openTaskDetailModal,
        handleChangeStatus,
      }}
    >
      {children}
      {isOpenTaskDetailModal && selectedTaskId ? (
        <TaskDetailModal
          taskId={selectedTaskId}
          open={isOpenTaskDetailModal}
          onOpenChange={(e) => {
            setIsOpenTaskDetailModal(e);
          }}
          handleStatusChange={handleChangeStatus}
        />
      ) : null}
    </TaskContext.Provider>
  );
};

export default TaskProvider;

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
