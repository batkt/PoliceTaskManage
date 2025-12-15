import { TaskForm } from '@/components/task/task-create-form';
import { getAllForms } from '@/ssr/service/form';
import { getLoggedUser } from '@/ssr/service/user';
import { isAuthenticated } from '@/ssr/util';
import { redirect } from 'next/navigation';
import React from 'react';

const CreateTask = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const params = await searchParams;
  const token = await isAuthenticated();
  const loggedUser = await getLoggedUser(token);

  if (
    !loggedUser ||
    !['super-admin', 'admin'].includes(loggedUser?.role || '')
  ) {
    redirect('/dashboard');
  }

  const res = await getAllForms(token);
  const forms = res.isOk ? res.data : [];

  return (
    <div>
      <TaskForm types={forms} formTemplateId={params.formId} />
    </div>
  );
};

export default CreateTask;
