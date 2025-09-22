"use server";
import { OfficerRegistrationData } from "@/lib/types/officer.types";
import { ssrClient } from "../client";
import { BACKEND_URL } from "@/lib/config";
import { revalidatePath } from "next/cache";
import { User } from "@/lib/types/user.types";

export const registerUser = async (
  data: Omit<OfficerRegistrationData, "joinedDate"> & { joinedDate: string },
  path: string
) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/register`, data);
  revalidatePath(path);
  return res;
};

export const updateUser = async (data: Partial<User>, path: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/update`, data);
  revalidatePath(path);
  return res;
};

export const changeUserPassword = async (
  userId: string,
  newPassword: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/user/changeUserPassword`,
    {
      userId,
      newPassword,
    }
  );
  return res;
};

export const deleteUser = async (userId: string, path: string) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/delete/${userId}`);

  if (res.code === 200) {
    revalidatePath(path);
  }
  return res;
};
