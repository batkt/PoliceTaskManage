"use client";

import React, { useState } from 'react'
import { Card } from '../ui/card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Task, TaskStatus, TaskStatusChangeType } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import PriorityBadge from './priority-badge';
import {
    isSameDay,
    isWithinInterval,
    startOfDay,
    endOfDay,
    differenceInDays,
    format,
    compareAsc
} from 'date-fns';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { changeStatusAction } from '@/ssr/actions/task';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';

const TaskItem = ({
    task,
    className,
    handleChangeStatus,
    goToDetail
}: {
    task: Task,
    className?: string,
    handleChangeStatus?: (data: TaskStatusChangeType) => Promise<void>;
    goToDetail: (row: Task) => void;
}) => {
    const cardVariants = cva("p-2 cursor-pointer", {
        variants: {
            variant: {
                default: "",
                completed: "bg-green-500/20 border-green-500",
                pending: "bg-gray-500/20 border-gray-500",
                active: "bg-blue-500/20 border-blue-500",
                in_progress: "bg-yellow-500/20 border-yellow-200",
                reviewed: "bg-purple-500/20 border-purple-500",
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    })

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Card className={cn(cardVariants({ variant: task.status, className }))}>
                    <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium line-clamp-3 ${task.status === TaskStatus.COMPLETED ? 'line-through' : ''}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {task.description}
                                </p>
                            )}
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuItem onClick={() => goToDetail?.(task)}>
                    Дэлгэрэнгүй
                </ContextMenuItem>
                {['pending', 'active'].includes(task.status) ? (
                    <ContextMenuItem
                        onClick={() =>
                            handleChangeStatus?.({
                                status: TaskStatus.IN_PROGRESS,
                                taskId: task._id,
                            })
                        }
                    >
                        Хийж эхлэх
                    </ContextMenuItem>
                ) : null}
                {task.status === TaskStatus.IN_PROGRESS ? (
                    <ContextMenuItem
                        onClick={() =>
                            handleChangeStatus?.({
                                status: TaskStatus.COMPLETED,
                                taskId: task._id,
                            })
                        }
                    >
                        Дуусгах
                    </ContextMenuItem>
                ) : null}
            </ContextMenuContent>
        </ContextMenu>
    )
}
const MultiDayTaskItem = ({
    task,
    className,
    handleChangeStatus,
    goToDetail
}: {
    task: Task,
    className?: string
    handleChangeStatus?: (data: TaskStatusChangeType) => Promise<void>;
    goToDetail: (row: Task) => void;
}) => {
    const cardVariants = cva("p-2 cursor-pointer border transition-all hover:shadow-md", {
        variants: {
            variant: {
                default: "",
                completed: "bg-green-500/20 border-green-500",
                pending: "bg-gray-500/20 border-gray-500",
                active: "bg-blue-500/20 border-blue-500",
                in_progress: "bg-yellow-500/20 border-yellow-200",
                reviewed: "bg-purple-500/20 border-purple-500",
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    })

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className={cn(cardVariants({ variant: task.status, className }), "rounded-lg")}>
                    <div className="flex items-start gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold line-clamp-2 ${task.status === TaskStatus.COMPLETED ? 'line-through' : ''}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {task.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.dueDate), 'MMM d')}
                                </p>
                                <PriorityBadge priority={task.priority} />
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuItem onClick={() => goToDetail?.(task)}>
                    Дэлгэрэнгүй
                </ContextMenuItem>
                {['pending', 'active'].includes(task.status) ? (
                    <ContextMenuItem
                        onClick={() =>
                            handleChangeStatus?.({
                                status: TaskStatus.IN_PROGRESS,
                                taskId: task._id,
                            })
                        }
                    >
                        Хийж эхлэх
                    </ContextMenuItem>
                ) : null}
                {task.status === TaskStatus.IN_PROGRESS ? (
                    <ContextMenuItem
                        onClick={() =>
                            handleChangeStatus?.({
                                status: TaskStatus.COMPLETED,
                                taskId: task._id,
                            })
                        }
                    >
                        Дуусгах
                    </ContextMenuItem>
                ) : null}
            </ContextMenuContent>
        </ContextMenu>
    )
}

interface TaskSpan {
    startIndex: number;
    span: number;
}

const getTaskSpan = (task: Task, weekDates: Date[]): TaskSpan => {
    const taskStart = startOfDay(new Date(task.startDate))
    const taskEnd = startOfDay(new Date(task.dueDate))
    const weekStart = startOfDay(weekDates[0])
    const weekEnd = endOfDay(weekDates[6])

    // Тухайн долоо хоногт харагдах хэсгийг тооцоолох
    const visibleStart = taskStart < weekStart ? weekStart : taskStart
    const visibleEnd = taskEnd > weekEnd ? weekEnd : taskEnd

    const startIndex = differenceInDays(visibleStart, weekStart)
    const span = differenceInDays(visibleEnd, visibleStart) + 1

    return {
        startIndex: Math.max(0, startIndex),
        span: Math.min(span, 7 - startIndex)
    }
}

// Хоёр даалгавар давхцаж байгаа эсэхийг шалгах
const tasksOverlap = (task1: Task, task2: Task, weekDates: Date[]): boolean => {
    const span1 = getTaskSpan(task1, weekDates)
    const span2 = getTaskSpan(task2, weekDates)

    const end1 = span1.startIndex + span1.span - 1
    const end2 = span2.startIndex + span2.span - 1

    return !(end1 < span2.startIndex || end2 < span1.startIndex)
}

// Олон өдрийн даалгавруудыг мөрөнд хуваах (давхцахгүй, createdAt дарааллаар)
const organizeMultiDayTasks = (tasks: Task[], weekDates: Date[]): Task[][] => {
    // createdAt-аар эрэмбэлэх (эхэндээ үүссэн нь эхэнд)
    const sortedTasks = [...tasks].sort((a, b) =>
        compareAsc(new Date(a.createdAt), new Date(b.createdAt))
    )

    const rows: Task[][] = []

    sortedTasks.forEach(task => {
        let placed = false

        // Одоо байгаа мөрнүүдээс давхцахгүй байр хайх
        for (let i = 0; i < rows.length; i++) {
            const rowHasOverlap = rows[i].some(existingTask =>
                tasksOverlap(task, existingTask, weekDates)
            )

            if (!rowHasOverlap) {
                rows[i].push(task)
                placed = true
                break
            }
        }

        // Давхцахгүй байр олдоогүй бол шинэ мөр үүсгэх
        if (!placed) {
            rows.push([task])
        }
    })

    return rows
}

const WeeklyList = ({
    data
}: {
    data: List<Task>
}) => {
    const { rows: tasks } = data
    console.log("data ", data)
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date()
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Даваа гараг
        return new Date(today.setDate(diff))
    })
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const weekDays = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням']

    const goToDetail = (row: Task) => {
        router.push(`/dashboard/task/detail/${row._id}`);
    };

    const getWeekDates = () => {
        const dates = []
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart)
            date.setDate(currentWeekStart.getDate() + i)
            dates.push(date)
        }
        return dates
    }

    const weekDates = getWeekDates()

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeekStart)
        newDate.setDate(newDate.getDate() - 7)
        setCurrentWeekStart(newDate);
        const url = new URL(window.location.href);
        url.searchParams.set('startDate', newDate.toISOString().split('T')[0]);
        router.push(url.toString());
    }

    const goToNextWeek = () => {
        const newDate = new Date(currentWeekStart)
        newDate.setDate(newDate.getDate() + 7)
        setCurrentWeekStart(newDate)
        const url = new URL(window.location.href);
        url.searchParams.set('startDate', newDate.toISOString().split('T')[0]);
        router.push(url.toString());
    }

    const goToCurrentWeek = () => {
        const today = new Date()
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1)
        setCurrentWeekStart(new Date(today.setDate(diff)))
        const url = new URL(window.location.href);
        url.searchParams.set('startDate', today.toISOString().split('T')[0]);
        router.push(url.toString());
    }

    // Нэг өдрийн даалгавруудыг авах
    const getSingleDayTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            const taskStart = startOfDay(new Date(task.startDate))
            const taskEnd = startOfDay(new Date(task.dueDate))
            const targetDate = startOfDay(date)

            return isSameDay(taskStart, taskEnd) && isSameDay(taskStart, targetDate)
        })
    }

    // Олон өдөр үргэлжлэх даалгавруудыг авах
    const getMultiDayTasks = () => {
        return tasks.filter(task => {
            const taskStart = startOfDay(new Date(task.startDate))
            const taskEnd = startOfDay(new Date(task.dueDate))
            const weekStart = startOfDay(weekDates[0])
            const weekEnd = endOfDay(weekDates[6])

            const isDifferentDay = !isSameDay(taskStart, taskEnd)
            const overlapsWeek = isWithinInterval(taskStart, { start: weekStart, end: weekEnd }) ||
                isWithinInterval(taskEnd, { start: weekStart, end: weekEnd }) ||
                (taskStart <= weekStart && taskEnd >= weekEnd)

            return isDifferentDay && overlapsWeek
        })
    }

    const isToday = (date: Date) => {
        return isSameDay(date, new Date())
    }

    const multiDayTaskRows = organizeMultiDayTasks(getMultiDayTasks(), weekDates)

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

    return (
        <div>
            <div className="flex w-full justify-between mb-4">
                <div>
                    <p className="text-base text-muted-foreground mt-2">
                        {`${(weekDates[0].getMonth() + 1)} сарын ${weekDates[0].getDate()} - ${(weekDates[6].getMonth() + 1)} сарын ${weekDates[6].getDate()}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={goToPreviousWeek} variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={goToCurrentWeek} variant="outline">
                        Өнөөдөр
                    </Button>
                    <Button onClick={goToNextWeek} variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Долоо хоногийн толгой */}
            <div className="grid grid-cols-7 divide-x border border-b-0 bg-muted/50">
                {weekDays.map((day, index) => (
                    <div key={day} className="p-3 text-center font-semibold">
                        <div className="text-sm">{day}</div>
                        <div className={`text-lg mt-1 ${isToday(weekDates[index]) ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                            {weekDates[index].getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Олон өдөр үргэлжлэх даалгаврууд */}
            {multiDayTaskRows.length > 0 && (
                <div className="p-2 bg-muted/20 border border-b-0 space-y-2">
                    {multiDayTaskRows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="relative"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                                gap: '0.5rem'
                            }}
                        >
                            {row.map((task) => {
                                const { span, startIndex } = getTaskSpan(task, weekDates)
                                return (
                                    <div
                                        key={task._id}
                                        style={{
                                            gridColumnStart: startIndex + 1,
                                            gridColumnEnd: startIndex + span + 1
                                        }}
                                    >
                                        <MultiDayTaskItem task={task} handleChangeStatus={handleChangeStatus} goToDetail={goToDetail} />
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Нэг өдрийн даалгаврууд */}
            <div className="grid grid-cols-7 divide-x border">
                {weekDates.map((date) => {
                    const dayTasks = getSingleDayTasksForDate(date)
                    return (
                        <div key={date.toISOString()} className={`space-y-2 p-2 ${isToday(date) ? 'bg-blue-50/30' : ''}`}>
                            {dayTasks.map((task) => (
                                <TaskItem key={task._id} task={task} handleChangeStatus={handleChangeStatus} goToDetail={goToDetail} />
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WeeklyList