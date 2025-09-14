'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import BranchCreateModal from './branch-create-modal';

const BranchRegisterButton = () => {
    const { authUser } = useAuth();
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    if (['super-admin'].includes(authUser?.role || '')) {
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
                <BranchCreateModal
                    open={registerModalOpen}
                    onOpenChange={setRegisterModalOpen}
                />
            </>
        );
    }
};

export default BranchRegisterButton;
