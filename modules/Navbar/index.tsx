import React from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Map } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black">
            <Map size={18} strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight">PathCanvas</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/gallery"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Gallery
          </Link>
          <Button variant="primary" size="sm" className="hidden sm:flex">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};
