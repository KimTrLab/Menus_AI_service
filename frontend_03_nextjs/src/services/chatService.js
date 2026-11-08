const CHAT_API_URL = "http://127.0.0.1:8000/chat";

export async function sendChat(question, history) {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: question,
      history: history
    })
  });

  if (!response.ok) {
    throw new Error("채팅 서버 오류");
  }

  return await response.json();
}