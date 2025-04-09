"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function SearchNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          variant="outline"
          className="relative flex h-9 w-9 p-0 xl:h-10 xl:w-60 md:ml-[-16rem] xl:justify-start xl:px-3 xl:py-2"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Хайх...</span>
          <span className="sr-only">Хайх</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Хайх..." />
        <CommandList>
          <CommandEmpty>Үр дүн олдсонгүй.</CommandEmpty>
          <CommandGroup heading="Хуудсууд">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Хянах самбар</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Даалгаврууд</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/jobs"))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Ажлын хяналт</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/officers"))
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Цагдаагийн бүртгэл</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/statistics"))
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Статистик</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Үйлдлүүд">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/jobs?status=planned"))
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Эхлээгүй ажлууд</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/jobs?status=assigned"))
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Хуваарилагдсан ажлууд</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/officers/new"))
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Шинэ ажилтан бүртгэх</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
