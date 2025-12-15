import { ssrClient } from "../client";
import { BACKEND_URL } from "@/lib/config";
import { TaskReport } from "@/lib/types/task.types";

export const getReportList = async (queryString?: string, token?: string) => {
  return ssrClient.get<TaskReport[]>(
    `${BACKEND_URL}/api/task-v2/report-list${queryString ? `?${queryString}` : ""
    }`,
    token
  );
};
