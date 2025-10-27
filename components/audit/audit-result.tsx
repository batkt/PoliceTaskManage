'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn, formatDateFull } from '@/lib/utils';
import { Audit } from '@/lib/types/audit.types';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { User } from '@/lib/types/user.types';
import { Card, CardContent, CardTitle } from '../ui/card';

const AuditResult = ({ data, users = [] }: { data: Audit[] | null, users?: User[] }) => {
  if (!data) {
    return null;
  }

  return (
    <>
      {
        users?.length > 0 ?
          <div className='space-y-2'>
            <Label className='text-muted-foreground'>Хяналт хийх алба хаагч</Label>
            <div className='flex gap-2'>
              {users.map(item => (<div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item?.profileImageUrl} />
                    <AvatarFallback className="text-xs bg-background">
                      {item?.givenname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{item?.givenname}</span>
                </div>
              </div>))
              }</div>
          </div> : null
      }
      {data?.map((item) => {
        return (
          <div key={item._id} className="px-2 py-4 border rounded-md relative">
            <div className="absolute left-2 -top-4">
              <Badge
                className="w-fit"
                variant={item.result === 'approved' ? 'success' : 'destructive'}
              >
                {item.result === 'approved' ? 'Зөвшөөрсөн' : 'Татгалзсан'}
              </Badge>
            </div>
            {
              item.result === 'approved' && item?.point ? (
                <div className='text-sm mb-2'>Үнэлгээ: {item.point}</div>
              ) : null
            }
            <div
              className={cn(
                'text-muted-foreground text-sm mb-2',
                item?.comments ? 'mb-2' : 'm-0'
              )}
            >
              {item?.comments}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 pe-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item?.checkedBy?.profileImageUrl} />
                  <AvatarFallback className="text-xs bg-background">
                    {item?.checkedBy?.givenname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{item?.checkedBy?.givenname}</span>
              </div>
              <div className="text-muted-foreground text-sm">
                {formatDateFull(item.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AuditResult;
