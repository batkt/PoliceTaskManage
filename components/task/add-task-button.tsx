'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import CreateTaskDialog from './create-task-dialog';
import { Plus } from 'lucide-react';

const AddTaskButton = ({
  me = false,
  onlyIconButton = false,
}: {
  onlyIconButton?: boolean;
  me?: boolean;
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      {!onlyIconButton ? (
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
        </>
      ) : (
        <Button
          size="icon"
          className="size-10"
          onClick={() => {
            setIsOpenDialog(true);
          }}
        >
          <Plus />
        </Button>
      )}

      {isOpenDialog && (
        <CreateTaskDialog
          open={isOpenDialog}
          me={me}
          onHide={() => {
            setIsOpenDialog(false);
          }}
        ></CreateTaskDialog>
      )}
    </>
  );
};

export default AddTaskButton;
