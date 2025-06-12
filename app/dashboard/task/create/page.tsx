import { TaskForm } from '@/components/task/task-create-form';
import { getOwnBranches } from '@/ssr/service/branch';
import { getAllForms } from '@/ssr/service/form';
import React from 'react';

const CreateTask = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const params = await searchParams;
  const res = await getAllForms();
  const resBranch = await getOwnBranches();
  return (
    <div>
      <TaskForm
        types={res.data}
        branches={resBranch.data}
        formTemplateId={params.formId}
      />
    </div>
  );
};

export default CreateTask;
