'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import { OfficerRegisterModal } from './officer-register-modal';

const OfficerRegisterButton = () => {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setRegisterModalOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Бүртгэх
      </Button>
      <OfficerRegisterModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
      />
    </>
  );
};

export default OfficerRegisterButton;
