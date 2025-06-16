import TaskDetail from '@/components/task/task-detail';
import TaskProvider from '@/context/task-context';
import { getTaskNotes } from '@/ssr/service/note';
import { getTaskDetail } from '@/ssr/service/task';
import { redirect } from 'next/navigation';
import React from 'react';

const TaskDetailPage = async (props: {
  params: Promise<Record<string, string>>;
}) => {
  const params = await props.params;
  if (!params?.slug) {
    redirect('/dashboard');
  }
  const res = await getTaskDetail(params.slug);

  if (res.code !== 200) {
    redirect('/dashboard');
  }

  const notesRes = await getTaskNotes(params.slug);
  return (
    <TaskProvider data={res.data} notesData={notesRes.data}>
      <TaskDetail />
    </TaskProvider>
  );
};

export default TaskDetailPage;
