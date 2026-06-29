import { AppShell } from "@/components/layout/app-shell";
import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <AppShell>
      <Chat />
    </AppShell>
  );
}
