import { ssrClient } from "../client";
import { BACKEND_URL } from "@/lib/config";
import { Report } from "@/lib/types/task.types";

export const getReportList = async (queryString?: string) => {
  return ssrClient.get<Report[]>(
    `${BACKEND_URL}/api/task-v2/report-list${
      queryString ? `?${queryString}` : ""
    }`
  );
};
