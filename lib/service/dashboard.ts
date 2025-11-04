'use client';

import { httpRequest } from '@/lib/http.utils';

export const getMasterDashboard = async (params?: string, token?: string) => {
    return httpRequest.get<any>(`/dashboard/master?${params}`, token);
};