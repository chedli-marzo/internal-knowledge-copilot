import { AppShell } from "@/components/layout/app-shell";
import { KnowledgeCopilot } from "@/components/copilot/knowledge-copilot";

/** Knowledge Copilot (T1-5) — upload PDFs and ask grounded, cited questions. */
export default function CopilotPage() {
  return (
    <AppShell>
      <KnowledgeCopilot />
    </AppShell>
  );
}
