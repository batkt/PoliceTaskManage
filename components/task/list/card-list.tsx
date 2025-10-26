'use client';

import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Task, TaskStatus, TaskStatusChangeType } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';
import { Card } from '../../ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import MobilePagination from '../../data-table-v2/mobile-pagination';
import { usePathname, useRouter } from 'next/navigation';
import { queryStringBuilder } from '@/lib/query.util';
import { TableParams } from '../../data-table-v2';
import StatusBadge from '../status-badge';
import PriorityBadge from '../priority-badge';
import TaskListToolbar from './toolbar';
import { changeStatusAction } from '@/ssr/actions/task';
import { useToast } from '@/hooks/use-toast';

export function MyTaskCardList({
  data,
  params,
  tableKey = 'my-tasks',
  clickToDetail = false,
}: {
  data?: List<Task>;
  params: {
    startDate?: string,
    sort?: string,
    order?: 'asc' | 'desc' | null,
    filters: Record<string, string | undefined>;
  };
  tableKey?: string;
  clickToDetail?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

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

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  const goToDetail = (row: Task) => {
    router.push(`/dashboard/task/detail/${row._id}`);
  };

  const handleChangeStatus = async (data: TaskStatusChangeType) => {
    const res = await changeStatusAction(data, pathname);

    if (res.code === 200) {
      let text = 'Төлөвлөгөөг амжилттай эхлүүллээ';
      if (data.status === 'completed') {
        text = 'Төлөвлөгөөг амжилттай гүйцэтгэж дууслаа';
      }
      toast({
        variant: 'success',
        title: 'Амжилттай.',
        description: text,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Алдаа гарлаа.',
        description: res.message || 'Системийн алдаа',
      });
    }
  };

  // const changePage = (_page: number) => {
  //   const query = queryStringBuilder({
  //     page: _page,
  //     pageSize: pageSize,
  //   });
  //   router.push(`${pathname}?${query}`);
  // };

  return (
    <div className="space-y-4">
      <TaskListToolbar
        tableKey={tableKey}
        filters={params.filters}
        onChangeFilter={handleFilterChange}
      />
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
              const now = new Date();
              const today = new Date(now.toDateString());
              const dueDate = task?.dueDate
                ? new Date(task.dueDate)
                : Date.now();
              const assignee = task.assignee;
              return (
                <Card
                  key={task._id}
                  onClick={() => {
                    if (clickToDetail) {
                      goToDetail(task);
                    }
                  }}
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
                        <div className="flex items-center text-sm font-medium truncate">
                          <StatusBadge status={task.status} onlyIcon />
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground truncate">
                            {task._id}
                          </span>
                        </div>
                      </div>
                    </div>
                    {tableKey === 'my-tasks' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Цэс нээх</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => goToDetail(task)}>
                            Дэлгэрэнгүй
                          </DropdownMenuItem>
                          {['pending', 'active'].includes(task.status) ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeStatus({
                                  status: TaskStatus.IN_PROGRESS,
                                  taskId: task._id,
                                })
                              }
                            >
                              Хийж эхлэх
                            </DropdownMenuItem>
                          ) : null}

                          {task.status === TaskStatus.IN_PROGRESS ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeStatus({
                                  status: TaskStatus.COMPLETED,
                                  taskId: task._id,
                                })
                              }
                            >
                              Дуусгах
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="!text-red-600 hover:!bg-red-500/20">
                            Устгах
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
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
                            today > dueDate && 'text-destructive'
                          )}
                        >
                          Дуусах огноо
                        </p>
                        <p
                          className={cn(
                            'truncate font-medium',
                            now > dueDate && 'text-destructive'
                          )}
                        >
                          {format(dueDate, 'yyyy-MM-dd')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee?.profileImageUrl} />
                          <AvatarFallback className="text-xs">
                            {assignee?.givenname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 font-medium text-sm flex items-center">
                          {assignee?.givenname}
                        </div>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {/* <MobilePagination
            pagination={{
              page: page,
              pageSize: pageSize,
              total: total,
              totalPages: totalPages,
            }}
            onNextPage={changePage}
            onPrevPage={changePage}
          /> */}
        </div>
      )}
    </div>
  );
}
