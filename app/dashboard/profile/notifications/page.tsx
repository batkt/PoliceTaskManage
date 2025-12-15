import { TableParams } from '@/components/data-table-v2';
import NotificationList from '@/components/notification/notification-list';
import ProfileLayout from '@/components/profile/layout';
import { getNotificaitonList } from '@/ssr/service/notificatoin';
import { isAuthenticated } from '@/ssr/util';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const Notification = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;

  const params: TableParams = {
    page: Number(searchParams.page ?? 1),
    pageSize: Number(searchParams.pageSize ?? 10),
    sort: searchParams?.sort as string,
    order: (searchParams?.order as 'asc' | 'desc' | null) ?? null,
    filters: Object.fromEntries(
      Object.entries(searchParams).filter(
        ([k]) => !['page', 'pageSize', 'sort', 'order'].includes(k)
      )
    ),
  };

  const token = await isAuthenticated();
  const notificationRes = await getNotificaitonList(undefined, token);

  const notifications = notificationRes.isOk ? notificationRes.data : {
    rows: [],
    total: 0,
    totalPages: 1,
    currentPage: 1
  };

  return (
    <ProfileLayout active="notification">
      <NotificationList data={notifications} params={params} />
    </ProfileLayout>
  );
};

export default Notification;
