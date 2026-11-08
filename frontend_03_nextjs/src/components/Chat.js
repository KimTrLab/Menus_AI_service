"use client";

import { useState } from "react";
import { sendChat } from "@/services/chatService";

export default function Chat() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "안녕하세요! 음식 메뉴에 관해 질문해 주세요."
    }
  ]);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!question.trim() || loading) return;

    const userQuestion = question;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {

      const result = await sendChat(userQuestion, history);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources || []
        }
      ]);

      setHistory(prev => [
        ...prev,
        {
          role: "user",
          content: userQuestion
        },
        {
          role: "assistant",
          content: result.answer
        }
      ].slice(-6));

    } catch (error) {

      alert("채팅 중 오류가 발생했습니다.");

    } finally {

      setLoading(false);

    }
  }

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

            {message.content}

            {message.sources?.length > 0 && (
              <div className="chat-sources">
                참고 메뉴: {message.sources.join(", ")}
              </div>
            )}

          </div>

        ))}

        {loading && (
          <div className="bot-message">
            답변을 생각하고 있습니다...
          </div>
        )}

      </div>

      <div className="chat-input-area">

        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="메뉴에 관해 질문하세요..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          전송
        </button>

      </div>

    </aside>
  );
}