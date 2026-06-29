/**
 * Design tokens — AI Knowledge Copilot
 *
 * Single source of truth for raw token VALUES (JS side).
 * The live theme is driven by CSS variables in `globals.css`; this file mirrors
 * those values for anywhere JS needs them (e.g. charts, canvas, inline styles).
 * Keep the two in sync.
 */

export const lightColors = {
  background: "#FFFFFF",
  surface: "#F9FAFB",
  surfaceSecondary: "#F3F4F6",
  border: "#E5E7EB",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },
  primary: {
    DEFAULT: "#2563EB",
    hover: "#1D4ED8",
    foreground: "#FFFFFF",
  },
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  citation: "#EEF2FF",
} as const;

export const darkColors = {
  background: "#0F172A",
  surface: "#111827",
  surfaceSecondary: "#1F2937",
  border: "#374151",
  text: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    muted: "#9CA3AF",
  },
  primary: {
    DEFAULT: "#3B82F6",
    hover: "#60A5FA",
    foreground: "#FFFFFF",
  },
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  citation: "#1E293B",
} as const;

export const fontFamily = {
  sans: ["Inter", "system-ui", "sans-serif"],
} as const;

export const fontSize = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const borderRadius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
} as const;

export const boxShadow = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 8px rgba(0,0,0,0.08)",
  lg: "0 8px 24px rgba(0,0,0,0.10)",
} as const;

/** Fixed layout dimensions (from spec). */
export const layout = {
  headerHeight: "64px",
  sidebarWidth: "320px",
  maxContentWidth: "1400px",
} as const;
