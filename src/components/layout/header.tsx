"use client";

import { BookOpen, Menu, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderProps = {
  /** Opens the mobile navigation drawer (only shown < md). */
  onMenuClick?: () => void;
  /** Opens the document upload flow (wired in a later step). */
  onUploadClick?: () => void;
};

/** Top navigation bar. Fixed 64px height (spec). */
export function Header({ onMenuClick, onUploadClick }: HeaderProps) {
  return (
    <header className="border-border bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <BookOpen className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">Knowledge Copilot</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button size="sm" onClick={onUploadClick}>
          <Upload className="size-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
