import { isAuthenticated } from '@/ssr/util';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const token = await isAuthenticated();

  if (!!token) {
    redirect('/dashboard');
  }
  return <>{children}</>;
};

export default AuthLayout;
