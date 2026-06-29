"use client";

import { Cpu } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PROVIDERS,
  PROVIDER_LABELS,
  type ProviderId,
} from "@ikc/ai-core/chat";

/**
 * Runtime provider switch (T1-6). Lets the user pick which AI provider answers.
 * The choice is sent with each message as `provider`.
 */
export function ProviderSelect({
  value,
  onChange,
  className,
}: {
  value: ProviderId;
  onChange: (p: ProviderId) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "border-border bg-surface text-text-secondary inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
        className,
      )}
    >
      <Cpu className="size-3.5" />
      <span className="hidden sm:inline">Provider</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProviderId)}
        className="text-foreground cursor-pointer bg-transparent font-medium outline-none"
        aria-label="AI provider"
      >
        {PROVIDERS.map((p) => (
          <option key={p} value={p}>
            {PROVIDER_LABELS[p]}
          </option>
        ))}
      </select>
    </label>
  );
}
