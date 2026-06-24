"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * Application layout shell.
 *
 *  Desktop: Header on top, fixed 320px Sidebar on the left, main content right.
 *  Mobile (< md): Sidebar collapses into a left drawer (Sheet) opened from the
 *  header menu button.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header
        onMenuClick={() => setMobileNavOpen(true)}
        onUploadClick={() => {
          // Upload flow is wired in Step 5.
        }}
      />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="border-border bg-surface hidden w-80 shrink-0 border-r md:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar drawer */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="bg-surface w-80 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="bg-background min-w-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
