import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { getAllForms } from '@/ssr/service/form';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Tasks - Task Management System',
  description: 'Police Department Task Management System Tasks',
};

export default async function TasksPage() {
  const resForms = await getAllForms();

  const typesData = resForms?.data || [];
  const sorted = typesData?.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Даалгаврын жагсаалт
        </h2>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {sorted?.map((formTemplate) => {
              return (
                <Link
                  key={formTemplate._id}
                  href={`/dashboard/tasks/${formTemplate._id}`}
                >
                  <Card>
                    <CardContent className="py-10 text-2xl font-bold text-center hover:bg-muted/50 cursor-pointer">
                      {formTemplate.name}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
