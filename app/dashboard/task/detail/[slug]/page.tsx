import TaskDetail from '@/components/task/task-detail';
import TaskProvider from '@/context/task-context';
import { getActivities } from '@/ssr/service/activity';
import { getAuditData } from '@/ssr/service/audit';
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

  const auditData = await getAuditData(params.slug);
  const notesRes = await getTaskNotes(params.slug);
  const activities = await getActivities(params.slug);
  
  return (
    <TaskProvider data={res.data} notesData={notesRes.data}>
      <TaskDetail auditData={auditData} activities={activities} />
    </TaskProvider>
  );
};

export default TaskDetailPage;
