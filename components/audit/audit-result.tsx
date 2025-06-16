'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn, formatDateFull } from '@/lib/utils';
import { Audit } from '@/lib/types/audit.types';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

const AuditResult = ({ data }: { data: Audit[] | null }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Label>Хяналтын мэдээлэл</Label>
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
    </div>
  );
};

export default AuditResult;
