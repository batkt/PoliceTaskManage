'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { OfficerRegisterModal } from './officer-register-modal';
import { useAuth } from '@/context/auth-context';

const OfficerRegisterButton = () => {
  const { authUser } = useAuth();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  if (['super-admin', 'admin'].includes(authUser?.role || '')) {
    return (
      <>
        <Button
          type="button"
          size="icon"
          className="size-10"
          onClick={() => setRegisterModalOpen(true)}
        >
          <Plus />
        </Button>
        <OfficerRegisterModal
          open={registerModalOpen}
          onOpenChange={setRegisterModalOpen}
        />
      </>
    );
  }
};

export default OfficerRegisterButton;
