import { apiRequest } from "@/lib/api-client";

import {
  ChatRequest,
  ChatResponse
} from "../types/chat";

export async function sendChatMessage(
  data: ChatRequest
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify(data)
  });
}