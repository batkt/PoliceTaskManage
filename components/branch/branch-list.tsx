'use client';

import { format } from 'date-fns';
import { Branch } from '@/lib/types/branch.types';
import { usePathname, useRouter } from 'next/navigation';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import { ColumnHeader } from '../data-table-v2/column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useAuth } from '@/context/auth-context';
import BranchCreateModal from './branch-create-modal';
import BranchUpdateModal from './branch-update-modal';
import { QuestionModal } from '../question-modal';
import { deleteBranch } from '@/ssr/actions/branch';
import { useToast } from '@/hooks/use-toast';

export function BranchList({
  data,
  params,
}: {
  data: Branch[];
  params: TableParams;
}) {
  const [openUpdateModal, setUpdateModalOpen] = useState(false);
  const [openChildRegisterModal, setOpenChildRegisterModal] = useState(false);
  const [selectedData, setSelectedData] = useState<Branch>();
  const [showQuestionDeleteModal, setShowQuestionDeleteModal] = useState(false);
  const { authUser, accessToken } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const questionDelete = (branch: Branch) => {
    setShowQuestionDeleteModal(true);
    setSelectedData(branch);
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteBranch(selectedData?._id!, pathname, accessToken);
        if (res.isOk) {
          toast({
            title: 'Амжилттай',
            description: 'Алба, хэлтэс устлаа.',
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
          description: message || 'Алба, хэлтэс устгахад алдаа гарлаа. Дахин оролдоно уу.',
          variant: 'destructive',
        });
      }
    })
  }

  const columns: ColumnDef<Branch>[] = [
    {
      key: '_id',
      header: (props) => {
        return <ColumnHeader {...props} title="ID" />;
      },
      renderCell: (row) => {
        return (
          <div>{row._id}</div>
        );
      },
    },
    {
      key: 'name',
      header: (props) => {
        return <ColumnHeader {...props} title="Нэр" />;
      },
      renderCell: (row) => <div>{row.name}</div>,
    },
    {
      key: 'createdDate',
      header: (props) => {
        return <ColumnHeader {...props} title="Элссэн огноо" />;
      },
      renderCell: (row) => {
        const dateValue = row.createdAt as string;
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

  if (["super-admin"].includes(authUser?.role || "")) {
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
                setOpenChildRegisterModal(true);
              }}>Салбар нэгж үүсгэх</DropdownMenuItem>
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

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={data}
        params={params}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      // toolbar={
      //   <BranchListToolbar
      //     filters={params.filters}
      //     onChangeFilter={handleFilterChange}
      //   />
      // }
      />
      {
        <BranchCreateModal
          open={openChildRegisterModal}
          parent={selectedData}
          onOpenChange={setOpenChildRegisterModal}
        />
      }
      {
        openUpdateModal && (<BranchUpdateModal
          data={selectedData}
          open={openUpdateModal}
          onOpenChange={setUpdateModalOpen}
        />)
      }

      {
        showQuestionDeleteModal && (
          <QuestionModal open={showQuestionDeleteModal} onOpenChange={setShowQuestionDeleteModal}
            title="Алба хэлтэс устгах"
            description="Та энэ алба, хэлтсийг устгахдаа итгэлтэй байна уу? Устгасан мэдээллийг сэргээх боломжгүй."
            loading={isPending}
            onConfirm={handleDelete}
            cancelText="Үгүй"
            confirmText="Тийм"
            loadingText="Устгаж байна..."
          />

        )
      }
    </div>
  );
}
