import { TaskForm } from '@/components/task/task-create-form';
import { getAllForms } from '@/ssr/service/form';
import { getLoggedUser } from '@/ssr/service/user';
import { redirect } from 'next/navigation';
import React from 'react';

const CreateTask = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const params = await searchParams;
  const loggedUser = await getLoggedUser();

  if (
    !loggedUser ||
    !['super-admin', 'admin'].includes(loggedUser?.role || '')
  ) {
    redirect('/dashboard');
  }

  const res = await getAllForms();
  return (
    <div>
      <TaskForm types={res.data} formTemplateId={params.formId} />
    </div>
  );
};

export default CreateTask;
