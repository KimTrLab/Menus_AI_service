import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "음식 메뉴 관리 시스템",
  description: "메뉴 관리 및 AI 메뉴 추천 서비스"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}