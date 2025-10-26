import { List } from "@/lib/types/global.types";
import { ssrClient } from "../client";
import { BACKEND_URL } from "@/lib/config";

export const getReportList = async (queryString?: string) => {
  return ssrClient.get<List<any>>(
    `${BACKEND_URL}/api/task-v2/report-list${queryString ? `?${queryString}` : ""}`
  );
};
