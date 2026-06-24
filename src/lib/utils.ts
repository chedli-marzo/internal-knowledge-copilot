import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely.
 * clsx handles conditionals; tailwind-merge dedupes conflicting utilities
 * (e.g. `px-2 px-4` -> `px-4`). Used by every UI component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
