"use client";

import { useState } from "react";

import { sendChatMessage } from "../api/chat-api";

import {
  ChatMessage
} from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "안녕하세요! 음식 메뉴에 관해 질문해 주세요."
    }
  ]);

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question: string) => {
    const value = question.trim();

    if (!value || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: value
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await sendChatMessage({
        question: value,
        history
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.answer
      };

      setMessages(prev => [...prev, assistantMessage]);

      setHistory(prev => [
        ...prev,
        userMessage,
        assistantMessage
      ].slice(-6));

      return result.sources || [];

    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          error instanceof Error
            ? `오류가 발생했습니다.\n${error.message}`
            : "서버 통신 중 오류가 발생했습니다."
      };

      setMessages(prev => [...prev, errorMessage]);

      return [];

    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
}