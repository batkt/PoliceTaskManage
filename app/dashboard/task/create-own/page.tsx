import { TaskForm } from '@/components/task/task-create-form';
import { getAllForms } from '@/ssr/service/form';
import { isAuthenticated } from '@/ssr/util';
import React from 'react';

const CreateOwnTask = async () => {
  const token = await isAuthenticated();
  const res = await getAllForms(token);
  const forms = res.isOk ? res.data : [];

  return (
    <div>
      <TaskForm types={forms} type="own" />
    </div>
  );
};

export default CreateOwnTask;
