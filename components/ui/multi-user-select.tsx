import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Check, User as UserIcon, UserCogIcon } from 'lucide-react';
import { User } from '@/lib/types/user.types';
import { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { getUserList } from '@/lib/service/user';
import { useAuth } from '@/context/auth-context';
import { List } from '@/lib/types/global.types';

interface MultiUserSelectProps {
  value?: string[];
  onChange?: (userIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  error?: FieldError;
  name?: string;
  branchId?: string;
  disabled?: boolean;
  required?: boolean;
}

export const MultiUserSelect: React.FC<MultiUserSelectProps> = ({
  value = [],
  onChange,
  placeholder = 'Алба хаагч сонгох',
  error,
  name = 'members',
  branchId,
  disabled = false,
  required = false,
}) => {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [manualChanged, setManualChanged] = useState(false);

  const [listUsers, setListUsers] = useState<List<User>>({
    totalPages: 1,
    currentPage: 1,
    rows: [],
    total: 0,
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const searchTimeout = useRef<NodeJS.Timeout>(null);

  const getSearchUsers = useCallback(
    async (q: string | undefined = '') => {
      const res = await getUserList(q, accessToken);
      if (res.code == 200) {
        setListUsers(res.data);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    getSearchUsers(branchId ? `branchId=${branchId}` : '');
  }, [getSearchUsers, branchId]);

  const getSelectedUsers = useCallback(async () => {
    if (value?.length > 0 && !manualChanged) {
      const res = await getUserList(`userIds=${value?.join('|')}`, accessToken);
      if (res.code === 200) {
        setSelectedUsers(res.data.rows);
      }
    }
  }, [value, accessToken]);

  useEffect(() => {
    getSelectedUsers();
  }, [getSelectedUsers]);

  useEffect(() => {}, [value]);

  const handleToggleUser = (user: User) => {
    if (disabled) return;

    setManualChanged(true);
    const isSelected = value.some((selected) => selected === user._id);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((selected) => selected !== user._id);
      setSelectedUsers((prev) => {
        return prev?.filter((p) => p._id !== user._id);
      });
    } else {
      newValue = [...value, user._id];
      setSelectedUsers((prev) => {
        return [...prev, user];
      });
    }

    onChange?.(newValue);
  };

  const handleRemoveUser = (userId: string, e?: React.MouseEvent) => {
    if (disabled) return;
    e?.stopPropagation();
    const newValue = value.filter((_userId) => _userId !== userId);
    setSelectedUsers((prev) => {
      return prev?.filter((p) => p._id !== userId);
    });
    onChange?.(newValue);
  };

  const isUserSelected = (userId: string) => {
    return value.some((_userId) => _userId === userId);
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

  const firstThree = value.slice(0, 3);
  const notSelectedUsers = listUsers?.rows?.filter(
    (u) => !value?.includes(u._id)
  );
  return (
    <div className="relative w-full">
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(value.map((user) => user))}
      />

      {/* Main Select Container */}
      <div
        className={cn(
          `min-h-[42px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background flex items-center transition-colors ${
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
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={!!error}
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground select-none">
            {placeholder}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1 items-center">
            {firstThree?.map((userId) => {
              const user = selectedUsers.find((u) => u._id === userId);
              if (!user) {
                return null;
              }

              return (
                <div
                  key={user._id}
                  className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs"
                >
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-2 h-2" />
                  </div>
                  <span className="max-w-[120px] truncate">
                    {user.givenname} {user.surname}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveUser(user._id, e)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${user.givenname} ${user.surname}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
            {value.length > 3 ? (
              <div className="ms-2 px-2 border rounded-sm bg-secondary text-secondary-foreground flex items-center justify-center">
                +{value.length - 3}
              </div>
            ) : null}
          </div>
        )}
        <Search className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
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
                          {user.surname?.[0]}.{user.givenname}
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

            <p className="text-sm mb-2 mt-4 text-primary">
              Боломжит алба хаагчид
            </p>
            {/* <Label>Алба хаагчид</Label> */}
            {notSelectedUsers?.length > 0 ? (
              notSelectedUsers?.map((user) => (
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
                        {user.surname?.[0]}.{user.givenname}
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
