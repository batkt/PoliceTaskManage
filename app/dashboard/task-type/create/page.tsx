'use client';
import React from 'react';
import { TaskTypeBuilder } from '@/components/task-type/task-type-builder';

const TaskTypeCreatePage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Даалгаврын төрөл үүсгэх
          </h2>
          <p className="text-muted-foreground">
            Даалгаврын төрөл үүсгэн, үүссэн төрлөөр шинэ даалгавар бүртгэх
            боломжтой
          </p>
        </div>
      </div>
      <TaskTypeBuilder />
    </div>
  );
};

export default TaskTypeCreatePage;
