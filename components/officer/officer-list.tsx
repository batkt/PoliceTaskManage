'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { List } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
import { format, set } from 'date-fns';
import { Branch } from '@/lib/types/branch.types';
import { usePathname, useRouter } from 'next/navigation';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import OfficerListToolbar from './toolbar';
import { DataTablePagination } from '../data-table-v2/pagination';
import { ColumnHeader } from '../data-table-v2/column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { OfficerUpdateModal } from './officer-update-modal';
import { useState } from 'react';
import PasswordChangeModal from './password-change-modal';
import { useAuth } from '@/context/auth-context';

import { QuestionModal } from '../question-modal';
import { deleteUser } from '@/ssr/actions/user';
import { useToast } from '@/hooks/use-toast';

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

export function OfficerList({
  data,
  params,
}: {
  data?: List<User>;
  params: TableParams;
}) {
  const total = data?.total || 1;
  const totalPages = data?.totalPages || 1;
  const rows = data?.rows || [];
  const pathname = usePathname();
  const { toast } = useToast();
  const [openUpdateModal, setUpdateModalOpen] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedData, setSelectedData] = useState<User>();
  const [showQuestionDeleteModal, setShowQuestionDeleteModal] = useState(false);
  const { authUser } = useAuth();

  const router = useRouter();

  const questionDelete = (user: User) => {
    setShowQuestionDeleteModal(true);
    setSelectedData(user);
  }

  const handleDelete = async () => {
    try {
      const res = await deleteUser(selectedData?._id!, pathname);
      if (res.code === 200) {
        toast({
          title: 'Амжилттай',
          description: 'Алба хаагч устлаа.',
          variant: 'success',
        });
        setShowQuestionDeleteModal(false);
        return;
      }
      throw new Error(res.message);
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error?.message;
      }
      toast({
        title: 'Алдаа гарлаа',
        description: message || 'Алба хаагч устгахад алдаа гарлаа. Дахин оролдоно уу.',
        variant: 'destructive',
      });
    }
  }

  const columns: ColumnDef<User & { status?: string }>[] = [
    {
      key: 'givenname',
      header: (props) => {
        return <ColumnHeader {...props} title="Нэр" />;
      },
      renderCell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32`}
                alt={row.givenname}
              />
              <AvatarFallback>
                {row.givenname?.toString().substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium">{row.givenname}</div>
          </div>
        );
      },
    },
    {
      key: 'workerId',
      header: (props) => {
        return <ColumnHeader {...props} title="Код" />;
      },
      renderCell: (row) => <div>{row.workerId}</div>,
    },
    {
      key: 'role',
      header: (props) => {
        return <ColumnHeader {...props} title="Үүрэг" />;
      },
      renderCell: (row) => <div>{row.role == "super-admin" ? "Супер админ" : row.role === "admin" ? "Админ" : "Хэрэглэгч"}</div>,
    },
    {
      key: 'rank',
      header: (props) => {
        return <ColumnHeader {...props} title="Цол" />;
      },
      renderCell: (row) => <div>{row.rank}</div>,
    },
    {
      key: 'branch',
      header: (props) => {
        return <ColumnHeader {...props} title="Хэлтэс" className="w-[140px]" />;
      },
      renderCell: (row) => {
        const branch = row.branch as Branch;
        if (!branch) {
          return null;
        }
        return <div className="line-clamp-2">{branch?.name}</div>;
      },
    },
    {
      key: 'position',
      header: (props) => {
        return <ColumnHeader {...props} title="Албан тушаал" />;
      },
      renderCell: (row) => <div>{row.position}</div>,
    },
    {
      key: 'status',
      header: () => {
        return <div className="text-center">Төлөв</div>;
      },
      renderCell: (row) => {
        return <Badge variant={'success'}>Идэвхитэй</Badge>;
      },
    },
    {
      key: 'joinedDate',
      header: (props) => {
        return <ColumnHeader {...props} title="Элссэн огноо" />;
      },
      renderCell: (row) => {
        const dateValue = row.joinedDate as string;
        if (!dateValue) {
          return null;
        }
        return (
          <div className="text-center">
            {format(new Date(dateValue), 'yyyy-MM-dd')}
          </div>
        );
      },
      enableSort: true,
    }
  ];

  if (["super-admin", "admin"].includes(authUser?.role || "")) {
    columns.push({
      key: 'action',
      header: (props) => {
        return <ColumnHeader {...props} title="Үйлдэл" />;
      },
      renderCell: (row) => {

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Цэс нээх</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setSelectedData(row);
                setUpdateModalOpen(true);
              }}>Засах</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedData(row);
                setOpenPasswordModal(true);
              }}>Нууц үг солих</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => questionDelete(row)}>Устгах</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }
  const handleSortChange = (key: string, direction: 'asc' | 'desc' | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', key);
    if (direction) url.searchParams.set('order', direction);
    else {
      url.searchParams.delete('sort');
      url.searchParams.delete('order');
    }
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

  const handlePageSizeChange = (pageSize: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('pageSize', pageSize.toString());
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={rows}
        params={params}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        toolbar={
          <OfficerListToolbar
            filters={params.filters}
            onChangeFilter={handleFilterChange}
          />
        }
      />
      <DataTablePagination
        pagination={{
          total,
          totalPages,
          page: params.page,
          pageSize: params.pageSize,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      {
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

      }
      {
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
    </div>
  );
}
