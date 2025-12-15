'use client';

import { useToast } from '@/hooks/use-toast';
import { getUserByIds } from '@/lib/service/user';
import { Note } from '@/lib/types/note.types';
import { TaskDetail, TaskStatusChangeType } from '@/lib/types/task.types';
import { changeStatusAction } from '@/ssr/actions/task';
import { usePathname } from 'next/navigation';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './auth-context';
import { User } from '@/lib/types/user.types';

interface TaskContextType {
  handleChangeStatus: (data: TaskStatusChangeType) => void;
  detailData: TaskDetail;
  notes: Note[];
  users: User[];
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
  const { accessToken } = useAuth();
  const pathname = usePathname();
  const [notes, setNotes] = useState<Note[]>(notesData || []);
  const [users, setUsers] = useState<User[]>([]);

  const addNote = (note: Note) => {
    setNotes((prev) => {
      return [...prev, note];
    });
  };

  useEffect(() => {
    const loadUsers = async (_ids: string[], token?: string) => {
      const res = await getUserByIds(_ids, token);
      if (res.isOk) {
        setUsers(res.data);
      }
    };

    if (data?.formValues && data?.formValues?.length > 0) {
      const userIds = data?.formValues
        ?.filter((item) => 'user-select' === item.type)
        ?.map((item) => item.value);

      const usersIds = data?.formValues
        ?.filter((item) => 'multi-user-select' === item.type)
        ?.map((item) => item.value)
        ?.flat();

      const allIds = (userIds || []).concat(usersIds || []);

      if (allIds.length > 0)
        loadUsers(allIds, accessToken);
    }
  }, [data, accessToken]);

  const handleChangeStatus = async (data: TaskStatusChangeType) => {
    const res = await changeStatusAction(data, pathname, accessToken);

    if (res.isOk) {
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
        users,
        notes,
        handleChangeStatus,
        addNote,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
