import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '제이씨랩 — JAICYLAB',
  description: '아이디어를 앱으로 구현하는 제이씨랩. iOS · Android · 웹 · 백엔드 · AI 통합 앱 개발 전문 스튜디오.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  )
}
