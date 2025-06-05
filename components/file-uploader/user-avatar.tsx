import { User } from '@/lib/types/user.types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = 'sm',
  showName = false,
  className = '',
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
        <AvatarFallback className={textSizes[size]}>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar> */}
      {showName && (
        <span className={`${textSizes[size]} text-gray-700 font-medium`}>
          {user.givenname}
        </span>
      )}
    </div>
  );
}
