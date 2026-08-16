import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { requireAdmin } from '@/lib/session'
import '../globals.css'

export const metadata: Metadata = {
  title: '치과 홈페이지 제작 견적 · MEDINITY',
  description: '원하는 옵션을 담아 실시간으로 홈페이지 제작 견적을 확인하고 요청하세요.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

// 내부 제작 도구 — 관리자 로그인 필수. 견적빌더·요청관리·개발정보·생성사이트 전부 이 가드로 커버.
export default async function MedinityLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster theme="light" position="bottom-center" richColors />
      </body>
    </html>
  )
}
