"use server";
import { OfficerRegistrationData } from "@/lib/types/officer.types";
import { ssrClient } from "../client";
import { BACKEND_URL } from "@/lib/config";
import { revalidatePath } from "next/cache";
import { User } from "@/lib/types/user.types";

export const registerUser = async (
  data: Omit<OfficerRegistrationData, "joinedDate"> & { joinedDate: string },
  path: string,
  accessToken?: string
) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/register`, data, accessToken);
  revalidatePath(path);
  return res;
};

export const updateUser = async (data: Partial<User>, path: string, accessToken?: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/update`, data, accessToken);
  revalidatePath(path);
  return res;
};

export const changeUserPassword = async (
  userId: string,
  newPassword: string,
  accessToken?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/user/changeUserPassword`,
    {
      userId,
      newPassword,
    },
    accessToken
  );
  return res;
};

export const deleteUser = async (userId: string, path: string, accessToken?: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/delete/${userId}`, accessToken);

  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};

export const dismissal = async (userId: string, path: string, accessToken?: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/dismissal`, {
    id: userId,
  }, accessToken);

  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};
