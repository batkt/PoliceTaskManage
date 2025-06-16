'use client';

import { useToast } from '@/hooks/use-toast';
import { Note } from '@/lib/types/note.types';
import { TaskDetail, TaskStatusChangeType } from '@/lib/types/task.types';
import { changeStatusAction } from '@/ssr/actions/task';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TaskContextType {
  // openTaskDetailModal: (id: string) => void;
  handleChangeStatus: (data: TaskStatusChangeType) => void;
  detailData: TaskDetail;
  notes: Note[];
  addNote: (note: Note) => void;
}
const TaskContext = createContext<TaskContextType | null>(null);

const TaskProvider = ({
  children,
  data,
  notesData,
}: {
  children: ReactNode;
  data: TaskDetail;
  notesData?: Note[];
}) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const [notes, setNotes] = useState<Note[]>(notesData || []);
  // const [isOpenTaskDetailModal, setIsOpenTaskDetailModal] = useState(false);
  // const openTaskDetailModal = (id: string) => {
  //   setSelectedTaskId(id);
  //   setIsOpenTaskDetailModal(true);
  // };

  const addNote = (note: Note) => {
    setNotes((prev) => {
      return [...prev, note];
    });
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
      // setIsOpenTaskDetailModal(false);
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
        // openTaskDetailModal,
        detailData: data,
        notes,
        handleChangeStatus,
        addNote,
      }}
    >
      {children}
      {/* {isOpenTaskDetailModal && selectedTaskId ? (
        <TaskDetailModal
          taskId={selectedTaskId}
          open={isOpenTaskDetailModal}
          onOpenChange={(e) => {
            setIsOpenTaskDetailModal(e);
          }}
          handleStatusChange={handleChangeStatus}
        />
      ) : null} */}
    </TaskContext.Provider>
  );
};

export default TaskProvider;

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
