import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Check,
  User as UserIcon,
  UserCogIcon,
  ChevronDown,
} from 'lucide-react';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { User } from '@/lib/types/user.types';
import { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { getUserList } from '@/lib/service/user';
import { List } from '@/lib/types/global.types';

interface UserSelectProps {
  value?: string;
  onChange?: (userId: string) => void;
  placeholder?: string;
  error?: FieldError;
  name?: string;
  branchId?: string;
  disabled?: boolean;
  required?: boolean;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  value = '',
  branchId,
  onChange,
  placeholder = 'Алба хаагч сонгох',
  error,
  name = '',
  disabled = false,
}) => {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [listUsers, setListUsers] = useState<List<User>>({
    totalPages: 1,
    currentPage: 1,
    rows: [],
    total: 0,
  });
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [manualChanged, setManualChanged] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>(null);

  const getSearchUsers = useCallback(
    async (q: string | undefined = '') => {
      const res = await getUserList(q, accessToken);
      if (res.code == 200) {
        setListUsers(res.data);
      }
    },
    [accessToken, branchId]
  );

  useEffect(() => {
    getSearchUsers(branchId ? `branchId=${branchId}` : '');
  }, [getSearchUsers, branchId]);

  const getSelectedUsers = useCallback(async () => {
    if (value && !manualChanged) {
      const res = await getUserList(`userIds=${value}`, accessToken);
      if (res.code === 200) {
        setSelectedUsers(res.data.rows);
      }
    }
  }, [value, accessToken]);

  useEffect(() => {
    getSelectedUsers();
  }, [getSelectedUsers]);

  const handleToggleUser = (user: User) => {
    if (disabled) return;

    setSelectedUsers([user]);
    setManualChanged(true);
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
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      let query = `search=${e.target.value}`;
      if (branchId) {
        query = `${query}&branchId=${branchId}`;
      }
      getSearchUsers(query);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const user = listUsers?.rows?.find((u) => u._id === value);

  const notSelectedUsers = listUsers?.rows?.filter((u) => u._id !== value);

  return (
    <div className="relative w-full">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Main Select Container */}
      <div
        className={cn(
          `min-h-[42px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background flex flex-wrap gap-1 items-center transition-colors ${
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-accent/50'
          } ${
            error
              ? 'border-destructive focus-within:ring-destructive'
              : 'border-input focus-within:ring-2 focus-within:ring-ring'
          } ${isOpen ? 'ring-2 ring-ring' : ''}`
        )}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
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

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        className="max-h-[500px]"
      >
        <CommandInput
          placeholder="Хайх..."
          onChangeCapture={handleSearchChange}
        />
        <div className="max-h-[450px]">
          <div className="py-2 px-2 overflow-y-auto h-full">
            <p className="text-sm mb-2 text-primary">Боломжит алба хаагчид</p>
            {/* <Label>Алба хаагчид</Label> */}
            {notSelectedUsers?.length > 0 ? (
              notSelectedUsers?.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors`}
                  onClick={() => {
                    handleToggleUser(user);
                  }}
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
            ) : (
              <div className="py-6 text-center text-sm">Үр дүн олдсонгүй.</div>
            )}

            {selectedUsers?.length > 0 ? (
              <div>
                <p className="text-sm mt-4 mb-2 text-primary">
                  Сонгогдсон алба хаагчид
                </p>
                {selectedUsers?.map((user) => (
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
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </CommandDialog>
      {/* Error Message */}
      {error && (
        <span className="text-sm font-medium text-destructive">
          {error.message}
        </span>
      )}
    </div>
  );
};
