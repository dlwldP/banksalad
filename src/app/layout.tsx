import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "보장 가디언 | 뱅크샐러드",
  description: "보험금 지급 거절 방어 AI 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}