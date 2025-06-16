import { TaskForm } from '@/components/task/task-create-form';
import { getAllForms } from '@/ssr/service/form';
import React from 'react';

const CreateOwnTask = async () => {
  const res = await getAllForms();

  return (
    <div>
      <TaskForm types={res.data} type="own" />
    </div>
  );
};

export default CreateOwnTask;
