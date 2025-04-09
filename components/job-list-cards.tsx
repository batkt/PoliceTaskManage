"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { JobCardSkeleton } from "@/components/job-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobRegistrationDialog } from "@/components/job-registration-dialog";
import { Plus, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for job cards
const jobsData = [
  {
    id: "JOB-001",
    title: "Гэмт хэргийн газар дээр очих",
    status: "completed",
    startDate: "2023-12-01",
    endDate: "2023-12-01",
    assignees: [
      { id: "1", name: "Түвшин", color: "blue" },
      { id: "2", name: "Дэлгэр", color: "red" },
      { id: "3", name: "Пүрэв", color: "green" },
      { id: "4", name: "Анар", color: "purple" },
    ],
    type: "investigation",
    system: "criminal",
    description: "Гэмт хэргийн газар дээр очиж нөхцөл байдлыг шалгах",
    isUrgent: true,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "JOB-002",
    title: "Гэрч нараас мэдүүлэг авах",
    status: "in_progress",
    startDate: "2023-12-05",
    endDate: "2023-12-10",
    assignees: [
      { id: "1", name: "Түвшин", color: "blue" },
      { id: "2", name: "Дэлгэр", color: "red" },
    ],
    type: "investigation",
    system: "criminal",
    description: "Гэрч нараас мэдүүлэг авч тэмдэглэл хөтлөх",
  },
  {
    id: "JOB-003",
    title: "Шөнийн эргүүл",
    status: "planned",
    startDate: "2023-12-15",
    endDate: "2023-12-16",
    assignees: [
      { id: "3", name: "Пүрэв", color: "green" },
      { id: "4", name: "Анар", color: "purple" },
    ],
    type: "patrol",
    system: "administrative",
    description: "Шөнийн эргүүл хийж хяналт тавих",
  },
  {
    id: "JOB-004",
    title: "Сарын тайлан бэлтгэх",
    status: "checking",
    startDate: "2023-12-20",
    endDate: "2023-12-25",
    assignees: [
      { id: "1", name: "Түвшин", color: "blue" },
      { id: "4", name: "Анар", color: "purple" },
    ],
    type: "administrative",
    system: "administrative",
    description: "Сарын тайлан бэлтгэж удирдлагад танилцуулах",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "JOB-005",
    title: "Тээврийн Цагдаагийн Газар",
    status: "assigned",
    startDate: "2023-12-18",
    endDate: "2023-12-20",
    assignees: [
      { id: "2", name: "Дэлгэр", color: "red" },
      { id: "3", name: "Пүрэв", color: "green" },
    ],
    type: "special",
    system: "traffic",
    description: "Тээврийн Цагдаагийн Газарт ажиллах",
  },
];

export function JobListCards({
  status,
  isLoading = false,
}: {
  status: string;
  isLoading?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const term = customEvent.detail;
      if (term) {
        setSearchTerm(term);
      }
    };

    window.addEventListener("globalSearch", handleGlobalSearch);
    return () => {
      window.removeEventListener("globalSearch", handleGlobalSearch);
    };
  }, []);

  // Map the status from URL to the actual status values in the data
  const statusMapping: Record<string, string[]> = {
    all: [],
    planned: ["planned"],
    assigned: ["assigned"],
    checking: ["checking"],
    completed: ["completed"],
  };

  // Filter data based on status prop and search term
  const filteredJobs =
    status === "all" || !statusMapping[status]
      ? jobsData
      : jobsData.filter((job) => statusMapping[status].includes(job.status));

  const searchFilteredJobs = searchTerm
    ? filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredJobs;

  // Sort jobs
  const sortedJobs = [...searchFilteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1"></div>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Эрэмбэлэх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Шинэ эхэндээ</SelectItem>
                <SelectItem value="oldest">Хуучин эхэндээ</SelectItem>
                <SelectItem value="title">Нэрээр</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <JobRegistrationDialog>
              <Button className="sm:w-auto h-9">
                <Plus className=" h-4 w-4" />
              </Button>
            </JobRegistrationDialog>
          </div>
        </div>
      </div>

      {sortedJobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">Ажил олдсонгүй</p>
        </div>
      )}
    </div>
  );
}
