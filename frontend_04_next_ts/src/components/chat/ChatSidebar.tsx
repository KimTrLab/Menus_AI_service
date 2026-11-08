"use client";

import { useState } from "react";
import { useChat } from "@/features/chat/hooks/useChat";

export default function ChatSidebar() {
  const [question, setQuestion] = useState("");

  const {
    messages,
    loading,
    sendMessage
  } = useChat();

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const value = question;
    setQuestion("");

    await sendMessage(value);
  };

  return (
    <aside className="chat-sidebar">
      <h2>🤖 AI 메뉴 도우미</h2>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "user-message"
                : "bot-message"
            }
          >
            <div>{message.content}</div>

            {message.sources &&
              message.sources.length > 0 && (
                <div className="chat-sources">
                  📚 참고 메뉴:
                  {" "}{message.sources.join(", ")}
                </div>
              )}
          </div>
        ))}

        {loading && (
          <div className="bot-message">
            🤖 답변을 생각하고 있습니다...
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <textarea
          value={question}
          placeholder="메뉴에 관해 질문하세요..."
          rows={2}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
        >
          전송
        </button>
      </div>
    </aside>
  );
}