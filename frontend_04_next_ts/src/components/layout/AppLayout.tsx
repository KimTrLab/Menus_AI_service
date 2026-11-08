import ChatSidebar from "@/components/chat/ChatSidebar";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({
  children
}: Props) {
  return (
    <div className="app-layout">
      <ChatSidebar />

      <main className="main-area">
        {children}
      </main>
    </div>
  );
}