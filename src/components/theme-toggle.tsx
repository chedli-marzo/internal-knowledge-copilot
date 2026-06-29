"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const noop = () => () => {};

/** True only after the component has mounted on the client. Lets us guard
 *  against hydration mismatch without calling setState inside an effect:
 *  the server snapshot is `false`, the client snapshot is `true`. */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Light/dark switch for the header. Guards against hydration mismatch by
 *  only resolving the current theme after mount. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {/* Render a stable icon until mounted to avoid SSR mismatch. */}
          {mounted && isDark ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Light mode" : "Dark mode"}</TooltipContent>
    </Tooltip>
  );
}
