'use client';

import { httpRequest } from '@/lib/http.utils';
import { Notification } from '../types/notification.types';
import { List } from '../types/global.types';

export const getNotifications = async (token?: string) => {
  return httpRequest.get<List<Notification>>('/notification/list', token);
};

export const getUnseenCount = async (token?: string) => {
  return httpRequest.get<number>('/notification/unseenCount', token);
};
