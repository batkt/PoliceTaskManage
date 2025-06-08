'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, UserPlus } from 'lucide-react';
import { OfficerRegisterModal } from './officer-register-modal';

const OfficerRegisterButton = () => {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

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
};

export default OfficerRegisterButton;
