import "./globals.css";

export const metadata = {
  title: "음식 메뉴 관리 시스템",
  description: "음식 메뉴 관리 및 AI 채팅"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}