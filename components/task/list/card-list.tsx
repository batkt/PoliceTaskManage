'use client';

import { Button } from '@/components/ui/button';
import { MoreVertical, Trash } from 'lucide-react';
import { Task } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '@/lib/utils';
import { priorities, statuses } from './task-table';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import MobilePagination from '../../data-table-v2/mobile-pagination';
import { usePathname, useRouter } from 'next/navigation';
import { queryStringBuilder } from '@/lib/query.util';
import { TableParams } from '../../data-table-v2';

export function MyTaskCardList({
  data,
  params,
}: {
  data?: List<Task>;
  params: TableParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // const [searchTerm, setSearchTerm] = useState('');
  // const [sortBy, setSortBy] = useState('newest');
  const rows = data?.rows || [];
  const page = params.page || 1;
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const pageSize = params.pageSize || 10;

  //   useEffect(() => {
  //     const handleGlobalSearch = (event: Event) => {
  //       const customEvent = event as CustomEvent;
  //       const term = customEvent.detail;
  //       if (term) {
  //         setSearchTerm(term);
  //       }
  //     };

  //     window.addEventListener('globalSearch', handleGlobalSearch);
  //     return () => {
  //       window.removeEventListener('globalSearch', handleGlobalSearch);
  //     };
  //   }, []);

  // Map the status from URL to the actual status values in the data
  const statusMapping: Record<string, string[]> = {
    all: [],
    planned: ['planned'],
    assigned: ['assigned'],
    checking: ['checking'],
    completed: ['completed'],
  };

  //   if (isLoading) {
  //     return (
  //       <div className="space-y-4">
  //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  //           <div className="relative flex-1">
  //             <Skeleton className="h-10 w-full" />
  //           </div>
  //           <div className="flex flex-wrap items-center gap-2">
  //             <Skeleton className="h-10 w-[180px]" />
  //             <Skeleton className="h-10 w-[120px]" />
  //           </div>
  //         </div>

  //         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  //           {Array.from({ length: 6 }).map((_, i) => (
  //             <JobCardSkeleton key={i} />
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   }

  const changePage = (_page: number) => {
    const query = queryStringBuilder({
      page: _page,
      pageSize: pageSize,
    });
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="space-y-4">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1"></div>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Эрэмбэлэх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Шинэ эхэндээ</SelectItem>s
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
      </div> */}

      {!rows || !rows?.length ? (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">Ажил олдсонгүй</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((task) => {
              const status = statuses.find(
                (status) => status.value === task.status
              );
              const priority = priorities.find(
                (priority) => priority.value === task.priority
              );

              const now = new Date();
              const today = new Date(now.toDateString());
              const endDate = new Date(task.endDate);
              const assignees = [task.assigner];
              return (
                <Card
                  key={task._id}
                  className="overflow-hidden bg-card dark:bg-slate-800 border dark:border-slate-700"
                >
                  {/* {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  className="hidden"
                  onEnded={handleAudioEnded}
                />
              )} */}
                  <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          <rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center text-sm font-medium truncate">
                          {status?.icon && (
                            <status.icon
                              className={cn('mr-2 size-4', status.color)}
                            />
                          )}
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground truncate">
                            {task._id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 ml-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Цэс нээх</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Устгах
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 flex justify-between text-sm">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Эхлэх огноо
                        </p>
                        <p className="truncate font-medium">
                          {format(new Date(task.startDate), 'yyyy-MM-dd')}
                        </p>
                      </div>
                      <div className="text-right min-w-0">
                        <p
                          className={cn(
                            'text-xs text-muted-foreground',
                            today > endDate && 'text-destructive'
                          )}
                        >
                          Дуусах огноо
                        </p>
                        <p
                          className={cn(
                            'truncate font-medium',
                            now > endDate && 'text-destructive'
                          )}
                        >
                          {format(new Date(task.endDate), 'yyyy-MM-dd')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2 overflow-hidden">
                        {assignees.slice(0, 4).map((assigner, index) => (
                          <Avatar
                            key={assigner._id}
                            className={cn(
                              'h-8 w-8 border-2 border-background dark:border-slate-800',
                              `bg-blue-500`
                            )}
                          >
                            <AvatarFallback
                              className={cn(
                                `bg-blue-500 text-white font-medium`
                              )}
                            >
                              {assigner.givenname.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {assignees.length > 4 && (
                          <Avatar className="h-8 w-8 border-2 border-background dark:border-slate-800 bg-muted">
                            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                              +{assignees.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      {priority && (
                        <Badge variant={priority.variant}>
                          {priority.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <MobilePagination
            pagination={{
              page: page,
              pageSize: pageSize,
              total: total,
              totalPages: totalPages,
            }}
            onNextPage={changePage}
            onPrevPage={changePage}
          />
        </div>
      )}
    </div>
  );
}
