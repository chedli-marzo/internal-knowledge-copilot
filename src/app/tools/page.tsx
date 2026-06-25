import { AppShell } from "@/components/layout/app-shell";
import { Chat } from "@/components/chat/chat";

/**
 * Operations Assistant — the tool-calling demo (T1-3).
 * Same chat backend (/api/chat), which can call getOrder / getCustomer /
 * getSupplier. Tool calls are shown inline in the conversation.
 */
export default function ToolsPage() {
  return (
    <AppShell>
      <Chat />
    </AppShell>
  );
}
