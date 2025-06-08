'use client';
import React, { useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchInput = ({
  placeholder = 'Хайх',
  value,
  onChange,
  className,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) => {
  const timer = useRef<NodeJS.Timeout>(null);
  const [text, setText] = useState(value || '');

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={text}
        type="text"
        onChange={(event) => {
          const val = event.target.value;
          setText(val);
          if (timer?.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            onChange?.(val);
          }, 700);
        }}
        className={cn('pl-10 max-md:w-full md:max-w-[240px]', className)}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-1 h-4 w-8 flex items-start justify-center">
        <Search className="size-4" />
      </div>
    </div>
  );
};

export default SearchInput;
