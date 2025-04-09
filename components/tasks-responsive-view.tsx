"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TasksCardView } from "@/components/tasks-card-view";
import { TasksTableView } from "@/components/tasks-table-view";

export function TasksResponsiveView({ status = "all" }: { status?: string }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <TasksCardView status={status} />
  ) : (
    <TasksTableView status={status} />
  );
}
