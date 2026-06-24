"use client";

/**
 * UI primitives showcase.
 *
 * Dev/validation page (not part of the product). Lists every shadcn primitive
 * in the sidebar; click one to render a live demo in the main panel.
 * Route: /showcase
 */

import { useState } from "react";
import {
  Boxes,
  CreditCard,
  PanelRightOpen,
  MessageSquareWarning,
  Info,
  ScrollText,
  Type,
  TextCursorInput,
  Tag,
  Minus,
  Loader,
  Tags,
  Moon,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

type Primitive = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Short note shown above the demo. */
  note: string;
  render: () => React.ReactNode;
};

const PRIMITIVES: Primitive[] = [
  {
    id: "button",
    label: "Button",
    icon: Boxes,
    note: "Primary actions. Variants + sizes.",
    render: () => (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    ),
  },
  {
    id: "card",
    label: "Card",
    icon: CreditCard,
    note: "Content container.",
    render: () => (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Supplier Report</CardTitle>
          <CardDescription>Generated from 12 documents</CardDescription>
        </CardHeader>
        <CardContent className="text-text-secondary text-sm">
          Lead times improved 14% across the last quarter.
        </CardContent>
        <CardFooter>
          <Button size="sm">View</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    id: "sheet",
    label: "Sheet",
    icon: PanelRightOpen,
    note: "Slide-out panel. Used for the mobile sidebar later.",
    render: () => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Documents</SheetTitle>
            <SheetDescription>
              Uploaded company documentation appears here.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button>Done</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    id: "dialog",
    label: "Dialog",
    icon: MessageSquareWarning,
    note: "Modal.",
    render: () => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document?</DialogTitle>
            <DialogDescription>
              This removes it from the knowledge base. Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "tooltip",
    label: "Tooltip",
    icon: Info,
    note: "Hover hint.",
    render: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Relevance: 92%</TooltipContent>
      </Tooltip>
    ),
  },
  {
    id: "scroll-area",
    label: "ScrollArea",
    icon: ScrollText,
    note: "Scrollable container.",
    render: () => (
      <ScrollArea className="border-border h-48 w-64 rounded-md border p-4">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="text-sm">
              Citation #{i + 1} — page {i + 3}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
  },
  {
    id: "textarea",
    label: "Textarea",
    icon: Type,
    note: "Multi-line input. Chat input is built on this.",
    render: () => (
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="t">Ask a question</Label>
        <Textarea id="t" placeholder="What were Q3 supplier lead times?" />
      </div>
    ),
  },
  {
    id: "input",
    label: "Input",
    icon: TextCursorInput,
    note: "Single-line input.",
    render: () => (
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="i">Search documents</Label>
        <Input id="i" placeholder="invoice, supplier, lead time…" />
      </div>
    ),
  },
  {
    id: "badge",
    label: "Badge",
    icon: Tag,
    note: "Status indicator.",
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Ready</Badge>
        <Badge variant="secondary">Processing</Badge>
        <Badge variant="outline">PDF</Badge>
        <Badge variant="destructive">Failed</Badge>
      </div>
    ),
  },
  {
    id: "separator",
    label: "Separator",
    icon: Minus,
    note: "Divider.",
    render: () => (
      <div className="max-w-sm">
        <p className="text-sm">Documents</p>
        <Separator className="my-3" />
        <p className="text-sm">Citations</p>
      </div>
    ),
  },
  {
    id: "skeleton",
    label: "Skeleton",
    icon: Loader,
    note: "Loading placeholder.",
    render: () => (
      <div className="max-w-sm space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
  },
  {
    id: "label",
    label: "Label",
    icon: Tags,
    note: "Accessible form label.",
    render: () => (
      <div className="flex items-center gap-2">
        <Label htmlFor="x">Field label</Label>
        <Input id="x" className="w-48" placeholder="value" />
      </div>
    ),
  },
];

export default function ShowcasePage() {
  const [activeId, setActiveId] = useState(PRIMITIVES[0].id);
  const [dark, setDark] = useState(false);
  const active = PRIMITIVES.find((p) => p.id === activeId)!;

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-border flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Boxes className="text-primary size-5" />
          <span className="font-semibold">UI Primitives</span>
          <Badge variant="secondary">{PRIMITIVES.length}</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="border-border bg-surface w-72 shrink-0 border-r">
          <ScrollArea className="h-full">
            <nav className="space-y-1 p-3">
              {PRIMITIVES.map((p) => {
                const Icon = p.icon;
                const isActive = p.id === activeId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      "focus-visible:ring-ring outline-none focus-visible:ring-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {p.label}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main panel */}
        <main className="min-w-0 flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-semibold">{active.label}</h1>
            <p className="text-text-secondary mt-1 text-sm">{active.note}</p>
            <Separator className="my-6" />
            <div className="bg-surface border-border rounded-lg border p-8 shadow-sm">
              {active.render()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
