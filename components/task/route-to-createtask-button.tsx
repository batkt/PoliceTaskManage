'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const RouteToCreatetaskButton = ({
  formTemplateId,
}: {
  formTemplateId: string;
}) => {
  const { authUser } = useAuth();

  if (['super-admin', 'admin'].includes(authUser?.role || '')) {
    return (
      <Button type="button" size="icon" className="size-10" asChild>
        <Link href={`/dashboard/task/create?formId=${formTemplateId}`}>
          <Plus />
        </Link>
      </Button>
    );
  }
  return null;
};

export default RouteToCreatetaskButton;
