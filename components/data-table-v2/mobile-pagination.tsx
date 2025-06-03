import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from './pagination';

const MobilePagination = ({
  pagination,
  onNextPage = () => {},
  onPrevPage = () => {},
}: {
  pagination?: Pagination;
  onNextPage: (page: number) => void;
  onPrevPage: (page: number) => void;
}) => {
  const {
    page = 1,
    totalPages = 1,
    total = 0,
    pageSize = 10,
  } = pagination || {};
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Нийт: {total} мөр
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground">Хуудас: {page}</div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPrevPage(page - 1)}
          disabled={page <= 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onNextPage(page)}
          disabled={!(page < totalPages)}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default MobilePagination;
