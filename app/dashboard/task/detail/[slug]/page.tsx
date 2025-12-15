import TaskDetail from '@/components/task/task-detail';
import TaskProvider from '@/context/task-context';
import { getActivities } from '@/ssr/service/activity';
import { getAuditData } from '@/ssr/service/audit';
import { getTaskNotes } from '@/ssr/service/note';
import { getTaskDetail } from '@/ssr/service/task';
import { isAuthenticated } from '@/ssr/util';
import { redirect } from 'next/navigation';
import React from 'react';

const TaskDetailPage = async (props: {
  params: Promise<Record<string, string>>;
}) => {
  const params = await props.params;
  const token = await isAuthenticated();
  if (!params?.slug) {
    redirect('/dashboard');
  }
  const res = await getTaskDetail(params.slug, token);

  if (!res.isOk) {
    redirect('/dashboard');
  }


  const auditRes = await getAuditData(params.slug, token);
  const notesRes = await getTaskNotes(params.slug, token);
  const activities = await getActivities(params.slug, token);

  const notesData = notesRes.isOk ? notesRes.data : [];
  const activitiesData = activities.isOk ? activities.data : null;
  const auditData = auditRes.isOk ? auditRes.data : null;

  return (
    <TaskProvider data={res.data} notesData={notesData}>
      <TaskDetail auditData={auditData} activities={activitiesData} />
    </TaskProvider>
  );
};

export default TaskDetailPage;
