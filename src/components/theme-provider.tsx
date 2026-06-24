"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** App-wide theme provider. Toggles the `.dark` class on <html> (class-based
 *  dark mode, matching our tokens in globals.css). */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
