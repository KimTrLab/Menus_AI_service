export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export interface ChatRequest {
  question: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}