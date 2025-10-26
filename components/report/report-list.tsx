'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { List } from '@/lib/types/global.types';
import { format } from 'date-fns';
import { Branch } from '@/lib/types/branch.types';
import { usePathname, useRouter } from 'next/navigation';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import { DataTablePagination } from '../data-table-v2/pagination';
import { ColumnHeader } from '../data-table-v2/column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

import { QuestionModal } from '../question-modal';
import { deleteUser, dismissal } from '@/ssr/actions/user';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '../task/status-badge';
import { FormTemplate } from '@/lib/types/form.types';
import { Task } from '@/lib/types/task.types';

// const columnInformations = [
//   {
//     key: 'givenname',
//     name: 'Нэр',
//   },
//   {
//     key: 'rank',
//     name: 'Цол',
//   },
//   {
//     key: 'branch',
//     name: 'Хэлтэс',
//   },
//   {
//     key: 'position',
//     name: 'Албан тушаал',
//   },
//   {
//     key: 'status',
//     name: 'Төлөв',
//   },
//   {
//     key: 'joinedDate',
//     name: 'Элссэн огноо',
//   },
// ];

export function ReportList({
  data = [],
  params,
  type,
  isArchived = false
}: {
  data?: Task[];
  params: TableParams;
  isArchived?: boolean,
  type: 'weekly' | 'monthly' | 'quarterly' | 'halfYearly' | 'yearly';
}) {
  // const total = data?.total || 1;
  // const totalPages = data?.totalPages || 1;
  // const rows = data?.rows || [];
  const pathname = usePathname();
  const { toast } = useToast();
  const [openUpdateModal, setUpdateModalOpen] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDismissalModal, setOpenDismissalModal] = useState(false);
  // const [selectedData, setSelectedData] = useState<User>();
  const [showQuestionDeleteModal, setShowQuestionDeleteModal] = useState(false);
  const { authUser } = useAuth();

  const router = useRouter();

  // const questionDelete = (user: User) => {
  //   setShowQuestionDeleteModal(true);
  //   setSelectedData(user);
  // }

  // const handleDelete = async () => {
  //   try {
  //     const res = await deleteUser(selectedData?._id!, pathname);
  //     if (res.code === 200) {
  //       toast({
  //         title: 'Амжилттай',
  //         description: 'Алба хаагч устлаа.',
  //         variant: 'success',
  //       });
  //       setShowQuestionDeleteModal(false);
  //       return;
  //     }
  //     throw new Error(res.message);
  //   } catch (error) {
  //     let message = '';
  //     if (error instanceof Error) {
  //       message = error?.message;
  //     }
  //     toast({
  //       title: 'Алдаа гарлаа',
  //       description: message || 'Алба хаагч устгахад алдаа гарлаа. Дахин оролдоно уу.',
  //       variant: 'destructive',
  //     });
  //   }
  // }

  // const handleDismissal = async () => {
  //   try {
  //     const res = await dismissal(selectedData?._id!, pathname);
  //     if (res.code === 200) {
  //       toast({
  //         title: 'Амжилттай',
  //         description: 'Алба хаагчийг чөлөөллөө.',
  //         variant: 'success',
  //       });
  //       setOpenDismissalModal(false);
  //       return;
  //     }
  //     throw new Error(res.message);
  //   } catch (error) {
  //     let message = '';
  //     if (error instanceof Error) {
  //       message = error?.message;
  //     }
  //     toast({
  //       title: 'Алдаа гарлаа',
  //       description: message || 'Алба хаагч чөлөөлөхөд алдаа гарлаа. Дахин оролдоно уу.',
  //       variant: 'destructive',
  //     });
  //   }
  // }

  const columns: ColumnDef<Task>[] = [
    {
      key: 'title',
      header: (props) => (
        <ColumnHeader
          {...props}
          title="Даалгаварын нэр"
          className="max-w-[200px] w-[140px]"
        />
      ),
      renderCell: (row) => (
        <div className="font-medium whitespace-nowrap truncate">
          {row.title}
        </div>
      ),
    },
    {
      key: 'formTemplateId',
      header: (props) => (
        <ColumnHeader
          {...props}
          title="Төрөл"
          className="max-w-[200px] w-[140px]"
        />
      ),
      renderCell: (row) => {
        const formTemplate = row.formTemplateId as FormTemplate;
        return (
          <div className="font-medium whitespace-nowrap truncate">
            {formTemplate?.name}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: (props) => (
        <div className="flex items-center justify-center">
          <ColumnHeader {...props} title="Төлөв" />
        </div>
      ),

      renderCell: (row) => {
        return (
          <div className="flex justify-center items-center">
            <StatusBadge status={row.status} />
          </div>
        );
      },
    }
  ];

  // if (["super-admin", "admin"].includes(authUser?.role || "") && !isArchived) {
  //   columns.push({
  //     key: 'action',
  //     header: (props) => {
  //       return <ColumnHeader {...props} title="Үйлдэл" />;
  //     },
  //     renderCell: (row) => {

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Цэс нээх</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => {
  //               setSelectedData(row);
  //               setUpdateModalOpen(true);
  //             }}>Засах</DropdownMenuItem>
  //             <DropdownMenuItem onClick={() => {
  //               setSelectedData(row);
  //               setOpenPasswordModal(true);
  //             }}>Нууц үг солих</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => {
  //               setSelectedData(row);
  //               setOpenDismissalModal(true);
  //             }}>Чөлөөлөх</DropdownMenuItem>
  //             <DropdownMenuItem className="text-red-600" onClick={() => questionDelete(row)}>Устгах</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   });
  // }

  // const handleSortChange = (key: string, direction: 'asc' | 'desc' | null) => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set('sort', key);
  //   if (direction) url.searchParams.set('order', direction);
  //   else {
  //     url.searchParams.delete('sort');
  //     url.searchParams.delete('order');
  //   }
  //   url.searchParams.set('page', '1');
  //   router.push(url.toString());
  // };

  // const handleFilterChange = (key: string, value: string) => {
  //   const url = new URL(window.location.href);
  //   if (value) url.searchParams.set(key, value);
  //   else url.searchParams.delete(key);
  //   url.searchParams.set('page', '1');
  //   router.push(url.toString());
  // };

  // const handlePageChange = (page: number) => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set('page', page.toString());
  //   router.push(url.toString());
  // };

  // const handlePageSizeChange = (pageSize: number) => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set('pageSize', pageSize.toString());
  //   url.searchParams.set('page', '1');
  //   router.push(url.toString());
  // };

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={data}
        params={params}
      // onSortChange={handleSortChange}
      // onFilterChange={handleFilterChange}
      // toolbar={
      //   <OfficerListToolbar
      //     filters={params.filters}
      //     onChangeFilter={handleFilterChange}
      //   />
      // }
      />
      {/* <DataTablePagination
        pagination={{
          total,
          totalPages,
          page: params.page,
          pageSize: params.pageSize,
        }}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      /> */}
      {/* {
        openUpdateModal && (<OfficerUpdateModal
          data={selectedData}
          open={openUpdateModal}
          onOpenChange={setUpdateModalOpen}
        />)
      }

      {
        openPasswordModal && (<PasswordChangeModal
          open={openPasswordModal}
          userId={selectedData?._id!}
          onOpenChange={setOpenPasswordModal}
        />)
      } */}
      {/* {
        showQuestionDeleteModal && (
          <QuestionModal open={showQuestionDeleteModal} onOpenChange={setShowQuestionDeleteModal}
            title="Алба хаагч устгах"
            description="Та энэ алба хаагчийг устгахдаа итгэлтэй байна уу? Устгасан алба хаагчийн мэдээллийг сэргээх боломжгүй."
            onConfirm={handleDelete}
            cancelText="Үгүй"
            confirmText="Тийм"
          />

        )
      }
      {
        openDismissalModal && (
          <QuestionModal open={openDismissalModal} onOpenChange={setOpenDismissalModal}
            title="Алба хаагч чөлөөлөх"
            description="Та энэ алба хаагчийг ажлаас чөлөөлөхдөө итгэлтэй байна уу? Алба хаагчийн мэдээлэл архивлагдах болно."
            onConfirm={handleDismissal}
            cancelText="Үгүй"
            confirmText="Тийм"
          />

        )
      } */}
    </div>
  );
}
