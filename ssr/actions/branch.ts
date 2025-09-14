"use server";

import { BACKEND_URL } from "@/lib/config";
import { ssrClient } from "../client";
import { revalidatePath } from "next/cache";
import { Branch, BranchInput } from "@/lib/types/branch.types";

export const createBranch = async (data: BranchInput, path: string) => {
  const res = await ssrClient.post<Branch>(
    `${BACKEND_URL}/api/branch/create`,
    data
  );

  if (res.code === 200) {
    revalidatePath(path);
  }
  return res;
};

export const updateBranch = async (data: Partial<Branch>, path: string) => {
  const res = await ssrClient.post<Branch>(
    `${BACKEND_URL}/api/branch/update`,
    data
  );
  if (res.code === 200) {
    revalidatePath(path);
  }
  return res;
};
