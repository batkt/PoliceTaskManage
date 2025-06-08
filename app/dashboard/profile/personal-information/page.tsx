'use client';

import ProfileLayout from '@/components/profile/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { formatDateFull } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  ContactRound,
  Shield,
  User,
} from 'lucide-react';

export default function PersonalInformationPage() {
  const { authUser } = useAuth();

  const getInitials = (surname: string, givenname: string) => {
    return `${surname.charAt(0)}${givenname.charAt(0)}`.toUpperCase();
  };

  const renderRole = (role: string) => {
    if (role === 'super-admin') {
      return 'Супер админ';
    }
    if (role === 'Admin') {
      return 'Админ';
    }
    return 'Хэрэглэгч';
  };

  if (!authUser) {
    return null;
  }
  return (
    <ProfileLayout active="personal-information">
      <Card>
        <CardHeader>
          <div className="flex gap-4 md:gap-6 items-center">
            <Avatar className="size-20 md:size-24">
              <AvatarImage
                src="/placeholder.svg"
                alt={`${authUser?.givenname} ${authUser?.surname}`}
              />
              <AvatarFallback className="text-xl">
                {getInitials(
                  authUser?.surname || 'U',
                  authUser?.givenname || 'U'
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-sm">
                  {authUser?.rank}
                </Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl">
                {authUser?.givenname} {authUser?.surname}
              </CardTitle>

              <p className="text-muted-foreground mt-1 max-md:text-sm">
                Сүүлд нэвтэрсэн: {formatDateFull(new Date())}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Хувийн мэдээлэл</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Овог</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{authUser?.surname}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Нэр</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{authUser?.givenname}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">
                  Алба хаагчийн дугаар
                </Label>
                <div className="flex items-center gap-2">
                  <ContactRound className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{authUser?.workerId}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Цол</Label>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{authUser?.rank}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">
                  Албан тушаал
                </Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{authUser?.position}</p>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label className="text-muted-foreground text-sm">
                  Алба, хэлтэс
                </Label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{authUser?.branch?.name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">Үүрэг</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium capitalize">
                    {renderRole(authUser?.role)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-sm">
                  Элссэн огноо
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {format(
                      authUser?.joinedDate
                        ? new Date(authUser?.joinedDate)
                        : new Date(),
                      'yyyy-MM-dd'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}
