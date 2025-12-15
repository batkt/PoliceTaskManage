import { isAuthenticated } from '@/ssr/util';
import { getLoggedUser } from '@/ssr/service/user';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const TaskTypeLayout = async ({ children }: { children: ReactNode }) => {
  const token = await isAuthenticated();
  const loggedUser = await getLoggedUser(token);
  if (loggedUser?.role === 'super-admin') {
    return <>{children}</>;
  }
  redirect('/dashboard');
};

export default TaskTypeLayout;
