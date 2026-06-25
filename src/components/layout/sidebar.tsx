"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  FileText,
  MessageSquare,
  Sparkles,
  Boxes,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
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

const NAV_LINKS = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tools", label: "Operations Assistant", icon: Wrench },
  { href: "/extract", label: "Extraction", icon: Sparkles },
  { href: "/showcase", label: "UI Showcase", icon: Boxes },
];

/**
 * Left sidebar. Top: navigation between pages. Below: uploaded documents and
 * retrieved citations (scaffold — real content arrives in Step 5).
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 py-4">
        <nav className="space-y-1 px-3">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  "focus-visible:ring-ring outline-none focus-visible:ring-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="mx-3 w-auto" />

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
