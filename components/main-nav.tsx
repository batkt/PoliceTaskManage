"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Хянах самбар",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/tasks",
      label: "Даалгавар",
      active: pathname === "/dashboard/tasks",
    },
    // {
    //   href: "/dashboard/reports",
    //   label: "Өөрийн тайлан",
    //   active: pathname === "/dashboard/reports",
    // },
    // {
    //   href: "/dashboard/deputies",
    //   label: "Дэд удирдлага",
    //   active: pathname === "/dashboard/deputies",
    // },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-10">
      <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
        <span className="hidden font-bold sm:inline-block">
          Даалгаврын Удирдлагын Систем
        </span>
      </Link>
      <nav className="hidden gap-4 md:flex">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-base font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {routes.map((route) => (
            <DropdownMenuItem key={route.href} asChild>
              <Link href={route.href}>{route.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
