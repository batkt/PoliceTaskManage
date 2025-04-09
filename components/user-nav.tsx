"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User2 } from "lucide-react";

export function UserNav() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/user.png" alt="user" />
              <AvatarFallback>ЦЕГ</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Б. Батболд</p>
              <p className="text-xs leading-none text-muted-foreground">
                batbold@police.gov.mn
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Тохиргоо</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/")}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Гарах</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
