"use server";

import { BACKEND_URL } from "@/lib/config";
import { ssrClient } from "../client";
import { revalidatePath } from "next/cache";
import { Branch, BranchInput } from "@/lib/types/branch.types";

export const createBranch = async (data: BranchInput, path: string, accessToken?: string) => {
  const res = await ssrClient.post<Branch>(
    `${BACKEND_URL}/api/branch/create`,
    data,
    accessToken
  );

  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};

export const updateBranch = async (data: Partial<Branch>, path: string, accessToken?: string) => {
  const res = await ssrClient.post<Branch>(
    `${BACKEND_URL}/api/branch/update`,
    data,
    accessToken
  );
  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};

export const deleteBranch = async (branchId: string, path: string, accessToken?: string) => {
  const res = await ssrClient.post<{ deletedCount: number }>(
    `${BACKEND_URL}/api/branch/delete/${branchId}`,
    accessToken
  );

  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};
