import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Check,
  User as UserIcon,
  UserCogIcon,
  ChevronDown,
} from 'lucide-react';
import { User } from '@/lib/types/user.types';
import { FieldError } from 'react-hook-form';

interface UserSelectProps {
  users: User[];
  value?: string;
  onChange?: (userId: string) => void;
  placeholder?: string;
  maxHeight?: string;
  error?: FieldError;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  users = [],
  value = '',
  onChange,
  placeholder = 'Алба хаагч сонгох',
  maxHeight = '200px',
  error,
  name = '',
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.surname.toLowerCase().includes(query) ||
        user.givenname.toLowerCase().includes(query) ||
        (user.position && user.position.toLowerCase().includes(query)) ||
        (user.branch?.name && user.branch?.name.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  const handleToggleUser = (user: User) => {
    if (disabled) return;

    onChange?.(user._id);
    setIsOpen(!isOpen);
  };

  const isUserSelected = (userId: string) => {
    return value === userId;
  };

  const handleContainerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const user = users?.find((u) => u._id === value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Main Select Container */}
      <div
        className={`min-h-[42px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background flex flex-wrap gap-1 items-center transition-colors ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-accent/50'
        } ${
          error
            ? 'border-destructive focus-within:ring-destructive'
            : 'border-input focus-within:ring-2 focus-within:ring-ring'
        } ${isOpen ? 'ring-2 ring-ring' : ''}`}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={!!error}
      >
        {!user ? (
          <span className="text-muted-foreground select-none">
            {placeholder}
          </span>
        ) : (
          <div
            key={user._id}
            className="inline-flex items-center rounded-sm text-sm"
          >
            <span>
              {user.givenname} {user.surname}
            </span>
          </div>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 ml-auto flex-shrink-0" />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Алба хаагч хайх..."
                autoFocus={false}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* User List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
            role="listbox"
            aria-label="User selection list"
          >
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {searchQuery
                  ? 'Хайлтад тохирох алба хаагч олдсонгүй.'
                  : 'Алба хаагчдын мэдээлэл олдсонгүй.'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors`}
                  onClick={() => handleToggleUser(user)}
                  role="option"
                  aria-selected={isUserSelected(user._id)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <UserCogIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate flex items-center gap-2">
                      <span>
                        {user.givenname} {user.surname}
                      </span>
                      {user.position && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                          {user.position}
                        </span>
                      )}
                    </div>
                    {user.branch?.name && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.branch?.name}
                      </div>
                    )}
                  </div>
                  {isUserSelected(user._id) && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span className="text-sm font-medium text-destructive">
          {error.message}
        </span>
      )}
    </div>
  );
};
