'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import CreateTaskDialog from './create-task-dialog';
import { Plus } from 'lucide-react';

const AddTaskButton = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="md:hidden"
        onClick={() => {
          setIsOpenDialog(true);
        }}
      >
        <Plus />
      </Button>
      <Button
        className="max-md:hidden"
        onClick={() => {
          setIsOpenDialog(true);
        }}
      >
        Даалгавар нэмэх
      </Button>
      {isOpenDialog && (
        <CreateTaskDialog
          open={isOpenDialog}
          onHide={() => {
            setIsOpenDialog(false);
          }}
        ></CreateTaskDialog>
      )}
    </>
  );
};

export default AddTaskButton;
