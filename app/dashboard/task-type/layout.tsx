import { getLoggedUser } from '@/ssr/service/user';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const TaskTypeLayout = async ({ children }: { children: ReactNode }) => {
  const loggedUser = await getLoggedUser();
  if (loggedUser?.role === 'super-admin') {
    return <>{children}</>;
  }
  redirect('/dashboard');
};

export default TaskTypeLayout;
