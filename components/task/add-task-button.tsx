'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import CreateTaskDialog from './create-task-dialog';

const AddTaskButton = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      <Button
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
