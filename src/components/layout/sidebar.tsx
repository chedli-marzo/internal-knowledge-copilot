"use client";

import { Database, FileText } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

/** Section heading used inside the sidebar. */
function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="text-text-secondary flex items-center gap-2 px-3 text-xs font-semibold tracking-wide uppercase">
      <Icon className="size-3.5" />
      {children}
    </div>
  );
}

/**
 * Left sidebar. Holds uploaded documents and retrieved citations.
 * Scaffold only — real document/citation content arrives in Step 5.
 */
export function Sidebar() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 py-4">
        <section className="space-y-2">
          <SectionTitle icon={FileText}>Documents</SectionTitle>
          <p className="text-text-muted px-3 text-sm">
            No documents yet. Upload company files to build the knowledge base.
          </p>
        </section>

        <Separator className="mx-3 w-auto" />

        <section className="space-y-2">
          <SectionTitle icon={Database}>Citations</SectionTitle>
          <p className="text-text-muted px-3 text-sm">
            Sources used in answers will appear here.
          </p>
        </section>
      </div>
    </ScrollArea>
  );
}
