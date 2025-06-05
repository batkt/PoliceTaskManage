'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const SearchInput = ({
  placeholder = 'Хайх',
  value,
  searchKey = 'name',
}: {
  placeholder: string;
  value?: string;
  searchKey: string;
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="relative md:w-[240px]">
      <Input
        id="search"
        type="text"
        value={searchValue}
        placeholder={placeholder}
        className="pr-10"
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        onClick={() => {
          router.push(
            `${pathname}${searchValue ? `?${searchKey}=${searchValue}` : ''}`
          );
        }}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
};

export default SearchInput;
