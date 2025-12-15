"use server";

import { BACKEND_URL } from "@/lib/config";
import { ssrClient } from "../client";
import {
  AttachFileInput,
  CreateMemoTaskType,
  CreateWorkGroupTaskType,
  ICreateTaskInput,
  TaskStatus,
  TaskStatusChangeType,
} from "@/lib/types/task.types";
import { revalidatePath } from "next/cache";
import { CreateFormData } from "@/lib/types/task-type.types";
import { UploadedFile } from "@/lib/types/file.types";

export const createMemoTask = async (
  data: CreateMemoTaskType,
  path: string,
  accessToken?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/task/createMemoTask`,
    data,
    accessToken
  );
  revalidatePath(path);
  return res;
};

export const createWorkGroupTask = async (
  data: CreateWorkGroupTaskType,
  path: string,
  accessToken?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/task/createWorkGroupTask`,
    data,
    accessToken
  );
  revalidatePath(path);
  return res;
};

export const changeStatusAction = async (
  data: TaskStatusChangeType,
  path?: string,
  accessToken?: string
) => {
  const { status, taskId, summary } = data;
  let res;
  if (status === TaskStatus.COMPLETED) {
    res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/complete`, {
      taskId,
      summary,
    }, accessToken);
  } else {
    res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/start`, {
      taskId,
    }, accessToken);
  }

  if (path) revalidatePath(path);
  return res;
};

export const createTask = async (data: ICreateTaskInput, accessToken?: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/`, data, accessToken);
  return res;
};

export const createForm = async (data: CreateFormData, accessToken?: string) => {
  return ssrClient.post<boolean>(`${BACKEND_URL}/api/form/`, data);
};

export const assignTask = async (data: {
  taskId: string;
  assignTo: string;
}, accessToken?: string) => {
  return ssrClient.post<boolean>(`${BACKEND_URL}/api/task-v2/assign`, data, accessToken);
};

export const attachFile = async (data: AttachFileInput, accessToken?: string) => {
  return ssrClient.post<UploadedFile[]>(
    `${BACKEND_URL}/api/task-v2/file`,
    data,
    accessToken
  );
};

export const removeFile = async (data: AttachFileInput, accessToken?: string) => {
  return ssrClient.post<UploadedFile[]>(
    `${BACKEND_URL}/api/task-v2/removeFile`,
    data,
    accessToken
  );
};
