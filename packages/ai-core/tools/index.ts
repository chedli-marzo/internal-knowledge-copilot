import { tool } from "ai";

/**
 * Shared tool framework.
 *
 * Re-exports the AI SDK `tool` primitive so all app tools are defined through the
 * package, and provides a consistent logging convention. (We expose `tool`
 * rather than wrapping it, so each tool keeps its precise input/output types.)
 */

export { tool };
export type { Tool, ToolSet } from "ai";

/** Standard log line for a tool call — call this at the top of every execute(). */
export function logToolCall(name: string, input: unknown): void {
  console.log(`[tool] ${name}`, input);
}
